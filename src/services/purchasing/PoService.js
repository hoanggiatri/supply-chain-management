import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createPo = async (purchaseOrderRequest, token) => {
  const res = await axios.post(`${BASE_URL}/purchase-orders`, purchaseOrderRequest, axiosAuth(token));
  return res.data;
};

export const getAllPosInCompany = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/purchase-orders/company/${companyId}`, axiosAuth(token));
  return res.data;
};

export const getAllPosInSupplierCompany = async (supplierCompanyId, token) => {
  const res = await axios.get(`${BASE_URL}/purchase-orders/supplier/${supplierCompanyId}`, axiosAuth(token));
  return res.data;
};

export const getPoById = async (poId, token) => {
  const res = await axios.get(`${BASE_URL}/purchase-orders/${poId}`, axiosAuth(token));
  return res.data;
};

export const updatePoStatus = async (poId, status, token) => {
  const res = await axios.put(`${BASE_URL}/purchase-orders/${poId}/status`, { status }, axiosAuth(token));
  return res.data;
};

export const getPurchaseReport = async (request, companyId, token) => {
  const response = await axios.post(
    `${BASE_URL}/purchase-orders/reports/purchase/${companyId}`,
    {
      startDate: request.startDate,
      endDate: request.endDate,
    },
    axiosAuth(token)
  );
  return response.data;
};

export const getMonthlyPurchaseReport = async (companyId, token) => {
  const response = await axios.get(`${BASE_URL}/purchase-orders/reports/monthly/${companyId}`, axiosAuth(token));
  return response.data;
};