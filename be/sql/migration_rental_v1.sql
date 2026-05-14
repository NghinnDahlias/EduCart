-- ============================================================
-- EduCart — Rental extension (v1)
--   Adds rental-specific fields to Orders + a richer LifecycleState
--   column used by the OrderStateMachine in code.
--
--   The existing Status column (Pending/Confirmed/Shipped/Completed/
--   Cancelled) is kept for backward compatibility with views and
--   the existing sp_CompleteOrder_And_Payout procedure.
-- ============================================================
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

-- ── Orders: rental fields ────────────────────────────────────
IF COL_LENGTH('dbo.Orders', 'OrderType') IS NULL
    ALTER TABLE dbo.Orders ADD OrderType VARCHAR(10) NOT NULL DEFAULT 'Buy';
GO

IF COL_LENGTH('dbo.Orders', 'RentStartDate') IS NULL
    ALTER TABLE dbo.Orders ADD RentStartDate DATE NULL;
GO
IF COL_LENGTH('dbo.Orders', 'RentEndDate') IS NULL
    ALTER TABLE dbo.Orders ADD RentEndDate DATE NULL;
GO
IF COL_LENGTH('dbo.Orders', 'RentDays') IS NULL
    ALTER TABLE dbo.Orders ADD RentDays INT NULL;
GO
IF COL_LENGTH('dbo.Orders', 'DailyRate') IS NULL
    ALTER TABLE dbo.Orders ADD DailyRate DECIMAL(18,2) NULL;
GO
IF COL_LENGTH('dbo.Orders', 'Deposit') IS NULL
    ALTER TABLE dbo.Orders ADD Deposit DECIMAL(18,2) NULL;
GO

-- LifecycleState mirrors the State pattern in code so we can
-- persist transitions like ActiveRental / DepositRefunded that
-- the legacy Status enum doesn't support.
IF COL_LENGTH('dbo.Orders', 'LifecycleState') IS NULL
    ALTER TABLE dbo.Orders ADD LifecycleState NVARCHAR(30)
        NOT NULL DEFAULT 'PendingPayment';
GO

-- Drop and re-add lifecycle check (idempotent).
IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Ord_Lifecycle')
    ALTER TABLE dbo.Orders DROP CONSTRAINT CK_Ord_Lifecycle;
GO
ALTER TABLE dbo.Orders ADD CONSTRAINT CK_Ord_Lifecycle
    CHECK (LifecycleState IN (
        'PendingPayment','Paid','Delivering',
        'ActiveRental','Completed','DepositRefunded','Cancelled'
    ));
GO

IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Ord_Type')
    ALTER TABLE dbo.Orders DROP CONSTRAINT CK_Ord_Type;
GO
ALTER TABLE dbo.Orders ADD CONSTRAINT CK_Ord_Type
    CHECK (OrderType IN ('Buy','Rent'));
GO

CREATE INDEX IX_Ord_Lifecycle ON dbo.Orders(LifecycleState);
GO

-- ── Products: stock for sell items, defaults to 1 for C2C ───
IF COL_LENGTH('dbo.Products', 'Stock') IS NULL
    ALTER TABLE dbo.Products ADD Stock INT NOT NULL DEFAULT 1;
GO

-- ── PaymentTransactions: cross-link to an Order for webhooks ─
IF COL_LENGTH('dbo.PaymentTransactions', 'OrderID') IS NULL
    ALTER TABLE dbo.PaymentTransactions ADD OrderID INT NULL;
GO
