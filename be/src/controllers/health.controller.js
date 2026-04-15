const { getPool } = require('../config/db');

async function healthCheck(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT GETDATE() AS CurrentTime');

    res.status(200).json({
      ok: true,
      message: 'SQL Server is responding',
      currentTime: result.recordset[0].CurrentTime,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Health check failed',
      error: error.message,
    });
  }
}

module.exports = {
  healthCheck,
};
