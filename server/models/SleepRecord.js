const { pool } = require('../db');

function mapRow(row) {
  return {
    id: row.id,
    startTime: new Date(row.start_time).toISOString(),
    endTime: new Date(row.end_time).toISOString(),
    durationSeconds: row.duration_seconds,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

async function findRecent(limit = 30) {
  const [rows] = await pool.query(
    `SELECT id, start_time, end_time, duration_seconds, created_at, updated_at
     FROM sleep_records
     ORDER BY start_time DESC
     LIMIT ?`,
    [limit]
  );

  return rows.map(mapRow);
}

async function create({ startTime, endTime, durationSeconds }) {
  const [result] = await pool.query(
    `INSERT INTO sleep_records (start_time, end_time, duration_seconds)
     VALUES (?, ?, ?)`,
    [new Date(startTime), new Date(endTime), durationSeconds]
  );

  const [rows] = await pool.query(
    `SELECT id, start_time, end_time, duration_seconds, created_at, updated_at
     FROM sleep_records
     WHERE id = ?`,
    [result.insertId]
  );

  return mapRow(rows[0]);
}

async function removeById(id) {
  const [result] = await pool.query('DELETE FROM sleep_records WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

async function updateById(id, { startTime, endTime, durationSeconds }) {
  const [result] = await pool.query(
    `UPDATE sleep_records
     SET start_time = ?, end_time = ?, duration_seconds = ?
     WHERE id = ?`,
    [new Date(startTime), new Date(endTime), durationSeconds, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  const [rows] = await pool.query(
    `SELECT id, start_time, end_time, duration_seconds, created_at, updated_at
     FROM sleep_records
     WHERE id = ?`,
    [id]
  );

  return mapRow(rows[0]);
}

module.exports = {
  findRecent,
  create,
  updateById,
  removeById,
};
