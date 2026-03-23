import axiosInstance from "./axiosInstance";

const API = "/hr";

export const getHrLogs = async (limit = 10) => {
  const res = await axiosInstance.get(`${API}/logs`, {
    params: { limit }
  });
  return res.data;
};
