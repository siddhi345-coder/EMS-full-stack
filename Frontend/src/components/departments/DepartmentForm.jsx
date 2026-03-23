import { useState, useEffect } from "react";
import "../../pages/employees.css";

const DepartmentForm = ({ department, onClose, onSave, onDelete }) => {

  const [form, setForm] = useState({
    department_name: "",
    location: "",
    budget: ""
  });

  useEffect(() => {
    if (department) {
      setForm(department);
    }
  }, [department]);

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
          {department ? "Edit Department" : "Add Department"}
        </h2>

        <form onSubmit={handleSubmit} className="form">

        <h3>
          {department ? "Edit Department" : "Add Department"}
        </h3>

        <input
          name="department_name"
          placeholder="Department Name"
          value={form.department_name}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          name="budget"
          type="number"
          placeholder="Budget"
          value={form.budget}
          onChange={handleChange}
          required
        />

        <div className="form-buttons">

          <button type="submit" className="add-btn">
            Save
          </button>

          {department && (
            <button type="button" className="delete-btn" onClick={() => onDelete(department.department_id)}>
              Delete
            </button>
          )}

          <button type="button" onClick={onClose}>
            Cancel
          </button>

        </div>

      </form>

    </div>

  </div>
  );
};

export default DepartmentForm;