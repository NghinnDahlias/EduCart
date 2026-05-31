const Joi = require("joi");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { sql, getPool } = require("../config/db");
const analyticsRepository = require("../repositories/analytics.repository");

const RANGE_DAYS = {
  "1d": 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "365d": 365,
};

const dashboardQuerySchema = Joi.object({
  range: Joi.string().valid("1d", "7d", "30d", "90d", "365d").default("7d"),
});

const listUsersSchema = Joi.object({
  search: Joi.string().max(100).allow("").optional(),
  status: Joi.string().valid("all", "Active", "Suspended", "Banned").default("all"),
});

const listReportsSchema = Joi.object({
  status: Joi.string().valid("all", "Pending", "Resolved", "Dismissed").default("Pending"),
});

const listForumPostsSchema = Joi.object({
  search: Joi.string().max(100).allow("").optional(),
  visibility: Joi.string().valid("all", "active", "hidden").default("all"),
});

const userActionSchema = Joi.object({
  action: Joi.string().valid("warn", "suspend", "ban", "activate").required(),
  message: Joi.string().max(1000).allow("").optional(),
});

const reviewReportSchema = Joi.object({
  status: Joi.string().valid("Resolved", "Dismissed").required(),
  action: Joi.string().valid("none", "warn", "suspend", "ban").default("none"),
  note: Joi.string().max(1000).allow("").optional(),
  evidenceSummary: Joi.string().max(2000).allow("").optional(),
});

const moderatePostSchema = Joi.object({
  isPinned: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
});

function getRangeWindow(rangeKey) {
  const days = RANGE_DAYS[rangeKey] || 7;
  const now = new Date();
  const currentStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const previousStart = new Date(currentStart.getTime() - days * 24 * 60 * 60 * 1000);
  return { now, days, currentStart, previousStart };
}

async function ensureAdminColumns(pool) {
  await analyticsRepository.ensureReady();
  await pool.request().query(`
    IF COL_LENGTH('dbo.Reports', 'AdminNote') IS NULL
      ALTER TABLE dbo.Reports ADD AdminNote NVARCHAR(MAX) NULL;

    IF COL_LENGTH('dbo.Reports', 'ReviewedBy') IS NULL
      ALTER TABLE dbo.Reports ADD ReviewedBy INT NULL;

    IF COL_LENGTH('dbo.Reports', 'EvidenceSummary') IS NULL
      ALTER TABLE dbo.Reports ADD EvidenceSummary NVARCHAR(MAX) NULL;

    IF COL_LENGTH('dbo.Reports', 'ResolutionAction') IS NULL
      ALTER TABLE dbo.Reports ADD ResolutionAction NVARCHAR(30) NULL;

    IF COL_LENGTH('dbo.Users', 'WarningCount') IS NULL
      ALTER TABLE dbo.Users ADD WarningCount INT NOT NULL CONSTRAINT DF_Users_WarningCount DEFAULT 0;

    IF COL_LENGTH('dbo.Users', 'TrustScore') IS NULL
      ALTER TABLE dbo.Users ADD TrustScore DECIMAL(5,2) NOT NULL CONSTRAINT DF_Users_TrustScore DEFAULT 100;

    IF COL_LENGTH('dbo.Users', 'RiskBadge') IS NULL
      ALTER TABLE dbo.Users ADD RiskBadge NVARCHAR(30) NOT NULL CONSTRAINT DF_Users_RiskBadge DEFAULT 'Verified';

    IF COL_LENGTH('dbo.Users', 'ModerationNote') IS NULL
      ALTER TABLE dbo.Users ADD ModerationNote NVARCHAR(1000) NULL;

    IF COL_LENGTH('dbo.Users', 'LastModerationAt') IS NULL
      ALTER TABLE dbo.Users ADD LastModerationAt DATETIME NULL;

    IF COL_LENGTH('dbo.Users', 'LifetimeStrikeCount') IS NULL
      ALTER TABLE dbo.Users ADD LifetimeStrikeCount INT NOT NULL CONSTRAINT DF_Users_LifetimeStrikeCount DEFAULT 0;

    IF COL_LENGTH('dbo.Users', 'SuspendedUntil') IS NULL
      ALTER TABLE dbo.Users ADD SuspendedUntil DATETIME NULL;
  `);
}

async function sendAdminMessage(pool, { senderId, receiverId, content }) {
  await pool
    .request()
    .input("SenderID", sql.Int, senderId)
    .input("ReceiverID", sql.Int, receiverId)
    .input("Content", sql.NVarChar(sql.MAX), content)
    .query(`
      INSERT INTO dbo.Messages (SenderID, ReceiverID, Content)
      VALUES (@SenderID, @ReceiverID, @Content);
    `);
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Number(value || 0)));
}

