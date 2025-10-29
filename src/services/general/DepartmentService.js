import axios from "axios";

const BASE_URL = "http://localhost:8080";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getDepartmentById = async (departmentId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-department/${departmentId}`, axiosAuth(token));
  return res.data;
};

export const getAllDepartmentsInCompany = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-all-department-in-com/${companyId}`, axiosAuth(token));
  return res.data;
};
