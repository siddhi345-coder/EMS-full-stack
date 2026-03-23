import { useAuth } from "../../context/AuthContext";

const DepartmentTable = ({ departments, onEdit, onDelete }) => {
  const { role } = useAuth();
  const canEdit = role === "HR";

  return (
    <div className="table-container">

      <table className="table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Department</th>
            <th>Location</th>
            <th>Budget</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {departments.map((dept) => (

            <tr key={dept.department_id}>

              <td>{dept.department_id}</td>
              <td>{dept.department_name}</td>
              <td>{dept.location}</td>
              <td>{dept.budget}</td>

              <td>
                {canEdit && (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => onEdit(dept)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => onDelete(dept)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default DepartmentTable;