const db = require("../config/db");

const calcNet = (d) => Number(d.basic_salary||0) + Number(d.bonuses||0) - Number(d.deductions||0) - Number(d.tax||0);

exports.create = async (data) => {
  if (!data?.employee_id || !data?.basic_salary) throw new Error("Missing required payroll fields");
  const [result] = await db.execute(
    `INSERT INTO payroll (employee_id, pay_period_start, pay_period_end, basic_salary, bonuses, deductions, tax, net_salary, payment_date, payment_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.employee_id, data.pay_period_start, data.pay_period_end, data.basic_salary,
     data.bonuses||0, data.deductions||0, data.tax||0, calcNet(data),
     data.payment_date, data.payment_status||"Pending"]
  );
  return result;
};

exports.getAll = async () => {
  const [rows] = await db.execute(
    `SELECT p.*, e.first_name, e.last_name FROM payroll p
     LEFT JOIN employees e ON p.employee_id = e.employee_id ORDER BY p.pay_period_start DESC`
  );
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM payroll WHERE payroll_id=?", [id]);
  return rows[0] || null;
};

exports.getByEmployee = async (employeeId) => {
  const [rows] = await db.execute(
    "SELECT * FROM payroll WHERE employee_id=? ORDER BY pay_period_start DESC", [employeeId]
  );
  return rows;
};

exports.update = async (id, data) => {
  const existing = await exports.getById(id);
  if (!existing) throw new Error("Payroll not found");
  const updated = {
    basic_salary: data.basic_salary ?? existing.basic_salary,
    bonuses: data.bonuses ?? existing.bonuses,
    deductions: data.deductions ?? existing.deductions,
    tax: data.tax ?? existing.tax,
  };
  const [result] = await db.execute(
    `UPDATE payroll SET basic_salary=?, bonuses=?, deductions=?, tax=?, net_salary=?, payment_date=?, payment_status=? WHERE payroll_id=?`,
    [updated.basic_salary, updated.bonuses, updated.deductions, updated.tax, calcNet(updated),
     data.payment_date ?? existing.payment_date, data.payment_status ?? existing.payment_status, id]
  );
  return result;
};

exports.remove = async (id) => {
  const [result] = await db.execute("DELETE FROM payroll WHERE payroll_id=?", [id]);
  return result;
};
