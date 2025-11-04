import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createProcess = async (process, token) => {
  const response = await axios.post(`${BASE_URL}/user/create-process/`, process, axiosAuth(token));
  return response.data;
};

export const getAllProcessesInMo = async (moId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-all-process-in-mo/${moId}`, axiosAuth(token));
  return response.data;
};

export const getProcessById = async (processId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-process/${processId}`, axiosAuth(token));
  return response.data;
};

export const updateProcess = async (processId, process, token) => {
  const response = await axios.put(`${BASE_URL}/user/update-process/${processId}`, process, axiosAuth(token));
  return response.data;
};
