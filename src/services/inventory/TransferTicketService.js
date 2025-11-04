import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createTransferTicket = async (request, token) => {
  const response = await axios.post(`${BASE_URL}/transfer-ticket`, request, axiosAuth(token));
  return response.data;
};

export const getTransferTicketById = async (ticketId, token) => {
  const response = await axios.get(`${BASE_URL}/transfer-ticket/${ticketId}`, axiosAuth(token));
  return response.data;
};

export const getAllTransferTicketsInCompany = async (companyId, token) => {
  const response = await axios.get(`${BASE_URL}/transfer-ticket/company/${companyId}`, axiosAuth(token));
  return response.data;
};

export const updateTransferTicket = async (ticketId, request, token) => {
  const response = await axios.put(`${BASE_URL}/transfer-ticket/${ticketId}`, request, axiosAuth(token));
  return response.data;
};
