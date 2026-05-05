-- ============================================================
-- EduCart MSSQL  —  Schema v7  (unified final)
--   Core     : Universities · Faculties · Subjects · Users
--   Market   : Products · ProductImages · CartItems
--              DeliveryMethods · Orders · Shipments · OrderItems
--   Interact : Messages · Reviews · Reports
--   Forum    : Posts · Comments · PostVotes
--   Gamif.   : UserLevels · XpEvents
--   Revenue  : CoinWallets · CoinTransactions · PaymentTransactions
--              Advertisements · AdImpressions · Referrals
--              LoginStreaks · CommissionConfigs · OrderFees
-- ============================================================

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

-- ── Drop theo thứ tự phụ thuộc ────────────────────────────────
IF OBJECT_ID('dbo.OrderFees',          'U') IS NOT NULL DROP TABLE dbo.OrderFees;
IF OBJECT_ID('dbo.CoinWallets',        'U') IS NOT NULL DROP TABLE dbo.CoinWallets;
IF OBJECT_ID('dbo.Reviews',            'U') IS NOT NULL DROP TABLE dbo.Reviews;
IF OBJECT_ID('dbo.Messages',           'U') IS NOT NULL DROP TABLE dbo.Messages;
IF OBJECT_ID('dbo.OrderFees',          'U') IS NOT NULL DROP TABLE dbo.OrderFees;
IF OBJECT_ID('dbo.Shipments',          'U') IS NOT NULL DROP TABLE dbo.Shipments;
IF OBJECT_ID('dbo.OrderItems',         'U') IS NOT NULL DROP TABLE dbo.OrderItems;
IF OBJECT_ID('dbo.Orders',             'U') IS NOT NULL DROP TABLE dbo.Orders;
IF OBJECT_ID('dbo.DeliveryMethods',    'U') IS NOT NULL DROP TABLE dbo.DeliveryMethods;
IF OBJECT_ID('dbo.CartItems',          'U') IS NOT NULL DROP TABLE dbo.CartItems;
IF OBJECT_ID('dbo.ProductImages',      'U') IS NOT NULL DROP TABLE dbo.ProductImages;
IF OBJECT_ID('dbo.Products',           'U') IS NOT NULL DROP TABLE dbo.Products;
IF OBJECT_ID('dbo.UserUniversity',     'U') IS NOT NULL DROP TABLE dbo.UserUniversity;
IF OBJECT_ID('dbo.Users',              'U') IS NOT NULL DROP TABLE dbo.Users;
IF OBJECT_ID('dbo.Subjects',           'U') IS NOT NULL DROP TABLE dbo.Subjects;
IF OBJECT_ID('dbo.Faculties',          'U') IS NOT NULL DROP TABLE dbo.Faculties;
IF OBJECT_ID('dbo.Universities',       'U') IS NOT NULL DROP TABLE dbo.Universities;
GO


-- ============================================================
-- 1. UNIVERSITIES
-- ============================================================
CREATE TABLE dbo.Universities (
    UniversityID INT           IDENTITY(1,1) PRIMARY KEY,
    UName        NVARCHAR(255) NOT NULL,
    DomainEmail  VARCHAR(50)   NULL        -- vd: hcmut.edu.vn
);
GO


-- ============================================================
-- 2. FACULTIES  (1 trường — N khoa)
-- ============================================================
CREATE TABLE dbo.Faculties (
    FacultyID    INT           IDENTITY(1,1) PRIMARY KEY,
    UniversityID INT           NOT NULL,
    FacultyName  NVARCHAR(255) NOT NULL,
    CONSTRAINT FK_Fac_Uni
        FOREIGN KEY (UniversityID) REFERENCES dbo.Universities(UniversityID)
);
GO


-- ============================================================
-- 3. SUBJECTS  (1 khoa — N môn)
-- ============================================================
CREATE TABLE dbo.Subjects (
    SubjectID   INT           IDENTITY(1,1) PRIMARY KEY,
    FacultyID   INT           NOT NULL,
    SubjectCode VARCHAR(20)   NULL,         -- vd: CO2011
    SubjectName NVARCHAR(255) NOT NULL,
    CONSTRAINT FK_Sub_Fac
        FOREIGN KEY (FacultyID) REFERENCES dbo.Faculties(FacultyID)
);
GO


