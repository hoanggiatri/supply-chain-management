import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createLine = async (plantId, data, token) => {
  const response = await axios.post(`${BASE_URL}/manufacture-line/${plantId}`, data, axiosAuth(token));
  return response.data;
};

export const getAllLinesInCompany = async (companyId, token) => {
  const response = await axios.get(`${BASE_URL}/manufacture-line/all/${companyId}`, axiosAuth(token));
  return response.data;
};

export const getLineById = async (lineId, token) => {
  const response = await axios.get(`${BASE_URL}/manufacture-line/${lineId}`, axiosAuth(token));
  return response.data;
};

export const updateLine = async (lineId, data, token) => {
  const response = await axios.put(`${BASE_URL}/manufacture-line/${lineId}`, data, axiosAuth(token));
  return response.data;
};
