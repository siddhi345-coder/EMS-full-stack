const attendanceModel = require("../models/attendance.model");
const managerActions = require("../models/manager_actions.model");
const employeeActions = require("../models/employee_actions.model");

// Returns local date as YYYY-MM-DD (avoids UTC timezone shift)
const localDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};

// Normalize MySQL date object or string to YYYY-MM-DD local
const normalizeDate = (d) => {
  if (!d) return "";
  if (d instanceof Date) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }
  return String(d).split("T")[0];
};

const logHrAction = async ({ req, employee_id, entity_id, action_type, remark }) => {
  const role = String(req.user?.role || "").toLowerCase();
  if (role !== "hr") return;

  try {
    await managerActions.create({
      manager_id: req.user.id,
      employee_id: employee_id || null,
      entity_type: "attendance",
      entity_id: entity_id || null,
      action_type,
      remark: remark || null,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error("Failed to log HR attendance action", err);
  }
};

const logEmployeeAction = async ({ employee_id, action_type, detail, entity_id }) => {
  try {
    await employeeActions.create({
      employee_id,
      entity_type: "attendance",
      entity_id: entity_id || null,
      action_type,
      detail: detail || null,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error("Failed to log employee attendance action", err);
  }
};

// ✅ GET ALL
exports.getAttendance = async (req, res) => {
  try {
    const role = String(req.user?.role || "").toLowerCase();

    if (role === "manager") {
      const employeeModel = require("../models/employee.model");
      const employeeId = req.user.employee_id || req.user.id;
      const emp = employeeId ? await employeeModel.getById(employeeId) : null;
      const departmentId = emp?.department_id || null;
      const date = req.query.date || new Date().toISOString().split("T")[0];
      const rows = await attendanceModel.getByManagerAndDate(req.user.id, departmentId, date);
      return res.json(rows);
    }

    const date = req.query.date || null;
    const departmentId = req.query.department_id || null;

    const rows = date
      ? await attendanceModel.getByDateAndDepartment(date, departmentId)
      : await attendanceModel.getAll();
    res.json(rows);
  } catch (error) {
    console.error("Get Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET Attendance by Employee (HR/Manager)
exports.getAttendanceByEmployee = async (req, res) => {
  try {
    const employee_id = req.params.employeeId;
    const rows = await attendanceModel.getByEmployee(employee_id);
    res.json(rows);
  } catch (error) {
    console.error("Get Attendance By Employee Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET Monthly Attendance Summary
exports.getMonthlyReport = async (req, res) => {
  try {
    const role = String(req.user?.role || "").toLowerCase();
    const month = req.query.month; // YYYY-MM
    const departmentId = req.query.department_id || null;

    if (!month) {
      return res.status(400).json({ message: "month (YYYY-MM) is required" });
    }

    if (role === "manager") {
      const employeeModel = require("../models/employee.model");
      const employeeId = req.user.employee_id || req.user.id;
      const emp = employeeId ? await employeeModel.getById(employeeId) : null;
      const managerDept = emp?.department_id || null;
      const rows = await attendanceModel.getSummaryByManagerAndMonth(req.user.id, managerDept, month);
      return res.json(rows);
    }

    const rows = await attendanceModel.getSummaryByMonth(month, departmentId);
    res.json(rows);
  } catch (error) {
    console.error("Get Attendance Report Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET MY ATTENDANCE (for employees)
exports.getMyAttendance = async (req, res) => {
  try {
    const employee_id = req.user.employee_id;
    if (!employee_id) return res.json([]);
    const month = req.query.month;

    const rows = await attendanceModel.getByEmployee(employee_id);
    // Normalize dates and attach dateStr for frontend use
    const normalized = rows.map((r) => ({ ...r, dateStr: normalizeDate(r.date) }));
    const filtered = month
      ? normalized.filter((r) => r.dateStr.startsWith(month))
      : normalized;
    res.json(filtered);
  } catch (error) {
    console.error("Get My Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ CHECK-IN (Employee)
exports.checkIn = async (req, res) => {
  try {
    const employee_id = req.user.employee_id;
    if (!employee_id) {
      return res.status(400).json({ message: "Your account is not linked to an employee record. Please contact HR." });
    }
    const today = localDate();
    const existing = await attendanceModel.getByEmployeeAndDate(employee_id, today);

    if (existing && existing.check_in_time) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const now = new Date().toTimeString().split(" ")[0]; // HH:MM:SS
    let recordId = null;
    if (existing && !existing.check_in_time) {
      await attendanceModel.update(existing.attendance_id, {
        check_in: now, check_out: existing.check_out_time || null,
        status: "Present", working_hours: existing.working_hours || null
      });
      recordId = existing.attendance_id;
    } else {
      const record = await attendanceModel.create({
        employee_id, date: today, check_in: now,
        check_out: null, status: "Present", working_hours: null
      });
      recordId = record?.insertId || null;
    }

    await logEmployeeAction({
      employee_id,
      action_type: "check_in",
      detail: `Checked in at ${now}`,
      entity_id: recordId
    });

    res.json({ message: "Checked in successfully" });
  } catch (error) {
    console.error("Check In Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ CHECK-OUT (Employee)
exports.checkOut = async (req, res) => {
  try {
    const employee_id = req.user.employee_id;
    if (!employee_id) {
      return res.status(400).json({ message: "Your account is not linked to an employee record. Please contact HR." });
    }
    const today = localDate();
    const existing = await attendanceModel.getByEmployeeAndDate(employee_id, today);

    if (!existing || !existing.check_in_time) {
      return res.status(400).json({ message: "No check-in found for today" });
    }
    if (existing.check_out_time) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    const now = new Date().toTimeString().split(" ")[0]; // HH:MM:SS
    const [h1, m1, s1] = existing.check_in_time.split(":").map(Number);
    const [h2, m2, s2] = now.split(":").map(Number);
    const secondsWorked = (h2*3600+m2*60+s2) - (h1*3600+m1*60+s1);

    if (secondsWorked < 9 * 3600) {
      return res.status(400).json({ message: "You can only check out after 9 hours of work" });
    }

    const hours = Math.round(secondsWorked / 3600 * 100) / 100;

    await attendanceModel.updateCheckOut(existing.attendance_id, {
      check_out: now, working_hours: hours, status: "Present"
    });

    await logEmployeeAction({
      employee_id,
      action_type: "check_out",
      detail: `Checked out at ${now} (${hours}h)`,
      entity_id: existing.attendance_id
    });

    res.json({ message: "Checked out successfully", working_hours: hours });
  } catch (error) {
    console.error("Check Out Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ CREATE
exports.createAttendance = async (req, res) => {
  try {
    const {
      date,
      check_in,
      check_out,
      status,
      working_hours
    } = req.body;

    const role = String(req.user?.role || "").toLowerCase();
    const employee_id =
      role === "hr" || role === "manager"
        ? req.body.employee_id || req.user.employee_id || req.user.id
        : req.user.employee_id || req.user.id;

    await attendanceModel.create({
      employee_id,
      date,
      check_in,
      check_out,
      status,
      working_hours
    });

    await logHrAction({
      req,
      employee_id,
      action_type: "create",
      remark: `Attendance created for ${date}`
    });

    res.json({ message: "Attendance created successfully" });
  } catch (error) {
    console.error("Create Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATE
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      check_in,
      check_out,
      status,
      working_hours
    } = req.body;

    await attendanceModel.update(id, {
      check_in,
      check_out,
      status,
      working_hours
    });

    await logHrAction({
      req,
      entity_id: id,
      action_type: "update",
      remark: status ? `Status set to ${status}` : "Attendance updated"
    });

    res.json({ message: "Attendance updated successfully" });
  } catch (error) {
    console.error("Update Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    await attendanceModel.remove(id);

    await logHrAction({
      req,
      entity_id: id,
      action_type: "delete",
      remark: "Attendance deleted"
    });

    res.json({ message: "Attendance deleted successfully" });
  } catch (error) {
    console.error("Delete Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
