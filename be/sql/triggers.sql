-- ============================================================
-- EduCart — Triggers
--   Keeps derived fields in sync.
-- ============================================================
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

USE EduCart;
GO

CREATE OR ALTER TRIGGER dbo.trg_UpdateProductRating
ON dbo.Reviews
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH ChangedProducts AS (
        SELECT ProductID FROM inserted
        UNION
        SELECT ProductID FROM deleted
    ),
    Agg AS (
        SELECT ProductID,
               AVG(CAST(Rating AS DECIMAL(5,2))) AS AvgRating,
               COUNT(*) AS ReviewCount
        FROM dbo.Reviews
        WHERE ProductID IN (SELECT ProductID FROM ChangedProducts)
        GROUP BY ProductID
    )
    UPDATE p
    SET Rating = a.AvgRating,
        ReviewsCount = a.ReviewCount
    FROM dbo.Products p
    JOIN Agg a ON a.ProductID = p.ProductID;

    UPDATE p
    SET Rating = NULL,
        ReviewsCount = 0
    FROM dbo.Products p
    WHERE p.ProductID IN (SELECT ProductID FROM ChangedProducts)
      AND NOT EXISTS (
          SELECT 1 FROM dbo.Reviews r WHERE r.ProductID = p.ProductID
      );
END;
GO
