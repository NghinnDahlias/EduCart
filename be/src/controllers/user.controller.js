const Joi = require("joi");
const bcrypt = require("bcrypt");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../utils/validate");
const { repositories } = require("../container");
const { sql, getPool } = require("../config/db");

async function loadUserWithCoinBalance(userId) {
  const pool = await getPool();
  const result = await pool.request().input("UserID", sql.Int, userId).query(`
    IF OBJECT_ID('dbo.CoinWallets', 'U') IS NOT NULL
    BEGIN
      SELECT u.*,
             ISNULL(cw.Balance, 0) AS CoinBalance
      FROM dbo.Users u
      LEFT JOIN dbo.CoinWallets cw ON cw.UserID = u.UserID
      WHERE u.UserID = @UserID;
    END
    ELSE
    BEGIN
      SELECT u.*, CAST(0 AS DECIMAL(18,2)) AS CoinBalance
      FROM dbo.Users u
      WHERE u.UserID = @UserID;
    END
  `);
  return result.recordset[0] || null;
}

async function getOrCreateCoinWallet(userId) {
  const pool = await getPool();
  const result = await pool.request().input("UserID", sql.Int, userId).query(`
    IF OBJECT_ID('dbo.CoinWallets', 'U') IS NULL
    BEGIN
      SELECT CAST(NULL AS INT) AS WalletID, CAST(0 AS DECIMAL(18,2)) AS Balance;
      RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM dbo.CoinWallets WHERE UserID = @UserID)
    BEGIN
      INSERT INTO dbo.CoinWallets (UserID, Balance) VALUES (@UserID, 0);
    END

    SELECT TOP 1 WalletID, Balance
    FROM dbo.CoinWallets
    WHERE UserID = @UserID;
  `);
  return result.recordset[0] || null;
}

async function ensureTrustColumns() {
  const pool = await getPool();
  await pool.request().query(`
    IF COL_LENGTH('dbo.Users', 'WarningCount') IS NULL
      ALTER TABLE dbo.Users ADD WarningCount INT NOT NULL CONSTRAINT DF_Users_WarningCount_Profile DEFAULT 0;

    IF COL_LENGTH('dbo.Users', 'TrustScore') IS NULL
      ALTER TABLE dbo.Users ADD TrustScore DECIMAL(5,2) NOT NULL CONSTRAINT DF_Users_TrustScore_Profile DEFAULT 100;

    IF COL_LENGTH('dbo.Users', 'RiskBadge') IS NULL
      ALTER TABLE dbo.Users ADD RiskBadge NVARCHAR(30) NOT NULL CONSTRAINT DF_Users_RiskBadge_Profile DEFAULT 'Verified';

    IF COL_LENGTH('dbo.Users', 'ModerationNote') IS NULL
      ALTER TABLE dbo.Users ADD ModerationNote NVARCHAR(1000) NULL;

    IF COL_LENGTH('dbo.Users', 'LifetimeStrikeCount') IS NULL
      ALTER TABLE dbo.Users ADD LifetimeStrikeCount INT NOT NULL CONSTRAINT DF_Users_LifetimeStrikeCount_Profile DEFAULT 0;

    IF COL_LENGTH('dbo.Users', 'SuspendedUntil') IS NULL
      ALTER TABLE dbo.Users ADD SuspendedUntil DATETIME NULL;
  `);
}

function defaultTrustHeadline(badge) {
  if (badge === "Warned") return "Người bán này đã từng bị cảnh báo.";
  if (badge === "Restricted") return "Người bán này đang bị hạn chế do có vi phạm gần đây.";
  if (badge === "Untrusted") return "Người bán này có mức rủi ro cao. Hãy kiểm tra kỹ trước khi giao dịch.";
  return "Người bán đang ở trạng thái bình thường.";
}

function safeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

async function verifyCurrentPassword(user, password) {
  const storedPassword = user.Password || "";
  const isBcryptHash =
    typeof storedPassword === "string" && /^\$2[aby]\$\d{2}\$/.test(storedPassword);

  if (isBcryptHash) {
    return bcrypt.compare(password, storedPassword);
  }

  const matched = password === storedPassword;
  if (matched) {
    const nextHash = await bcrypt.hash(password, 10);
    await repositories.userRepository.updatePasswordHash(user.UserID, nextHash);
  }
  return matched;
}

const getMe = asyncHandler(async (req, res) => {
  const user = await loadUserWithCoinBalance(req.user.id);
  if (!user) {
    return res.status(404).json({ ok: false, message: "User not found" });
  }
  const { Password, ...safe } = user;
  res.json({ ok: true, user: safe });
});

