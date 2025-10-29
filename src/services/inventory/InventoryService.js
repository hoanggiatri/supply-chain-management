import axios from "axios";

const BASE_URL = "http://localhost:8080";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createInventory = async (inventory, token) => {
  const response = await axios.post(`${BASE_URL}/user/create-inventory`, inventory, axiosAuth(token));
  return response.data;
};

export const checkInventory = async (itemId, warehouseId, amount, token) => {
  const response = await axios.get(`${BASE_URL}/user/check-inventory/${itemId}/${warehouseId}?amount=${amount}`, axiosAuth(token));
  return response.data;
};

export const getInventoryById = async (inventoryId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-inventory/${inventoryId}`, axiosAuth(token));
  return response.data;
};

export const updateInventory = async (inventoryId, inventory, token) => {
  const response = await axios.put(`${BASE_URL}/user/update-inventory/${inventoryId}`, inventory, axiosAuth(token));
  return response.data;
};

export const increaseQuantity = async (request, token) => {
  const response = await axios.post(`${BASE_URL}/user/increase-quantity`, request, axiosAuth(token));
  return response.data;
};

export const decreaseQuantity = async (request, token) => {
  const response = await axios.post(`${BASE_URL}/user/decrease-quantity`, request, axiosAuth(token));
  return response.data;
}

export const increaseOnDemand = async (request, token) => {
  const response = await axios.post(`${BASE_URL}/user/increase-ondemand`, request, axiosAuth(token));
  return response.data;
};

export const decreaseOnDemand = async (request, token) => {
  const response = await axios.post(`${BASE_URL}/user/decrease-ondemand`, request, axiosAuth(token));
  return response.data;
};

export const getAllInventory = async (itemId, warehouseId, companyId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-all-inventory/${companyId}/${itemId}/${warehouseId}`, axiosAuth(token));
  return response.data;
};
