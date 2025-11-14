import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createDeliveryOrder = async (request, token) => {
  const res = await axios.post(`${BASE_URL}/delivery-order`, request, axiosAuth(token));
  return res.data;
};

export const getDeliveryOrderById = async (doId, token) => {
  const res = await axios.get(`${BASE_URL}/delivery-order/${doId}`, axiosAuth(token));
  return res.data;
};

export const getDeliveryOrderBySoId = async (soId, token) => {
  const res = await axios.get(`${BASE_URL}/delivery-order/so/${soId}`, axiosAuth(token));
  return res.data;
};

export const getAllDeliveryOrdersInCompany = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/delivery-order/all/${companyId}`, axiosAuth(token));
  return res.data;
};

export const updateDeliveryOrder = async (doId, request, token) => {
  const res = await axios.put(`${BASE_URL}/delivery-order/${doId}`, request, axiosAuth(token));
  return res.data;
}
