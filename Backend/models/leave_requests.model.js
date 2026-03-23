const db = require("../config/db");

// Resolve leave_type string → leave_type_id, fallback to 1 (Sick)
const resolveLeaveTypeId = async (leaveType) => {
  if (!leaveType) return 1;
  const [rows] = await db.execute(
    "SELECT leave_type_id FROM leave_types WHERE leave_name = ? LIMIT 1",
    [leaveType]
  );
  return rows[0]?.leave_type_id || 1;
};

exports.create = async (data) => {
  const leave_type_id = await resolveLeaveTypeId(data.leave_type);
  const [result] = await db.execute(
    `INSERT INTO leave_requests (employee_id, leave_type_id, start_date, end_date, reason, status)
     VALUES (?, ?, ?, ?, ?, 'Pending')`,
    [data.employee_id, leave_type_id, data.start_date, data.end_date, data.reason]
  );
  return result;
};

exports.getAll = async () => {
  const [rows] = await db.execute(
    `SELECT lr.leave_request_id, lr.employee_id, lr.reason, lr.status,
     lt.leave_name AS leave_type,
     lr.approved_by, lr.manager_status, lr.hr_status,
     lr.manager_id, lr.hr_id,
     DATE_FORMAT(lr.start_date, '%Y-%m-%d') AS start_date,
     DATE_FORMAT(lr.end_date, '%Y-%m-%d') AS end_date,
     DATE_FORMAT(lr.applied_at, '%Y-%m-%dT%H:%i:%s') AS applied_at,
     DATE_FORMAT(lr.manager_action_date, '%Y-%m-%d') AS manager_action_date,
     e.first_name, e.last_name
     FROM leave_requests lr
     LEFT JOIN employees e ON lr.employee_id = e.employee_id
     LEFT JOIN leave_types lt ON lr.leave_type_id = lt.leave_type_id
     ORDER BY lr.applied_at DESC`
  );
  return rows;
};

exports.getByEmployee = async (employeeId) => {
  const [rows] = await db.execute(
    `SELECT lr.leave_request_id, lr.employee_id, lr.reason, lr.status,
     lt.leave_name AS leave_type,
     lr.approved_by, lr.manager_status, lr.hr_status,
     DATE_FORMAT(lr.start_date, '%Y-%m-%d') AS start_date,
     DATE_FORMAT(lr.end_date, '%Y-%m-%d') AS end_date,
     DATE_FORMAT(lr.applied_at, '%Y-%m-%dT%H:%i:%s') AS applied_at,
     DATE_FORMAT(lr.manager_action_date, '%Y-%m-%d') AS manager_action_date
     FROM leave_requests lr
     LEFT JOIN leave_types lt ON lr.leave_type_id = lt.leave_type_id
     WHERE lr.employee_id = ? ORDER BY lr.applied_at DESC`,
    [employeeId]
  );
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute(
    `SELECT lr.*, lt.leave_name AS leave_type
     FROM leave_requests lr
     LEFT JOIN leave_types lt ON lr.leave_type_id = lt.leave_type_id
     WHERE lr.leave_request_id = ?`,
    [id]
  );
  return rows[0] || null;
};

exports.updateStatus = async (id, status) => {
  const [result] = await db.execute(
    "UPDATE leave_requests SET status=? WHERE leave_request_id=?",
    [status, id]
  );
  return result;
};

exports.updateByManager = async (id, data) => {
  const [result] = await db.execute(
    `UPDATE leave_requests SET status=?, approved_by=?, manager_id=?, manager_status=?, manager_action_date=?
     WHERE leave_request_id=?`,
    [
      data.status,
      data.approved_by || null,
      data.approved_by || null,
      data.status,
      data.manager_action_date || null,
      id
    ]
  );
  return result;
};

exports.getByManagerOrDepartment = async (managerId, departmentId, managerUserId) => {
  const [rows] = await db.execute(
    `SELECT lr.leave_request_id, lr.employee_id, lr.reason, lr.status,
     lt.leave_name AS leave_type,
     lr.approved_by, lr.manager_status, lr.hr_status,
     DATE_FORMAT(lr.start_date, '%Y-%m-%d') AS start_date,
     DATE_FORMAT(lr.end_date, '%Y-%m-%d') AS end_date,
     DATE_FORMAT(lr.applied_at, '%Y-%m-%dT%H:%i:%s') AS applied_at,
     DATE_FORMAT(lr.manager_action_date, '%Y-%m-%d') AS manager_action_date,
     e.first_name, e.last_name, e.department_id
     FROM leave_requests lr
     LEFT JOIN employees e ON lr.employee_id = e.employee_id
     LEFT JOIN leave_types lt ON lr.leave_type_id = lt.leave_type_id
     WHERE e.employee_id != ?
       AND (
         e.manager_id = ?
         OR e.manager_id = ?
         OR (? IS NOT NULL AND e.department_id = ?)
       )
     ORDER BY lr.applied_at DESC`,
    [managerId, managerId, managerUserId || managerId, departmentId, departmentId]
  );
  return rows;
};

exports.getSummaryByMonth = async (month, departmentId = null) => {
  const [rows] = await db.execute(
    `SELECT lr.employee_id, e.first_name, e.last_name, e.department_id,
     SUM(CASE WHEN lr.status='Approved' THEN 1 ELSE 0 END) AS approved,
     SUM(CASE WHEN lr.status='Rejected' THEN 1 ELSE 0 END) AS rejected,
     SUM(CASE WHEN lr.status='Pending' THEN 1 ELSE 0 END) AS pending,
     COUNT(*) AS total
     FROM leave_requests lr LEFT JOIN employees e ON lr.employee_id = e.employee_id
     WHERE lr.applied_at LIKE ? AND (? IS NULL OR e.department_id = ?)
     GROUP BY lr.employee_id ORDER BY e.first_name ASC`,
    [`${month}%`, departmentId, departmentId]
  );
  return rows;
};

exports.remove = async (id) => {
  const [result] = await db.execute(
    "DELETE FROM leave_requests WHERE leave_request_id=?",
    [id]
  );
  return result;
};
