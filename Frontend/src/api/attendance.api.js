import axiosInstance from "./axiosInstance";

const API = "/attendance";

// GET ALL
export const getAttendance = async (params = {}) => {
  const res = await axiosInstance.get(API, { params });
  return res.data;
};

// GET MY ATTENDANCE
export const getMyAttendance = async (params = {}) => {
  const res = await axiosInstance.get(`${API}/my`, { params });
  return res.data;
};

// CHECK-IN
export const checkIn = async () => {
  const res = await axiosInstance.post(`${API}/check-in`);
  return res.data;
};

// CHECK-OUT
export const checkOut = async () => {
  const res = await axiosInstance.post(`${API}/check-out`);
  return res.data;
};

// GET Attendance by Employee (HR/Manager)
export const getAttendanceByEmployee = async (employeeId) => {
  const res = await axiosInstance.get(`${API}/employee/${employeeId}`);
  return res.data;
};

// GET Monthly Attendance Report
export const getAttendanceReport = async (month, departmentId = null) => {
  const res = await axiosInstance.get(`${API}/report/monthly`, {
    params: {
      month,
      department_id: departmentId || undefined
    }
  });
  return res.data;
};

// CREATE
export const createAttendance = async (data) => {
  return await axiosInstance.post(API, data);
};

// UPDATE
export const updateAttendance = async (id, data) => {
  return await axiosInstance.put(`${API}/${id}`, data);
};

// DELETE
export const deleteAttendance = async (id) => {
  return await axiosInstance.delete(`${API}/${id}`);
};
