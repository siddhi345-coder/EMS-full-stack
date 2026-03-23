const AttendanceTable = ({ attendance, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <table className="modern-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
            <th>Working Hours</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {attendance?.length > 0 ? (
            attendance.map((record) => (
              <tr key={record.attendance_id}>
                <td>{record.employee_id}</td>
                <td>{record.employee_name}</td>
                <td>{record.date}</td>
                <td>{record.check_in}</td>
                <td>{record.check_out}</td>
                <td>{record.status}</td>
                <td>{record.working_hours || "—"}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => onEdit(record)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(record.attendance_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No Attendance Records Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;