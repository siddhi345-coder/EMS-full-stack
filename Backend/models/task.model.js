const db = require("../config/db");

exports.create = async (data) => {
  const [result] = await db.execute(
    `INSERT INTO tasks (employee_id, manager_id, title, description, status, due_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.employee_id, data.manager_id, data.title, data.description || null,
     data.status || "Pending", data.due_date || null, data.created_at || null, data.updated_at || null]
  );
  return result;
};

exports.getByManager = async (managerId) => {
  const [rows] = await db.execute(
    `SELECT t.*, e.first_name, e.last_name, e.department_id
     FROM tasks t LEFT JOIN employees e ON t.employee_id = e.employee_id
     WHERE t.manager_id = ? ORDER BY t.created_at DESC`,
    [managerId]
  );
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM tasks WHERE task_id = ?", [id]);
  return rows[0] || null;
};

exports.updateStatus = async (id, status, updated_at) => {
  const [result] = await db.execute(
    "UPDATE tasks SET status = ?, updated_at = ? WHERE task_id = ?",
    [status, updated_at || null, id]
  );
  return result;
};

exports.getSummaryByManager = async (managerId) => {
  const [rows] = await db.execute(
    `SELECT employee_id, COUNT(*) AS total_tasks,
     SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks
     FROM tasks WHERE manager_id = ? GROUP BY employee_id`,
    [managerId]
  );
  return rows;
};
