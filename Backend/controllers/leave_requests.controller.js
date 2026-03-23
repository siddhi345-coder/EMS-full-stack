const leaveModel = require("../models/leave_requests.model");
const employeeModel = require("../models/employee.model");
const managerActions = require("../models/manager_actions.model");
const employeeActions = require("../models/employee_actions.model");

const getEmployeeId = (req) => req.user.employee_id || null;

const getManagerDepartmentId = async (req) => {
  const employeeId = req.user.employee_id || null;
  if (!employeeId) return null;
  const profile = await employeeModel.getById(employeeId);
  return profile ? profile.department_id : null;
};

// APPLY
exports.createLeave = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { start_date, end_date, reason, leave_type } = req.body;
    if (!start_date || !end_date || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const employee_id = getEmployeeId(req);
    if (!employee_id) {
      return res.status(400).json({ message: "Your account is not linked to an employee record. Please contact HR." });
    }

    // calculate number of days
    const days = Math.max(1, Math.round(
      (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24) + 1
    ));

    // check sufficient balance
    const emp = await employeeModel.getById(employee_id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    if ((emp.leave_balance ?? 0) < days) {
      return res.status(400).json({ message: `Insufficient leave balance. You have ${emp.leave_balance ?? 0} day(s) remaining.` });
    }

    const result = await leaveModel.create({ employee_id, start_date, end_date, reason, leave_type });

    // deduct balance immediately on apply
    await employeeModel.deductLeaveBalance(employee_id, days);

    try {
      await employeeActions.create({
        employee_id,
        entity_type: "leave",
        entity_id: result?.insertId || null,
        action_type: "apply",
        detail: `Leave applied ${start_date} to ${end_date}`,
        created_at: new Date().toISOString()
      });
    } catch (err) {
      console.error("Failed to log employee leave action", err);
    }

    res.status(201).json({ message: "Leave applied successfully" });
  } catch (err) {
    next(err);
  }
};

// GET ALL
exports.getLeaves = async (req, res, next) => {
  try {
    if (!req.user?.role) return res.status(401).json({ message: "Unauthorized" });

    const role = req.user.role.toLowerCase();
    let leaves;

    if (role === "hr" || role === "manager" || role === "admin") {
      leaves = await leaveModel.getAll();
    } else {
      const employee_id = getEmployeeId(req);
      leaves = employee_id ? await leaveModel.getByEmployee(employee_id) : [];
    }

    res.json(leaves);
  } catch (err) {
    next(err);
  }
};

// GET BY ID
exports.getLeave = async (req, res, next) => {
  try {
    const leave = await leaveModel.getById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    const role = req.user.role.toLowerCase();
    if (role === "hr") return res.json(leave);

    if (role === "manager") {
      const departmentId = await getManagerDepartmentId(req);
      const allowed = await employeeModel.isInManagerScope(leave.employee_id, req.user.id, departmentId);
      if (!allowed) return res.status(403).json({ message: "Access denied" });
      return res.json(leave);
    }

    if (String(leave.employee_id) !== String(getEmployeeId(req))) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(leave);
  } catch (err) {
    next(err);
  }
};

// GET BY EMPLOYEE
exports.getEmployeeLeaves = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const role = req.user.role.toLowerCase();

    if (role === "employee" && String(employeeId) !== String(getEmployeeId(req))) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (role === "manager") {
      // manager can view any employee's leaves
    }

    res.json(await leaveModel.getByEmployee(employeeId));
  } catch (err) {
    next(err);
  }
};

// CANCEL (Employee)
exports.cancelLeave = async (req, res, next) => {
  try {
    const employee_id = getEmployeeId(req);
    const leave = await leaveModel.getById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    if (String(leave.employee_id) !== String(employee_id)) return res.status(403).json({ message: "Access denied" });
    if (leave.status !== "Pending") return res.status(400).json({ message: "Only pending leaves can be cancelled" });

    const result = await leaveModel.updateStatus(req.params.id, "Cancelled");
    if (!result || result.affectedRows === 0) return res.status(404).json({ message: "Leave not found" });

    // restore balance
    const days = Math.max(1, Math.round(
      (new Date(leave.end_date) - new Date(leave.start_date)) / (1000 * 60 * 60 * 24) + 1
    ));
    await employeeModel.restoreLeaveBalance(employee_id, days);

    res.json({ message: "Leave cancelled successfully" });
  } catch (err) {
    next(err);
  }
};

// LEAVE SUMMARY (HR)
exports.getLeaveSummary = async (req, res, next) => {
  try {
    const month = req.query.month;
    if (!month) return res.status(400).json({ message: "month (YYYY-MM) is required" });
    res.json(await leaveModel.getSummaryByMonth(month, req.query.department_id || null));
  } catch (err) {
    next(err);
  }
};

// UPDATE (HR/Manager approve/reject)
exports.updateLeave = async (req, res, next) => {
  try {
    const role = req.user.role.toLowerCase();
    const leave = await leaveModel.getById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    if (role === "manager") {
      // manager can approve/reject any leave — scope enforced on frontend
    } else if (role === "hr") {
      // hr can view but not action
    }

    const result = await leaveModel.updateByManager(req.params.id, {
      status: req.body.status,
      approved_by: req.user.id,
      manager_action_date: new Date().toISOString().split("T")[0]
    });

    if (!result || result.affectedRows === 0) return res.status(404).json({ message: "Leave not found" });

    // restore balance if rejected
    if (req.body.status === "Rejected") {
      const days = Math.max(1, Math.round(
        (new Date(leave.end_date) - new Date(leave.start_date)) / (1000 * 60 * 60 * 24) + 1
      ));
      await employeeModel.restoreLeaveBalance(leave.employee_id, days);
    }

    try {
      managerActions.create({
        manager_id: req.user.id,
        employee_id: leave.employee_id,
        entity_type: "leave",
        entity_id: req.params.id,
        action_type: req.body.status === "Approved" ? "approve" : "reject",
        remark: req.body.manager_remark || req.body.remark || null,
        created_at: new Date().toISOString()
      });
    } catch (err) {
      console.error("Failed to log leave action", err);
    }

    res.json({ message: "Leave updated successfully" });
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.deleteLeave = async (req, res, next) => {
  try {
    const result = await leaveModel.remove(req.params.id);
    if (!result || result.affectedRows === 0) return res.status(404).json({ message: "Leave not found" });
    res.json({ message: "Leave deleted successfully" });
  } catch (err) {
    next(err);
  }
};
