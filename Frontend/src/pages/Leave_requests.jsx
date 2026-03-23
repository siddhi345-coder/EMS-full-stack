import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LeaveTable from "../components/leave_requests/LeaveTable";
import LeaveForm from "../components/leave_requests/LeaveForm";
import ConfirmModal from "../components/common/ConfirmModal";

import {
  getLeaves,
  createLeave,
  updateLeave,
  deleteLeave
} from "../api/leave_requests.api";

const Leaves = () => {

  const { role } = useAuth();
  const canCreate = ["HR", "Employee"].includes(role);
  const canManage = ["HR", "Manager"].includes(role);

  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [editingLeave, setEditingLeave] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchLeaves = async () => {
    const data = await getLeaves();
    setLeaves(data);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSave = async (data) => {

    if (editingLeave) {
      await updateLeave(editingLeave.leave_request_id, data);
    } else {
      await createLeave(data);
    }

    setShowForm(false);
    setEditingLeave(null);
    fetchLeaves();
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this leave request?")) return;

    await deleteLeave(id);
    fetchLeaves();
  };

  const requestDelete = (leave) => {
    setConfirmDelete(leave);
  };

  const performDelete = async (leave) => {
    await deleteLeave(leave.leave_request_id);
    fetchLeaves();
    setConfirmDelete(null);
  };

  const closeConfirm = () => setConfirmDelete(null);

  const filteredLeaves = leaves.filter((l) =>
    String(l.employee_id).includes(search)
  );

  return (

    <div className="page">

      <div className="top-bar">

        <h2>Leave Management</h2>

        <div>
          <input
            type="text"
            placeholder="Search by Employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {canCreate && (
            <button
              className="add-btn"
              onClick={() => setShowForm(true)}
            >
              + Add Leave
            </button>
          )}
        </div>

      </div>

      <LeaveTable
        leaves={filteredLeaves}
        onEdit={canManage ? (leave) => {
          setEditingLeave(leave);
          setShowForm(true);
        } : null}
        onDelete={canManage ? requestDelete : null}
      />

      {showForm && canManage && (
        <LeaveForm
          leave={editingLeave}
          onClose={() => {
            setShowForm(false);
            setEditingLeave(null);
          }}
          onSave={handleSave}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(confirmDelete)}
        title="Delete leave request"
        message={
          confirmDelete
            ? `Are you sure you want to delete leave request for ${confirmDelete.first_name} ${confirmDelete.last_name}? This action cannot be undone.`
            : ""
        }
        onConfirm={() => performDelete(confirmDelete)}
        onCancel={closeConfirm}
        confirmText="Delete"
      />

    </div>
  );
};

export default Leaves;