function deriveRiskBadge({ status, warningCount, trustScore }) {
  if (status === "Banned") return "Untrusted";
  if (status === "Suspended") return "Restricted";
  if (Number(warningCount || 0) >= 10 || Number(trustScore || 0) <= 50) return "Restricted";
  if (Number(warningCount || 0) >= 1 || Number(trustScore || 0) < 100) return "Warned";
  return "Verified";
}

function buildModerationMessage({ action, message, trustScore, warningCount, nextStatus }) {
  const reason = (message || "").trim() || "Có phản ánh từ người mua về hành vi giao dịch chưa đúng quy chuẩn.";
  const actionLabel =
    action === "warn"
      ? "Cảnh báo"
      : action === "suspend"
        ? "Cấm tạm thời"
        : action === "ban"
          ? "Cấm vĩnh viễn"
          : "Khôi phục tài khoản";

  const remediation =
    action === "warn"
      ? "Vui lòng rà soát lại ảnh sản phẩm, mô tả tin đăng và chủ động liên hệ người mua để xử lý trong 48 giờ."
      : action === "suspend"
        ? "Tài khoản đang bị hạn chế hiển thị. Bạn cần giải trình với admin và khắc phục đầy đủ trước khi được mở lại."
        : action === "ban"
          ? "Toàn bộ hoạt động mua bán đã bị chặn. Nếu cho rằng quyết định này chưa chính xác, bạn cần gửi khiếu nại nội bộ cho admin."
          : "Tài khoản đã được mở lại. Hãy tiếp tục giao dịch đúng quy chuẩn để tránh tái phạm.";

  const consequence =
    action === "warn"
      ? "Nếu tiếp tục vi phạm, tài khoản có thể bị cấm tạm thời hoặc cấm vĩnh viễn."
      : action === "suspend"
        ? "Nếu tiếp tục tái phạm sau khi mở lại, tài khoản có thể bị cấm vĩnh viễn."
        : action === "ban"
          ? "Người mua sẽ nhìn thấy cảnh báo rủi ro rõ ràng trên hồ sơ của bạn."
          : "Lịch sử cảnh báo vẫn được lưu nội bộ để theo dõi tái phạm.";

  return [
    `[${actionLabel}] Hệ thống vừa xử lý một report liên quan đến tài khoản của bạn.`,
    `Lý do: ${reason}`,
    `Trạng thái hiện tại: ${nextStatus}`,
    `Điểm uy tín hiện tại: ${Number(trustScore || 0).toFixed(0)}/100`,
    `Số lần cảnh báo tích lũy: ${Number(warningCount || 0)}`,
    `Hướng khắc phục: ${remediation}`,
    `Lưu ý: ${consequence}`,
  ].join("\\n");
}

function buildModerationMessageV2({
  action,
  message,
  trustScore,
  warningCount,
  nextStatus,
  suspendedUntil,
  lifetimeStrikeCount,
}) {
  const reason = (message || "").trim() || "Có phản ánh từ người mua về hành vi giao dịch chưa đúng quy chuẩn.";
  const base = [
    `[${action}] Quyết định kiểm duyệt mới cho tài khoản của bạn.`,
    `Lý do: ${reason}`,
    `Trạng thái hiện tại: ${nextStatus}`,
    `Điểm uy tín hiện tại: ${Number.isFinite(Number(trustScore)) ? Number(trustScore).toFixed(0) : "100"}/100`,
    `Số lần cảnh báo tích lũy: ${Number(warningCount || 0)}`,
    `Tổng số lần tái phạm: ${Number(lifetimeStrikeCount || 0)}`,
  ];

  if (suspendedUntil) {
    base.push(`Tài khoản bị khóa đến: ${new Date(suspendedUntil).toLocaleString("vi-VN")}`);
    base.push("Yêu cầu bắt buộc: hoàn trả tiền cho người dùng liên quan trước khi gửi yêu cầu mở lại tài khoản.");
  }

  if (action === "warn") {
    base.push("Mỗi lần cảnh báo bị trừ 5 điểm uy tín.");
    base.push("Đủ 10 lần cảnh báo, tài khoản sẽ bị khóa 7 ngày.");
  } else if (action === "suspend") {
    base.push("Bạn đã chạm ngưỡng 10 lần cảnh báo nên bị khóa 7 ngày.");
    base.push("Nếu tái phạm thêm 3 lần nữa, tài khoản sẽ bị cấm vĩnh viễn.");
  } else if (action === "ban") {
    base.push("Tài khoản đã bị cấm vĩnh viễn và không thể quay lại nền tảng.");
  }

  return base.join("\\n");
}

