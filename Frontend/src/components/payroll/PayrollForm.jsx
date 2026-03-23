import { useState, useEffect } from "react";
import "../../pages/employees.css";

const PayrollForm = ({ payroll, onClose, onSave }) => {

  const [form, setForm] = useState({
    employee_id: "",
    pay_period_start: "",
    pay_period_end: "",
    basic_salary: "",
    bonuses: "",
    deductions: "",
    tax: "",
    payment_date: "",
    payment_status: "Pending"
  });

  useEffect(() => {
    if (payroll) {
      setForm(payroll);
    }
  }, [payroll]);

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
          {payroll ? "Edit Payroll" : "Add Payroll"}
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
          name="basic_salary"
          type="number"
          placeholder="Basic Salary"
          value={form.basic_salary}
          onChange={handleChange}
          required
        />

        <input
          name="bonuses"
          type="number"
          placeholder="Bonuses"
          value={form.bonuses}
          onChange={handleChange}
        />

        <input
          name="deductions"
          type="number"
          placeholder="Deductions"
          value={form.deductions}
          onChange={handleChange}
        />

        <input
          name="tax"
          type="number"
          placeholder="Tax"
          value={form.tax}
          onChange={handleChange}
        />
        <select
          name="payment_status"
          value={form.payment_status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>

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

export default PayrollForm;