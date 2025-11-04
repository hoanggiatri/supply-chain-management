import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createPlant = async (companyId, plantData, token) => {
  const response = await axios.post(`${BASE_URL}/manufacture-plant/${companyId}`, plantData, axiosAuth(token));
  return response.data;
};

export const getAllPlantsInCompany = async (companyId, token) => {
  const response = await axios.get(`${BASE_URL}/manufacture-plant/all/${companyId}`, axiosAuth(token));
  return response.data;
};

export const getPlantById = async (plantId, token) => {
  const response = await axios.get(`${BASE_URL}/manufacture-plant/${plantId}`, axiosAuth(token));
  return response.data;
};

export const updatePlant = async (plantId, updatedPlant, token) => {
  const response = await axios.put(`${BASE_URL}/manufacture-plant/${plantId}`, updatedPlant, axiosAuth(token));
  return response.data;
};
