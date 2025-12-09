import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token, config = {}) => ({
  ...config,
  headers: {
    Authorization: `Bearer ${token}`,
    ...(config.headers || {}),
  },
});

export const getAllUsers = async (token) => {
  const response = await axios.get(`${BASE_URL}/users`, axiosAuth(token));
  return response.data;
};

export const getAllUsersInCompany = async (companyId, token, config = {}) => {
  const response = await axios.get(
    `${BASE_URL}/users/company/${companyId}`,
    axiosAuth(token, config)
  );
  return response.data;
};

export const getUserByEmployeeId = async (employeeId, token) => {
  const response = await axios.get(`${BASE_URL}/users/employee/${employeeId}`, axiosAuth(token));
  return response.data;
};

export const getUserById = async (userId, token) => {
  const response = await axios.get(`${BASE_URL}/users/${userId}`, axiosAuth(token));
  return response.data;
};

export const updateUser = async (userId, newUser, token) => {
  const response = await axios.patch(`${BASE_URL}/users/update-info/${userId}`, newUser, axiosAuth(token));
  return response.data;
};

export const updatePassword = async (userId, data, token) => {
  const res = await axios.patch(`${BASE_URL}/users/update-password/${userId}`, data, axiosAuth(token));
  return res.data;
};

export const monthlyUserReport = async (token) => {
  const res = await axios.get(`${BASE_URL}/sysad/monthly-user-report`, axiosAuth(token));
  return res.data;
}
