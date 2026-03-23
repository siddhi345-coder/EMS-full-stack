const Employee = require("../models/employee.model");
const managerActions = require("../models/manager_actions.model");
const employeeActions = require("../models/employee_actions.model");
const Announcement = require("../models/announcement.model");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

exports.create = async (req, res, next) => {
  try {
    const result = await Employee.create(req.body);
    res.status(201).json({ message: "Employee created", employee_id: result.insertId });
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    res.json(await Employee.getAll());
  } catch (err) { next(err); }
};

exports.getManagers = async (req, res, next) => {
  try {
    const db = require("../config/db");
    const [rows] = await db.execute(
      `SELECT e.*, d.department_name, r.role_name
       FROM employees e
       INNER JOIN users u ON u.employee_id = e.employee_id
       LEFT JOIN departments d ON e.department_id = d.department_id
       LEFT JOIN roles r ON e.role_id = r.role_id
       WHERE u.role = 'Manager'
       ORDER BY e.first_name ASC`
    );
    res.json(rows);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const emp = await Employee.getById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    await Employee.update(req.params.id, req.body);
    res.json({ message: "Employee updated successfully" });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Employee.remove(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) { next(err); }
};

// ================= EMPLOYEE SELF =================
exports.getMe = async (req, res, next) => {
  try {
    const employeeId = req.user.employee_id;
    if (!employeeId) return res.status(404).json({ message: "No employee record linked to your account. Please contact HR." });

    const employee = await Employee.getById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.json(employee);
  } catch (err) { next(err); }
};

exports.updateMe = async (req, res, next) => {
  try {
    const employeeId = req.user.employee_id;
    if (!employeeId) return res.status(400).json({ message: "No employee record linked to your account." });

    const { first_name, last_name, email, phone, gender, address } = req.body;
    await Employee.updateSelf(employeeId, { first_name, last_name, email, phone, gender, address });
    res.json({ message: "Profile updated successfully" });
  } catch (err) { next(err); }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    const hash = await bcrypt.hash(password, 10);
    await User.updatePassword(req.user.id, hash);
    res.json({ message: "Password updated successfully" });
  } catch (err) { next(err); }
};

exports.getMyLogs = async (req, res, next) => {
  try {
    const employeeId = req.user.employee_id;
    if (!employeeId) return res.json([]);
    const limit = Number(req.query.limit || 5);
    const logs = await employeeActions.getRecentByEmployee(employeeId, limit);
    res.json(logs);
  } catch (err) { next(err); }
};

exports.getMyNotifications = async (req, res, next) => {
  try {
    const employeeId = req.user.employee_id;

    let leaves = [];
    if (employeeId) {
      const allLeaves = await require("../models/leave_requests.model").getByEmployee(employeeId);
      leaves = allLeaves
        .filter((l) => l.status && l.status !== "Pending")
        .slice(0, 5)
        .map((l) => ({
          type: "leave",
          title: `Leave ${l.status}`,
          detail: `${l.start_date} to ${l.end_date}`,
          date: l.manager_action_date || l.applied_at
        }));
    }

    let announcements = [];
    try {
      const allAnnouncements = await Announcement.getAll(5);
      announcements = allAnnouncements.map((a) => ({
        type: "announcement",
        title: a.title,
        detail: a.body,
        date: a.created_at
      }));
    } catch (_) {}

    res.json({ leaves, announcements });
  } catch (err) { next(err); }
};
