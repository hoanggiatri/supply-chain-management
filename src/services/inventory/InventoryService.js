import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createInventory = async (inventory, token) => {
  const response = await axios.post(`${BASE_URL}/inventory`, inventory, axiosAuth(token));
  return response.data;
};

export const checkInventory = async (itemId, warehouseId, amount, token) => {
  const response = await axios.get(`${BASE_URL}/inventory/check/${itemId}/${warehouseId}?amount=${amount}`, axiosAuth(token));
  return response.data;
};

export const getInventoryById = async (inventoryId, token) => {
  const response = await axios.get(`${BASE_URL}/inventory/${inventoryId}`, axiosAuth(token));
  return response.data;
};

export const updateInventory = async (inventoryId, inventory, token) => {
  const response = await axios.put(`${BASE_URL}/inventory/${inventoryId}`, inventory, axiosAuth(token));
  return response.data;
};

export const increaseQuantity = async (request, token) => {
  const response = await axios.post(`${BASE_URL}/inventory/increase-quantity`, request, axiosAuth(token));
  return response.data;
};

export const decreaseQuantity = async (request, token) => {
  const response = await axios.post(`${BASE_URL}/inventory/decrease-quantity`, request, axiosAuth(token));
  return response.data;
}

export const increaseOnDemand = async (request, token) => {
  const response = await axios.post(`${BASE_URL}/inventory/increase-ondemand`, request, axiosAuth(token));
  return response.data;
};

export const decreaseOnDemand = async (request, token) => {
  const response = await axios.post(`${BASE_URL}/inventory/decrease-ondemand`, request, axiosAuth(token));
  return response.data;
};

export const getAllInventory = async (itemId, warehouseId, companyId, token) => {
  const response = await axios.get(`${BASE_URL}/inventory/all/${companyId}/${itemId}/${warehouseId}`, axiosAuth(token));
  return response.data;
};
