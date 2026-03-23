import axiosInstance from "./axiosInstance";

export const getRoles = async () => {
  const res = await axiosInstance.get("/roles");
  return res.data;
};
