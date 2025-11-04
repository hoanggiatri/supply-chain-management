import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createReceiveTicket = async (request, token) => {
  const response = await axios.post(`${BASE_URL}/receive-ticket`, request, axiosAuth(token));
  return response.data;
};

export const getReceiveTicketById = async (ticketId, token) => {
  const response = await axios.get(`${BASE_URL}/receive-ticket/${ticketId}`, axiosAuth(token));
  return response.data;
};

export const getAllReceiveTicketsInCompany = async (companyId, token) => {
  const response = await axios.get(`${BASE_URL}/receive-ticket/company/${companyId}`, axiosAuth(token));
  return response.data;
};

export const updateReceiveTicket = async (ticketId, request, token) => {
  const response = await axios.put(`${BASE_URL}/receive-ticket/${ticketId}`, request, axiosAuth(token));
  return response.data;
};

export const getReceiveReport = async (request, companyId, token) => {
  const response = await axios.post(`${BASE_URL}/receive-ticket/report/${companyId}`, request, axiosAuth(token));
  return response.data;
};

export const getMonthlyReceiveReport = async (companyId, receiveType, warehouseId, token) => {
  const response = await axios.get(`${BASE_URL}/receive-ticket/monthly-report/${companyId}`, {
    params: {
      receiveType,
      warehouseId,
    },
    ...axiosAuth(token),
  });
  return response.data;
};