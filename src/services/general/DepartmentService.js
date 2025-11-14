import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getDepartmentById = async (departmentId, token) => {
  const res = await axios.get(`${BASE_URL}/departments/${departmentId}`, axiosAuth(token));
  return res.data;
};

export const getAllDepartmentsInCompany = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/departments/company/${companyId}`, axiosAuth(token));
  return res.data;
};
