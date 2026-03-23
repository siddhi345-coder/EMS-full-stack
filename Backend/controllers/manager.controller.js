const employeeModel = require("../models/employee.model");
const attendanceModel = require("../models/attendance.model");
const leaveModel = require("../models/leave_requests.model");
const taskModel = require("../models/task.model");
const managerActions = require("../models/manager_actions.model");

const getManagerEmployeeId = (req) => req.user?.employee_id || null;

const getManagerDepartmentId = async (req) => {
  const employeeId = getManagerEmployeeId(req);
  if (!employeeId) return null;
  const managerProfile = await employeeModel.getById(employeeId);
  return managerProfile ? managerProfile.department_id : null;
};

const logAction = (data) => {
  try {
    managerActions.create(data);
  } catch (err) {
    console.error("Failed to log manager action", err);
  }
};

exports.getTeam = async (req, res, next) => {
  try {
    const employeeId = getManagerEmployeeId(req);
    if (!employeeId) return res.json([]);
    const departmentId = await getManagerDepartmentId(req);
    const team = await employeeModel.getByManagerOrDepartment(employeeId, departmentId, req.user.id);
    res.json(team);
  } catch (err) {
    next(err);
  }
};

exports.getTeamByManagerId = async (req, res, next) => {
  try {
    const managerId = Number(req.params.managerId);
    const role = String(req.user.role || "").toLowerCase();
    const managerEmployeeId = getManagerEmployeeId(req);
    if (role === "manager" && String(managerId) !== String(managerEmployeeId)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const team = await employeeModel.getByManagerOrDepartment(managerId, null);
    res.json(team);
  } catch (err) {
    next(err);
  }
};

exports.getTeamMember = async (req, res, next) => {
  try {
    const managerEmployeeId = getManagerEmployeeId(req);
    if (!managerEmployeeId) return res.status(400).json({ message: "Manager employee profile not linked" });
    const departmentId = await getManagerDepartmentId(req);
    const employeeId = req.params.id;
    const allowed = await employeeModel.isInManagerScope(employeeId, managerEmployeeId, departmentId);
    if (!allowed) return res.status(403).json({ message: "Access denied" });
    const employee = await employeeModel.getById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    next(err);
  }
};

exports.updateTeamMember = async (req, res, next) => {
  try {
    const managerEmployeeId = getManagerEmployeeId(req);
    if (!managerEmployeeId) return res.status(400).json({ message: "Manager employee profile not linked" });
    const departmentId = await getManagerDepartmentId(req);
    const employeeId = req.params.id;
    const allowed = await employeeModel.isInManagerScope(employeeId, managerEmployeeId, departmentId);
    if (!allowed) return res.status(403).json({ message: "Access denied" });
    await employeeModel.updateLimited(employeeId, req.body);
    logAction({ manager_id: managerEmployeeId, employee_id: employeeId, entity_type: "employee", entity_id: employeeId, action_type: "update", remark: "Updated limited employee fields", created_at: new Date().toISOString() });
    res.json({ message: "Employee updated successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getAttendanceByDate = async (req, res, next) => {
  try {
    const managerEmployeeId = getManagerEmployeeId(req);
    if (!managerEmployeeId) return res.json([]);
    const departmentId = await getManagerDepartmentId(req);
    const date = req.query.date || new Date().toISOString().split("T")[0];
    const attendance = await attendanceModel.getByManagerAndDate(managerEmployeeId, departmentId, date);
    res.json(attendance);
  } catch (err) {
    next(err);
  }
};

exports.getAttendanceSummary = async (req, res, next) => {
  try {
    const managerEmployeeId = getManagerEmployeeId(req);
    if (!managerEmployeeId) return res.json({ month: req.query.month, summary: [] });
    const departmentId = await getManagerDepartmentId(req);
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const summary = await attendanceModel.getSummaryByManagerAndMonth(managerEmployeeId, departmentId, month);
    res.json({ month, summary });
  } catch (err) {
    next(err);
  }
};

exports.getLeaves = async (req, res, next) => {
  try {
    const managerEmployeeId = getManagerEmployeeId(req);
    if (!managerEmployeeId) return res.json([]);
    const departmentId = await getManagerDepartmentId(req);
    const leaves = await leaveModel.getByManagerOrDepartment(managerEmployeeId, departmentId, req.user.id);
    res.json(leaves);
  } catch (err) {
    next(err);
  }
};

exports.updateLeaveStatus = async (req, res, next) => {
  try {
    const managerEmployeeId = getManagerEmployeeId(req);
    if (!managerEmployeeId) return res.status(400).json({ message: "Manager employee profile not linked" });
    const departmentId = await getManagerDepartmentId(req);
    const leaveId = req.params.id;
    const leave = await leaveModel.getById(leaveId);
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    const allowed = await employeeModel.isInManagerScope(leave.employee_id, managerEmployeeId, departmentId);
    if (!allowed) return res.status(403).json({ message: "Access denied" });
    const status = req.body.status;
    const manager_remark = req.body.manager_remark || null;
    await leaveModel.updateByManager(leaveId, { status, manager_remark, approved_by: managerEmployeeId, manager_action_date: new Date().toISOString().split("T")[0] });

    // restore balance if rejected (was deducted on apply)
    if (status === "Rejected") {
      const days = Math.max(1, Math.round(
        (new Date(leave.end_date) - new Date(leave.start_date)) / (1000 * 60 * 60 * 24) + 1
      ));
      await employeeModel.restoreLeaveBalance(leave.employee_id, days);
    }
    logAction({ manager_id: managerEmployeeId, employee_id: leave.employee_id, entity_type: "leave", entity_id: leaveId, action_type: status === "Approved" ? "approve" : "reject", remark: manager_remark, created_at: new Date().toISOString() });
    res.json({ message: "Leave updated successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await taskModel.getByManager(req.user.id);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const managerEmployeeId = getManagerEmployeeId(req);
    if (!managerEmployeeId) return res.status(400).json({ message: "Manager employee profile not linked" });
    const departmentId = await getManagerDepartmentId(req);
    const { employee_id, title, description, due_date } = req.body;
    const allowed = await employeeModel.isInManagerScope(employee_id, managerEmployeeId, departmentId);
    if (!allowed) return res.status(403).json({ message: "Access denied" });
    const now = new Date().toISOString();
    const result = await taskModel.create({ employee_id, manager_id: req.user.id, title, description, status: "Pending", due_date, created_at: now, updated_at: now });
    logAction({ manager_id: managerEmployeeId, employee_id, entity_type: "task", entity_id: result?.insertId || null, action_type: "assign", remark: title, created_at: now });
    res.status(201).json({ message: "Task assigned successfully" });
  } catch (err) {
    next(err);
  }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await taskModel.getById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (String(task.manager_id) !== String(req.user.id)) return res.status(403).json({ message: "Access denied" });
    const status = req.body.status;
    const now = new Date().toISOString();
    await taskModel.updateStatus(taskId, status, now);
    const managerEmployeeId = getManagerEmployeeId(req);
    logAction({ manager_id: managerEmployeeId || req.user.id, employee_id: task.employee_id, entity_type: "task", entity_id: taskId, action_type: "status_update", remark: status, created_at: now });
    res.json({ message: "Task updated successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getPerformanceSummary = async (req, res, next) => {
  try {
    const managerEmployeeId = getManagerEmployeeId(req);
    if (!managerEmployeeId) return res.json({ month: req.query.month, performance: [] });
    const departmentId = await getManagerDepartmentId(req);
    const month = req.query.month || new Date().toISOString().slice(0, 7);

    const team = await employeeModel.getByManagerOrDepartment(managerEmployeeId, departmentId, req.user.id);
    const attendanceSummary = await attendanceModel.getSummaryByManagerAndMonth(managerEmployeeId, departmentId, month);
    const taskSummary = await taskModel.getSummaryByManager(req.user.id);

    const attendanceMap = new Map(
      attendanceSummary.map((row) => [String(row.employee_id), row])
    );
    const taskMap = new Map(
      taskSummary.map((row) => [String(row.employee_id), row])
    );

    const performance = team.map((member) => {
      const attendance = attendanceMap.get(String(member.employee_id)) || {
        present_days: 0,
        absent_days: 0,
        recorded_days: 0
      };
      const tasks = taskMap.get(String(member.employee_id)) || {
        total_tasks: 0,
        completed_tasks: 0
      };

      const attendanceRate = attendance.recorded_days
        ? Math.round((attendance.present_days / attendance.recorded_days) * 100)
        : null;
      const taskCompletionRate = tasks.total_tasks
        ? Math.round((tasks.completed_tasks / tasks.total_tasks) * 100)
        : null;

      return {
        employee_id: member.employee_id,
        first_name: member.first_name,
        last_name: member.last_name,
        attendance_present: attendance.present_days || 0,
        attendance_absent: attendance.absent_days || 0,
        attendance_rate: attendanceRate,
        total_tasks: tasks.total_tasks || 0,
        completed_tasks: tasks.completed_tasks || 0,
        task_completion_rate: taskCompletionRate
      };
    });

    res.json({ month, performance });
  } catch (err) {
    next(err);
  }
};

exports.getAttendanceReport = async (req, res, next) => {
  try {
    const managerEmployeeId = getManagerEmployeeId(req);
    if (!managerEmployeeId) return res.json({ generated_at: new Date().toISOString(), month: req.query.month, summary: [] });
    const departmentId = await getManagerDepartmentId(req);
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const summary = await attendanceModel.getSummaryByManagerAndMonth(managerEmployeeId, departmentId, month);
    res.json({ generated_at: new Date().toISOString(), month, summary });
  } catch (err) {
    next(err);
  }
};

exports.getPerformanceReport = async (req, res, next) => {
  try {
    const managerEmployeeId = getManagerEmployeeId(req);
    if (!managerEmployeeId) return res.json({ generated_at: new Date().toISOString(), month: req.query.month, report: [] });
    const departmentId = await getManagerDepartmentId(req);
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const team = await employeeModel.getByManagerOrDepartment(managerEmployeeId, departmentId, req.user.id);
    const attendanceSummary = await attendanceModel.getSummaryByManagerAndMonth(managerEmployeeId, departmentId, month);
    const taskSummary = await taskModel.getSummaryByManager(req.user.id);

    const attendanceMap = new Map(
      attendanceSummary.map((row) => [String(row.employee_id), row])
    );
    const taskMap = new Map(
      taskSummary.map((row) => [String(row.employee_id), row])
    );

    const report = team.map((member) => {
      const attendance = attendanceMap.get(String(member.employee_id)) || {
        present_days: 0,
        absent_days: 0,
        recorded_days: 0
      };
      const tasks = taskMap.get(String(member.employee_id)) || {
        total_tasks: 0,
        completed_tasks: 0
      };

      return {
        employee_id: member.employee_id,
        name: `${member.first_name || ""} ${member.last_name || ""}`.trim(),
        present_days: attendance.present_days || 0,
        absent_days: attendance.absent_days || 0,
        total_tasks: tasks.total_tasks || 0,
        completed_tasks: tasks.completed_tasks || 0
      };
    });

    res.json({ generated_at: new Date().toISOString(), month, report });
  } catch (err) {
    next(err);
  }
};