const updateMeSchema = Joi.object({
  firstName: Joi.string().max(50).optional(),
  lastName: Joi.string().max(50).optional(),
  phoneNumber: Joi.string().max(15).optional().allow("", null),
  bio: Joi.string().max(500).optional().allow("", null),
  avatarUrl: Joi.string().uri().max(500).optional().allow("", null),
  address: Joi.string().max(500).optional().allow("", null),
});

const updateMe = asyncHandler(async (req, res) => {
  const { value, error } = updateMeSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed",
      details: error.details.map((d) => ({
        path: d.path.join("."),
        msg: d.message,
      })),
    });
  }

  const { firstName, lastName, phoneNumber, bio, avatarUrl, address } = value;
  const currentUser = await repositories.userRepository.findById(req.user.id);
  if (!currentUser) {
    return res.status(404).json({ ok: false, message: "User not found" });
  }

  const hasField = (field) => Object.prototype.hasOwnProperty.call(value, field);
  const pool = await getPool();
  const result = await pool
    .request()
    .input("UserID", sql.Int, req.user.id)
    .input(
      "FName",
      sql.NVarChar(50),
      hasField("firstName") ? firstName || null : currentUser.FName,
    )
    .input(
      "LName",
      sql.NVarChar(50),
      hasField("lastName") ? lastName || null : currentUser.LName,
    )
    .input(
      "PhoneNumber",
      sql.VarChar(15),
      hasField("phoneNumber") ? phoneNumber || null : currentUser.PhoneNumber,
    )
    .input(
      "Bio",
      sql.NVarChar(500),
      hasField("bio") ? bio || null : currentUser.Bio,
    )
    .input(
      "AvatarURL",
      sql.VarChar(500),
      hasField("avatarUrl") ? avatarUrl || null : currentUser.AvatarURL,
    )
    .input(
      "Address",
      sql.NVarChar(500),
      hasField("address") ? address || null : currentUser.Address,
    ).query(`
      UPDATE dbo.Users
      SET FName = @FName,
          LName = @LName,
          PhoneNumber = @PhoneNumber,
          Bio = @Bio,
          AvatarURL = @AvatarURL,
          Address = @Address
      WHERE UserID = @UserID;

      SELECT * FROM dbo.Users WHERE UserID = @UserID;
    `);

  const user = result.recordset[0];
  const { Password, ...safe } = user;
  res.json({ ok: true, user: safe });
});

const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      ok: false,
      message: 'No file uploaded. Send a file in the "avatar" field.',
    });
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  const pool = await getPool();
  const result = await pool
    .request()
    .input("UserID", sql.Int, req.user.id)
    .input("AvatarURL", sql.VarChar(500), avatarUrl).query(`
      UPDATE dbo.Users SET AvatarURL = @AvatarURL WHERE UserID = @UserID;
      SELECT * FROM dbo.Users WHERE UserID = @UserID;
    `);

  const user = result.recordset[0];
  if (!user) {
    return res.status(404).json({ ok: false, message: "User not found" });
  }

  const { Password, ...safe } = user;
  res.json({ ok: true, avatarUrl, user: safe });
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).max(100).required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});

const changePassword = asyncHandler(async (req, res) => {
  const { value, error } = changePasswordSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed",
      details: error.details.map((d) => ({
        path: d.path.join("."),
        msg: d.message,
      })),
    });
  }

  const user = await repositories.userRepository.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ ok: false, message: "User not found" });
  }

  const passwordOk = await verifyCurrentPassword(user, value.currentPassword);
  if (!passwordOk) {
    return res.status(400).json({ ok: false, message: "Mật khẩu hiện tại không đúng" });
  }

  if (value.currentPassword === value.newPassword) {
    return res.status(400).json({ ok: false, message: "Mật khẩu mới phải khác mật khẩu cũ" });
  }

  const nextHash = await bcrypt.hash(value.newPassword, 10);
  await repositories.userRepository.updatePasswordHash(req.user.id, nextHash);

  res.json({ ok: true, message: "Đổi mật khẩu thành công" });
});

