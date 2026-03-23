import axiosInstance from "./axiosInstance";

const API = "/leaves";

// GET ALL
export const getLeaves = async () => {
  const res = await axiosInstance.get(API);
  return res.data;
};

// GET Leaves by Employee
export const getLeavesByEmployee = async (employeeId) => {
  const res = await axiosInstance.get(`${API}/employee/${employeeId}`);
  return res.data;
};

// GET Monthly Leave Summary
export const getLeaveSummary = async (month, departmentId = null) => {
  const res = await axiosInstance.get(`${API}/report/summary`, {
    params: {
      month,
      department_id: departmentId || undefined
    }
  });
  return res.data;
};

// CREATE
export const createLeave = async (data) => {
  const res = await axiosInstance.post(API, data);
  return res.data;
};

// UPDATE
export const updateLeave = async (id, data) => {
  const res = await axiosInstance.put(`${API}/${id}`, data);
  return res.data;
};

// CANCEL (Employee)
export const cancelLeave = async (id) => {
  const res = await axiosInstance.patch(`${API}/${id}/cancel`);
  return res.data;
};

// DELETE
export const deleteLeave = async (id) => {
  const res = await axiosInstance.delete(`${API}/${id}`);
  return res.data;
};
