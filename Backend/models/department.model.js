const db = require("../config/db");

exports.create = async (data) => {
  const [result] = await db.execute(
    `INSERT INTO departments (department_name, location, budget) VALUES (?, ?, ?)`,
    [data.department_name, data.location||null, data.budget||null]
  );
  return result;
};

exports.getAll = async () => {
  const [rows] = await db.execute("SELECT * FROM departments ORDER BY department_id ASC");
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM departments WHERE department_id = ?", [id]);
  return rows[0] || null;
};

exports.update = async (id, data) => {
  const [result] = await db.execute(
    `UPDATE departments SET department_name=?, location=?, budget=? WHERE department_id=?`,
    [data.department_name, data.location||null, data.budget||null, id]
  );
  return result;
};

exports.remove = async (id) => {
  const [result] = await db.execute("DELETE FROM departments WHERE department_id=?", [id]);
  return result;
};
