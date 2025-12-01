// src/services/manufacturing/MoService.js
import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createMo = async (mo, token) => {
  const response = await axios.post(
    `${BASE_URL}/manufacture-order`,
    mo,
    axiosAuth(token)
  );
  return response.data;
};

export const getAllMosInItem = async (itemId, token) => {
  const response = await axios.get(
    `${BASE_URL}/manufacture-order/all-by-item/${itemId}`,
    axiosAuth(token)
  );
  return response.data;
};

export const getAllMosInCompany = async (companyId, token) => {
  const response = await axios.get(
    `${BASE_URL}/manufacture-order/all-in-com/${companyId}`,
    axiosAuth(token)
  );
  return response.data;
};

export const getMoById = async (moId, token) => {
  const response = await axios.get(
    `${BASE_URL}/manufacture-order/${moId}`,
    axiosAuth(token)
  );
  return response.data;
};

export const updateMo = async (moId, mo, token) => {
  const response = await axios.put(
    `${BASE_URL}/manufacture-order/${moId}`,
    mo,
    axiosAuth(token)
  );
  return response.data;
};

export const getManufactureReport = async (request, companyId, token) => {
  const response = await axios.post(
    `${BASE_URL}/manufacture-order/report/${companyId}`,
    {},
    {
      params: {
        startTime: request?.startTime,
        endTime: request?.endTime,
        type: request?.type,
      },
      ...axiosAuth(token),
    }
  );
  return response.data;
};

export const getMonthlyManufactureReport = async (companyId, type, token) => {
  const response = await axios.get(
    `${BASE_URL}/manufacture-order/monthly-report/${companyId}`,
    {
      params: { type },
      ...axiosAuth(token),
    }
  );
  return response.data;
};

export const completeMo = async (moId, completedQuantity, token) => {
  const response = await axios.put(
    `${BASE_URL}/manufacture-order/${moId}/complete`,
    { completedQuantity },
    axiosAuth(token)
  );
  return response.data;
};
