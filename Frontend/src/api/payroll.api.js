import axiosInstance from "./axiosInstance";

const API = "/payroll";

// GET ALL
export const getPayrolls = async () => {
  const res = await axiosInstance.get(API);
  return res.data;
};

// CREATE
export const createPayroll = async (data) => {
  const res = await axiosInstance.post(API, data);
  return res.data;
};

// UPDATE
export const updatePayroll = async (id, data) => {
  const res = await axiosInstance.put(`${API}/${id}`, data);
  return res.data;
};

// DELETE
export const deletePayroll = async (id) => {
  const res = await axiosInstance.delete(`${API}/${id}`);
  return res.data;
};