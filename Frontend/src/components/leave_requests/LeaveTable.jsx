const LeaveTable = ({ leaves, onEdit, onDelete }) => {
  const canEdit = !!onEdit;
  const canDelete = !!onDelete;

  return (
    <div className="table-container">

      <table className="table">

        <thead>
          <tr>
            {/* ID column removed */}
            <th>Employee</th>
            <th>Leave Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {leaves.map((leave) => (

            <tr key={leave.leave_request_id}> {/* Keep this */}

              {/* ID display removed */}
              <td>{leave.employee_id}</td>
              <td>{leave.leave_type_id}</td>
              <td>{leave.from_date?.slice(0, 10)}</td>
              <td>{leave.to_date?.slice(0, 10)}</td>
              <td>{leave.status}</td>

              <td>
                {canEdit && (
                  <button
                    className="edit-btn"
                    onClick={() => onEdit(leave)}
                  >
                    Edit
                  </button>
                )}

                {canDelete && (
                  <button
                    className="delete-btn"
                    onClick={() => onDelete(leave)}
                  >
                    Delete
                  </button>
                )}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default LeaveTable;