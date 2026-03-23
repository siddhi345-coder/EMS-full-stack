import { useState, useEffect } from "react";
import "../../pages/employees.css";

const today = new Date().toISOString().split("T")[0];

const LeaveForm = ({ leave, onClose, onSave }) => {

  const [form, setForm] = useState({
    employee_id: "",
    leave_type_id: "",
    from_date: "",
    to_date: "",
    reason: "",
    status: "Pending",
    approved_by: ""
  });

  useEffect(() => {
    if (leave) {
      setForm(leave);
    }
  }, [leave]);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (

    <div className="modal-overlay">

      <div className="modal-box">

        <h2>
          {leave ? "Edit Leave" : "Add Leave"}
        </h2>

        <form onSubmit={handleSubmit} className="form">

        <input
          name="employee_id"
          placeholder="Employee ID"
          value={form.employee_id}
          onChange={handleChange}
          required
        />

        <input
          name="leave_type_id"
          placeholder="Leave Type ID"
          value={form.leave_type_id}
          onChange={handleChange}
        />

        <input
        type="date"
        name="from_date"
        value={form.from_date || ""}
        onChange={handleChange}
        min={today}
        />

        <input
        type="date"
        name="to_date"
        value={form.to_date || ""}
        onChange={handleChange}
        min={form.from_date || today}
      />

        <input
          name="reason"
          placeholder="Reason"
          value={form.reason}
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input
          name="approved_by"
          placeholder="Approved By"
          value={form.approved_by}
          onChange={handleChange}
        />

        <div className="form-buttons">

          <button type="submit" className="add-btn">
            Save
          </button>

          <button type="button" onClick={onClose}>
            Cancel
          </button>

        </div>

      </form>

    </div>

  </div>
  );
};

export default LeaveForm;