-- ============================================================
-- 4. USERS
--    Specialization (total, disjoint) theo Role:
--      Student → IsStudentVerified, EducationLevel, StudentYear
--        Undergraduate : StudentYear 1–6
--        Pupils        : StudentYear 1–12
--      Admin   → không có field riêng
-- ============================================================
CREATE TABLE dbo.Users (
    UserID            INT           IDENTITY(1,1) PRIMARY KEY,
    UserEmail         VARCHAR(100)  NOT NULL UNIQUE,

    -- Họ tên (3 phần)
    FName             NVARCHAR(50)  NULL,
    Minit             NVARCHAR(10)  NULL,
    LName             NVARCHAR(50)  NULL,

    -- Liên hệ & cá nhân
    PhoneNumber       VARCHAR(15)   NULL,
    DOB               DATE          NULL,
    Address           NVARCHAR(500) NULL,

    -- Hồ sơ hiển thị
    AvatarURL         VARCHAR(500)  NULL,
    Bio               NVARCHAR(500) NULL,
    Rating            DECIMAL(3,2)  NULL,   -- 0.00–5.00, trigger từ Reviews

    -- Tài khoản
    Password          VARCHAR(255)  NOT NULL,
    Role              NVARCHAR(20)  NOT NULL DEFAULT 'Student',
    Status            NVARCHAR(20)  NOT NULL DEFAULT 'Active',
    CreatedAt         DATETIME      NOT NULL DEFAULT GETDATE(),

    -- ── Subtype Student ─────────────────────────────────────
    IsStudentVerified BIT           NOT NULL DEFAULT 0,
    EducationLevel    NVARCHAR(20)  NULL,   -- 'Undergraduate' | 'Pupils' | NULL(Admin)
    StudentYear       TINYINT       NULL,   -- UG: 1–6 | Pupils: 1–12 | Admin: NULL
    -- ────────────────────────────────────────────────────────

    CONSTRAINT CK_U_Role        CHECK (Role IN ('Student','Admin')),
    CONSTRAINT CK_U_Status      CHECK (Status IN ('Active','Suspended','Banned')),
    CONSTRAINT CK_U_EduLevel    CHECK (EducationLevel IS NULL
                                   OR EducationLevel IN ('Undergraduate','Pupils')),
    CONSTRAINT CK_U_AdminNoStu  CHECK (NOT (Role = 'Admin'
                                   AND (EducationLevel IS NOT NULL
                                        OR StudentYear IS NOT NULL))),
    CONSTRAINT CK_U_StuHasLvl  CHECK (NOT (Role = 'Student'
                                   AND EducationLevel IS NULL)),
    CONSTRAINT CK_U_UGYear      CHECK (EducationLevel <> 'Undergraduate'
                                   OR StudentYear BETWEEN 1 AND 6),
    CONSTRAINT CK_U_PupilYear   CHECK (EducationLevel <> 'Pupils'
                                   OR StudentYear BETWEEN 1 AND 12),
    CONSTRAINT CK_U_Rating      CHECK (Rating IS NULL OR Rating BETWEEN 0 AND 5)
);
GO


-- ============================================================
-- 5. USERUNIVERSITY  (M:N — belongs to — song bằng, văn bằng 2)
-- ============================================================
CREATE TABLE dbo.UserUniversity (
    UserID       INT  NOT NULL,
    UniversityID INT  NOT NULL,
    EnrolledAt   DATE NULL,
    PRIMARY KEY (UserID, UniversityID),
    CONSTRAINT FK_UU_User FOREIGN KEY (UserID)       REFERENCES dbo.Users(UserID),
    CONSTRAINT FK_UU_Uni  FOREIGN KEY (UniversityID) REFERENCES dbo.Universities(UniversityID)
);
GO


