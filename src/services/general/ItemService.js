import axios from "axios";

const BASE_URL = "http://localhost:8080";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getAllItemsInCompany = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-all-item-in-com/${companyId}`, axiosAuth(token));
  return res.data;
};

export const getItemById = async (itemId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-item/${itemId}`, axiosAuth(token));
  return res.data;
};

export const createItem = async (companyId, data, token) => {
  const res = await axios.post(`${BASE_URL}/comad/create-item/${companyId}`, data, axiosAuth(token));
  return res.data;
};

export const updateItem = async (itemId, data, token) => {
  const res = await axios.put(`${BASE_URL}/comad/update-item/${itemId}`, data, axiosAuth(token));
  return res.data;
};

export const deleteItem = async (itemId, token) => {
  const res = await axios.delete(`${BASE_URL}/comad/delete-item/${itemId}`, axiosAuth(token));
  return res.data;
};

