import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  FaCalendarCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUmbrellaBeach,
  FaSignInAlt,
  FaSignOutAlt,
  FaBell,
  FaIdBadge,
  FaUpload,
  FaRegClock,
  FaStopwatch
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import {
  getMyAttendance,
  checkIn,
  checkOut
} from "../../api/attendance.api";
import {
  getLeaves,
  createLeave,
  cancelLeave
} from "../../api/leave_requests.api";
import {
  getMyProfile,
  updateMyProfile,
  getMyLogs,
  getMyNotifications
} from "../../api/employee.api";
import "./EmployeeDashboard.css";

const formatTime = (t) => {
  if (!t) return "-";
  // Handle both HH:MM:SS time strings and full ISO timestamps
  if (String(t).includes("T")) {
    return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  }
  const [h, m] = String(t).split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
};

const formatHours = (h) => {
  if (h === null || h === undefined || h === "") return "-";
  const total = Number(h);
  if (isNaN(total)) return "-";
  const hrs = Math.floor(total);
  const mins = Math.round((total - hrs) * 60);
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
};

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [section, setSection] = useState("overview");

  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [logs, setLogs] = useState([]);
  const [notifications, setNotifications] = useState({ leaves: [], announcements: [] });

  const [leaveForm, setLeaveForm] = useState({
    start_date: "",
    end_date: "",
    leave_type: "Sick",
    reason: ""
  });
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    profile_image: ""
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const target = searchParams.get("section");
    if (target) {
      setSection(target);
    }
  }, [searchParams]);

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [month]);

  // Live clock — ticks every second to update countdown and auto-checkout
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadAll = async () => {
    await Promise.all([loadProfile(), loadAttendance(), loadLeaves(), loadLogs(), loadNotifications()]);
  };

  const loadProfile = async () => {
    try {
      const data = await getMyProfile();
      setProfile(data);
      setProfileForm({
        first_name: data?.first_name || "",
        last_name: data?.last_name || "",
        email: data?.email || "",
        phone: data?.phone || "",
        gender: data?.gender || "",
        address: data?.address || "",
        profile_image: data?.profile_image || ""
      });
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

  const loadAttendance = async () => {
    try {
      const data = await getMyAttendance({ month });
      setAttendance(data);
    } catch (err) {
      console.error("Failed to load attendance", err);
    }
  };

  const loadLeaves = async () => {
    try {
      const data = await getLeaves();
      setLeaves(data);
    } catch (err) {
      console.error("Failed to load leaves", err);
    }
  };

  const loadLogs = async () => {
    try {
      const data = await getMyLogs(5);
      setLogs(data);
    } catch (err) {
      console.error("Failed to load logs", err);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const handleCalendarChange = (date) => {
    setSelectedDate(date);
  };

  const handleCalendarActiveStartDateChange = ({ activeStartDate }) => {
    setCalendarDate(activeStartDate);
    const newMonth = `${activeStartDate.getFullYear()}-${String(activeStartDate.getMonth() + 1).padStart(2, "0")}`;
    setMonth(newMonth);
  };

  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  })();

  const normalizeDate = (d) => {
    if (!d) return "";
    if (d instanceof Date)
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    return String(d).split("T")[0];
  };

  const todayAttendance = attendance.find((a) => {
    const d = a.dateStr || normalizeDate(a.date);
    return d === today;
  }) || null;

  const handleCheckIn = async () => {
    try {
      await checkIn();
      loadAttendance();
      loadLogs();
    } catch (err) {
      alert("Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
      loadAttendance();
      loadLogs();
    } catch (err) {
      const msg = err?.response?.data?.message || "Check-out failed";
      alert(msg);
    }
  };

  // Returns seconds elapsed since check-in (null if not checked in)
  const secondsSinceCheckIn = (() => {
    const t = todayAttendance?.check_in_time;
    if (!t) return null;
    const [h, m, s] = t.split(":").map(Number);
    const checkInSecs = h * 3600 + m * 60 + s;
    const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    return nowSecs - checkInSecs;
  })();

  const canCheckOut = secondsSinceCheckIn !== null && secondsSinceCheckIn >= 9 * 3600;

  // Auto-checkout exactly at 9h mark
  useEffect(() => {
    if (canCheckOut && todayAttendance?.check_in_time && !todayAttendance?.check_out_time) {
      handleCheckOut();
    }
  }, [canCheckOut]);  // eslint-disable-line

  const formatCountdown = (secs) => {
    if (secs === null) return null;
    const remaining = Math.max(0, 9 * 3600 - secs);
    if (remaining === 0) return null;
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLeave(leaveForm);
      setLeaveForm({ start_date: "", end_date: "", leave_type: "Sick", reason: "" });
      setShowLeaveForm(false);
      loadLeaves();
      loadLogs();
    } catch (err) {
      alert("Leave request failed");
    }
  };

  const handleCancelLeave = async (id) => {
    try {
      await cancelLeave(id);
      loadLeaves();
      loadLogs();
    } catch (err) {
      alert("Cancel failed");
    }
  };

  const handleProfileSave = async () => {
    try {
      await updateMyProfile(profileForm);
      setProfileSaved(true);
      setEditingProfile(false);
      setTimeout(() => setProfileSaved(false), 2000);
      loadProfile();
    } catch (err) {
      alert("Profile update failed");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfileForm((prev) => ({ ...prev, profile_image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const daysInMonth = useMemo(() => {
    const [year, monthIdx] = month.split("-").map(Number);
    return new Date(year, monthIdx, 0).getDate();
  }, [month]);

  const isWeekend = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.getDay() === 0 || d.getDay() === 6;
  };

  // Build a full date-wise list for the selected month, capped at today
  const attendanceByDate = useMemo(() => {
    const [year, monthIdx] = month.split("-").map(Number);
    const totalDays = new Date(year, monthIdx, 0).getDate();
    const recordMap = {};
    attendance.forEach((a) => {
      const d = a.dateStr || normalizeDate(a.date);
      recordMap[d] = a;
    });

    const rows = [];
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(monthIdx).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      if (dateStr > today) break;
      if (isWeekend(dateStr)) {
        rows.push(recordMap[dateStr] || { date: dateStr, status: "Holiday", check_in_time: null, check_out_time: null, working_hours: null });
      } else {
        rows.push(recordMap[dateStr] || { date: dateStr, status: "Absent", check_in_time: null, check_out_time: null, working_hours: null });
      }
    }
    return rows;
  }, [month, attendance, today]);

  const presentDays = attendanceByDate.filter((a) => a.status === "Present").length;
  const absentDays = attendanceByDate.filter((a) => a.status === "Absent" && !isWeekend(a.date)).length;
  const workingDays = attendanceByDate.filter((a) => !isWeekend(a.date)).length;
  const pendingLeaves = leaves.filter((l) => l.status === "Pending").length;
  const leaveBalance = profile?.leave_balance ?? 0;

  const monthlyHours = attendance.reduce((sum, row) => {
    return sum + (Number(row.working_hours) || 0);
  }, 0);

  const notificationsList = [
    ...(notifications.leaves || []),
    ...(notifications.announcements || [])
  ].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

  return (
    <div className="employee-dashboard">
      <div className="employee-header">
        <div>
          <h1>Welcome back, {user?.username}</h1>
          <p>{profile?.department_name || "Department"} � {profile?.role_name || user?.role}</p>
        </div>

      </div>

      <div className="employee-tabs">
        {["overview", "attendance", "leaves", "profile"].map((tab) => (
          <button
            key={tab}
            className={section === tab ? "tab-active" : "tab"}
            onClick={() => setSection(tab)}
          >
            {tab === "overview" && "Dashboard"}
            {tab === "attendance" && "Attendance"}
            {tab === "leaves" && "Leaves"}
            {tab === "profile" && "My Profile"}
          </button>
        ))}
      </div>

      {section === "overview" && (
        <>
          <div className="summary-grid">
            <div className="summary-card">
              <FaCalendarCheck />
              <div>
                <p>Total Working Days</p>
                <h3>{attendanceByDate.length}</h3>
              </div>
            </div>
            <div className="summary-card">
              <FaCheckCircle />
              <div>
                <p>Present Days</p>
                <h3>{presentDays}</h3>
              </div>
            </div>
            <div className="summary-card">
              <FaTimesCircle />
              <div>
                <p>Absent Days</p>
                <h3>{absentDays}</h3>
              </div>
            </div>
            <div className="summary-card">
              <FaClock />
              <div>
                <p>Pending Leaves</p>
                <h3>{pendingLeaves}</h3>
              </div>
            </div>
            <div className="summary-card">
              <FaUmbrellaBeach />
              <div>
                <p>Leave Balance</p>
                <h3>{leaveBalance}</h3>
              </div>
            </div>
          </div>

          <div className="panel-grid">
            <section className="panel">
              <h2>Recent Activity</h2>
              <ul>
                {logs.length ? (
                  logs.map((log) => (
                    <li key={log.action_id}>
                      <strong>{log.action_type}</strong> � {log.detail}
                    </li>
                  ))
                ) : (
                  <li>No recent activity.</li>
                )}
              </ul>
            </section>

            <section className="panel">
              <h2>Notifications</h2>
              <div className="notifications">
                {notificationsList.length ? (
                  notificationsList.slice(0, 5).map((note, idx) => (
                    <div key={`${note.type}-${idx}`} className="notification">
                      <FaBell />
                      <div>
                        <strong>{note.title}</strong>
                        <p>{note.detail}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="muted">No notifications yet.</p>
                )}
              </div>
            </section>
          </div>
        </>
      )}

      {section === "attendance" && (
        <div className="attendance-page">

          {/* Check-in / Check-out bar */}
          <div className="attendance-action-bar">
            <div className="attendance-action-bar-left">
              <span className="attendance-month-label">
                {new Date(month + "-01").toLocaleString("default", { month: "long", year: "numeric" })}
              </span>
              {todayAttendance?.check_in_time && (
                <span className="att-checkin-info">
                  <FaSignInAlt /> Checked in at {formatTime(todayAttendance.check_in_time)}
                  {!todayAttendance.check_out_time && formatCountdown(secondsSinceCheckIn) && (
                    <span className="att-countdown"> &mdash; Checkout in {formatCountdown(secondsSinceCheckIn)}</span>
                  )}
                  {todayAttendance.check_out_time && (
                    <span style={{ marginLeft: 12 }}><FaSignOutAlt /> Checked out at {formatTime(todayAttendance.check_out_time)}</span>
                  )}
                </span>
              )}
            </div>
            <div className="attendance-action-bar-right">
              <button className="btn-primary" onClick={handleCheckIn} disabled={!!todayAttendance?.check_in_time}>
                <FaSignInAlt /> Check In
              </button>
              <button className="btn-outline" onClick={handleCheckOut}
                disabled={!todayAttendance?.check_in_time || !!todayAttendance?.check_out_time || !canCheckOut}>
                <FaSignOutAlt /> Check Out
              </button>
            </div>
          </div>

          {/* Two-card layout */}
          <div className="attendance-cards">

            {/* Card 1: Calendar */}
            <div className="att-card att-card-calendar">
              <h3 className="att-card-title">Monthly Calendar</h3>
              <Calendar
                onChange={handleCalendarChange}
                value={selectedDate}
                activeStartDate={calendarDate}
                onActiveStartDateChange={handleCalendarActiveStartDateChange}
                maxDate={new Date()}
                tileClassName={({ date, view }) => {
                  if (view !== "month") return null;
                  const ds = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                  if (ds === today) return "cal-today";
                  if (isWeekend(ds)) return "cal-holiday";
                  const rec = attendanceByDate.find((a) => (a.dateStr || normalizeDate(a.date)) === ds || a.date === ds);
                  if (rec?.status === "Present") return "cal-present";
                  if (rec?.status === "Absent") return "cal-absent";
                  return null;
                }}
                tileDisabled={({ date }) => date > new Date()}
              />
              <div className="cal-legend">
                <span className="legend-dot legend-present" /> Present
                <span className="legend-dot legend-absent" /> Absent
                <span className="legend-dot legend-today" /> Today
                <span className="legend-dot legend-holiday" /> Weekend
              </div>
            </div>

            {/* Card 2: Details */}
            <div className="att-card att-card-details">
              <h3 className="att-card-title">Attendance Details</h3>
              {selectedDate ? (() => {
                const ds = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
                const isWknd = isWeekend(ds);
                const rec = attendanceByDate.find((a) => (a.dateStr || normalizeDate(a.date)) === ds || a.date === ds);
                const hasRecord = rec && rec.status === "Present";
                return (
                  <>
                    <div className="att-detail-date">
                      {selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </div>
                    {isWknd ? (
                      <div className="att-no-record">
                        <FaUmbrellaBeach />
                        <p>Weekend — No attendance required.</p>
                        <span className="att-status-badge att-status-holiday">Holiday</span>
                      </div>
                    ) : hasRecord ? (
                      <div className="att-detail-rows">
                        <div className="att-detail-row">
                          <span className="att-detail-icon att-icon-in"><FaSignInAlt /></span>
                          <div>
                            <span className="att-detail-label">Check In</span>
                            <span className="att-detail-value">{formatTime(rec.check_in_time || rec.check_in) || "—"}</span>
                          </div>
                        </div>
                        <div className="att-detail-row">
                          <span className="att-detail-icon att-icon-out"><FaSignOutAlt /></span>
                          <div>
                            <span className="att-detail-label">Check Out</span>
                            <span className="att-detail-value">{formatTime(rec.check_out_time || rec.check_out) || "—"}</span>
                          </div>
                        </div>
                        <div className="att-detail-row">
                          <span className="att-detail-icon att-icon-hours"><FaStopwatch /></span>
                          <div>
                            <span className="att-detail-label">Working Hours</span>
                            <span className="att-detail-value">{formatHours(rec.working_hours)}</span>
                          </div>
                        </div>
                        <div className="att-detail-row">
                          <span className="att-detail-icon att-icon-status"><FaRegClock /></span>
                          <div>
                            <span className="att-detail-label">Status</span>
                            <span className="att-status-badge att-status-present">Present</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="att-no-record">
                        <FaTimesCircle />
                        <p>No attendance record for this day.</p>
                        {rec?.status === "Absent" && <span className="att-status-badge att-status-absent">Absent</span>}
                      </div>
                    )}
                  </>
                );
              })() : (
                <div className="att-no-selection">
                  <FaCalendarCheck />
                  <p>Select a date on the calendar to view attendance details.</p>
                </div>
              )}

              {/* Today's quick status */}
              <div className="att-today-bar">
                <span className="att-today-label">Today</span>
                <div className="att-today-times">
                  <span><FaSignInAlt /> {formatTime(todayAttendance?.check_in_time || todayAttendance?.check_in) || "Not checked in"}</span>
                  <span><FaSignOutAlt /> {formatTime(todayAttendance?.check_out_time || todayAttendance?.check_out) || "Not checked out"}</span>
                  <span><FaStopwatch /> {formatHours(todayAttendance?.working_hours)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly summary footer */}
          <div className="att-summary-bar">
            <div className="att-summary-item">
              <FaCheckCircle className="att-sum-icon present" />
              <div>
                <span className="att-sum-label">Present</span>
                <strong>{presentDays}</strong>
              </div>
            </div>
            <div className="att-summary-item">
              <FaTimesCircle className="att-sum-icon absent" />
              <div>
                <span className="att-sum-label">Absent</span>
                <strong>{absentDays}</strong>
              </div>
            </div>
            <div className="att-summary-item">
              <FaCalendarCheck className="att-sum-icon" />
              <div>
                <span className="att-sum-label">Working Days</span>
                <strong>{workingDays}</strong>
              </div>
            </div>
            <div className="att-summary-item">
              <FaStopwatch className="att-sum-icon" />
              <div>
                <span className="att-sum-label">Total Hours</span>
                <strong>{formatHours(monthlyHours)}</strong>
              </div>
            </div>
          </div>

        </div>
      )}

      {section === "leaves" && (
        <section className="panel">
          <div className="panel-header">
            <h2>Leave Management</h2>
            <button className="btn-primary" onClick={() => setShowLeaveForm(!showLeaveForm)}>
              Apply for Leave
            </button>
          </div>

          {showLeaveForm && (
            <div className="leave-form-overlay">
              <div className="leave-form-card">
                <h3>Apply for Leave</h3>
                <form onSubmit={handleLeaveSubmit} className="leave-form">
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>Start Date</label>
                    <input
                      type="date"
                      value={leaveForm.start_date}
                      onChange={(e) => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                      required
                      style={{ width: "100%", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>End Date</label>
                    <input
                      type="date"
                      value={leaveForm.end_date}
                      onChange={(e) => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                      required
                      style={{ width: "100%", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>Leave Type</label>
                    <select
                      value={leaveForm.leave_type}
                      onChange={(e) => setLeaveForm({ ...leaveForm, leave_type: e.target.value })}
                      style={{ width: "100%", boxSizing: "border-box" }}
                    >
                      <option value="Sick">Sick</option>
                      <option value="Casual">Casual</option>
                      <option value="Paid Leave">Paid Leave</option>
                      <option value="Unpaid Leave">Unpaid Leave</option>
                      <option value="Maternity Leave">Maternity Leave</option>
                      <option value="Paternity Leave">Paternity Leave</option>
                      <option value="Comp Off">Comp Off</option>
                      <option value="Bereavement Leave">Bereavement Leave</option>
                      <option value="Emergency Leave">Emergency Leave</option>
                      <option value="Study Leave">Study Leave</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>Reason</label>
                    <textarea
                      placeholder="Briefly describe your reason..."
                      value={leaveForm.reason}
                      onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                      required
                      style={{ width: "100%", boxSizing: "border-box" }}
                    />
                  </div>
                  <div className="leave-form-actions">
                    <button type="submit" className="btn-primary">Submit</button>
                    <button type="button" className="btn-outline" onClick={() => setShowLeaveForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Dates</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length ? (
                  leaves.map((leave) => (
                    <tr key={leave.leave_request_id}>
                      <td>{leave.start_date} to {leave.end_date}</td>
                      <td>{leave.leave_type || "-"}</td>
                      <td>{leave.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="muted">No leave requests.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="leave-balance">
            <span>Remaining Leave Balance</span>
            <strong>{leaveBalance}</strong>
          </div>
        </section>
      )}

      {section === "profile" && (
        <div className="profile-page">

          {/* ── Top hero card ── */}
          <div className="profile-hero">
            <div className="profile-hero-bg" />
            <div className="profile-hero-body">
              <div className="profile-avatar-wrap">
                <div className="avatar">
                  {profileForm.profile_image
                    ? <img src={profileForm.profile_image} alt="profile" />
                    : <FaIdBadge />}
                </div>
                {editingProfile && (
                  <label className="upload-btn">
                    <FaUpload />
                    <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                  </label>
                )}
              </div>
              <div className="profile-hero-info">
                <h2 className="profile-name">{profile?.first_name || "-"} {profile?.last_name || ""}</h2>
                <div className="profile-hero-meta">
                  <span className="profile-role-badge">{profile?.role_name || user?.role || "Employee"}</span>
                  <span className="profile-dept-tag">🏢 {profile?.department_name || "—"}</span>
                </div>
              </div>
              <div className="profile-hero-stats">
                <div className="phs-item">
                  <strong>{presentDays}</strong>
                  <span>Present</span>
                </div>
                <div className="phs-divider" />
                <div className="phs-item">
                  <strong>{pendingLeaves}</strong>
                  <span>Pending</span>
                </div>
                <div className="phs-divider" />
                <div className="phs-item">
                  <strong>{leaveBalance}</strong>
                  <span>Leave Left</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Details card ── */}
          <div className="profile-details-card">
            <div className="profile-details-header">
              <div>
                <h3 className="profile-section-title">Personal Information</h3>
                <p className="profile-section-sub">Your account details and employment info</p>
              </div>
              <div className="profile-actions">
                {profileSaved && <span className="saved">✓ Saved</span>}
                {!editingProfile
                  ? <button className="btn-edit-profile" onClick={() => setEditingProfile(true)}>Edit Profile</button>
                  : <>
                      <button className="btn-save-profile" onClick={handleProfileSave}>Save Changes</button>
                      <button className="btn-outline" onClick={() => { setEditingProfile(false); loadProfile(); }}>Cancel</button>
                    </>
                }
              </div>
            </div>

            {!editingProfile ? (
              <>
                <div className="profile-fields-grid">
                  <div className="pf-item">
                    <span className="pf-label">Full Name</span>
                    <span className="pf-value">{profile?.first_name || "-"} {profile?.last_name || ""}</span>
                  </div>
                  <div className="pf-item">
                    <span className="pf-label">Email</span>
                    <span className="pf-value">{profile?.email || "-"}</span>
                  </div>
                  <div className="pf-item">
                    <span className="pf-label">Phone</span>
                    <span className="pf-value">{profile?.phone || "-"}</span>
                  </div>
                  <div className="pf-item">
                    <span className="pf-label">Gender</span>
                    <span className="pf-value">{profile?.gender || "-"}</span>
                  </div>
                  <div className="pf-item pf-full">
                    <span className="pf-label">Address</span>
                    <span className="pf-value">{profile?.address || "-"}</span>
                  </div>
                </div>
                <div className="profile-divider-line"><span>Employment</span></div>
                <div className="profile-fields-grid">
                  <div className="pf-item">
                    <span className="pf-label">Department</span>
                    <span className="pf-value">{profile?.department_name || "-"}</span>
                  </div>
                  <div className="pf-item">
                    <span className="pf-label">Role</span>
                    <span className="pf-value">{profile?.role_name || user?.role || "-"}</span>
                  </div>
                  <div className="pf-item">
                    <span className="pf-label">Join Date</span>
                    <span className="pf-value">{profile?.hire_date || "-"}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="profile-edit-grid">
                  <div className="profile-field">
                    <label>First Name</label>
                    <input placeholder="First Name" value={profileForm.first_name}
                      onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })} />
                  </div>
                  <div className="profile-field">
                    <label>Last Name</label>
                    <input placeholder="Last Name" value={profileForm.last_name}
                      onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })} />
                  </div>
                  <div className="profile-field">
                    <label>Email</label>
                    <input type="email" placeholder="Email" value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
                  </div>
                  <div className="profile-field">
                    <label>Phone</label>
                    <input placeholder="Phone" value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                  </div>
                  <div className="profile-field">
                    <label>Gender</label>
                    <select value={profileForm.gender}
                      onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="profile-field profile-field-full">
                    <label>Address</label>
                    <input placeholder="Address" value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} />
                  </div>
                </div>
                <p className="muted" style={{ margin: "12px 0 0", fontSize: 13 }}>Department, Role, and Join Date can only be updated by HR.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