-- ============================================================
-- 6. PRODUCTS
-- ============================================================
CREATE TABLE dbo.Products (
    ProductID   INT            IDENTITY(1,1) PRIMARY KEY,
    SellerID    INT            NOT NULL,
    UniversityID INT            NOT NULL,   
    FacultyID   INT            NOT NULL,
    SubjectID   INT            NOT NULL,
    Title       NVARCHAR(255)  NOT NULL,
    Description NVARCHAR(MAX)  NULL,
    Price       DECIMAL(18,2)  NULL     CHECK (Price >= 0),
    Condition   INT            NULL,    -- tình trạng 0–100 (%)
    IsForRent   BIT            NOT NULL DEFAULT 0,   -- 0=bán/pass  1=cho thuê
    Status      NVARCHAR(20)   NOT NULL DEFAULT 'Available',
    ViewCount   INT            NOT NULL DEFAULT 0,
    CreatedAt   DATETIME       NOT NULL DEFAULT GETDATE(),
    UpdatedAt   DATETIME       NULL,
    CONSTRAINT FK_Prod_Seller  FOREIGN KEY (SellerID)  REFERENCES dbo.Users(UserID),
    CONSTRAINT FK_Prod_Subject FOREIGN KEY (SubjectID) REFERENCES dbo.Subjects(SubjectID),
    CONSTRAINT CK_Prod_Status  CHECK (Status IN ('Available','Pending','Sold')),
    CONSTRAINT CK_Prod_Cond    CHECK (Condition IS NULL OR Condition BETWEEN 0 AND 100),
    CONSTRAINT CK_Prod_View    CHECK (ViewCount >= 0)
);
GO


-- ============================================================
-- 7. PRODUCTIMAGES  (thuộc tính đa trị của Products)
--    SortOrder = 0 → thumbnail chính
-- ============================================================
CREATE TABLE dbo.ProductImages (
    ImageID   INT          IDENTITY(1,1) PRIMARY KEY,
    ProductID INT          NOT NULL,
    ImageURL  VARCHAR(500) NOT NULL,
    SortOrder TINYINT      NOT NULL DEFAULT 0,
    CONSTRAINT FK_PI_Prod
        FOREIGN KEY (ProductID) REFERENCES dbo.Products(ProductID)
        ON DELETE CASCADE
);
GO


-- ============================================================
-- 8. CARTITEMS  (M:N Users ↔ Products — giỏ hàng)
--    Không có Quantity — mỗi listing là 1 bản duy nhất (C2C)
--    SavedForLater: 0=đang trong giỏ  1=lưu xem sau
-- ============================================================
CREATE TABLE dbo.CartItems (
    CartItemID    INT      IDENTITY(1,1) PRIMARY KEY,
    UserID        INT      NOT NULL,
    ProductID     INT      NOT NULL,
    SavedForLater BIT      NOT NULL DEFAULT 0,
    AddedAt       DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Cart_User    FOREIGN KEY (UserID)    REFERENCES dbo.Users(UserID),
    CONSTRAINT FK_Cart_Product FOREIGN KEY (ProductID) REFERENCES dbo.Products(ProductID),
    CONSTRAINT UQ_Cart         UNIQUE (UserID, ProductID)
);
GO


-- ============================================================
-- 9. DELIVERYMETHODS  (lookup — 2 loại cố định)
-- ============================================================
CREATE TABLE dbo.DeliveryMethods (
    MethodID    INT           IDENTITY(1,1) PRIMARY KEY,
    MethodCode  VARCHAR(30)   NOT NULL UNIQUE,
    MethodName  NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500) NULL,
    CONSTRAINT CK_DM_Code
        CHECK (MethodCode IN ('MeetingOnCampus','CODDelivery'))
);
GO

INSERT INTO dbo.DeliveryMethods (MethodCode, MethodName, Description) VALUES
('MeetingOnCampus', N'Gặp trực tiếp tại trường',
    N'Người mua và người bán tự thỏa thuận địa điểm, thời gian trong khuôn viên trường.'),
('CODDelivery', N'Giao hàng COD',
    N'Thanh toán khi nhận hàng qua đơn vị vận chuyển thứ ba.');
GO