const checkIn = asyncHandler(async (req, res) => {
  const wallet = await getOrCreateCoinWallet(req.user.id);
  if (!wallet?.WalletID) {
    return res.status(501).json({ ok: false, message: "Coin wallet is not available in this database" });
  }

  const pool = await getPool();
  const existing = await pool.request().input("WalletID", sql.Int, wallet.WalletID).query(`
    SELECT TOP 1 TxID, CreatedAt
    FROM dbo.CoinTransactions
    WHERE WalletID = @WalletID AND TxType = 'LoginStreak'
    ORDER BY CreatedAt DESC;
  `);

  const lastCheckIn = existing.recordset[0] || null;
  if (lastCheckIn) {
    const lastDate = new Date(lastCheckIn.CreatedAt);
    const now = new Date();
    if (
      lastDate.getFullYear() === now.getFullYear() &&
      lastDate.getMonth() === now.getMonth() &&
      lastDate.getDate() === now.getDate()
    ) {
      return res.status(409).json({ ok: false, message: "Bạn đã điểm danh hôm nay rồi" });
    }
  }

  const rewardCoins = 5;
  await pool.request()
    .input("WalletID", sql.Int, wallet.WalletID)
    .input("RewardCoins", sql.Decimal(18, 2), rewardCoins)
    .query(`
      UPDATE dbo.CoinWallets
      SET Balance = Balance + @RewardCoins, UpdatedAt = GETDATE()
      WHERE WalletID = @WalletID;

      INSERT INTO dbo.CoinTransactions (WalletID, Amount, TxType, Note)
      VALUES (@WalletID, @RewardCoins, 'LoginStreak', N'Điểm danh hằng ngày');
    `);

  const updatedWallet = await getOrCreateCoinWallet(req.user.id);
  res.json({
    ok: true,
    message: `Điểm danh thành công. Bạn nhận được ${rewardCoins} coins.`,
    rewardCoins,
    coinBalance: Number(updatedWallet?.Balance || 0),
  });
});

const getProfileHub = asyncHandler(async (req, res) => {
  const user = await loadUserWithCoinBalance(req.user.id);
  if (!user) {
    return res.status(404).json({ ok: false, message: "User not found" });
  }

  const buyerOrders = await repositories.orderRepository.findByUser(req.user.id, "buyer");
  const unreadMessages = await repositories.messageRepository.getUnreadCount(req.user.id);
  const conversations = await repositories.messageRepository.getConversations(req.user.id);
  const pool = await getPool();

  const receivedReviewsRes = await pool.request().input("UserID", sql.Int, req.user.id).query(`
    SELECT TOP 10
      r.ReviewID,
      r.Rating,
      r.Comment,
      r.CreatedAt,
      p.Title,
      reviewer.FName + ' ' + reviewer.LName AS ReviewerName
    FROM dbo.Reviews r
    JOIN dbo.Products p ON p.ProductID = r.ProductID
    JOIN dbo.Users reviewer ON reviewer.UserID = r.ReviewerID
    WHERE p.SellerID = @UserID
    ORDER BY r.CreatedAt DESC;
  `);

  const wallet = await getOrCreateCoinWallet(req.user.id);
  const lastCheckInRes = wallet?.WalletID
    ? await pool.request().input("WalletID", sql.Int, wallet.WalletID).query(`
        SELECT TOP 1 CreatedAt
        FROM dbo.CoinTransactions
        WHERE WalletID = @WalletID AND TxType = 'LoginStreak'
        ORDER BY CreatedAt DESC;
      `)
    : { recordset: [] };
  const lastCheckIn = lastCheckInRes.recordset[0]?.CreatedAt || null;

  const notifications = [];
  for (const order of buyerOrders.slice(0, 8)) {
    if (order.LifecycleState === "PendingPayment" && order.PaymentDueAt) {
      notifications.push({
        type: "payment",
        severity: "warning",
        createdAt: order.CreatedAt,
        title: `Đơn #${order.OrderID} đang chờ thanh toán`,
        description: `Bạn nên thanh toán trước ${new Date(order.PaymentDueAt).toLocaleString("vi-VN")}.`,
      });
    }
    if (order.LifecycleState === "Paid") {
      notifications.push({
        type: "order",
        severity: "info",
        createdAt: order.CreatedAt,
        title: `Chủ shop đã nhận đơn #${order.OrderID}`,
        description: "Người bán đang chuẩn bị hàng cho bạn.",
      });
    }
    if (order.LifecycleState === "Delivering") {
      notifications.push({
        type: "shipping",
        severity: "info",
        createdAt: order.CreatedAt,
        title: `Đơn #${order.OrderID} đã chuyển cho vận chuyển`,
        description: "Hàng của bạn đang trên đường tới nơi.",
      });
    }
    if (order.LifecycleState === "Completed") {
      notifications.push({
        type: "delivered",
        severity: "success",
        createdAt: order.CreatedAt,
        title: `Đơn #${order.OrderID} đã giao thành công`,
        description: "Bạn có thể xác nhận trải nghiệm và để lại đánh giá.",
      });
    }
  }

  if (unreadMessages > 0) {
    notifications.unshift({
      type: "message",
      severity: "info",
      createdAt: conversations[0]?.LastSentAt || new Date().toISOString(),
      title: `Bạn có ${unreadMessages} cuộc trò chuyện chưa đọc`,
      description: "Có người đang nhắn tin cho bạn trong EduCart.",
    });
  }

  res.json({
    ok: true,
    user: (() => {
      const { Password, ...safe } = user;
      return {
        ...safe,
        CoinBalance: Number(user.CoinBalance || 0),
      };
    })(),
    purchaseHistory: buyerOrders.slice(0, 10),
    notifications: notifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10),
    receivedReviews: receivedReviewsRes.recordset,
    unreadMessages,
    lastCheckIn,
    canCheckIn: !lastCheckIn || new Date(lastCheckIn).toDateString() !== new Date().toDateString(),
  });
});

