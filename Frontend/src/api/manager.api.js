import axiosInstance from "./axiosInstance";

const API = "/manager";

export const getManagerTeam = async () => {
  const res = await axiosInstance.get(`${API}/team`);
  return res.data;
};

export const getManagerTeamMember = async (id) => {
  const res = await axiosInstance.get(`${API}/team/member/${id}`);
  return res.data;
};

export const updateManagerTeamMember = async (id, data) => {
  const res = await axiosInstance.patch(`${API}/team/member/${id}`, data);
  return res.data;
};

export const getManagerAttendance = async (date) => {
  const res = await axiosInstance.get(`${API}/attendance`, {
    params: { date }
  });
  return res.data;
};

export const getManagerAttendanceSummary = async (month) => {
  const res = await axiosInstance.get(`${API}/attendance/summary`, {
    params: { month }
  });
  return res.data;
};

export const getManagerLeaves = async () => {
  const res = await axiosInstance.get(`${API}/leaves`);
  return res.data;
};

export const updateManagerLeave = async (id, data) => {
  const res = await axiosInstance.patch(`${API}/leaves/${id}`, data);
  return res.data;
};

export const getManagerTasks = async () => {
  const res = await axiosInstance.get(`${API}/tasks`);
  return res.data;
};

export const createManagerTask = async (data) => {
  const res = await axiosInstance.post(`${API}/tasks`, data);
  return res.data;
};

export const updateManagerTaskStatus = async (id, data) => {
  const res = await axiosInstance.patch(`${API}/tasks/${id}`, data);
  return res.data;
};

export const getManagerPerformance = async (month) => {
  const res = await axiosInstance.get(`${API}/performance`, {
    params: { month }
  });
  return res.data;
};

export const getManagerAttendanceReport = async (month) => {
  const res = await axiosInstance.get(`${API}/reports/attendance`, {
    params: { month }
  });
  return res.data;
};

export const getManagerPerformanceReport = async (month) => {
  const res = await axiosInstance.get(`${API}/reports/performance`, {
    params: { month }
  });
  return res.data;
};