-- ============================================================
-- 10. ORDERS
--     TotalPrice = SUM(OrderItems.Quantity × UnitPrice)  — dẫn xuất
--     FinalPrice = TotalPrice + Shipments.ShippingFee    — dẫn xuất
-- ============================================================
CREATE TABLE dbo.Orders (
    OrderID     INT            IDENTITY(1,1) PRIMARY KEY,
    BuyerID     INT            NOT NULL,
    SellerID    INT            NOT NULL,   -- người bán (C2C 1 seller / đơn)
    Status      NVARCHAR(20)   NOT NULL DEFAULT 'Pending',
    Note        NVARCHAR(500)  NULL,       -- ghi chú của người mua
    IsPaid      BIT            NOT NULL DEFAULT 0,
    PaidType    NVARCHAR(30)   NULL,       -- 'Cash'|'BankTransfer'|'EWallet'|'Coin'
    CreatedAt   DATETIME       NOT NULL DEFAULT GETDATE(),
    UpdatedAt   DATETIME       NULL,
    ReceivedAt  DATETIME       NULL,       -- người mua xác nhận nhận hàng
    CompletedAt DATETIME       NULL,       -- hệ thống đóng đơn
    ShippingFee DECIMAL(18,2)  NOT NULL DEFAULT 0 CHECK (ShippingFee >= 0), -- lưu cứng để audit
    CONSTRAINT FK_Ord_Buyer   FOREIGN KEY (BuyerID)  REFERENCES dbo.Users(UserID),
    CONSTRAINT FK_Ord_Seller  FOREIGN KEY (SellerID) REFERENCES dbo.Users(UserID),
    CONSTRAINT CK_Ord_Status  CHECK (Status IN
        ('Pending','Confirmed','Shipped','Completed','Cancelled')),
    CONSTRAINT CK_Ord_PaidType CHECK (PaidType IS NULL
        OR PaidType IN ('Cash','BankTransfer','EWallet','Coin')),
    CONSTRAINT CK_Ord_NotSelf  CHECK (BuyerID <> SellerID)
);
GO


-- ============================================================
-- 11. SHIPMENTS  (1:1 với Orders — bản ghi giao hàng riêng)
--     Nhánh MeetingOnCampus: MeetingPlace, MeetingTime
--     Nhánh CODDelivery    : ToAddress, Carrier, TrackingNo, ShippingFee, EstimatedAt
-- ============================================================
CREATE TABLE dbo.Shipments (
    ShipmentID   INT           IDENTITY(1,1) PRIMARY KEY,
    OrderID      INT           NOT NULL UNIQUE,
    MethodID     INT           NOT NULL,
    Status       NVARCHAR(20)  NOT NULL DEFAULT 'Pending',

    -- MeetingOnCampus
    MeetingPlace NVARCHAR(255) NULL,
    MeetingTime  DATETIME      NULL,

    -- CODDelivery
    ToAddress    NVARCHAR(500) NULL,
    Carrier      NVARCHAR(100) NULL,       -- vd: GHN, GHTK
    TrackingNo   VARCHAR(100)  NULL,
    BaseFee      DECIMAL(18,2)  NOT NULL DEFAULT 0 CHECK (BaseFee >= 0),
    EstimatedAt  DATETIME      NULL,

    -- Vòng đời
    CreatedAt    DATETIME      NOT NULL DEFAULT GETDATE(),
    ShippedAt    DATETIME      NULL,
    DeliveredAt  DATETIME      NULL,
    FailedAt     DATETIME      NULL,

    CONSTRAINT FK_Ship_Order  FOREIGN KEY (OrderID)  REFERENCES dbo.Orders(OrderID),
    CONSTRAINT FK_Ship_Method FOREIGN KEY (MethodID) REFERENCES dbo.DeliveryMethods(MethodID),
    CONSTRAINT CK_Ship_Status CHECK (Status IN
        ('Pending','Processing','InTransit','Delivered','Failed','Cancelled'))
);
GO


