const db = require("../config/db");

exports.getAll = async (limit = 10) => {
  const [rows] = await db.execute(
    "SELECT * FROM announcements ORDER BY created_at DESC LIMIT ?", [limit]
  );
  return rows;
};

exports.create = async (data) => {
  const [result] = await db.execute(
    "INSERT INTO announcements (title, body, created_at, created_by) VALUES (?, ?, ?, ?)",
    [data.title, data.body||null, data.created_at||null, data.created_by||null]
  );
  return result;
};
