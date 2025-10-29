import axios from "axios";

const BASE_URL = "http://localhost:8080";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createStage = async (stage, token) => {
  const response = await axios.post(`${BASE_URL}/user/create-stage`, stage, axiosAuth(token));
  return response.data;
};

export const getStageByItemId = async (itemId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-stage-by-item/${itemId}`, axiosAuth(token));
  return response.data;
};

export const getAllStagesInCompany = async (companyId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-all-stage-in-com/${companyId}`, axiosAuth(token));
  return response.data;
};

export const getStageById = async (stageId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-stage-by-id/${stageId}`, axiosAuth(token));
  return response.data;
};

export const updateStage = async (stageId, stage, token) => {
  const response = await axios.put(`${BASE_URL}/user/update-stage/${stageId}`, stage, axiosAuth(token));
  return response.data;
};

export const deleteStage = async (stageId, token) => {
  const response = await axios.delete(`${BASE_URL}/user/delete-stage/${stageId}`, axiosAuth(token));
  return response.data;
};