-- ============================================================
-- 12. ORDERITEMS  (M:N Orders ↔ Products — included in)
--     Quantity, UnitPrice là attribute của relationship
--     UnitPrice lưu cứng tại thời điểm đặt (không thay đổi khi Products.Price đổi)
-- ============================================================
CREATE TABLE dbo.OrderItems (
    OrderID   INT           NOT NULL,
    ProductID INT           NOT NULL,
    Quantity  INT           NOT NULL DEFAULT 1 CHECK (Quantity > 0),
    UnitPrice DECIMAL(18,2) NOT NULL CHECK (UnitPrice >= 0),
    PRIMARY KEY (OrderID, ProductID),
    CONSTRAINT FK_OI_Order   FOREIGN KEY (OrderID)   REFERENCES dbo.Orders(OrderID),
    CONSTRAINT FK_OI_Product FOREIGN KEY (ProductID) REFERENCES dbo.Products(ProductID)
);
GO


-- ============================================================
-- 13. MESSAGES  (thực thể yếu — partial key: SenderID + MessageID)
--     ProductID: ngữ cảnh sản phẩm đang trao đổi (NULL = chat chung)
-- ============================================================
CREATE TABLE dbo.Messages (
    MessageID  INT           IDENTITY(1,1),
    SenderID   INT           NOT NULL,
    ReceiverID INT           NOT NULL,
    ProductID  INT           NULL,
    Content    NVARCHAR(MAX) NOT NULL,
    IsRead     BIT           NOT NULL DEFAULT 0,
    SentAt     DATETIME      NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (SenderID, MessageID),
    CONSTRAINT FK_Msg_Sender   FOREIGN KEY (SenderID)   REFERENCES dbo.Users(UserID),
    CONSTRAINT FK_Msg_Receiver FOREIGN KEY (ReceiverID) REFERENCES dbo.Users(UserID),
    CONSTRAINT FK_Msg_Product  FOREIGN KEY (ProductID)  REFERENCES dbo.Products(ProductID)
);
GO


-- ============================================================
-- 14. REVIEWS  (M:N diamond: Users ─[reviews]─ Products)
--     Chỉ review được khi đơn hàng ở trạng thái Completed
--     1 đơn / 1 sản phẩm chỉ được review 1 lần
-- ============================================================
CREATE TABLE dbo.Reviews (
    ReviewID   INT           IDENTITY(1,1) PRIMARY KEY,
    ReviewerID INT           NOT NULL,
    ProductID  INT           NOT NULL,
    OrderID    INT           NOT NULL,
    Rating     TINYINT       NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comment    NVARCHAR(MAX) NULL,
    CreatedAt  DATETIME      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Rev_Reviewer FOREIGN KEY (ReviewerID) REFERENCES dbo.Users(UserID),
    CONSTRAINT FK_Rev_Product  FOREIGN KEY (ProductID)  REFERENCES dbo.Products(ProductID),
    CONSTRAINT FK_Rev_Order    FOREIGN KEY (OrderID)    REFERENCES dbo.Orders(OrderID),
    CONSTRAINT UQ_Rev          UNIQUE (OrderID, ProductID)
);
GO


-- ============================================================
-- 15. REPORTS  (M:N đệ quy: Users ─[reports]─ Users)
--     Người dùng báo cáo người dùng vi phạm
-- ============================================================
CREATE TABLE dbo.Reports (
    ReportID    INT           IDENTITY(1,1) PRIMARY KEY,
    ReporterID  INT           NOT NULL,
    ReportedID  INT           NOT NULL,
    Reason      NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Status      NVARCHAR(20)  NOT NULL DEFAULT 'Pending',
    CreatedAt   DATETIME      NOT NULL DEFAULT GETDATE(),
    CompletedAt DATETIME      NULL,
    CONSTRAINT FK_Rep_Reporter FOREIGN KEY (ReporterID) REFERENCES dbo.Users(UserID),
    CONSTRAINT FK_Rep_Reported FOREIGN KEY (ReportedID) REFERENCES dbo.Users(UserID),
    CONSTRAINT CK_Rep_Status   CHECK (Status IN ('Pending','Resolved','Dismissed')),
    CONSTRAINT CK_Rep_NotSelf  CHECK (ReporterID <> ReportedID)
);
GO



