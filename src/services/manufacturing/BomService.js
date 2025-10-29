import axios from "axios";

const BASE_URL = "http://localhost:8080";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Bom
export const createBom = async (data, token) => {
  const res = await axios.post(`${BASE_URL}/user/create-bom`, data, axiosAuth(token));
  return res.data;
};

export const getAllBomsInCompany = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-all-bom-in-com/${companyId}`, axiosAuth(token));
  return res.data;
};

export const getBomByItemId = async (itemId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-bom/${itemId}`, axiosAuth(token));
  return res.data;
};

export const updateBom = async (bomId, data, token) => {
  const res = await axios.put(`${BASE_URL}/user/update-bom/${bomId}`, data, axiosAuth(token));
  return res.data;
};

export const deleteBom = async (bomId, token) => {
  const res = await axios.delete(`${BASE_URL}/comad/delete-bom/${bomId}`, axiosAuth(token));
  return res.data;
};