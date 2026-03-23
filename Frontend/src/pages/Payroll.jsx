import { useEffect, useState } from "react";

import PayrollTable from "../components/payroll/PayrollTable";
import PayrollForm from "../components/payroll/PayrollForm";
import ConfirmModal from "../components/common/ConfirmModal";

import {
  getPayrolls,
  createPayroll,
  updatePayroll,
  deletePayroll
} from "../api/payroll.api";

const Payroll = () => {

  const [payrolls, setPayrolls] = useState([]);
  const [search, setSearch] = useState("");
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchPayrolls = async () => {
    const data = await getPayrolls();
    setPayrolls(data);
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleSave = async (data) => {

    if (editingPayroll) {
      await updatePayroll(editingPayroll.payroll_id, data);
    } else {
      await createPayroll(data);
    }

    setShowForm(false);
    setEditingPayroll(null);
    fetchPayrolls();
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this payroll?")) return;

    await deletePayroll(id);
    fetchPayrolls();
  };

  const requestDelete = (payroll) => {
    setConfirmDelete(payroll);
  };

  const performDelete = async (payroll) => {
    await deletePayroll(payroll.payroll_id);
    fetchPayrolls();
    setConfirmDelete(null);
  };

  const closeConfirm = () => setConfirmDelete(null);

  const filteredPayrolls = payrolls.filter((p) =>
    String(p.employee_id).includes(search)
  );

  return (
    <div className="page">

      <div className="top-bar">

        <h2>Payroll Management</h2>

        <div>

          <input
            type="text"
            placeholder="Search Employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="add-btn"
            onClick={() => setShowForm(true)}
          >
            + Add Payroll
          </button>

        </div>

      </div>

      <PayrollTable
        payrolls={filteredPayrolls}
        onEdit={(payroll) => {
          setEditingPayroll(payroll);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />

      {showForm && (
        <PayrollForm
          payroll={editingPayroll}
          onClose={() => {
            setShowForm(false);
            setEditingPayroll(null);
          }}
          onSave={handleSave}
        />
      )}

    </div>
  );
};

export default Payroll;