-- ============================================================
-- 21. COINWALLETS  (1:1 với Users — tạo auto khi đăng ký)
-- ============================================================
CREATE TABLE dbo.CoinWallets (
    WalletID  INT           IDENTITY(1,1) PRIMARY KEY,
    UserID    INT           NOT NULL UNIQUE,
    Balance   DECIMAL(18,2) NOT NULL DEFAULT 0 CHECK (Balance >= 0),
    UpdatedAt DATETIME      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_CW_User FOREIGN KEY (UserID) REFERENCES dbo.Users(UserID)
);
GO


-- ============================================================
-- 22. COINTRANSACTIONS  (mọi biến động xu)
--     Amount > 0: nhận vào  |  Amount < 0: chi ra
-- ============================================================
CREATE TABLE dbo.CoinTransactions (
    TxID      INT           IDENTITY(1,1) PRIMARY KEY,
    WalletID  INT           NOT NULL,
    Amount    DECIMAL(18,2) NOT NULL,
    TxType    NVARCHAR(30)  NOT NULL,
    RefID     INT           NULL,    -- OrderID / ImpressionID / ReferralID
    Note      NVARCHAR(255) NULL,
    CreatedAt DATETIME      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_CT_Wallet FOREIGN KEY (WalletID) REFERENCES dbo.CoinWallets(WalletID),
    CONSTRAINT CK_CT_Type   CHECK (TxType IN (
        'TopUp',        -- nạp xu bằng tiền thật
        'AdReward',     -- xem quảng cáo → nhận xu
        'Referral',     -- giới thiệu bạn → nhận xu
        'LoginStreak',  -- chuỗi đăng nhập → nhận xu
        'Purchase',     -- dùng xu mua / mở khóa nội dung
        'Commission',   -- phí sàn trừ từ người bán
        'Refund'        -- hoàn xu khi đơn hủy
    ))
);
GO


-- ============================================================
-- 23. PAYMENTTRANSACTIONS  (tiền thật VND chảy vào platform)
--     Tách riêng khỏi CoinTransactions để audit dòng tiền thực
-- ============================================================
CREATE TABLE dbo.PaymentTransactions (
    PayTxID     INT           IDENTITY(1,1) PRIMARY KEY,
    UserID      INT           NOT NULL,
    Amount      DECIMAL(18,2) NOT NULL CHECK (Amount > 0),
    Currency    VARCHAR(5)    NOT NULL DEFAULT 'VND',
    TxType      NVARCHAR(30)  NOT NULL,
    CoinsGiven  INT           NOT NULL DEFAULT 0,   -- xu đổi được (nếu TopUp)
    PayMethod   NVARCHAR(30)  NULL,    -- 'MoMo'|'VNPay'|'BankTransfer'|'Cash'
    Status      NVARCHAR(20)  NOT NULL DEFAULT 'Pending',
    RefID       INT           NULL,    -- OrderID nếu là CommissionCollect
    CreatedAt   DATETIME      NOT NULL DEFAULT GETDATE(),
    CompletedAt DATETIME      NULL,
    CONSTRAINT FK_PT_User    FOREIGN KEY (UserID) REFERENCES dbo.Users(UserID),
    CONSTRAINT CK_PT_Type    CHECK (TxType IN ('TopUp','CommissionCollect','Payout')),
    CONSTRAINT CK_PT_Status  CHECK (Status IN ('Pending','Completed','Failed','Refunded')),
    CONSTRAINT CK_PT_Method  CHECK (PayMethod IS NULL
        OR PayMethod IN ('MoMo','VNPay','BankTransfer','Cash'))
);
GO



-- ============================================================
-- 28. COMMISSIONCONFIGS  (lịch sử thay đổi phí sàn 0% → 10%)
--     ExpiredAt = NULL → đang áp dụng
-- ============================================================
CREATE TABLE dbo.CommissionConfigs (
    ConfigID    INT           IDENTITY(1,1) PRIMARY KEY,
    Rate        DECIMAL(5,4)  NOT NULL,   -- 0.0000=0%  0.1000=10%
    EffectiveAt DATETIME      NOT NULL DEFAULT GETDATE(),
    ExpiredAt   DATETIME      NULL,
    Note        NVARCHAR(255) NULL,
    CONSTRAINT CK_CC_Rate CHECK (Rate >= 0 AND Rate <= 0.10)
);
GO
INSERT INTO dbo.CommissionConfigs (Rate, Note)
VALUES (0.0000, N'Khởi điểm 0% — ưu đãi cho HSSV');
GO