async function applyUserAction(pool, { adminId, targetUserId, action, message }) {
  const actionMessages = {
    warn: "Cảnh báo từ quản trị viên",
    suspend: "Tài khoản của bạn đã bị tạm khóa",
    ban: "Tài khoản của bạn đã bị cấm",
    activate: "Tài khoản của bạn đã được kích hoạt lại",
  };

  if (action === "suspend" || action === "ban" || action === "activate") {
    const nextStatus =
      action === "suspend" ? "Suspended" : action === "ban" ? "Banned" : "Active";
    await pool
      .request()
      .input("UserID", sql.Int, targetUserId)
      .input("Status", sql.NVarChar(20), nextStatus)
      .query(`
        UPDATE dbo.Users
        SET Status = @Status
        WHERE UserID = @UserID;
      `);
  }

  const prefix = actionMessages[action] || "Thông báo từ quản trị viên";
  const content = `${prefix}: ${message?.trim() || "Vui lòng kiểm tra lại hoạt động của tài khoản."}`;
  await sendAdminMessage(pool, {
    senderId: adminId,
    receiverId: targetUserId,
    content,
  });
}

async function applyUserActionV2(pool, { adminId, targetUserId, action, message }) {
  await ensureAdminColumns(pool);

  const currentUserRes = await pool
    .request()
    .input("UserID", sql.Int, targetUserId)
    .query(`
      SELECT TOP 1
        UserID,
        Status,
        ISNULL(WarningCount, 0) AS WarningCount,
        ISNULL(TrustScore, 100) AS TrustScore,
        ISNULL(LifetimeStrikeCount, 0) AS LifetimeStrikeCount
      FROM dbo.Users
      WHERE UserID = @UserID;
    `);

  const currentUser = currentUserRes.recordset[0];
  if (!currentUser) {
    throw new AppError("User not found", 404);
  }

  let nextStatus = currentUser.Status;
  let nextWarningCount = Number(currentUser.WarningCount || 0);
  let nextTrustScore = Number(currentUser.TrustScore || 100);
  let nextLifetimeStrikeCount = Number(currentUser.LifetimeStrikeCount || 0);
  let suspendedUntil = null;

  if (action === "suspend" || action === "ban" || action === "activate") {
    nextStatus = action === "suspend" ? "Suspended" : action === "ban" ? "Banned" : "Active";
  }

  if (action === "warn") {
    nextWarningCount += 1;
    nextLifetimeStrikeCount += 1;
    nextTrustScore = clampScore(nextTrustScore - 5);
    if (nextWarningCount >= 13 || nextLifetimeStrikeCount >= 13) {
      nextStatus = "Banned";
      nextTrustScore = 0;
    } else if (nextWarningCount >= 10) {
      nextStatus = "Suspended";
      suspendedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  } else if (action === "suspend") {
    nextWarningCount += 1;
    nextLifetimeStrikeCount += 1;
    nextTrustScore = clampScore(nextTrustScore - 5);
    nextStatus = "Suspended";
    suspendedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  } else if (action === "ban") {
    nextWarningCount += 1;
    nextLifetimeStrikeCount += 1;
    nextTrustScore = 0;
  } else if (action === "activate") {
    nextTrustScore = clampScore(nextTrustScore + 10);
    suspendedUntil = null;
  }

  const nextRiskBadge = deriveRiskBadge({
    status: nextStatus,
    warningCount: nextWarningCount,
    trustScore: nextTrustScore,
  });

  await pool
    .request()
    .input("UserID", sql.Int, targetUserId)
    .input("Status", sql.NVarChar(20), nextStatus)
    .input("WarningCount", sql.Int, nextWarningCount)
    .input("TrustScore", sql.Decimal(5, 2), nextTrustScore)
    .input("RiskBadge", sql.NVarChar(30), nextRiskBadge)
    .input("ModerationNote", sql.NVarChar(1000), message?.trim() || null)
    .input("LifetimeStrikeCount", sql.Int, nextLifetimeStrikeCount)
    .input("SuspendedUntil", sql.DateTime, suspendedUntil)
    .query(`
      UPDATE dbo.Users
      SET Status = @Status,
          WarningCount = @WarningCount,
          TrustScore = @TrustScore,
          RiskBadge = @RiskBadge,
          ModerationNote = @ModerationNote,
          LifetimeStrikeCount = @LifetimeStrikeCount,
          SuspendedUntil = @SuspendedUntil,
          LastModerationAt = GETDATE()
      WHERE UserID = @UserID;
    `);

  const content = buildModerationMessageV2({
    action,
    message,
    trustScore: nextTrustScore,
    warningCount: nextWarningCount,
    nextStatus,
    suspendedUntil,
    lifetimeStrikeCount: nextLifetimeStrikeCount,
  });

  await sendAdminMessage(pool, {
    senderId: adminId,
    receiverId: targetUserId,
    content,
  });
}

function mapTrend(record) {
  const current = Number(record.currentValue || 0);
  const previous = Number(record.previousValue || 0);
  const delta = current - previous;
  const deltaPct = previous === 0 ? (current > 0 ? 100 : 0) : Number(((delta / previous) * 100).toFixed(1));
  return { current, previous, delta, deltaPct };
}

const getDashboard = asyncHandler(async (req, res) => {
  const { value, error } = dashboardQuerySchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    throw new AppError("Invalid dashboard range", 400);
  }

  const pool = await getPool();
  await ensureAdminColumns(pool);

  const { range } = value;
  const { now, days, currentStart, previousStart } = getRangeWindow(range);

  const [
    snapshotRes,
    financeRes,
    trendRes,
    timelineRes,
    recentPaymentsRes,
    recentOrdersRes,
    pendingReportsRes,
  ] = await Promise.all([
    pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM dbo.Users) AS totalUsers,
        (SELECT COUNT(*) FROM dbo.Users WHERE Role = 'Admin') AS totalAdmins,
        (SELECT COUNT(*) FROM dbo.Users WHERE Status = 'Active') AS activeUsers,
        (SELECT COUNT(*) FROM dbo.Products) AS totalProducts,
        (SELECT COUNT(*) FROM dbo.Products WHERE Status = 'Available') AS listedProducts,
        (SELECT COUNT(*) FROM dbo.Products WHERE Status = 'Pending') AS reservedProducts,
        (SELECT COUNT(*) FROM dbo.Products WHERE Status = 'Sold') AS soldProducts,
        (SELECT COUNT(*) FROM dbo.Orders) AS totalOrders,
        (SELECT COUNT(*) FROM dbo.Orders WHERE LifecycleState = 'PendingPayment') AS pendingPaymentOrders,
        (SELECT COUNT(*) FROM dbo.Orders WHERE LifecycleState = 'Paid') AS paidOrders,
        (SELECT COUNT(*) FROM dbo.Orders WHERE LifecycleState = 'Delivering') AS deliveringOrders,
        (SELECT COUNT(*) FROM dbo.Orders WHERE LifecycleState = 'Completed') AS completedOrders,
        (SELECT COUNT(*) FROM dbo.Orders WHERE LifecycleState = 'Cancelled') AS cancelledOrders,
        (SELECT COUNT(*) FROM dbo.Posts WHERE IsActive = 1) AS activeForumPosts,
        (SELECT COUNT(*) FROM dbo.Reports WHERE Status = 'Pending') AS pendingReports;
    `),
    pool.request().query(`
      SELECT
        COALESCE(SUM(CASE WHEN TxType = 'TopUp' AND Status = 'Completed' AND OrderID IS NOT NULL THEN Amount ELSE 0 END), 0) AS totalBuyerPayments,
        COALESCE(SUM(CASE WHEN TxType = 'Payout' AND Status = 'Completed' THEN Amount ELSE 0 END), 0) AS totalSellerPayouts,
        COALESCE(SUM(CASE WHEN TxType = 'CommissionCollect' AND Status = 'Completed' THEN Amount ELSE 0 END), 0) AS totalPlatformFees,
        COALESCE(SUM(CASE WHEN TxType = 'TopUp' AND Status = 'Completed' AND OrderID IS NOT NULL THEN Amount ELSE 0 END), 0)
          - COALESCE(SUM(CASE WHEN TxType = 'Payout' AND Status = 'Completed' THEN Amount ELSE 0 END), 0) AS platformCashOnHand,
        COALESCE((
          SELECT SUM(orderBase.HeldAmount)
          FROM (
            SELECT
              o.OrderID,
              CASE
                WHEN o.OrderType = 'Rent'
                  THEN (COALESCE(o.DailyRate, 0) * COALESCE(o.RentDays, 0)) + COALESCE(o.Deposit, 0)
                ELSE COALESCE(SUM(oi.Quantity * oi.UnitPrice), 0)
              END AS HeldAmount
            FROM dbo.Orders o
            LEFT JOIN dbo.OrderItems oi ON oi.OrderID = o.OrderID
            WHERE o.IsPaid = 1
              AND o.LifecycleState <> 'Completed'
              AND o.LifecycleState <> 'Cancelled'
            GROUP BY
              o.OrderID,
              o.OrderType,
              o.DailyRate,
              o.RentDays,
              o.Deposit
          ) orderBase
        ), 0) AS escrowBeingHeld
      FROM dbo.PaymentTransactions;
    `),
    pool.request()
      .input("CurrentStart", sql.DateTime, currentStart)
      .input("PreviousStart", sql.DateTime, previousStart)
      .input("NowAt", sql.DateTime, now)
      .query(`
        SELECT 'newUsers' AS metric,
          SUM(CASE WHEN CreatedAt >= @CurrentStart AND CreatedAt < @NowAt THEN 1 ELSE 0 END) AS currentValue,
          SUM(CASE WHEN CreatedAt >= @PreviousStart AND CreatedAt < @CurrentStart THEN 1 ELSE 0 END) AS previousValue
        FROM dbo.Users
        UNION ALL
        SELECT 'buyersParticipated',
          COUNT(DISTINCT CASE WHEN CreatedAt >= @CurrentStart AND CreatedAt < @NowAt THEN BuyerID END),
          COUNT(DISTINCT CASE WHEN CreatedAt >= @PreviousStart AND CreatedAt < @CurrentStart THEN BuyerID END)
        FROM dbo.Orders
        UNION ALL
        SELECT 'sellersParticipated',
          COUNT(DISTINCT CASE WHEN CreatedAt >= @CurrentStart AND CreatedAt < @NowAt THEN SellerID END),
          COUNT(DISTINCT CASE WHEN CreatedAt >= @PreviousStart AND CreatedAt < @CurrentStart THEN SellerID END)
        FROM dbo.Products
        UNION ALL
        SELECT 'productsListed',
          SUM(CASE WHEN CreatedAt >= @CurrentStart AND CreatedAt < @NowAt THEN 1 ELSE 0 END),
          SUM(CASE WHEN CreatedAt >= @PreviousStart AND CreatedAt < @CurrentStart THEN 1 ELSE 0 END)
        FROM dbo.Products
        UNION ALL
        SELECT 'productsPurchased',
          COALESCE(SUM(CASE WHEN o.CompletedAt >= @CurrentStart AND o.CompletedAt < @NowAt THEN oi.Quantity ELSE 0 END), 0),
          COALESCE(SUM(CASE WHEN o.CompletedAt >= @PreviousStart AND o.CompletedAt < @CurrentStart THEN oi.Quantity ELSE 0 END), 0)
        FROM dbo.Orders o
        LEFT JOIN dbo.OrderItems oi ON oi.OrderID = o.OrderID
        WHERE o.LifecycleState = 'Completed'
        UNION ALL
        SELECT 'ordersCancelled',
          SUM(CASE WHEN UpdatedAt >= @CurrentStart AND UpdatedAt < @NowAt AND LifecycleState = 'Cancelled' THEN 1 ELSE 0 END),
          SUM(CASE WHEN UpdatedAt >= @PreviousStart AND UpdatedAt < @CurrentStart AND LifecycleState = 'Cancelled' THEN 1 ELSE 0 END)
        FROM dbo.Orders
        UNION ALL
        SELECT 'ordersReceived',
          SUM(CASE WHEN ReceivedAt >= @CurrentStart AND ReceivedAt < @NowAt THEN 1 ELSE 0 END),
          SUM(CASE WHEN ReceivedAt >= @PreviousStart AND ReceivedAt < @CurrentStart THEN 1 ELSE 0 END)
        FROM dbo.Orders
        UNION ALL
        SELECT 'forumPosts',
          SUM(CASE WHEN CreatedAt >= @CurrentStart AND CreatedAt < @NowAt THEN 1 ELSE 0 END),
          SUM(CASE WHEN CreatedAt >= @PreviousStart AND CreatedAt < @CurrentStart THEN 1 ELSE 0 END)
        FROM dbo.Posts
        UNION ALL
        SELECT 'reportsCreated',
          SUM(CASE WHEN CreatedAt >= @CurrentStart AND CreatedAt < @NowAt THEN 1 ELSE 0 END),
          SUM(CASE WHEN CreatedAt >= @PreviousStart AND CreatedAt < @CurrentStart THEN 1 ELSE 0 END)
        FROM dbo.Reports
        UNION ALL
        SELECT 'contentViews',
          SUM(CASE WHEN CreatedAt >= @CurrentStart AND CreatedAt < @NowAt THEN 1 ELSE 0 END),
          SUM(CASE WHEN CreatedAt >= @PreviousStart AND CreatedAt < @CurrentStart THEN 1 ELSE 0 END)
        FROM dbo.AnalyticsEvents
        WHERE EventType IN ('ProductView', 'ForumView')
        UNION ALL
        SELECT 'productClicks',
          SUM(CASE WHEN CreatedAt >= @CurrentStart AND CreatedAt < @NowAt AND EventType = 'ProductView' THEN 1 ELSE 0 END),
          SUM(CASE WHEN CreatedAt >= @PreviousStart AND CreatedAt < @CurrentStart AND EventType = 'ProductView' THEN 1 ELSE 0 END)
        FROM dbo.AnalyticsEvents;
      `),
    pool.request()
      .input("CurrentStart", sql.DateTime, currentStart)
      .query(`
        SELECT
          CONVERT(date, bucket.DateValue) AS BucketDate,
          COALESCE(u.NewUsers, 0) AS NewUsers,
          COALESCE(p.NewProducts, 0) AS NewProducts,
          COALESCE(o.NewOrders, 0) AS NewOrders,
          COALESCE(r.NewReports, 0) AS NewReports,
          COALESCE(a.Views, 0) AS Views
        FROM (
          SELECT DISTINCT CONVERT(date, CreatedAt) AS DateValue FROM dbo.Users WHERE CreatedAt >= @CurrentStart
          UNION
          SELECT DISTINCT CONVERT(date, CreatedAt) FROM dbo.Products WHERE CreatedAt >= @CurrentStart
          UNION
          SELECT DISTINCT CONVERT(date, CreatedAt) FROM dbo.Orders WHERE CreatedAt >= @CurrentStart
          UNION
          SELECT DISTINCT CONVERT(date, CreatedAt) FROM dbo.Reports WHERE CreatedAt >= @CurrentStart
          UNION
          SELECT DISTINCT CONVERT(date, CreatedAt) FROM dbo.AnalyticsEvents WHERE CreatedAt >= @CurrentStart
        ) bucket
        LEFT JOIN (
          SELECT CONVERT(date, CreatedAt) AS DateValue, COUNT(*) AS NewUsers
          FROM dbo.Users WHERE CreatedAt >= @CurrentStart
          GROUP BY CONVERT(date, CreatedAt)
        ) u ON u.DateValue = bucket.DateValue
        LEFT JOIN (
          SELECT CONVERT(date, CreatedAt) AS DateValue, COUNT(*) AS NewProducts
          FROM dbo.Products WHERE CreatedAt >= @CurrentStart
          GROUP BY CONVERT(date, CreatedAt)
        ) p ON p.DateValue = bucket.DateValue
        LEFT JOIN (
          SELECT CONVERT(date, CreatedAt) AS DateValue, COUNT(*) AS NewOrders
          FROM dbo.Orders WHERE CreatedAt >= @CurrentStart
          GROUP BY CONVERT(date, CreatedAt)
        ) o ON o.DateValue = bucket.DateValue
        LEFT JOIN (
          SELECT CONVERT(date, CreatedAt) AS DateValue, COUNT(*) AS NewReports
          FROM dbo.Reports WHERE CreatedAt >= @CurrentStart
          GROUP BY CONVERT(date, CreatedAt)
        ) r ON r.DateValue = bucket.DateValue
        LEFT JOIN (
          SELECT CONVERT(date, CreatedAt) AS DateValue, COUNT(*) AS Views
          FROM dbo.AnalyticsEvents
          WHERE CreatedAt >= @CurrentStart AND EventType IN ('ProductView', 'ForumView')
          GROUP BY CONVERT(date, CreatedAt)
        ) a ON a.DateValue = bucket.DateValue
        ORDER BY BucketDate ASC;
      `),
    pool.request().query(`
      SELECT TOP 10
        pt.PayTxID,
        pt.Amount,
        pt.PayMethod,
        pt.TxType,
        pt.Status,
        pt.OrderID,
        pt.CreatedAt,
        pt.CompletedAt,
        u.UserEmail
      FROM dbo.PaymentTransactions pt
      JOIN dbo.Users u ON u.UserID = pt.UserID
      ORDER BY pt.PayTxID DESC;
    `),
    pool.request().query(`
      SELECT TOP 10
        o.OrderID,
        o.OrderType,
        o.LifecycleState,
        o.IsPaid,
        o.CreatedAt,
        buyer.UserEmail AS BuyerEmail,
        seller.UserEmail AS SellerEmail
      FROM dbo.Orders o
      JOIN dbo.Users buyer ON buyer.UserID = o.BuyerID
      JOIN dbo.Users seller ON seller.UserID = o.SellerID
      ORDER BY o.OrderID DESC;
    `),
    pool.request().query(`
      SELECT TOP 5
        r.ReportID,
        r.Reason,
        r.Status,
        r.CreatedAt,
        reporter.UserEmail AS ReporterEmail,
        reported.UserEmail AS ReportedEmail
      FROM dbo.Reports r
      JOIN dbo.Users reporter ON reporter.UserID = r.ReporterID
      JOIN dbo.Users reported ON reported.UserID = r.ReportedID
      WHERE r.Status = 'Pending'
      ORDER BY r.CreatedAt DESC;
    `),
  ]);

  const trends = Object.fromEntries(
    trendRes.recordset.map((row) => [row.metric, mapTrend(row)]),
  );

  res.json({
    ok: true,
    range,
    rangeDays: days,
    snapshot: snapshotRes.recordset[0],
    finance: financeRes.recordset[0],
    trends,
    timeline: timelineRes.recordset,
    recentPayments: recentPaymentsRes.recordset,
    recentOrders: recentOrdersRes.recordset,
    pendingReports: pendingReportsRes.recordset,
    platformWallet: {
      label: "Ví merchant của nền tảng",
      mode: "internal_ledger_with_gateway_collection",
      note: "Trong bản sandbox, hệ thống mô phỏng escrow bằng sổ cái nội bộ. Khi triển khai thật, buyer phải trả vào tài khoản doanh nghiệp hoặc merchant wallet của nền tảng, không dùng ví cá nhân của admin.",
    },
  });
});

const listUsers = asyncHandler(async (req, res) => {
  const { value, error } = listUsersSchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    throw new AppError("Invalid user filter", 400);
  }

  const pool = await getPool();
  const request = pool.request();
  const conditions = [];

  if (value.search) {
    request.input("Search", sql.NVarChar(100), `%${value.search}%`);
    conditions.push("(u.UserEmail LIKE @Search OR u.FName LIKE @Search OR u.LName LIKE @Search)");
  }
  if (value.status !== "all") {
    request.input("Status", sql.NVarChar(20), value.status);
    conditions.push("u.Status = @Status");
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const result = await request.query(`
    SELECT
      u.UserID,
      u.UserEmail,
      u.FName,
      u.LName,
      u.Role,
      u.Status,
      ISNULL(u.WarningCount, 0) AS WarningCount,
      ISNULL(u.TrustScore, 100) AS TrustScore,
      ISNULL(u.RiskBadge, 'Verified') AS RiskBadge,
      u.PhoneNumber,
      u.CreatedAt,
      COUNT(DISTINCT p.ProductID) AS ProductsListed,
      COUNT(DISTINCT o.OrderID) AS OrdersPlaced,
      COUNT(DISTINCT r.ReportID) AS ReportsAgainstUser
    FROM dbo.Users u
    LEFT JOIN dbo.Products p ON p.SellerID = u.UserID
    LEFT JOIN dbo.Orders o ON o.BuyerID = u.UserID
    LEFT JOIN dbo.Reports r ON r.ReportedID = u.UserID
    ${where}
    GROUP BY
      u.UserID, u.UserEmail, u.FName, u.LName, u.Role, u.Status, u.WarningCount, u.TrustScore, u.RiskBadge, u.PhoneNumber, u.CreatedAt
    ORDER BY
      CASE WHEN u.Role = 'Admin' THEN 0 ELSE 1 END,
      u.CreatedAt DESC;
  `);

  res.json({ ok: true, users: result.recordset });
});

const actOnUser = asyncHandler(async (req, res) => {
  const { value, error } = userActionSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    throw new AppError("Invalid user action", 400);
  }

  const targetUserId = Number(req.params.id);
  if (!Number.isFinite(targetUserId)) {
    throw new AppError("Invalid user ID", 400);
  }
  if (targetUserId === req.user.id && value.action !== "warn") {
    throw new AppError("Admin cannot change their own status here", 400);
  }

  const pool = await getPool();
  const existing = await pool
    .request()
    .input("UserID", sql.Int, targetUserId)
    .query(`SELECT TOP 1 UserID, UserEmail, Role, Status FROM dbo.Users WHERE UserID = @UserID`);

  if (!existing.recordset[0]) {
    throw new AppError("User not found", 404);
  }

  await applyUserActionV2(pool, {
    adminId: req.user.id,
    targetUserId,
    action: value.action,
    message: value.message,
  });

  const updated = await pool
    .request()
    .input("UserID", sql.Int, targetUserId)
    .query(`
      SELECT TOP 1 UserID, UserEmail, FName, LName, Role, Status, PhoneNumber, CreatedAt
      FROM dbo.Users
      WHERE UserID = @UserID
    `);

  res.json({
    ok: true,
    message: "User moderation action applied",
    user: updated.recordset[0],
  });
});

const listReports = asyncHandler(async (req, res) => {
  const { value, error } = listReportsSchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    throw new AppError("Invalid report filter", 400);
  }

  const pool = await getPool();
  await ensureAdminColumns(pool);
  const request = pool.request();
  const where = value.status === "all" ? "" : "WHERE r.Status = @Status";
  if (value.status !== "all") {
    request.input("Status", sql.NVarChar(20), value.status);
  }

  const result = await request.query(`
    SELECT
      r.ReportID,
      r.ReporterID,
      r.ReportedID,
      r.Reason,
      r.Description,
      r.Status,
      r.CreatedAt,
      r.CompletedAt,
      r.AdminNote,
      r.EvidenceSummary,
      r.ResolutionAction,
      r.ReviewedBy,
      reporter.UserEmail AS ReporterEmail,
      reporter.FName AS ReporterFirstName,
      reporter.LName AS ReporterLastName,
      reported.UserEmail AS ReportedEmail,
      reported.FName AS ReportedFirstName,
      reported.LName AS ReportedLastName,
      reported.Status AS ReportedUserStatus,
      ISNULL(reported.WarningCount, 0) AS ReportedWarningCount,
      ISNULL(reported.TrustScore, 100) AS ReportedTrustScore,
      ISNULL(reported.RiskBadge, 'Verified') AS ReportedRiskBadge
    FROM dbo.Reports r
    JOIN dbo.Users reporter ON reporter.UserID = r.ReporterID
    JOIN dbo.Users reported ON reported.UserID = r.ReportedID
    ${where}
    ORDER BY
      CASE WHEN r.Status = 'Pending' THEN 0 WHEN r.Status = 'Resolved' THEN 1 ELSE 2 END,
      r.CreatedAt DESC;
  `);

  res.json({ ok: true, reports: result.recordset });
});

const reviewReport = asyncHandler(async (req, res) => {
  const { value, error } = reviewReportSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    throw new AppError("Invalid report review payload", 400);
  }

  const reportId = Number(req.params.id);
  if (!Number.isFinite(reportId)) {
    throw new AppError("Invalid report ID", 400);
  }

  const pool = await getPool();
  await ensureAdminColumns(pool);
  const reportRes = await pool
    .request()
    .input("ReportID", sql.Int, reportId)
    .query(`
      SELECT TOP 1 *
      FROM dbo.Reports
      WHERE ReportID = @ReportID
    `);

  const report = reportRes.recordset[0];
  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (value.status === "Resolved" && value.action !== "none") {
    await applyUserActionV2(pool, {
      adminId: req.user.id,
      targetUserId: report.ReportedID,
      action: value.action,
      message: value.note,
    });
  }

  await pool
    .request()
    .input("ReportID", sql.Int, reportId)
    .input("Status", sql.NVarChar(20), value.status)
    .input("AdminNote", sql.NVarChar(sql.MAX), value.note || null)
    .input("EvidenceSummary", sql.NVarChar(sql.MAX), value.evidenceSummary || null)
    .input("ResolutionAction", sql.NVarChar(30), value.action || "none")
    .input("ReviewedBy", sql.Int, req.user.id)
    .query(`
      UPDATE dbo.Reports
      SET Status = @Status,
          AdminNote = @AdminNote,
          EvidenceSummary = @EvidenceSummary,
          ResolutionAction = @ResolutionAction,
          ReviewedBy = @ReviewedBy,
          CompletedAt = CASE WHEN @Status IN ('Resolved', 'Dismissed') THEN GETDATE() ELSE CompletedAt END
      WHERE ReportID = @ReportID
    `);

  res.json({
    ok: true,
    message: "Report reviewed successfully",
  });
});

const listForumPosts = asyncHandler(async (req, res) => {
  const { value, error } = listForumPostsSchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    throw new AppError("Invalid forum filter", 400);
  }

  const pool = await getPool();
  const request = pool.request();
  const conditions = [];

  if (value.search) {
    request.input("Search", sql.NVarChar(100), `%${value.search}%`);
    conditions.push("(p.Title LIKE @Search OR p.Content LIKE @Search)");
  }
  if (value.visibility === "active") {
    conditions.push("p.IsActive = 1");
  } else if (value.visibility === "hidden") {
    conditions.push("p.IsActive = 0");
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const result = await request.query(`
    SELECT
      p.PostID,
      p.AuthorID,
      p.Title,
      p.Content,
      p.Tags,
      p.ViewCount,
      p.CommentsCount,
      p.VotesCount,
      p.IsActive,
      p.IsPinned,
      p.CreatedAt,
      p.UpdatedAt,
      u.UserEmail AS AuthorEmail,
      u.FName,
      u.LName,
      s.SubjectName
    FROM dbo.Posts p
    LEFT JOIN dbo.Users u ON u.UserID = p.AuthorID
    LEFT JOIN dbo.Subjects s ON s.SubjectID = p.SubjectID
    ${where}
    ORDER BY p.IsPinned DESC, p.CreatedAt DESC
  `);

  res.json({ ok: true, posts: result.recordset });
});

const moderateForumPost = asyncHandler(async (req, res) => {
  const { value, error } = moderatePostSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    throw new AppError("Invalid post moderation payload", 400);
  }

  const postId = Number(req.params.id);
  if (!Number.isFinite(postId)) {
    throw new AppError("Invalid post ID", 400);
  }

  if (!Object.keys(value).length) {
    throw new AppError("No moderation fields provided", 400);
  }

  const pool = await getPool();
  const current = await pool
    .request()
    .input("PostID", sql.Int, postId)
    .query(`SELECT TOP 1 * FROM dbo.Posts WHERE PostID = @PostID`);

  if (!current.recordset[0]) {
    throw new AppError("Post not found", 404);
  }

  await pool
    .request()
    .input("PostID", sql.Int, postId)
    .input("IsPinned", sql.Bit, value.isPinned ?? current.recordset[0].IsPinned)
    .input("IsActive", sql.Bit, value.isActive ?? current.recordset[0].IsActive)
    .query(`
      UPDATE dbo.Posts
      SET IsPinned = @IsPinned,
          IsActive = @IsActive,
          UpdatedAt = GETDATE()
      WHERE PostID = @PostID
    `);

  const updated = await pool
    .request()
    .input("PostID", sql.Int, postId)
    .query(`
      SELECT TOP 1
        p.PostID, p.Title, p.IsPinned, p.IsActive, p.UpdatedAt
      FROM dbo.Posts p
      WHERE p.PostID = @PostID
    `);

  res.json({ ok: true, post: updated.recordset[0] });
});

module.exports = {
  getDashboard,
  listUsers,
  actOnUser,
  listReports,
  reviewReport,
  listForumPosts,
  moderateForumPost,
};
