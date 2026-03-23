const PayrollTable = ({ payrolls, onEdit, onDelete }) => {

  return (

    <div className="table-container">

      <table className="table">

        <thead>
          <tr>
            {/* ID column removed */}
            <th>Employee</th>
            <th>Basic</th>
            <th>Bonus</th>
            <th>Deduction</th>
            <th>Tax</th>
            <th>Net Salary</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {payrolls.map((p) => (

            <tr key={p.payroll_id}>  {/* Keep this */}

              {/* ID display removed */}
              <td>{p.employee_id}</td>
              <td>{p.basic_salary}</td>
              <td>{p.bonuses}</td>
              <td>{p.deductions}</td>
              <td>{p.tax}</td>
              <td>{p.net_salary}</td>
              <td>{p.payment_status}</td>

              <td>

                <button
                  className="edit-btn"
                  onClick={() => onEdit(p)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => onDelete(p.payroll_id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
};

export default PayrollTable;