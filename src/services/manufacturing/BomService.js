import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Bom
export const createBom = async (data, token) => {
  const res = await axios.post(`${BASE_URL}/bom`, data, axiosAuth(token));
  return res.data;
};

export const getAllBomsInCompany = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/bom/all/${companyId}`, axiosAuth(token));
  return res.data;
};

export const getBomByItemId = async (itemId, token) => {
  const res = await axios.get(`${BASE_URL}/bom/${itemId}`, axiosAuth(token));
  return res.data;
};

export const updateBom = async (bomId, data, token) => {
  const res = await axios.put(`${BASE_URL}/bom/${bomId}`, data, axiosAuth(token));
  return res.data;
};

export const deleteBom = async (bomId, token) => {
  const res = await axios.delete(`${BASE_URL}/bom/${bomId}`, axiosAuth(token));
  return res.data;
};