const getUserPublic = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (Number.isNaN(userId)) {
    return res.status(400).json({ ok: false, message: "Invalid user ID" });
  }

  await ensureTrustColumns();
  const pool = await getPool();
  const result = await pool.request().input("UserID", sql.Int, userId).query(`
    SELECT TOP 1
      u.*,
      ISNULL(u.WarningCount, 0) AS WarningCount,
      ISNULL(u.TrustScore, 100) AS TrustScore,
      ISNULL(u.RiskBadge, 'Verified') AS RiskBadge,
      ISNULL(u.LifetimeStrikeCount, 0) AS LifetimeStrikeCount,
      u.SuspendedUntil,
      ISNULL((
        SELECT COUNT(*)
        FROM dbo.Reports r
        WHERE r.ReportedID = u.UserID AND r.Status = 'Resolved'
      ), 0) AS ResolvedReportsCount,
      ISNULL((
        SELECT COUNT(*)
        FROM dbo.Reports r
        WHERE r.ReportedID = u.UserID AND r.Status = 'Pending'
      ), 0) AS PendingReportsCount,
      ISNULL((
        SELECT COUNT(*)
        FROM dbo.Orders o
        WHERE o.SellerID = u.UserID AND o.LifecycleState = 'Completed'
      ), 0) AS CompletedOrdersAsSeller,
      ISNULL((
        SELECT COUNT(*)
        FROM dbo.Orders o
        WHERE o.SellerID = u.UserID
          AND o.LifecycleState IN ('Completed', 'Cancelled')
      ), 0) AS ClosedOrdersAsSeller
    FROM dbo.Users u
    WHERE u.UserID = @UserID
  `);

  const user = result.recordset[0];
  if (!user) {
    return res.status(404).json({ ok: false, message: "User not found" });
  }

  const { Password, ...publicProfile } = user;
  const closedOrders = safeNumber(user.ClosedOrdersAsSeller, 0);
  const completedOrders = safeNumber(user.CompletedOrdersAsSeller, 0);
  const deliverySuccessRate = closedOrders > 0 ? Number(((completedOrders / closedOrders) * 100).toFixed(1)) : null;
  const trustHeadline = defaultTrustHeadline(user.RiskBadge);

  res.json({
    ok: true,
    user: {
        ...publicProfile,
        WarningCount: safeNumber(user.WarningCount, 0),
        TrustScore: safeNumber(user.TrustScore, 100),
        LifetimeStrikeCount: safeNumber(user.LifetimeStrikeCount, 0),
        ResolvedReportsCount: safeNumber(user.ResolvedReportsCount, 0),
        PendingReportsCount: safeNumber(user.PendingReportsCount, 0),
        CompletedOrdersAsSeller: safeNumber(user.CompletedOrdersAsSeller, 0),
        DeliverySuccessRate: deliverySuccessRate,
        TrustHeadline: trustHeadline,
      TrustWarningMessage:
        user.RiskBadge && user.RiskBadge !== "Verified"
          ? "Hãy kiểm tra kỹ ảnh thật, lịch sử đánh giá và chỉ thanh toán trong luồng của hệ thống."
          : null,
    },
  });
});

module.exports = {
  getMe,
  getProfileHub,
  updateMe,
  updateMeValidator: validate(updateMeSchema),
  changePassword,
  checkIn,
  uploadAvatar,
  getUserPublic,
};
