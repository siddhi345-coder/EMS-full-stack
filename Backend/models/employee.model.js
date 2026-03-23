const db = require("../config/db");

exports.create = async (data) => {
  const [result] = await db.execute(
    `INSERT INTO employees (first_name, last_name, email, phone, gender, department_id, role_id, hire_date, salary, manager_id, leave_balance)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 2)`,
    [data.first_name||null, data.last_name||null, data.email||null, data.phone||null,
     data.gender||null, data.department_id||null, data.role_id||null,
     data.hire_date||null, data.salary||null, data.manager_id||null]
  );
  return result;
};

exports.getAll = async () => {
  const [rows] = await db.execute(
    `SELECT e.*, d.department_name, r.role_name
     FROM employees e
     LEFT JOIN departments d ON e.department_id = d.department_id
     LEFT JOIN roles r ON e.role_id = r.role_id
     ORDER BY e.employee_id ASC`
  );
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute(
    `SELECT e.*, d.department_name, r.role_name
     FROM employees e
     LEFT JOIN departments d ON e.department_id = d.department_id
     LEFT JOIN roles r ON e.role_id = r.role_id
     WHERE e.employee_id = ?`,
    [id]
  );
  return rows[0] || null;
};

exports.update = async (id, data) => {
  const [result] = await db.execute(
    `UPDATE employees SET first_name=?, last_name=?, email=?, phone=?, gender=?,
     department_id=?, role_id=?, salary=?, manager_id=? WHERE employee_id=?`,
    [data.first_name||null, data.last_name||null, data.email||null, data.phone||null,
     data.gender||null, data.department_id||null, data.role_id||null,
     data.salary||null, data.manager_id||null, id]
  );
  return result;
};

exports.updateLimited = async (id, data) => {
  const [result] = await db.execute(
    `UPDATE employees SET email=?, phone=?, gender=? WHERE employee_id=?`,
    [data.email||null, data.phone||null, data.gender||null, id]
  );
  return result;
};

exports.updateSelf = async (id, data) => {
  const [result] = await db.execute(
    `UPDATE employees SET first_name=?, last_name=?, email=?, phone=?, gender=?, address=? WHERE employee_id=?`,
    [data.first_name||null, data.last_name||null, data.email||null,
     data.phone||null, data.gender||null, data.address||null, id]
  );
  return result;
};

exports.getByManagerOrDepartment = async (managerId, departmentId, managerUserId) => {
  const [rows] = await db.execute(
    `SELECT e.*, d.department_name, r.role_name
     FROM employees e
     LEFT JOIN departments d ON e.department_id = d.department_id
     LEFT JOIN roles r ON e.role_id = r.role_id
     WHERE e.employee_id != ?
       AND (
         e.manager_id = ?
         OR e.manager_id = ?
         OR (? IS NOT NULL AND e.department_id = ?)
       )
     ORDER BY e.employee_id ASC`,
    [managerId, managerId, managerUserId || managerId, departmentId, departmentId]
  );
  return rows;
};

exports.isInManagerScope = async (employeeId, managerId, departmentId) => {
  const [rows] = await db.execute(
    `SELECT 1 FROM employees WHERE employee_id=?
     AND (manager_id=?
          OR (? IS NOT NULL AND department_id=?)
          OR manager_id = (SELECT u.user_id FROM users u WHERE u.employee_id = ? LIMIT 1)
          OR ? = (SELECT u.user_id FROM users u WHERE u.employee_id = ? LIMIT 1))`,
    [employeeId, managerId, departmentId, departmentId, managerId, managerId, employeeId]
  );
  return rows.length > 0;
};

exports.deductLeaveBalance = async (employeeId, days) => {
  await db.execute(
    `UPDATE employees SET leave_balance = GREATEST(0, leave_balance - ?) WHERE employee_id = ?`,
    [days, employeeId]
  );
};

exports.restoreLeaveBalance = async (employeeId, days) => {
  await db.execute(
    `UPDATE employees SET leave_balance = LEAST(2, leave_balance + ?) WHERE employee_id = ?`,
    [days, employeeId]
  );
};

exports.remove = async (id) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute("UPDATE users SET employee_id=NULL WHERE employee_id=?", [id]);
    await conn.execute("UPDATE employees SET manager_id=NULL WHERE manager_id=?", [id]);
    await conn.execute("DELETE FROM attendance WHERE employee_id=?", [id]);
    await conn.execute("DELETE FROM leave_requests WHERE employee_id=? OR approved_by=?", [id, id]);
    await conn.execute("DELETE FROM payroll WHERE employee_id=?", [id]);
    await conn.execute("DELETE FROM performance_reviews WHERE employee_id=? OR reviewer_id=?", [id, id]);
    await conn.execute("DELETE FROM tasks WHERE employee_id=?", [id]);
    const [result] = await conn.execute("DELETE FROM employees WHERE employee_id=?", [id]);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
