import { useState, useEffect } from "react";

const EmployeeForm = ({ employee, onSave, onClose, departments, roles, managers }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    department_id: "",
    role_id: "",
    manager_id: "",
    salary: "",
    hire_date: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        gender: employee.gender ?? "",
        department_id: employee.department_id ?? "",
        role_id: employee.role_id ?? "",
        manager_id: employee.manager_id ?? "",
        phone: employee.phone ?? "",
        salary: employee.salary ?? "",
        hire_date: employee.hire_date
          ? employee.hire_date.split("T")[0]
          : "",
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    await onSave(formData, setError);
    setSaving(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>{employee ? "Edit Employee" : "Add Employee"}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <input name="first_name" placeholder="First Name"
              value={formData.first_name} onChange={handleChange} required />

            <input name="last_name" placeholder="Last Name"
              value={formData.last_name} onChange={handleChange} required />

            <input name="email" placeholder="Email"
              value={formData.email} onChange={handleChange} required />

            <input name="phone" placeholder="Phone"
              value={formData.phone} onChange={handleChange} />

            <select name="gender"
              value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select name="department_id"
              value={formData.department_id} onChange={handleChange}>
              <option value="">Select Department</option>
              {departments?.map((dept) => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.department_name}
                </option>
              ))}
            </select>

            <select name="role_id"
              value={formData.role_id} onChange={handleChange}>
              <option value="">Select Role</option>
              {roles?.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </option>
              ))}
            </select>

            <select name="manager_id"
              value={formData.manager_id} onChange={handleChange}>
              <option value="">Select Manager</option>
              {managers?.map((mgr) => (
                <option key={mgr.employee_id} value={mgr.employee_id}>
                  {mgr.first_name} {mgr.last_name}
                </option>
              ))}
            </select>

            <input type="number" name="salary"
              placeholder="Salary"
              value={formData.salary} onChange={handleChange} />

            <input type="date" name="hire_date"
              value={formData.hire_date || ""}
              onChange={handleChange} />
          </div>

          {error && (
            <p style={{ color: "#dc2626", fontSize: 13, margin: "8px 0 0" }}>{error}</p>
          )}
          <div className="modal-actions">
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;