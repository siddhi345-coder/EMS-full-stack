import { useState, useEffect } from "react";
import axios from "axios";

const ReviewForm = ({ review, onClose, onSave }) => {

  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    rating: "",
    comments: ""
  });

  useEffect(() => {

    // ✅ Fetch employees (not reviews)
    axios.get("http://localhost:3000/api/employees")
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));

    if (review) {
      setForm({
        employeeId: review.employee_id || "",
        rating: review.rating || "",
        comments: review.comments || ""
      });
    }

  }, [review]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <h2>{review ? "Edit Review" : "Add Review"}</h2>

        <form onSubmit={handleSubmit} className="form">

          <select
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            required
          >
            <option value="">Select Employee</option>

            {employees.map(emp => (
              <option key={emp.employee_id} value={emp.employee_id}>
                {emp.first_name} {emp.last_name}
              </option>
            ))}

          </select>

          <input
            type="number"
            name="rating"
            placeholder="Rating (1-5)"
            value={form.rating}
            onChange={handleChange}
            min="1"
            max="5"
            required
          />

          <textarea
            name="comments"
            placeholder="Comments"
            value={form.comments}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginBottom: "15px",
              resize: "none"
            }}
          />

          <div className="button-group">

            <button type="submit" className="save-btn">
              Save
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default ReviewForm;