import axiosInstance from "../../utils/axiosInterceptor";

export const registerUserAPI = async (userdata) => {
  const response = await axiosInstance.post(`/users/register`, userdata, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
export const loginUserAPI = async (userdata) => {
  const response = await axiosInstance.post(`/users/login`, userdata, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
