import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token, config = {}) => ({
  ...config,
  headers: {
    Authorization: `Bearer ${token}`,
    ...(config.headers || {}),
  },
});

export const getAllEmployeesInCompany = async (companyId, token, config = {}) => {
  const res = await axios.get(
    `${BASE_URL}/employees/company/${companyId}`,
    axiosAuth(token, config)
  );
  return res.data;
};

export const getEmployeeById = async (employeeId, token) => {
  const res = await axios.get(`${BASE_URL}/employees/${employeeId}`, axiosAuth(token));
  return res.data;
};

export const createEmployee = async (data, token) => {
  const res = await axios.post(`${BASE_URL}/admin/employees`, data, axiosAuth(token));
  return res.data;
};

export const updateEmployee = async (employeeId, data, token) => {
  const res = await axios.put(`${BASE_URL}/employees/${employeeId}`, data, axiosAuth(token));
  return res.data;
};

export const deleteEmployee = async (employeeId, token) => {
  const res = await axios.delete(`${BASE_URL}/admin/employees/${employeeId}`, axiosAuth(token));
  return res.data;
};

export const updateEmployeeAvatar = async (employeeId, file, token) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${BASE_URL}/employees/${employeeId}/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
