import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createSo = async (salesOrderRequest, token) => {
  const res = await axios.post(`${BASE_URL}/user/create-so`, salesOrderRequest, axiosAuth(token));
  return res.data;
};

export const getSoById = async (soId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-so/${soId}`, axiosAuth(token));
  return res.data;
};

export const getSoByPoId = async (poId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-so-by-poId/${poId}`, axiosAuth(token));
  return res.data;
};

export const getAllSosInCompany = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-all-so-in-com/${companyId}`, axiosAuth(token));
  return res.data;
};

export const updateSoStatus = async (soId, status, token) => {
  const res = await axios.put(`${BASE_URL}/user/update-so-status/${soId}?status=${status}`, {}, axiosAuth(token));
  return res.data;
};

export const getSalesReport = async (request, companyId, token) => {
  const response = await axios.post(`${BASE_URL}/user/sales-report/${companyId}`, request, axiosAuth(token));
  return response.data;
};

export const getMonthlySalesReport = async (companyId, token) => {
  const response = await axios.get(`${BASE_URL}/user/monthly-sales-report/${companyId}`, axiosAuth(token));
  return response.data;
};
