import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  FaUsers, FaClock, FaTasks, FaCheckCircle, FaTimesCircle,
  FaEye, FaSearch, FaBell
} from "react-icons/fa";
import { getEmployees } from "../../api/employee.api";
import { getManagerTeam } from "../../api/manager.api";
import { getAttendanceByEmployee } from "../../api/attendance.api";
import { getLeavesByEmployee } from "../../api/leave_requests.api";
import axiosInstance from "../../api/axiosInstance";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [section, setSection] = useState("overview");

  // core data
  const [allEmployees, setAllEmployees] = useState([]);
  const [myTeam, setMyTeam] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [myProfile, setMyProfile] = useState(null);

  // team tab
  const [teamSearch, setTeamSearch] = useState("");
  const [profileModal, setProfileModal] = useState(null);
  const [profileAtt, setProfileAtt] = useState([]);
  const [profileLeaves, setProfileLeaves] = useState([]);

  // leaves tab
  const [leaveSearch, setLeaveSearch] = useState("");
  const [leaveStatusFilter, setLeaveStatusFilter] = useState("all");
  const [leaveRemark, setLeaveRemark] = useState({});

  // tasks tab
  const [taskForm, setTaskForm] = useState({ employee_id: "", title: "", description: "", due_date: "" });
  const [taskError, setTaskError] = useState("");

  const loadAll = async () => {
    try {
      const [empData, leaveData, teamData, profileRes] = await Promise.all([
        getEmployees(),
        axiosInstance.get("/manager/leaves").catch(() => ({ data: [] })),
        getManagerTeam(),
        axiosInstance.get("/employees/me").catch(() => ({ data: null }))
      ]);

      setAllEmployees(Array.isArray(empData) ? empData : []);
      setLeaves(Array.isArray(leaveData.data) ? leaveData.data : []);
      setMyTeam(Array.isArray(teamData) ? teamData : []);
      if (profileRes.data) setMyProfile(profileRes.data);
    } catch (err) {
      console.error("Failed to load manager data", err);
    }
  };

  const loadTasks = async () => {
    try {
      const res = await axiosInstance.get("/manager/tasks");
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  useEffect(() => {
    loadAll();
    loadTasks();
  }, []);

  // ── overview stats ──────────────────────────────────────────────
  const pendingLeaves = useMemo(
    () => leaves.filter(l => {
      const emp = myTeam.find(e => e.employee_id === l.employee_id);
      return emp && l.status === "Pending";
    }).length,
    [leaves, myTeam]
  );
  const ongoingTasks = tasks.filter(t => t.status !== "Completed").length;

  // ── team tab ────────────────────────────────────────────────────
  const filteredTeam = useMemo(() => {
    const q = teamSearch.toLowerCase();
    return myTeam.filter(m =>
      `${m.first_name} ${m.last_name}`.toLowerCase().includes(q) ||
      String(m.employee_id).includes(q)
    );
  }, [myTeam, teamSearch]);

  const openProfile = async (emp) => {
    setProfileModal(emp);
    try {
      const [att, lv] = await Promise.all([
        getAttendanceByEmployee(emp.employee_id),
        getLeavesByEmployee(emp.employee_id)
      ]);
      setProfileAtt(Array.isArray(att) ? att : []);
      setProfileLeaves(Array.isArray(lv) ? lv : []);
    } catch {
      setProfileAtt([]);
      setProfileLeaves([]);
    }
  };

  // ── leaves tab ──────────────────────────────────────────────────
  const teamLeaves = leaves; // already scoped by /manager/leaves

  const filteredLeaves = useMemo(() => {
    const q = leaveSearch.toLowerCase();
    return teamLeaves.filter(l => {
      const emp = allEmployees.find(e => e.employee_id === l.employee_id);
      const name = emp ? `${emp.first_name} ${emp.last_name}`.toLowerCase() : "";
      const matchSearch = !q || name.includes(q) || String(l.employee_id).includes(q);
      const matchStatus = leaveStatusFilter === "all" || l.status === leaveStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [teamLeaves, leaveSearch, leaveStatusFilter, allEmployees]);

  const handleLeaveAction = async (leaveId, status) => {
    try {
      await axiosInstance.patch(`/manager/leaves/${leaveId}`, {
        status,
        manager_remark: leaveRemark[leaveId] || ""
      });
      setLeaveRemark(prev => ({ ...prev, [leaveId]: "" }));
      loadAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update leave");
    }
  };

  const getEmpName = (id) => {
    const emp = allEmployees.find(e => e.employee_id === id);
    return emp ? `${emp.first_name} ${emp.last_name}` : `#${id}`;
  };

  // ── tasks tab ───────────────────────────────────────────────────
  const handleAssignTask = async (e) => {
    e.preventDefault();
    setTaskError("");
    try {
      await axiosInstance.post("/manager/tasks", taskForm);
      setTaskForm({ employee_id: "", title: "", description: "", due_date: "" });
      loadTasks();
    } catch (err) {
      setTaskError(err?.response?.data?.message || "Failed to assign task");
    }
  };

  const handleTaskStatus = async (taskId, status) => {
    try {
      await axiosInstance.patch(`/manager/tasks/${taskId}`, { status });
      loadTasks();
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "team", label: "My Team" },
    { key: "leaves", label: "Leave Requests" },
    { key: "tasks", label: "Tasks" }
  ];

  return (
    <div className="manager-dashboard">
      <div className="manager-header">
        <div>
          <h1>Manager Dashboard</h1>
          <p>Welcome, {user?.username} — {myProfile?.department_name || "your department"}</p>
        </div>
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={section === t.key ? "tab-active" : "tab"}
            onClick={() => setSection(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {section === "overview" && (
        <>
          <div className="card-grid">
            <div className="dashboard-card">
              <FaUsers className="card-icon" />
              <h3>Team Members</h3>
              <p>{myTeam.length}</p>
            </div>
            <div className="dashboard-card">
              <FaClock className="card-icon" />
              <h3>Pending Leaves</h3>
              <p>{pendingLeaves}</p>
            </div>
            <div className="dashboard-card">
              <FaTasks className="card-icon" />
              <h3>Ongoing Tasks</h3>
              <p>{ongoingTasks}</p>
            </div>
          </div>

          <div className="section">
            <h2>Team Overview</h2>
            {myTeam.length === 0 ? (
              <p className="muted-text">No team members assigned yet. Ask HR to assign employees to you.</p>
            ) : (
              <div className="table-wrapper">
                <table className="manager-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Leave Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myTeam.slice(0, 5).map(m => (
                      <tr key={m.employee_id}>
                        <td>{m.first_name} {m.last_name}</td>
                        <td>{m.department_name || "-"}</td>
                        <td>{m.role_name || "-"}</td>
                        <td>{m.email || "-"}</td>
                        <td>{m.leave_balance ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {teamLeaves.filter(l => l.status === "Pending").length > 0 && (
            <div className="section">
              <h2><FaBell style={{ marginRight: 8 }} />Pending Leave Requests</h2>
              <div className="table-wrapper">
                <table className="manager-table">
                  <thead>
                    <tr><th>Employee</th><th>Dates</th><th>Reason</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {teamLeaves.filter(l => l.status === "Pending").slice(0, 5).map(l => (
                      <tr key={l.leave_request_id}>
                        <td>{l.first_name || getEmpName(l.employee_id)} {l.last_name || ""}</td>
                        <td>{l.start_date} → {l.end_date}</td>
                        <td>{l.reason || "-"}</td>
                        <td className="table-actions">
                          <button className="btn-success" onClick={() => handleLeaveAction(l.leave_request_id, "Approved")}>Approve</button>
                          <button className="btn-danger" onClick={() => handleLeaveAction(l.leave_request_id, "Rejected")}>Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── MY TEAM ── */}
      {section === "team" && (
        <div className="section">
          <div className="section-header">
            <h2>My Team ({myTeam.length})</h2>
            <div className="filter-row">
              <div className="filter-input">
                <FaSearch />
                <input
                  placeholder="Search by name or ID"
                  value={teamSearch}
                  onChange={e => setTeamSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {myTeam.length === 0 ? (
            <div className="empty-state">
              <FaUsers size={40} />
              <p>No team members found.</p>
              <span>Ask HR to assign employees to you by editing their profile and selecting you as their manager.</span>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="manager-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Leave Balance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeam.map(m => (
                    <tr key={m.employee_id}>
                      <td>{m.first_name} {m.last_name}</td>
                      <td>{m.department_name || "-"}</td>
                      <td>{m.role_name || "-"}</td>
                      <td>{m.email || "-"}</td>
                      <td>{m.phone || "-"}</td>
                      <td>{m.leave_balance ?? 0}</td>
                      <td>
                        <button className="btn-secondary" onClick={() => openProfile(m)}>
                          <FaEye /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── LEAVE REQUESTS ── */}
      {section === "leaves" && (
        <div className="section">
          <div className="section-header">
            <h2>Team Leave Requests</h2>
            <div className="filter-row">
              <div className="filter-input">
                <FaSearch />
                <input
                  placeholder="Search employee"
                  value={leaveSearch}
                  onChange={e => setLeaveSearch(e.target.value)}
                />
              </div>
              <select value={leaveStatusFilter} onChange={e => setLeaveStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {filteredLeaves.length === 0 ? (
            <p className="muted-text">No leave requests found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="manager-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Dates</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Applied</th>
                    <th>Remark</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map(l => (
                    <tr key={l.leave_request_id}>
                      <td>{l.first_name || getEmpName(l.employee_id)} {l.last_name || ""}</td>
                      <td>{l.start_date} → {l.end_date}</td>
                      <td>{l.reason || "-"}</td>
                      <td>
                        <span className={`status-badge status-${l.status?.toLowerCase()}`}>
                          {l.status}
                        </span>
                      </td>
                      <td>{l.applied_at ? new Date(l.applied_at).toLocaleDateString() : "-"}</td>
                      <td>
                        {l.status === "Pending" ? (
                          <input
                            placeholder="Add remark"
                            value={leaveRemark[l.leave_request_id] || ""}
                            onChange={e => setLeaveRemark(prev => ({ ...prev, [l.leave_request_id]: e.target.value }))}
                          />
                        ) : (
                          <span className="muted-text">{l.manager_remark || "-"}</span>
                        )}
                      </td>
                      <td className="table-actions">
                        {l.status === "Pending" ? (
                          <>
                            <button className="btn-success" onClick={() => handleLeaveAction(l.leave_request_id, "Approved")}>
                              <FaCheckCircle /> Approve
                            </button>
                            <button className="btn-danger" onClick={() => handleLeaveAction(l.leave_request_id, "Rejected")}>
                              <FaTimesCircle /> Reject
                            </button>
                          </>
                        ) : (
                          <span className="muted-text">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TASKS ── */}
      {section === "tasks" && (
        <div className="section">
          <h2>Task Management</h2>
          <div className="task-grid">
            <div className="panel-card">
              <h3>Assign New Task</h3>
              {myTeam.length === 0 ? (
                <p className="muted-text">No team members to assign tasks to.</p>
              ) : (
                <form onSubmit={handleAssignTask} className="form-grid">
                  <select
                    required
                    value={taskForm.employee_id}
                    onChange={e => setTaskForm({ ...taskForm, employee_id: e.target.value })}
                  >
                    <option value="">Select team member</option>
                    {myTeam.map(m => (
                      <option key={m.employee_id} value={m.employee_id}>
                        {m.first_name} {m.last_name}
                      </option>
                    ))}
                  </select>
                  <input
                    required
                    placeholder="Task title"
                    value={taskForm.title}
                    onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  />
                  <input
                    type="date"
                    value={taskForm.due_date}
                    onChange={e => setTaskForm({ ...taskForm, due_date: e.target.value })}
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={taskForm.description}
                    onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                    style={{ gridColumn: "1 / -1" }}
                  />
                  {taskError && <p style={{ color: "red", gridColumn: "1 / -1", margin: 0 }}>{taskError}</p>}
                  <button type="submit" className="btn-primary" style={{ gridColumn: "1 / -1" }}>
                    Assign Task
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="section-sub">
            <h3>Active Tasks</h3>
            {tasks.length === 0 ? (
              <p className="muted-text">No tasks assigned yet.</p>
            ) : (
              <div className="table-wrapper">
                <table className="manager-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Task</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map(t => (
                      <tr key={t.task_id}>
                        <td>{t.first_name || getEmpName(t.employee_id)} {t.last_name || ""}</td>
                        <td>
                          <strong>{t.title}</strong>
                          {t.description && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>{t.description}</p>}
                        </td>
                        <td>{t.due_date || "-"}</td>
                        <td>
                          <select
                            value={t.status}
                            onChange={e => handleTaskStatus(t.task_id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PROFILE MODAL ── */}
      {profileModal && (
        <div className="modal-overlay" onClick={() => setProfileModal(null)}>
          <div className="modal-card wide" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{profileModal.first_name} {profileModal.last_name}</h2>
              <button className="close-btn" onClick={() => setProfileModal(null)}>×</button>
            </div>
            <div className="profile-grid">
              <div>
                <h4>Details</h4>
                <p><strong>Email:</strong> {profileModal.email || "-"}</p>
                <p><strong>Phone:</strong> {profileModal.phone || "-"}</p>
                <p><strong>Department:</strong> {profileModal.department_name || "-"}</p>
                <p><strong>Role:</strong> {profileModal.role_name || "-"}</p>
                <p><strong>Leave Balance:</strong> {profileModal.leave_balance ?? 0}</p>
              </div>
              <div>
                <h4>Recent Attendance</h4>
                <ul>
                  {profileAtt.slice(0, 6).map(a => (
                    <li key={a.attendance_id}>{a.date} — {a.status}</li>
                  ))}
                  {profileAtt.length === 0 && <li>No records.</li>}
                </ul>
              </div>
              <div>
                <h4>Leave History</h4>
                <ul>
                  {profileLeaves.slice(0, 6).map(l => (
                    <li key={l.leave_request_id || l.leave_id}>
                      {l.start_date} → {l.end_date} ({l.status})
                    </li>
                  ))}
                  {profileLeaves.length === 0 && <li>No records.</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
