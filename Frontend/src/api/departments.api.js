import axiosInstance from "./axiosInstance";

const API = "/departments";

export const getDepartments = async () => {
  const res = await axiosInstance.get(API);
  return res.data;
};

export const createDepartment = async (data) => {
  const res = await axiosInstance.post(API, data);
  return res.data;
};

export const updateDepartment = async (id, data) => {
  const res = await axiosInstance.put(`${API}/${id}`, data);
  return res.data;
};

export const deleteDepartment = async (id) => {
  const res = await axiosInstance.delete(`${API}/${id}`);
  return res.data;
};