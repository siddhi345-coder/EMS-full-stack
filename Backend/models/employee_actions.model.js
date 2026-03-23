const db = require("../config/db");

exports.create = async (data) => {
  if (!data.employee_id) return null;
  try {
    const [result] = await db.execute(
      "INSERT INTO employee_actions (employee_id, entity_type, entity_id, action_type, detail, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [data.employee_id, data.entity_type||null, data.entity_id||null, data.action_type||null, data.detail||null, data.created_at||null]
    );
    return result;
  } catch (err) {
    console.error("employee_actions insert failed:", err.message);
    return null;
  }
};

exports.getRecentByEmployee = async (employeeId, limit = 5) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM employee_actions WHERE employee_id = ? ORDER BY created_at DESC LIMIT ?",
      [employeeId, limit]
    );
    return rows;
  } catch (_) { return []; }
};
