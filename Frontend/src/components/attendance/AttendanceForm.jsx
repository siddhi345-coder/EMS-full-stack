import { useState, useEffect } from "react";

const AttendanceForm = ({ record, onSave, onClose, employees }) => {
  const [formData, setFormData] = useState({
    employee_id: "",
    date: "",
    check_in: "",
    check_out: "",
    status: "",
  });

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateWorkingHours = () => {
    if (formData.check_in && formData.check_out) {
      const start = new Date(`1970-01-01T${formData.check_in}`);
      const end = new Date(`1970-01-01T${formData.check_out}`);
      const diff = (end - start) / (1000 * 60 * 60);
      return diff > 0 ? diff.toFixed(2) : 0;
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const working_hours = calculateWorkingHours();
    onSave({ ...formData, working_hours });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>{record ? "Edit Attendance" : "Add Attendance"}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">

            <select
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Employee</option>
              {employees?.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <input
              type="time"
              name="check_in"
              value={formData.check_in}
              onChange={handleChange}
              required
            />

            <input
              type="time"
              name="check_out"
              value={formData.check_out}
              onChange={handleChange}
              required
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>

          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceForm;