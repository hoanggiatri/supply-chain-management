// src/services/manufacturing/MoService.js
import axios from "axios";

const BASE_URL = "http://localhost:8080";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createMo = async (mo, token) => {
  const response = await axios.post(`${BASE_URL}/user/create-mo`, mo, axiosAuth(token));
  return response.data;
};

export const getAllMosInItem = async (itemId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-all-mo-in-item/${itemId}`, axiosAuth(token));
  return response.data;
};

export const getAllMosInCompany = async (companyId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-all-mo-in-com/${companyId}`, axiosAuth(token));
  return response.data;
};

export const getMoById = async (moId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-mo/${moId}`, axiosAuth(token));
  return response.data;
};

export const updateMo = async (moId, mo, token) => {
  const response = await axios.put(`${BASE_URL}/user/update-mo/${moId}`, mo, axiosAuth(token));
  return response.data;
};

export const getManufactureReport = async (request, companyId, token) => {
  const response = await axios.post(`${BASE_URL}/user/manufacture-report/${companyId}`, request, axiosAuth(token));
  return response.data;
};

export const getMonthlyManufactureReport = async (companyId, type, token) => {
  const response = await axios.get(`${BASE_URL}/user/monthly-manufacture-report/${companyId}`, {
    params: { type },
    ...axiosAuth(token),
  });
  return response.data;
};