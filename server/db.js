const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'schedule_management',
};

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
});

async function initDatabase() {
  const bootstrap = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
  });

  try {
    await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
  } finally {
    await bootstrap.end();
  }

  const connection = await pool.getConnection();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sleep_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        duration_seconds INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  initDatabase,
};
