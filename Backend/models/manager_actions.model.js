const db = require("../config/db");

exports.create = async (data) => {
  try {
    const [result] = await db.execute(
      "INSERT INTO manager_actions (manager_id, employee_id, entity_type, entity_id, action_type, remark, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [data.manager_id, data.employee_id||null, data.entity_type||null, data.entity_id||null, data.action_type||null, data.remark||null, data.created_at||null]
    );
    return result;
  } catch (err) {
    console.error("manager_actions insert failed:", err.message);
    return null;
  }
};

exports.getRecentByManager = async (managerId, limit = 5) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM manager_actions WHERE manager_id = ? ORDER BY created_at DESC LIMIT ?",
      [managerId, limit]
    );
    return rows;
  } catch (_) { return []; }
};

exports.getRecent = async (limit = 10) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM manager_actions ORDER BY created_at DESC LIMIT ?",
      [limit]
    );
    return rows;
  } catch (_) { return []; }
};
