const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { sql, getPool } = require("../config/db");
const { verify } = require("../utils/jwt");

function normalizeText(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function safeUserFromHeader(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  try {
    const payload = verify(token);
    return { id: payload.sub, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

function scoreIntent(message, keywords) {
  return keywords.reduce((score, keyword) => score + (message.includes(keyword) ? 1 : 0), 0);
}

function classifyIntent(rawMessage) {
  const message = normalizeText(rawMessage);
  const intents = [
    {
      key: "payment_retry",
      keywords: ["thanh toan", "mo mo", "momo", "vnpay", "tra lai", "retry", "pending payment", "chua thanh toan"],
    },
    {
      key: "order_tracking",
      keywords: ["don hang", "giao den dau", "dang giao", "ship", "tracking", "theo doi", "da gui"],
    },
    {
      key: "refund_dispute",
      keywords: ["hoan tien", "khieu nai", "tranh chap", "refund", "bao cao", "scam", "lua dao", "tra hang"],
    },
    {
      key: "rent_policy",
      keywords: ["thue", "dat coc", "rental", "deposit", "thue sach"],
    },
    {
      key: "trust_score",
      keywords: ["trust", "uy tin", "bao nhieu diem", "canh bao", "ban vinh vien", "suspended"],
    },
    {
      key: "copyright",
      keywords: ["ban quyen", "pdf lau", "ebook lau", "copyright", "hoc lieu so", "scan giao trinh"],
    },
    {
      key: "product_recommendation",
      keywords: ["goi y", "recommend", "nen mua", "san pham phu hop", "tai lieu", "giao trinh", "flashcard"],
    },
    {
      key: "greeting",
      keywords: ["xin chao", "chao", "hello", "hi", "helo", "hey"],
    },
  ];

  let winner = { key: "fallback", score: 0 };
  for (const intent of intents) {
    const score = scoreIntent(message, intent.keywords);
    if (score > winner.score) {
      winner = { key: intent.key, score };
    }
  }

  return winner.score > 0 ? winner.key : "fallback";
}

async function loadRecentOrderContext(userId) {
  const pool = await getPool();
  const result = await pool.request().input("UserID", sql.Int, userId).query(`
    SELECT TOP 3
      o.OrderID,
      o.LifecycleState,
      o.IsPaid,
      o.OrderType,
      o.CreatedAt,
      DATEADD(HOUR, 2, o.CreatedAt) AS PaymentDueAt,
      (
        SELECT TOP 1 p.Title
        FROM dbo.OrderItems oi
        JOIN dbo.Products p ON p.ProductID = oi.ProductID
        WHERE oi.OrderID = o.OrderID
        ORDER BY oi.ProductID
      ) AS PrimaryTitle
    FROM dbo.Orders o
    WHERE o.BuyerID = @UserID
    ORDER BY o.CreatedAt DESC;
  `);

  return result.recordset;
}

async function loadRecommendations(rawMessage) {
  const normalized = normalizeText(rawMessage);
  const tokens = normalized
    .split(/\s+/)
    .filter((token) => token.length >= 3)
    .slice(0, 6);

  const pool = await getPool();
  const request = pool.request();
  const conditions = ["p.Status = 'Available'"];

  if (tokens.length) {
    const tokenConditions = tokens.map((token, index) => {
      request.input(`kw${index}`, sql.NVarChar(50), `%${token}%`);
      return `(p.Title LIKE @kw${index} OR ISNULL(p.Category,'') LIKE @kw${index} OR ISNULL(p.Description,'') LIKE @kw${index})`;
    });
    conditions.push(`(${tokenConditions.join(" OR ")})`);
  }

  const result = await request.query(`
    SELECT TOP 3
      p.ProductID,
      p.Title,
      p.Price,
      p.RentalPrice,
      p.IsForRent,
      p.Category,
      p.Format
    FROM dbo.Products p
    WHERE ${conditions.join(" AND ")}
    ORDER BY p.ViewCount DESC, p.CreatedAt DESC;
  `);

  return result.recordset;
}

function buildReply({ intent, orders, recommendations }) {
  switch (intent) {
    case "greeting":
      return {
        reply:
          "Xin chao. Minh la EduCart AI Assistant. Minh co the ho tro theo doi don hang, thanh toan lai, giai thich trust score, chinh sach thue sach va goi y hoc lieu phu hop.",
      };

    case "payment_retry": {
      const pendingOrder = orders.find((order) => order.LifecycleState === "PendingPayment");
      if (pendingOrder) {
        return {
          reply: `Ban dang co don #${pendingOrder.OrderID} cho "${pendingOrder.PrimaryTitle || "san pham"}" o trang thai cho thanh toan. Ban co the vao don hang de thanh toan lai truoc ${new Date(pendingOrder.PaymentDueAt).toLocaleString("vi-VN")}.`,
        };
      }
      return {
        reply:
          "Hien minh chua thay don cho thanh toan trong tai khoan cua ban. Neu ban vua tao don, hay mo trang don hang de kiem tra hoac thu lai tu buoc checkout.",
      };
    }

    case "order_tracking": {
      const latestOrder = orders[0];
      if (latestOrder) {
        return {
          reply: `Don gan nhat cua ban la #${latestOrder.OrderID} cho "${latestOrder.PrimaryTitle || "san pham"}". Trang thai hien tai la ${latestOrder.LifecycleState}. Neu don dang giao, ban co the vao chi tiet don hang de theo doi va xac nhan khi da nhan duoc hang.`,
        };
      }
      return {
        reply:
          "Hien minh chua thay don hang nao trong tai khoan cua ban. Ban co the bat dau bang cach chon san pham va vao buoc checkout.",
      };
    }

    case "refund_dispute":
      return {
        reply:
          "Neu co tranh chap, ban nen tao report hoac khieu nai ngay trong he thong, kem mo ta va bang chung. EduCart se tiep nhan, xac minh chung cu va co the hoan tien, huy giao dich hoac khoa tai khoan vi pham tuy muc do.",
      };

    case "rent_policy":
      return {
        reply:
          "Voi don thue sach, EduCart cho phep giu coc va theo doi vong doi don rieng. Ban nen kiem tra ky thoi gian thue, tien coc va lich tra hang truoc khi xac nhan giao dich.",
      };

    case "trust_score":
      return {
        reply:
          "Trust Score khoi tao la 100. Moi vi pham hop le se bi tru diem va ghi canh bao. Neu tai khoan tich luy du 10 canh bao hop le hoac diem con 50 tro xuong, he thong co the tam khoa 7 ngay. Tai pham them 3 lan sau khi mo khoa co the dan den cam vinh vien.",
      };

    case "copyright":
      return {
        reply:
          "EduCart cho phep ghi chu ca nhan, flashcard tu tao va tai lieu do nguoi dung bien soan, nhung khong cho phep scan toan bo giao trinh co ban quyen, ebook lau hoac PDF lau. Noi dung vi pham co the bi go trong vong 72 gio sau khi xac minh.",
      };

    case "product_recommendation": {
      if (recommendations.length) {
        const lines = recommendations.map((item) => {
          const price = item.IsForRent
            ? `${Number(item.RentalPrice || 0).toLocaleString("vi-VN")} đ/lan`
            : `${Number(item.Price || 0).toLocaleString("vi-VN")} đ`;
          return `- #${item.ProductID}: ${item.Title} (${price})`;
        });

        return {
          reply: `Minh goi y mot so hoc lieu phu hop voi cau hoi cua ban:\n${lines.join("\n")}\nBan co the mo trang san pham de xem chi tiet va danh gia nguoi ban.`,
        };
      }

      return {
        reply:
          "Minh chua tim thay goi y du sat trong kho hien tai. Ban thu noi ro hon mon hoc, loai hoc lieu hoac tu khoa nhu Giai tich, Cau truc du lieu, flashcard hay giao trinh nhe.",
      };
    }

    default:
      return {
        reply:
          "Minh co the ho tro theo doi don hang, thanh toan lai, chinh sach thue sach, trust score, tranh chap, ban quyen hoc lieu va goi y san pham. Ban thu hoi ngan gon hon theo mot chu de nhe.",
      };
  }
}

const chat = asyncHandler(async (req, res) => {
  const message = String(req.body?.message || "").trim();
  if (!message) {
    throw new AppError("Message is required", 400);
  }

  const user = safeUserFromHeader(req);
  const intent = classifyIntent(message);
  const orders = user?.id ? await loadRecentOrderContext(user.id) : [];
  const recommendations = await loadRecommendations(message);
  const result = buildReply({ intent, orders, recommendations });

  res.json({
    ok: true,
    intent,
    reply: result.reply,
    suggestions: recommendations.map((item) => ({
      id: item.ProductID,
      title: item.Title,
      href: `/products/${item.ProductID}`,
      price: item.IsForRent ? item.RentalPrice : item.Price,
      isForRent: Boolean(item.IsForRent),
    })),
  });
});

module.exports = {
  chat,
  classifyIntent,
};
