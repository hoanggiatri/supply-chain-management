import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";

const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createProduct = async (itemId, data, token) => {
  const res = await axios.post(`${BASE_URL}/product/${itemId}`, data, axiosAuth(token));
  return res.data;
};

export const getProductById = async (productId, token) => {
  const res = await axios.get(`${BASE_URL}/product/${productId}`, axiosAuth(token));
  return res.data;
};

export const getAllProductsByItem = async (itemId, token) => {
  const res = await axios.get(`${BASE_URL}/product/item/${itemId}`, axiosAuth(token));
  return res.data;
};

export const getAllProductsByCompany = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/product/company/${companyId}`, axiosAuth(token));
  return res.data;
};

export const getProductsByBatch = async (batchNo, token) => {
  const res = await axios.get(`${BASE_URL}/product/batch/${batchNo}`, axiosAuth(token));
  return res.data;
};

export const updateProduct = async (productId, data, token) => {
  const res = await axios.put(`${BASE_URL}/product/${productId}`, data, axiosAuth(token));
  return res.data;
};

export const deleteProduct = async (productId, token) => {
  const res = await axios.delete(`${BASE_URL}/product/${productId}`, axiosAuth(token));
  return res.data;
};

export const scanQRCode = async (qrCode, token) => {
  const res = await axios.get(`${BASE_URL}/product/scan/${qrCode}`, axiosAuth(token));
  return res.data;
};

export const transferProduct = async (productId, newCompanyId, token) => {
  const res = await axios.put(`${BASE_URL}/product/${productId}/transfer`, { newCompanyId }, axiosAuth(token));
  return res.data;
};

export const getQRCodeImage = async (productId, token) => {
  const res = await axios.get(`${BASE_URL}/product/${productId}/qr-image`, axiosAuth(token));
  return res.data; // Assuming this returns base64 string or url
};
