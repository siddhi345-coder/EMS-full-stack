
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBuilding,
  FaPlus,
  FaEdit,
  FaTrash,

  FaEye,

} from "react-icons/fa";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getManagers
} from "../../api/employee.api";
import {
  getAttendance,
  getAttendanceByEmployee,
  getAttendanceReport,
  createAttendance,
  updateAttendance,
  deleteAttendance
} from "../../api/attendance.api";
import {
  getLeaves,
  getLeavesByEmployee,
  getLeaveSummary
} from "../../api/leave_requests.api";
import { getDepartments } from "../../api/departments.api";
import { getRoles } from "../../api/role.api";
import { getHrLogs } from "../../api/hr.api";
import { downloadEmployeeSummary, downloadDepartmentWise, downloadMonthlyAttendance } from "../../api/reports.api";
import EmployeeForm from "../../components/employees/EmployeeForm";
import ConfirmModal from "../../components/common/ConfirmModal";
import "./HRDashboard.css";

const HRDashboard = () => {
  const [searchParams] = useSearchParams();
  const [section, setSection] = useState("overview");

  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [todayStats, setTodayStats] = useState({ present: 0, absent: 0 });
  const [leaves, setLeaves] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [logs, setLogs] = useState([]);

  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeDept, setEmployeeDept] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [employeeSort, setEmployeeSort] = useState({ key: "name", dir: "asc" });

  const [attendanceDate, setAttendanceDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [attendanceDept, setAttendanceDept] = useState("");

  const [leaveStatus, setLeaveStatus] = useState("all");
  const [leaveSearch, setLeaveSearch] = useState("");

  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [profileEmployee, setProfileEmployee] = useState(null);
  const [profileAttendance, setProfileAttendance] = useState([]);
  const [profileLeaves, setProfileLeaves] = useState([]);

  const [attendanceModal, setAttendanceModal] = useState(false);
  const [attendanceForm, setAttendanceForm] = useState({
    attendance_id: null,
    employee_id: "",
    date: new Date().toISOString().split("T")[0],
    check_in: "",
    check_out: "",
    status: "Present",
    working_hours: ""
  });

const [reportMonth, setReportMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [reportDept, setReportDept] = useState("");
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState([]);

  useEffect(() => {
    const target = searchParams.get("section");
    if (target) {
      setSection(target);
    }
  }, [searchParams]);

  useEffect(() => {
    loadBaseData();
    loadAttendance();
    loadTodayStats();
    loadLogs();
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [attendanceDate, attendanceDept]);

  const loadTodayStats = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const rows = await getAttendance({ date: today });
      const present = rows.filter((a) => a.status === "Present").length;
      const absent = rows.filter((a) => a.status === "Absent").length;
      setTodayStats({ present, absent });
    } catch (err) {
      console.error("Failed to load today stats", err);
    }
  };

  const loadBaseData = async () => {
    try {
      const [emp, lv, dept, rol, mgr] = await Promise.all([
        getEmployees(),
        getLeaves(),
        getDepartments(),
        getRoles(),
        getManagers()
      ]);
      setEmployees(Array.isArray(emp) ? emp : []);
      setLeaves(Array.isArray(lv) ? lv : []);
      setDepartments(Array.isArray(dept) ? dept : []);
      setRoles(Array.isArray(rol) ? rol : []);
      setManagers(Array.isArray(mgr) ? mgr : []);
    } catch (err) {
      console.error("Failed to load base data", err);
    }
  };

  const loadAttendance = async () => {
    try {
      const params = {};
      if (attendanceDate) params.date = attendanceDate;
      if (attendanceDept) params.department_id = attendanceDept;
      const att = await getAttendance(params);
      setAttendance(att);
    } catch (err) {
      console.error("Failed to load attendance", err);
    }
  };

  const loadLogs = async () => {
    try {
      const data = await getHrLogs(8);
      setLogs(data);
    } catch (err) {
      console.error("Failed to load logs", err);
    }
  };

  const refreshAll = async () => {
    await Promise.all([loadBaseData(), loadAttendance(), loadTodayStats(), loadLogs()]);
  };
  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowEmployeeForm(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleSaveEmployee = async (formData, setFormError) => {
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.employee_id, formData);
      } else {
        await createEmployee(formData);
      }
      setShowEmployeeForm(false);
      await loadBaseData();
      await loadLogs();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to save employee";
      if (setFormError) setFormError(msg);
      else alert(msg);
    }
  };

  const handleDeleteEmployee = (employeeId) => {
    const employee = employees.find((emp) => emp.employee_id === employeeId);
    setConfirmDelete(employee);
  };

  const confirmDeleteEmployee = async () => {
    try {
      await deleteEmployee(confirmDelete.employee_id);
      setConfirmDelete(null);
      await loadBaseData();
      await loadLogs();
    } catch (err) {
      console.error("Failed to delete employee", err);
    }
  };

  const openProfile = async (employee) => {
    setProfileEmployee(employee);
    try {
      const [att, lv] = await Promise.all([
        getAttendanceByEmployee(employee.employee_id),
        getLeavesByEmployee(employee.employee_id)
      ]);
      setProfileAttendance(att);
      setProfileLeaves(lv);
    } catch (err) {
      console.error("Failed to load profile history", err);
    }
  };

  const closeProfile = () => {
    setProfileEmployee(null);
    setProfileAttendance([]);
    setProfileLeaves([]);
  };

  const openAttendanceModal = (record = null) => {
    if (record) {
      setAttendanceForm({
        attendance_id: record.attendance_id,
        employee_id: record.employee_id,
        date: record.date,
        check_in: record.check_in || "",
        check_out: record.check_out || "",
        status: record.status || "Present",
        working_hours: record.working_hours || ""
      });
    } else {
      setAttendanceForm({
        attendance_id: null,
        employee_id: "",
        date: attendanceDate || new Date().toISOString().split("T")[0],
        check_in: "",
        check_out: "",
        status: "Present",
        working_hours: ""
      });
    }
    setAttendanceModal(true);
  };

  const saveAttendance = async () => {
    try {
      const payload = {
        employee_id: attendanceForm.employee_id,
        date: attendanceForm.date,
        check_in: attendanceForm.check_in,
        check_out: attendanceForm.check_out,
        status: attendanceForm.status,
        working_hours: attendanceForm.working_hours
      };
      if (attendanceForm.attendance_id) {
        await updateAttendance(attendanceForm.attendance_id, payload);
      } else {
        await createAttendance(payload);
      }
      setAttendanceModal(false);
      await loadAttendance();
      await loadLogs();
    } catch (err) {
      console.error("Failed to save attendance", err);
    }
  };

  const removeAttendance = async (id) => {
    try {
      await deleteAttendance(id);
      await loadAttendance();
      await loadLogs();
    } catch (err) {
      console.error("Failed to delete attendance", err);
    }
  };

  const generateAttendanceReport = async () => {
    try {
      const rows = await getAttendanceReport(reportMonth, reportDept);
      setAttendanceReport(rows);
    } catch (err) {
      console.error("Failed to load attendance report", err);
    }
  };

  const generateLeaveSummary = async () => {
    try {
      const rows = await getLeaveSummary(reportMonth, reportDept);
      setLeaveSummary(rows);
    } catch (err) {
      console.error("Failed to load leave summary", err);
    }
  };

  const downloadCSV = (filename, rows) => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
      )
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const today = new Date().toISOString().split("T")[0];
  const presentToday = todayStats.present;
  const absentToday = todayStats.absent;
  const pendingLeaves = leaves.filter((l) => l.status === "Pending").length;

  const employeeMap = useMemo(() => {
    return new Map(
      employees.map((emp) => [
        emp.employee_id,
        `${emp.first_name} ${emp.last_name}`
      ])
    );
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const name = `${emp.first_name} ${emp.last_name}`.toLowerCase();
        const matchesSearch = name.includes(employeeSearch.toLowerCase());
        const matchesDept = employeeDept ? String(emp.department_id) === String(employeeDept) : true;
        const matchesRole = employeeRole ? String(emp.role_id) === String(employeeRole) : true;
        return matchesSearch && matchesDept && matchesRole;
      })
      .sort((a, b) => {
        const dir = employeeSort.dir === "asc" ? 1 : -1;
        if (employeeSort.key === "name") {
          return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`) * dir;
        }
        if (employeeSort.key === "hire_date") {
          return String(a.hire_date || "").localeCompare(String(b.hire_date || "")) * dir;
        }
        if (employeeSort.key === "department") {
          return String(a.department_id || "").localeCompare(String(b.department_id || "")) * dir;
        }
        return String(a.employee_id).localeCompare(String(b.employee_id)) * dir;
      });
  }, [employees, employeeSearch, employeeDept, employeeRole, employeeSort]);

  const filteredLeaves = useMemo(() => {
    return leaves.filter((l) => {
      const matchesStatus = leaveStatus === "all" ? true : l.status === leaveStatus;
      const employeeName = employeeMap.get(l.employee_id)?.toLowerCase() || "";
      const matchesSearch =
        !leaveSearch ||
        employeeName.includes(leaveSearch.toLowerCase()) ||
        String(l.employee_id).includes(leaveSearch);
      return matchesStatus && matchesSearch;
    });
  }, [leaves, leaveStatus, leaveSearch, employeeMap]);

  const recentActivities = logs.map((log) => {
    return {
      id: log.action_id,
      title: `${(log.action_type || "action").toUpperCase()}: ${log.entity_type}`,
      detail: log.remark || `Employee ${log.employee_id || "-"}`
    };
  });

  return (
    <div className="hr-dashboard">
      <div className="hr-header">
        <div>
          <h1>HR Command Center</h1>
          <p>Manage people, attendance, and approvals at a glance.</p>
        </div>
        <div className="hr-header-actions">

          <button className="btn-primary" onClick={handleAddEmployee}>


            <FaPlus /> Add Employee
          </button>
        </div>
      </div>

      <div className="hr-tabs">
        {[
          { key: "overview", label: "Overview" },
          { key: "employees", label: "Employees" },
          { key: "attendance", label: "Attendance" },
          { key: "leaves", label: "Leaves" },
          { key: "reports", label: "Reports" }
        ].map((tab) => (
          <button
            key={tab.key}
            className={section === tab.key ? "tab-active" : "tab"}
            onClick={() => setSection(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {section === "overview" && (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <FaUsers />
              <div>
                <p>Total Employees</p>
                <h3>{employees.length}</h3>
              </div>
            </div>
            <div className="stat-card">
              <FaCheckCircle />
              <div>
                <p>Present Today</p>
                <h3>{presentToday}</h3>
              </div>
            </div>
            <div className="stat-card">
              <FaTimesCircle />
              <div>
                <p>Absent Today</p>
                <h3>{absentToday}</h3>
              </div>
            </div>
            <div className="stat-card">
              <FaClock />
              <div>
                <p>Pending Leaves</p>
                <h3>{pendingLeaves}</h3>
              </div>
            </div>
            <div className="stat-card">
              <FaBuilding />
              <div>
                <p>Departments</p>
                <h3>{departments.length}</h3>
              </div>
            </div>
          </div>

          <div className="hr-grid">
            <section className="hr-panel">
              <h2>Recent Activities</h2>
              <ul className="activity-feed">
                {recentActivities.length ? (
                  recentActivities.map((item) => (
                    <li key={item.id}>
                      <strong>{item.title}</strong>
                      <span>{item.detail}</span>
                    </li>
                  ))
                ) : (
                  <li>No recent HR activity yet.</li>
                )}
              </ul>
            </section>

            <section className="hr-panel">
              <h2>Quick Metrics</h2>
              <div className="metric-list">
                <div>
                  <span>Average Leave Balance</span>
                  <strong>
                    {employees.length
                      ? Math.round(
                          employees.reduce((acc, e) => acc + (e.leave_balance || 0), 0) /
                            employees.length
                        )
                      : 0}
                  </strong>
                </div>
                <div>
                  <span>Active Requests</span>
                  <strong>{pendingLeaves}</strong>
                </div>
                <div>
                  <span>Attendance Coverage</span>
                  <strong>
                    {employees.length
                      ? `${Math.round((presentToday / employees.length) * 100)}%`
                      : "0%"}
                  </strong>
                </div>
              </div>
            </section>
          </div>
        </>
      )}

      {section === "employees" && (
        <section className="hr-panel">
          <div className="panel-header">
            <h2>Employee Management</h2>
            <div className="panel-actions">
              <input
                className="input"
                placeholder="Search employee"
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
              />
              <select className="input" value={employeeDept} onChange={(e) => setEmployeeDept(e.target.value)}>
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
              <select className="input" value={employeeRole} onChange={(e) => setEmployeeRole(e.target.value)}>
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
              <select
                className="input"
                value={`${employeeSort.key}:${employeeSort.dir}`}
                onChange={(e) => {
                  const [key, dir] = e.target.value.split(":");
                  setEmployeeSort({ key, dir });
                }}
              >
                <option value="name:asc">Name (A-Z)</option>
                <option value="name:desc">Name (Z-A)</option>
                <option value="hire_date:asc">Hire Date (Oldest)</option>
                <option value="hire_date:desc">Hire Date (Newest)</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table className="hr-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Manager</th>
                  <th>Email</th>
                  <th>Leave Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length ? (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.employee_id}>
                      <td>{emp.employee_id}</td>
                      <td>{emp.first_name} {emp.last_name}</td>
                      <td>{emp.department_name || "-"}</td>
                      <td>{emp.role_name || "-"}</td>
                      <td>{managers.find(m => m.employee_id === emp.manager_id) ? `${managers.find(m => m.employee_id === emp.manager_id).first_name} ${managers.find(m => m.employee_id === emp.manager_id).last_name}` : "-"}</td>
                      <td>{emp.email}</td>
                      <td>{emp.leave_balance ?? 0}</td>
                      <td className="actions">
                        <button className="icon-btn" onClick={() => openProfile(emp)}>
                          <FaEye />
                        </button>
                        <button className="icon-btn" onClick={() => handleEditEmployee(emp)}>
                          <FaEdit />
                        </button>
                        <button className="icon-btn danger" onClick={() => handleDeleteEmployee(emp.employee_id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="empty">No employees found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {section === "attendance" && (
        <section className="hr-panel">
          <div className="panel-header">
            <h2>Attendance Management</h2>
            <div className="panel-actions">
              <input
                className="input"
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
              />
              <select className="input" value={attendanceDept} onChange={(e) => setAttendanceDept(e.target.value)}>
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
              <button className="btn-primary" onClick={() => openAttendanceModal()}>
                <FaPlus /> Mark Attendance
              </button>
            </div>
          </div>

          <div className="table-wrap">
            <table className="hr-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Hours</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length ? (
                  attendance.map((row) => (
                    <tr key={row.attendance_id}>
                      <td>{row.first_name} {row.last_name}</td>
                      <td>{row.date}</td>
                      <td>{row.status}</td>
                      <td>{row.check_in || "-"}</td>
                      <td>{row.check_out || "-"}</td>
                      <td>{row.working_hours || "-"}</td>
                      <td className="actions">
                        <button className="icon-btn" onClick={() => openAttendanceModal(row)}>
                          <FaEdit />
                        </button>
                        <button className="icon-btn danger" onClick={() => removeAttendance(row.attendance_id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="empty">No attendance records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {section === "leaves" && (
        <section className="hr-panel">
          <div className="panel-header">
            <h2>Leave Management</h2>
            <div className="panel-actions">
              <input
                className="input"
                placeholder="Search employee"
                value={leaveSearch}
                onChange={(e) => setLeaveSearch(e.target.value)}
              />
              <select className="input" value={leaveStatus} onChange={(e) => setLeaveStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table className="hr-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Dates</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.length ? (
                  filteredLeaves.map((leave) => (
                    <tr key={leave.leave_request_id}>
                      <td>{employeeMap.get(leave.employee_id) || `#${leave.employee_id}`}</td>
                      <td>{leave.start_date} to {leave.end_date}</td>
                      <td>{leave.reason}</td>
                      <td>{leave.status}</td>
                      <td>{leave.applied_at ? new Date(leave.applied_at).toLocaleDateString() : "-"}</td>
                      <td className="actions">
                        <span className="muted">{leave.status === "Pending" ? "Awaiting Manager" : "Processed"}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty">No leave requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {section === "reports" && (
        <section className="hr-panel">
          <h2>Download Reports</h2>
          <div className="report-actions" style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "400px" }}>
            <div>
              <h4>Employee Reports</h4>
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button className="btn-primary" onClick={downloadEmployeeSummary}>Download Employee Summary</button>
                <button className="btn-primary" onClick={downloadDepartmentWise}>Download Department-Wise</button>
              </div>
            </div>
            <div>
              <h4>Attendance Report</h4>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "8px" }}>
                <input
                  className="input"
                  type="month"
                  value={reportMonth}
                  onChange={(e) => setReportMonth(e.target.value)}
                />
                <button
                  className="btn-primary"
                  onClick={() => {
                    const [year, month] = reportMonth.split("-");
                    downloadMonthlyAttendance(parseInt(month), parseInt(year));
                  }}
                >
                  Download Attendance
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {showEmployeeForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSave={handleSaveEmployee}
          onClose={() => setShowEmployeeForm(false)}
          departments={departments}
          roles={roles}
          managers={managers}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          isOpen={true}
          message={`Are you sure you want to delete ${confirmDelete.first_name} ${confirmDelete.last_name}?`}
          onConfirm={confirmDeleteEmployee}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {profileEmployee && (
        <div className="modal-overlay">
          <div className="modal-card wide">
            <div className="modal-header">
              <h2>{profileEmployee.first_name} {profileEmployee.last_name}</h2>
              <button className="close-btn" onClick={closeProfile}>x</button>
            </div>
            <div className="profile-grid">
              <div>
                <h4>Employee Profile</h4>
                <p>Email: {profileEmployee.email}</p>
                <p>Phone: {profileEmployee.phone || "-"}</p>
                <p>Department: {profileEmployee.department_name || "-"}</p>
                <p>Role: {profileEmployee.role_name || "-"}</p>
                <p>Leave Balance: {profileEmployee.leave_balance ?? 0}</p>
              </div>
              <div>
                <h4>Recent Attendance</h4>
                <ul>
                  {profileAttendance.slice(0, 6).map((att) => (
                    <li key={att.attendance_id}>{att.date} - {att.status}</li>
                  ))}
                  {!profileAttendance.length && <li>No attendance records.</li>}
                </ul>
              </div>
              <div>
                <h4>Leave History</h4>
                <ul>
                  {profileLeaves.slice(0, 6).map((lv) => (
                    <li key={lv.leave_id}>{lv.start_date} to {lv.end_date} ({lv.status})</li>
                  ))}
                  {!profileLeaves.length && <li>No leave requests.</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {attendanceModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{attendanceForm.attendance_id ? "Edit Attendance" : "Mark Attendance"}</h2>
              <button className="close-btn" onClick={() => setAttendanceModal(false)}>x</button>
            </div>
            <div className="form-grid">
              <select
                value={attendanceForm.employee_id}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, employee_id: e.target.value })}
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.first_name} {emp.last_name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={attendanceForm.date}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
              />
              <select
                value={attendanceForm.status}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
              </select>
              <input
                placeholder="Check In"
                value={attendanceForm.check_in}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, check_in: e.target.value })}
              />
              <input
                placeholder="Check Out"
                value={attendanceForm.check_out}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, check_out: e.target.value })}
              />
              <input
                placeholder="Working Hours"
                value={attendanceForm.working_hours}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, working_hours: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={saveAttendance}>Save</button>
              <button className="btn-outline" onClick={() => setAttendanceModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRDashboard;
