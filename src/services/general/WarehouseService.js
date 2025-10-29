import axios from "axios";

const BASE_URL = "http://localhost:8080";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createWarehouse = async (companyId, warehouseData, token) => {
  const response = await axios.post(`${BASE_URL}/comad/create-warehouse/${companyId}`, warehouseData, axiosAuth(token) );
  return response.data;
};

export const getWarehouseById = async (warehouseId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-warehouse/${warehouseId}`, axiosAuth(token));
  return response.data;
};

export const getAllWarehousesInCompany = async (companyId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-all-warehouse-in-com/${companyId}`, axiosAuth(token));
  return response.data;
};

export const updateWarehouse = async (warehouseId, updatedWarehouse, token) => {
  const response = await axios.put(`${BASE_URL}/comad/update-warehouse/${warehouseId}`, updatedWarehouse, axiosAuth(token));
  return response.data;
};
