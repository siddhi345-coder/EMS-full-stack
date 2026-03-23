import axiosInstance from "./axiosInstance";

const API = "/announcements";

export const getAnnouncements = async (limit = 5) => {
  const res = await axiosInstance.get(API, { params: { limit } });
  return res.data;
};
