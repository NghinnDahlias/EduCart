const { sql, getPool } = require("../config/db");

let ensured = false;

async function ensureTable() {
  if (ensured) return;
  const pool = await getPool();
  await pool.request().query(`
    IF OBJECT_ID('dbo.AnalyticsEvents', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.AnalyticsEvents (
        EventID INT IDENTITY(1,1) PRIMARY KEY,
        EventType NVARCHAR(50) NOT NULL,
        EntityType NVARCHAR(50) NULL,
        EntityID INT NULL,
        UserID INT NULL,
        SessionKey VARCHAR(100) NULL,
        Metadata NVARCHAR(MAX) NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
      );

      CREATE INDEX IX_AnalyticsEvents_CreatedAt ON dbo.AnalyticsEvents (CreatedAt);
      CREATE INDEX IX_AnalyticsEvents_EventType ON dbo.AnalyticsEvents (EventType);
    END
  `);
  ensured = true;
}

const AnalyticsRepository = {
  async track({
    eventType,
    entityType = null,
    entityId = null,
    userId = null,
    sessionKey = null,
    metadata = null,
  }) {
    await ensureTable();
    const pool = await getPool();
    await pool
      .request()
      .input("EventType", sql.NVarChar(50), eventType)
      .input("EntityType", sql.NVarChar(50), entityType)
      .input("EntityID", sql.Int, entityId)
      .input("UserID", sql.Int, userId)
      .input("SessionKey", sql.VarChar(100), sessionKey)
      .input(
        "Metadata",
        sql.NVarChar(sql.MAX),
        metadata ? JSON.stringify(metadata) : null,
      )
      .query(`
        INSERT INTO dbo.AnalyticsEvents (EventType, EntityType, EntityID, UserID, SessionKey, Metadata)
        VALUES (@EventType, @EntityType, @EntityID, @UserID, @SessionKey, @Metadata);
      `);
  },

  async ensureReady() {
    await ensureTable();
  },
};

module.exports = AnalyticsRepository;
