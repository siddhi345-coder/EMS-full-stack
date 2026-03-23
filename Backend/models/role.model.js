const db = require("../config/db");

exports.createRole = async (data) => {
  const [result] = await db.execute("INSERT INTO roles (role_name, description) VALUES (?, ?)", [data.role_name, data.description||null]);
  return result;
};

exports.getAllRoles = async () => {
  const [rows] = await db.execute("SELECT * FROM roles ORDER BY role_id ASC");
  return rows;
};

exports.getRoleById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM roles WHERE role_id = ?", [id]);
  return rows[0] || null;
};

exports.updateRole = async (id, data) => {
  const [result] = await db.execute("UPDATE roles SET role_name=?, description=? WHERE role_id=?", [data.role_name, data.description||null, id]);
  return result;
};

exports.checkEmployeesWithRole = async (id) => {
  const [rows] = await db.execute("SELECT employee_id FROM employees WHERE role_id = ?", [id]);
  return rows;
};

exports.deleteRole = async (id) => {
  const [result] = await db.execute("DELETE FROM roles WHERE role_id=?", [id]);
  return result;
};
