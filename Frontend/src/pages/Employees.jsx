import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import EmployeeTable from "../components/employees/EmployeeTable";
import EmployeeForm from "../components/employees/EmployeeForm";
import ConfirmModal from "../components/common/ConfirmModal";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from "../api/employee.api";

import { getAttendance } from "../api/attendance.api";
import { getLeaves } from "../api/leave_requests.api";
import { getDepartments } from "../api/departments.api";
import { getRoles } from "../api/role.api";

import "./employees.css";

const Employees = () => {
  const { role } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [monthDays, setMonthDays] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  const [confirmDelete, setConfirmDelete] = useState(null);

  const canEdit = ["HR", "Manager"].includes(role);

  /* ============================= */
  /* FETCH EMPLOYEES */
  /* ============================= */

  const fetchEmployees = async () => {
    const data = await getEmployees();
    setEmployees(data);
  };

  const fetchMeta = async () => {
    const [deptData, roleData] = await Promise.all([
      getDepartments(),
      getRoles()
    ]);
    setDepartments(deptData);
    setRoles(roleData);
  };

  useEffect(() => {
    fetchEmployees();
    fetchMeta();
  }, []);

  /* ============================= */
  /* GENERATE CURRENT MONTH */
  /* ============================= */

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
      return new Date(year, month, i + 1);
    });

    setMonthDays(daysArray);
  }, []);

  /* ============================= */
  /* LOAD EMPLOYEE HISTORY */
  /* ============================= */

  const loadEmployeeHistory = async (employee) => {
    const [allAttendance, allLeaves] = await Promise.all([
      getAttendance(),
      getLeaves()
    ]);

    setAttendance(
      allAttendance.filter(
        (a) => a.employee_id === employee.employee_id
      )
    );

    setLeaves(
      allLeaves.filter(
        (l) => l.employee_id === employee.employee_id
      )
    );
  };

  const handleSelect = (employee) => {
    setSelectedEmployee(employee);
    loadEmployeeHistory(employee);
  };

  const handleBackToList = () => {
    setSelectedEmployee(null);
    setAttendance([]);
    setLeaves([]);
  };

  /* ============================= */
  /* GET STATUS FOR CALENDAR */
  /* ============================= */

  const getStatusForDate = (date) => {
    const formatted = date.toISOString().split("T")[0];

    const attendanceRecord = attendance.find(
      (a) => a.date?.split("T")[0] === formatted
    );

    const approvedLeave = leaves.find(
      (l) =>
        l.status === "Approved" &&
        formatted >= l.from_date.split("T")[0] &&
        formatted <= l.to_date.split("T")[0]
    );

    if (approvedLeave) return "leave";
    if (attendanceRecord?.status === "Present") return "present";
    if (attendanceRecord?.status === "Absent") return "absent";

    return "none";
  };

  /* ============================= */
  /* DELETE */
  /* ============================= */

  const performDelete = async (id) => {
    await deleteEmployee(id);
    fetchEmployees();
    setConfirmDelete(null);
  };

  /* ============================= */
  /* UI */
  /* ============================= */

  return (
    <div className="container">
      {selectedEmployee ? (
        <div className="employee-detail">
          <button className="back-btn" onClick={handleBackToList}>
            ← Back
          </button>

          <h2>
            {selectedEmployee.first_name} {selectedEmployee.last_name}
          </h2>

          {/* MONTHLY CALENDAR */}

          <div className="detail-section">
            <h3>Monthly Attendance</h3>

            <div className="attendance-calendar">
              {monthDays.map((date, index) => {
                const status = getStatusForDate(date);

                return (
                  <div
                    key={index}
                    className={`calendar-day ${status}`}
                  >
                    <span className="day-number">
                      {date.getDate()}
                    </span>

                    {status === "present" && <span>P</span>}
                    {status === "absent" && <span>A</span>}
                    {status === "leave" && <span>L</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* LEAVE TABLE */}

          <div className="detail-section">
            <h3>Leave Requests</h3>

            {leaves.length === 0 ? (
              <div className="no-data">No leave requests</div>
            ) : (
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.leave_id}>
                      <td>{leave.from_date.slice(0, 10)}</td>
                      <td>{leave.to_date.slice(0, 10)}</td>
                      <td>{leave.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onSelect={handleSelect}
          onDelete={(emp) => setConfirmDelete(emp)}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(confirmDelete)}
        title="Delete employee"
        message="Are you sure?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() =>
          performDelete(confirmDelete.employee_id)
        }
        onCancel={() => setConfirmDelete(null)}
      />

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          departments={departments}
          roles={roles}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Employees;