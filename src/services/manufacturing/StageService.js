import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createStage = async (stage, token) => {
  const response = await axios.post(`${BASE_URL}/manufacture-stage`, stage, axiosAuth(token));
  return response.data;
};

export const getStageByItemId = async (itemId, token) => {
  const response = await axios.get(`${BASE_URL}/manufacture-stage/item/${itemId}`, axiosAuth(token));
  return response.data;
};

export const getAllStagesInCompany = async (companyId, token) => {
  const response = await axios.get(`${BASE_URL}/manufacture-stage/all-in-com/${companyId}`, axiosAuth(token));
  return response.data;
};

export const getStageById = async (stageId, token) => {
  const response = await axios.get(`${BASE_URL}/manufacture-stage/${stageId}`, axiosAuth(token));
  return response.data;
};

export const updateStage = async (stageId, stage, token) => {
  const response = await axios.put(`${BASE_URL}/manufacture-stage/${stageId}`, stage, axiosAuth(token));
  return response.data;
};

export const deleteStage = async (stageId, token) => {
  const response = await axios.delete(`${BASE_URL}/manufacture-stage/${stageId}`, axiosAuth(token));
  return response.data;
};
