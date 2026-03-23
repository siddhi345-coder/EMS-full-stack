import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DepartmentTable from "../components/departments/DepartmentTable";
import DepartmentForm from "../components/departments/DepartmentForm";
import ConfirmModal from "../components/common/ConfirmModal";

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from "../api/departments.api";

const Departments = () => {

  const { role } = useAuth();
  const canEdit = role === "HR";

  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSave = async (data) => {

    if (editingDepartment) {
      await updateDepartment(editingDepartment.department_id, data);
    } else {
      await createDepartment(data);
    }

    setShowForm(false);
    setEditingDepartment(null);
    fetchDepartments();
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this department?")) return;

    await deleteDepartment(id);
    fetchDepartments();
  };

  const requestDelete = (dept) => {
    setConfirmDelete(dept);
  };

  const performDelete = async (dept) => {
    await deleteDepartment(dept.department_id);
    fetchDepartments();
    setConfirmDelete(null);
  };

  const closeConfirm = () => setConfirmDelete(null);

  const filteredDepartments = departments.filter((d) =>
    d.department_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">

      <div className="top-bar">

        <h2>Department Management</h2>

        <div>
          <input
            type="text"
            placeholder="Search department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {canEdit && (
          <button
            className="add-btn"
            onClick={() => setShowForm(true)}
          >
            + Add Department
          </button>
        )}
        </div>

      </div>

      <DepartmentTable
        departments={filteredDepartments}
        onEdit={canEdit ? (dept) => {
          setEditingDepartment(dept);
          setShowForm(true);
        } : null}
        onDelete={canEdit ? requestDelete : null}
      />

      {showForm && canEdit && (
        <DepartmentForm
          department={editingDepartment}
          onClose={() => {
            setShowForm(false);
            setEditingDepartment(null);
          }}
          onSave={handleSave}
          onDelete={requestDelete}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(confirmDelete)}
        title="Delete department"
        message={
          confirmDelete
            ? `Are you sure you want to delete ${confirmDelete.department_name}? This action cannot be undone.`
            : ""
        }
        onConfirm={() => performDelete(confirmDelete)}
        onCancel={closeConfirm}
        confirmText="Delete"
      />

    </div>
  );
};

export default Departments;