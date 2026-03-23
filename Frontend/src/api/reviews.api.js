import axiosInstance from "./axiosInstance";

const API = "/reviews";

export const getReviews = async () => {
  const res = await axiosInstance.get(API);
  return res.data;
};

export const getEmployeeReviews = async (id) => {
  const res = await axiosInstance.get(`${API}/employee/${id}`);
  return res.data;
};

export const createReview = async (data) => {
  const res = await axiosInstance.post(API, data);
  return res.data;
};

export const updateReview = async (id, data) => {
  const res = await axiosInstance.put(`${API}/${id}`, data);
  return res.data;
};

export const deleteReview = async (id) => {
  const res = await axiosInstance.delete(`${API}/${id}`);
  return res.data;
};