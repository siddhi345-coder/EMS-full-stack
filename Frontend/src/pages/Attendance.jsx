import { useEffect, useState } from "react";
import AttendanceTable from "../components/attendance/AttendanceTable";
import AttendanceForm from "../components/attendance/AttendanceForm";
import ConfirmModal from "../components/common/ConfirmModal";

import {
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance
} from "../api/attendance.api";

const Attendance = () => {

  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchAttendance = async () => {
    try {
      const res = await getAttendance();
      setAttendance(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleAdd = () => {
    setSelectedAttendance(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelectedAttendance(item);
    setShowModal(true);
  };

  const requestDelete = (item) => {
    setConfirmDelete(item);
  };

  const performDelete = async (item) => {
    await deleteAttendance(item.attendance_id);
    fetchAttendance();
    setConfirmDelete(null);
  };

  const closeConfirm = () => setConfirmDelete(null);

  const handleSubmit = async (data) => {

    if (selectedAttendance) {
      await updateAttendance(selectedAttendance.attendance_id, data);
    } else {
      await createAttendance(data);
    }

    setShowModal(false);
    fetchAttendance();
  };

  const filteredAttendance = attendance.filter((item) => {

    const name =
      `${item.first_name || ""} ${item.last_name || ""}`.toLowerCase();

    return name.includes(search.toLowerCase());

  });

  return (
    <div className="dashboard">

      <div className="top-bar">

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn add-btn" onClick={handleAdd}>
          + Add Attendance
        </button>

      </div>

      <AttendanceTable
        attendance={filteredAttendance}
        onEdit={handleEdit}
        onDelete={requestDelete}
      />

      {showModal && (
        <AttendanceForm
          selectedAttendance={selectedAttendance}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(confirmDelete)}
        title="Delete attendance"
        message={
          confirmDelete
            ? `Are you sure you want to delete attendance for ${confirmDelete.first_name} ${confirmDelete.last_name}? This action cannot be undone.`
            : ""
        }
        onConfirm={() => performDelete(confirmDelete)}
        onCancel={closeConfirm}
        confirmText="Delete"
      />

    </div>
  );
};

export default Attendance;