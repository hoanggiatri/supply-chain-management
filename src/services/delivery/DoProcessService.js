import axios from "axios";

const BASE_URL = "http://localhost:8080";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createDeliveryProcess = async (request, token) => {
  const res = await axios.post(`${BASE_URL}/user/create-delivery-process`, request, axiosAuth(token));
  return res.data;
};

export const getAllDeliveryProcesses = async (doId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-all-delivery-process/${doId}`, axiosAuth(token));
  return res.data;
};
