export const registerUser = async (data) => {
  const res = await axiosInstance.post("/users/signup", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axiosInstance.post("/users/login", data);
  return res.data;
};