-- ============================================================
-- 29. ORDERFEES  (1:1 với Orders — phí hoa hồng mỗi đơn)
--     Lưu cứng Rate tại thời điểm đặt để audit sau này
-- ============================================================
CREATE TABLE dbo.OrderFees (
    FeeID            INT           IDENTITY(1,1) PRIMARY KEY,
    OrderID          INT           NOT NULL UNIQUE,
    ConfigID         INT           NOT NULL,
    CommissionRate   DECIMAL(5,4)  NOT NULL,
    CommissionAmount DECIMAL(18,2) NOT NULL CHECK (CommissionAmount >= 0),
    CreatedAt        DATETIME      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_OF_Order  FOREIGN KEY (OrderID)  REFERENCES dbo.Orders(OrderID),
    CONSTRAINT FK_OF_Config FOREIGN KEY (ConfigID) REFERENCES dbo.CommissionConfigs(ConfigID)
);
GO


-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IX_Fac_UniID        ON dbo.Faculties(UniversityID);
CREATE INDEX IX_Sub_FacID        ON dbo.Subjects(FacultyID);
CREATE INDEX IX_UU_UniID         ON dbo.UserUniversity(UniversityID);
CREATE INDEX IX_Prod_SellerID    ON dbo.Products(SellerID);
CREATE INDEX IX_Prod_SubjectID   ON dbo.Products(SubjectID);
CREATE INDEX IX_Prod_Status      ON dbo.Products(Status);
CREATE INDEX IX_PI_ProdID        ON dbo.ProductImages(ProductID);
CREATE INDEX IX_Cart_ProdID      ON dbo.CartItems(ProductID);
CREATE INDEX IX_Cart_UserSaved   ON dbo.CartItems(UserID, SavedForLater);
CREATE INDEX IX_Ord_BuyerID      ON dbo.Orders(BuyerID);
CREATE INDEX IX_Ord_SellerID     ON dbo.Orders(SellerID);
CREATE INDEX IX_Ord_Status       ON dbo.Orders(Status);
CREATE INDEX IX_Ship_MethodID    ON dbo.Shipments(MethodID);
CREATE INDEX IX_Ship_Status      ON dbo.Shipments(Status);
CREATE INDEX IX_OI_ProdID        ON dbo.OrderItems(ProductID);
CREATE INDEX IX_Msg_Receiver     ON dbo.Messages(ReceiverID, IsRead);
CREATE INDEX IX_Msg_ProdID       ON dbo.Messages(ProductID);
CREATE INDEX IX_Rev_ProdID       ON dbo.Reviews(ProductID);
CREATE INDEX IX_Rev_ReviewerID   ON dbo.Reviews(ReviewerID);
CREATE INDEX IX_Rep_ReportedID   ON dbo.Reports(ReportedID);
CREATE INDEX IX_Rep_Status       ON dbo.Reports(Status);
CREATE INDEX IX_CT_WalletID      ON dbo.CoinTransactions(WalletID);
CREATE INDEX IX_CT_Type          ON dbo.CoinTransactions(TxType);
CREATE INDEX IX_PT_UserID        ON dbo.PaymentTransactions(UserID);
CREATE INDEX IX_PT_Status        ON dbo.PaymentTransactions(Status);
CREATE INDEX IX_AI_AdID          ON dbo.AdImpressions(AdID);
CREATE INDEX IX_AI_UserID        ON dbo.AdImpressions(UserID);
CREATE INDEX IX_OF_OrderID       ON dbo.OrderFees(OrderID);
CREATE INDEX IX_CC_Active        ON dbo.CommissionConfigs(EffectiveAt, ExpiredAt);
GO

