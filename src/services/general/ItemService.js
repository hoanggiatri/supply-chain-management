import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getAllItemsInCompany = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/item/all/${companyId}`, axiosAuth(token));
  return res.data;
};

export const getItemById = async (itemId, token) => {
  const res = await axios.get(`${BASE_URL}/item/${itemId}`, axiosAuth(token));
  return res.data;
};

export const createItem = async (companyId, data, token) => {
  const res = await axios.post(`${BASE_URL}/item/${companyId}`, data, axiosAuth(token));
  return res.data;
};

export const updateItem = async (itemId, data, token) => {
  const res = await axios.put(`${BASE_URL}/item/${itemId}`, data, axiosAuth(token));
  return res.data;
};

export const updateItemImage = async (itemId, file, token) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `${BASE_URL}/item/${itemId}/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const deleteItem = async (itemId, token) => {
  const res = await axios.delete(`${BASE_URL}/item/${itemId}`, axiosAuth(token));
  return res.data;
};

