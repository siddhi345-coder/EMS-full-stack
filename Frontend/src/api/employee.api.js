import axiosInstance from "./axiosInstance";

const API = "/employees"; // axiosInstance already has baseURL

export const getEmployees = async () => {
  const res = await axiosInstance.get(API);
  return res.data;
};

export const getManagers = async () => {
  const res = await axiosInstance.get(`${API}/managers`);
  return res.data;
};

export const createEmployee = async (data) => {
  return axiosInstance.post(API, data);
};

export const updateEmployee = async (id, data) => {
  return axiosInstance.put(`${API}/${id}`, data);
};

export const deleteEmployee = async (id) => {
  return axiosInstance.delete(`${API}/${id}`);
};

// EMPLOYEE SELF
export const getMyProfile = async () => {
  const res = await axiosInstance.get(`${API}/me`);
  return res.data;
};

export const updateMyProfile = async (data) => {
  const res = await axiosInstance.patch(`${API}/me`, data);
  return res.data;
};

export const updateMyPassword = async (password) => {
  const res = await axiosInstance.patch(`${API}/me/password`, { password });
  return res.data;
};

export const getMyLogs = async (limit = 5) => {
  const res = await axiosInstance.get(`${API}/me/logs`, { params: { limit } });
  return res.data;
};

export const getMyNotifications = async () => {
  const res = await axiosInstance.get(`${API}/me/notifications`);
  return res.data;
};
