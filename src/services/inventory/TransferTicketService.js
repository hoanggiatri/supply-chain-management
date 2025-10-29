import axios from "axios";

const BASE_URL = "http://localhost:8080";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createTransferTicket = async (request, token) => {
  const response = await axios.post(`${BASE_URL}/user/create-transfer-ticket`, request, axiosAuth(token));
  return response.data;
};

export const getTransferTicketById = async (ticketId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-transfer-ticket-by-id/${ticketId}`, axiosAuth(token));
  return response.data;
};

export const getAllTransferTicketsInCompany = async (companyId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-all-transfer-ticket-in-com/${companyId}`, axiosAuth(token));
  return response.data;
};

export const updateTransferTicket = async (ticketId, request, token) => {
  const response = await axios.put(`${BASE_URL}/user/update-transfer-ticket/${ticketId}`, request, axiosAuth(token));
  return response.data;
};