GO
-- =========================================================================
-- PROCEDURE: sp_CompleteOrder_And_Payout
-- Tác dụng: Hoàn tất đơn hàng, thanh toán Xu cho Seller và tự động trừ phí sàn
-- =========================================================================
CREATE OR ALTER PROCEDURE dbo.sp_CompleteOrder_And_Payout
    @OrderID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Bắt đầu một Transaction an toàn
    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Lấy thông tin đơn hàng và kiểm tra trạng thái
        DECLARE @SellerID INT, @CurrentStatus NVARCHAR(20);
        SELECT @SellerID = SellerID, @CurrentStatus = Status
        FROM dbo.Orders WHERE OrderID = @OrderID;

        IF @CurrentStatus <> 'Shipped' AND @CurrentStatus <> 'Confirmed' AND @CurrentStatus <> 'Pending'
        BEGIN
            RAISERROR(N'Lỗi: Đơn hàng không ở trạng thái hợp lệ để hoàn tất.', 16, 1);
        END

        -- 2. Tính tổng tiền hàng (Không tính phí ship) từ OrderItems
        DECLARE @ProductTotal DECIMAL(18,2);
        SELECT @ProductTotal = ISNULL(SUM(Quantity * UnitPrice), 0)
        FROM dbo.OrderItems WHERE OrderID = @OrderID;

        -- 3. Lấy cấu hình Phí sàn (Commission) đang Active
        DECLARE @ConfigID INT, @CommissionRate DECIMAL(5,4);
        SELECT TOP 1 @ConfigID = ConfigID, @CommissionRate = Rate
        FROM dbo.CommissionConfigs
        WHERE ExpiredAt IS NULL
        ORDER BY EffectiveAt DESC;

        -- 4. Tính toán dòng tiền
        DECLARE @CommissionAmount DECIMAL(18,2) = @ProductTotal * @CommissionRate;
        DECLARE @SellerReceive DECIMAL(18,2) = @ProductTotal - @CommissionAmount;
        DECLARE @SellerWalletID INT = (SELECT WalletID FROM dbo.CoinWallets WHERE UserID = @SellerID);

        -- 5. Cập nhật số dư ví cho Người bán
        UPDATE dbo.CoinWallets
        SET Balance = Balance + @SellerReceive, UpdatedAt = GETDATE()
        WHERE WalletID = @SellerWalletID;

        -- 6. Ghi log vào CoinTransactions (Rất quan trọng để đối soát)
        -- 6.1 Ghi nhận tiền thu được từ việc bán sách
        INSERT INTO dbo.CoinTransactions (WalletID, Amount, TxType, RefID, Note)
        VALUES (@SellerWalletID, @ProductTotal, 'Purchase', @OrderID, N'Nhận tiền bán tài liệu từ Đơn hàng #' + CAST(@OrderID AS NVARCHAR));

        -- 6.2 Ghi nhận khoản bị hệ thống trừ đi làm phí sàn (nếu phí > 0)
        IF @CommissionAmount > 0
        BEGIN
            INSERT INTO dbo.CoinTransactions (WalletID, Amount, TxType, RefID, Note)
            VALUES (@SellerWalletID, -@CommissionAmount, 'Commission', @OrderID, N'Trừ phí sàn nền tảng cho Đơn hàng #' + CAST(@OrderID AS NVARCHAR));
        END

        -- 7. Ghi nhận lịch sử áp dụng phí vào bảng OrderFees
        INSERT INTO dbo.OrderFees (OrderID, ConfigID, CommissionRate, CommissionAmount)
        VALUES (@OrderID, @ConfigID, @CommissionRate, @CommissionAmount);

        -- 8. Chốt trạng thái Đơn hàng và Sản phẩm
        UPDATE dbo.Orders 
        SET Status = 'Completed', CompletedAt = GETDATE(), IsPaid = 1, PaidType = 'Coin' 
        WHERE OrderID = @OrderID;

        -- Cập nhật tất cả sách trong đơn này thành 'Sold'
        UPDATE dbo.Products 
        SET Status = 'Sold', UpdatedAt = GETDATE()
        WHERE ProductID IN (SELECT ProductID FROM dbo.OrderItems WHERE OrderID = @OrderID);

        -- Nếu tất cả các bước trên không có lỗi -> Chốt dữ liệu
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Nếu có bất kỳ lỗi nào xảy ra ở các bước trên -> Hoàn tác toàn bộ
        ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO