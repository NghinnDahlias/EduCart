const sql = require('mssql');

// const sqlConfig = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_NAME,
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 30000,
//   },
//   options: {
//     encrypt: true,
//     trustServerCertificate: true,
//     enableArithAbort: true,
//   },
// };
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: 'localhost\\SQLEXPRESS',  // ⭐ gộp instance vào server
  database: process.env.DB_NAME,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    // instanceName: 'SQLEXPRESS',  // ⭐ bỏ dòng này đi
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

async function getPool() {
  if (pool && pool.connected) {
    return pool;
  }

  try {
    pool = await sql.connect(sqlConfig);

    pool.on('error', (err) => {
      console.error('SQL pool error:', err);
    });

    return pool;
  } catch (err) {
    console.error('Failed to connect to SQL Server:', err);
    throw err;
  }
}

async function closePool() {
  if (pool) {
    await pool.close();
    pool = null;
  }
}

module.exports = {
  sql,
  getPool,
  closePool,
};
