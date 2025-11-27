import axiosInstance from "../helpers/AxiosInstance";

export const loginWithGoogle = async (id_token) => {
  const res = await axiosInstance.post("/auth/google", { id_token });
  return res.data;
};

export const getProfile = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};

export const refreshToken = async () => {
  const res = await axiosInstance.post("/auth/refresh");
  return res.data;
};