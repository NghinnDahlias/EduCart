-- ============================================================
-- EduCart — Stored Procedures
--   Run after educart_schema.sql.
--   All procedures use CREATE OR ALTER for idempotency.
-- ============================================================
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

USE EduCart;
GO

-- =========================================================================
-- sp_CompleteOrder_And_Payout
-- Atomically completes an order: pays the seller (minus commission) into
-- their CoinWallet and marks the order + products as Completed / Sold.
-- =========================================================================
CREATE OR ALTER PROCEDURE dbo.sp_CompleteOrder_And_Payout
    @OrderID INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Validate order state
        DECLARE @SellerID INT, @CurrentStatus NVARCHAR(20);
        SELECT @SellerID = SellerID, @CurrentStatus = Status
        FROM dbo.Orders WHERE OrderID = @OrderID;

        IF @CurrentStatus NOT IN ('Shipped', 'Confirmed', 'Pending')
            RAISERROR(N'Order is not in a valid state to complete.', 16, 1);

        -- 2. Sum product total (excluding shipping)
        DECLARE @ProductTotal DECIMAL(18,2);
        SELECT @ProductTotal = ISNULL(SUM(Quantity * UnitPrice), 0)
        FROM dbo.OrderItems WHERE OrderID = @OrderID;

        -- 3. Get active commission config
        DECLARE @ConfigID INT, @CommissionRate DECIMAL(5,4);
        SELECT TOP 1 @ConfigID = ConfigID, @CommissionRate = Rate
        FROM dbo.CommissionConfigs
        WHERE ExpiredAt IS NULL
        ORDER BY EffectiveAt DESC;

        -- 4. Calculate amounts
        DECLARE @CommissionAmount DECIMAL(18,2) = @ProductTotal * @CommissionRate;
        DECLARE @SellerReceive   DECIMAL(18,2) = @ProductTotal - @CommissionAmount;
        DECLARE @SellerWalletID  INT = (SELECT WalletID FROM dbo.CoinWallets WHERE UserID = @SellerID);

        -- 5. Credit seller wallet
        UPDATE dbo.CoinWallets
        SET Balance = Balance + @SellerReceive, UpdatedAt = GETDATE()
        WHERE WalletID = @SellerWalletID;

        -- 6. Log coin transactions
        INSERT INTO dbo.CoinTransactions (WalletID, Amount, TxType, RefID, Note)
        VALUES (@SellerWalletID, @ProductTotal, 'Purchase', @OrderID,
                N'Sale proceeds from Order #' + CAST(@OrderID AS NVARCHAR));

        IF @CommissionAmount > 0
            INSERT INTO dbo.CoinTransactions (WalletID, Amount, TxType, RefID, Note)
            VALUES (@SellerWalletID, -@CommissionAmount, 'Commission', @OrderID,
                    N'Platform commission for Order #' + CAST(@OrderID AS NVARCHAR));

        -- 7. Audit commission in OrderFees
        INSERT INTO dbo.OrderFees (OrderID, ConfigID, CommissionRate, CommissionAmount)
        VALUES (@OrderID, @ConfigID, @CommissionRate, @CommissionAmount);

        -- 8. Close order and mark products as Sold
        UPDATE dbo.Orders
        SET Status = 'Completed', CompletedAt = GETDATE(), IsPaid = 1, PaidType = 'Coin'
        WHERE OrderID = @OrderID;

        UPDATE dbo.Products
        SET Status = 'Sold', UpdatedAt = GETDATE()
        WHERE ProductID IN (SELECT ProductID FROM dbo.OrderItems WHERE OrderID = @OrderID);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO
