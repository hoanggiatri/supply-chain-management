import axios from "axios";

const BASE_URL = "http://localhost:8080";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createPo = async (purchaseOrderRequest, token) => {
  const res = await axios.post(`${BASE_URL}/user/create-po`, purchaseOrderRequest, axiosAuth(token));
  return res.data;
};

export const getAllPosInCompany = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-all-po-in-com/${companyId}`, axiosAuth(token));
  return res.data;
};

export const getAllPosInSupplierCompany = async (supplierCompanyId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-all-po-in-supplier-com/${supplierCompanyId}`, axiosAuth(token));
  return res.data;
};

export const getPoById = async (poId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-po/${poId}`, axiosAuth(token));
  return res.data;
};

export const updatePoStatus = async (poId, status, token) => {
  const res = await axios.put(`${BASE_URL}/user/update-po-status/${poId}?status=${status}`, {}, axiosAuth(token));
  return res.data;
};

export const getPurchaseReport = async (request, companyId, token) => {
  const response = await axios.post(`${BASE_URL}/user/purchase-report/${companyId}`, request, axiosAuth(token));
  return response.data;
};

export const getMonthlyPurchaseReport = async (companyId, token) => {
  const response = await axios.get(`${BASE_URL}/user/monthly-purchase-report/${companyId}`, axiosAuth(token));
  return response.data;
};