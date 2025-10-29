import axios from "axios";

const BASE_URL = "http://localhost:8080";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createDeliveryOrder = async (request, token) => {
  const res = await axios.post(`${BASE_URL}/user/create-do`, request, axiosAuth(token));
  return res.data;
};

export const getDeliveryOrderById = async (doId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-do/${doId}`, axiosAuth(token));
  return res.data;
};

export const getDeliveryOrderBySoId = async (soId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-do-by-soId/${soId}`, axiosAuth(token));
  return res.data;
};

export const getAllDeliveryOrdersInCompany = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-all-do-in-company/${companyId}`, axiosAuth(token));
  return res.data;
};

export const updateDeliveryOrder = async (doId, request, token) => {
  const res = await axios.put(`${BASE_URL}/user/update-do/${doId}`, request, axiosAuth(token));
  return res.data;
}
