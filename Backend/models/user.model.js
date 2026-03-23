const db = require("../config/db");

exports.getAllUsers = async () => {
  const [rows] = await db.execute("SELECT * FROM users");
  return rows;
};

exports.getUserById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE user_id = ?", [id]);
  return rows[0] || null;
};

exports.createUser = async (userData) => {
  const { employee_id, username, password_hash, role } = userData;
  const [result] = await db.execute(
    "INSERT INTO users (employee_id, username, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)",
    [employee_id||null, username, password_hash, role]
  );
  return result;
};

exports.updateUser = async (id, userData) => {
  const { employee_id, username, password_hash, role, is_active } = userData;
  const [result] = await db.execute(
    "UPDATE users SET employee_id=?, username=?, password_hash=?, role=?, is_active=? WHERE user_id=?",
    [employee_id||null, username, password_hash, role, is_active, id]
  );
  return result;
};

exports.updatePassword = async (id, passwordHash) => {
  const [result] = await db.execute("UPDATE users SET password_hash=? WHERE user_id=?", [passwordHash, id]);
  return result;
};

exports.deleteUser = async (id) => {
  const [result] = await db.execute("DELETE FROM users WHERE user_id=?", [id]);
  return result;
};
