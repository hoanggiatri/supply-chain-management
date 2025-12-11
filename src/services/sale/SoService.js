import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createSo = async (salesOrderRequest, token) => {
  const res = await axios.post(`${BASE_URL}/sales-orders`, salesOrderRequest, axiosAuth(token));
  return res.data;
};

export const getSoById = async (soId, token) => {
  const res = await axios.get(`${BASE_URL}/sales-orders/${soId}`, axiosAuth(token));
  return res.data;
};

export const getSoByPoId = async (poId, token) => {
  const res = await axios.get(`${BASE_URL}/sales-orders/purchase-orders/${poId}`, axiosAuth(token));
  return res.data;
};

export const getAllSosInCompany = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/sales-orders/company/${companyId}`, axiosAuth(token));
  return res.data;
};

export const updateSoStatus = async (soId, status, token) => {
  const res = await axios.put(`${BASE_URL}/sales-orders/${soId}`, { status }, axiosAuth(token));
  return res.data;
};

export const getSalesReport = async (request, companyId, token) => {
  const response = await axios.post(
    `${BASE_URL}/sales-orders/reports/sales/${companyId}`,
    {
      startDate: request.startDate,
      endDate: request.endDate,
    },
    axiosAuth(token)
  );
  return response.data;
};

export const getMonthlySalesReport = async (companyId, token) => {
  const response = await axios.get(`${BASE_URL}/sales-orders/reports/monthly/${companyId}`, axiosAuth(token));
  return response.data;
};
