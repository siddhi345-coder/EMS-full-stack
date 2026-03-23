const db = require("../config/db");

exports.create = async (data) => {
  const [result] = await db.execute(
    `INSERT INTO attendance (employee_id, date, check_in_time, check_out_time, status, working_hours) VALUES (?, ?, ?, ?, ?, ?)`,
    [data.employee_id, data.date, data.check_in||null, data.check_out||null, data.status||"Present", data.working_hours||null]
  );
  return result;
};

exports.getAll = async () => {
  const [rows] = await db.execute(
    `SELECT a.*, e.first_name, e.last_name FROM attendance a
     LEFT JOIN employees e ON a.employee_id = e.employee_id ORDER BY a.date DESC`
  );
  return rows;
};

exports.getByDateAndDepartment = async (date, departmentId = null) => {
  const [rows] = await db.execute(
    `SELECT a.*, e.first_name, e.last_name, e.department_id FROM attendance a
     LEFT JOIN employees e ON a.employee_id = e.employee_id
     WHERE a.date = ? AND (? IS NULL OR e.department_id = ?)
     ORDER BY e.first_name ASC`,
    [date, departmentId, departmentId]
  );
  return rows;
};

exports.getByEmployee = async (employeeId) => {
  const [rows] = await db.execute(
    `SELECT attendance_id, employee_id, status, check_in_time, check_out_time, working_hours, created_at,
     DATE_FORMAT(date, '%Y-%m-%d') AS date
     FROM attendance WHERE employee_id = ? ORDER BY date DESC`,
    [employeeId]
  );
  return rows;
};

exports.getByEmployeeAndDate = async (employeeId, date) => {
  const [rows] = await db.execute(
    `SELECT attendance_id, employee_id, status, check_in_time, check_out_time, working_hours, created_at,
     DATE_FORMAT(date, '%Y-%m-%d') AS date
     FROM attendance WHERE employee_id = ? AND date = ?`,
    [employeeId, date]
  );
  return rows[0] || null;
};

exports.getByManagerAndDate = async (managerId, departmentId, date) => {
  const [rows] = await db.execute(
    `SELECT a.*, e.first_name, e.last_name, e.department_id FROM attendance a
     LEFT JOIN employees e ON a.employee_id = e.employee_id
     WHERE a.date = ? AND (e.manager_id = ? OR (? IS NOT NULL AND e.department_id = ?))
     ORDER BY e.first_name ASC`,
    [date, managerId, departmentId, departmentId]
  );
  return rows;
};

exports.getSummaryByManagerAndMonth = async (managerId, departmentId, month) => {
  const [rows] = await db.execute(
    `SELECT a.employee_id, e.first_name, e.last_name, e.department_id,
     SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS present_days,
     SUM(CASE WHEN a.status='Absent' THEN 1 ELSE 0 END) AS absent_days,
     COUNT(*) AS recorded_days
     FROM attendance a LEFT JOIN employees e ON a.employee_id = e.employee_id
     WHERE a.date LIKE ? AND (e.manager_id = ? OR (? IS NOT NULL AND e.department_id = ?))
     GROUP BY a.employee_id ORDER BY e.first_name ASC`,
    [`${month}%`, managerId, departmentId, departmentId]
  );
  return rows;
};

exports.getSummaryByMonth = async (month, departmentId = null) => {
  const [rows] = await db.execute(
    `SELECT a.employee_id, e.first_name, e.last_name, e.department_id,
     SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS present_days,
     SUM(CASE WHEN a.status='Absent' THEN 1 ELSE 0 END) AS absent_days,
     COUNT(*) AS recorded_days
     FROM attendance a LEFT JOIN employees e ON a.employee_id = e.employee_id
     WHERE a.date LIKE ? AND (? IS NULL OR e.department_id = ?)
     GROUP BY a.employee_id ORDER BY e.first_name ASC`,
    [`${month}%`, departmentId, departmentId]
  );
  return rows;
};

exports.update = async (id, data) => {
  const [result] = await db.execute(
    `UPDATE attendance SET check_in_time=?, check_out_time=?, status=?, working_hours=? WHERE attendance_id=?`,
    [data.check_in||null, data.check_out||null, data.status||null, data.working_hours||null, id]
  );
  return result;
};

exports.updateCheckOut = async (id, data) => {
  const [result] = await db.execute(
    `UPDATE attendance SET check_out_time=?, working_hours=?, status=? WHERE attendance_id=?`,
    [data.check_out, data.working_hours, data.status, id]
  );
  return result;
};

exports.remove = async (id) => {
  const [result] = await db.execute("DELETE FROM attendance WHERE attendance_id=?", [id]);
  return result;
};
