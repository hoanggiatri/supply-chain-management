import axios from "axios";

const BASE_URL = "http://localhost:8080";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createReceiveTicket = async (request, token) => {
  const response = await axios.post(`${BASE_URL}/user/create-receive-ticket`, request, axiosAuth(token));
  return response.data;
};

export const getReceiveTicketById = async (ticketId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-receive-ticket/${ticketId}`, axiosAuth(token));
  return response.data;
};

export const getAllReceiveTicketsInCompany = async (companyId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-all-receive-ticket-in-com/${companyId}`, axiosAuth(token));
  return response.data;
};

export const updateReceiveTicket = async (ticketId, request, token) => {
  const response = await axios.put(`${BASE_URL}/user/update-receive-ticket/${ticketId}`, request, axiosAuth(token));
  return response.data;
};

export const getReceiveReport = async (request, companyId, token) => {
  const response = await axios.post(`${BASE_URL}/user/receive-report/${companyId}`, request, axiosAuth(token));
  return response.data;
};

export const getMonthlyReceiveReport = async (companyId, receiveType, warehouseId, token) => {
  const response = await axios.get(`${BASE_URL}/user/monthly-receive-report/${companyId}`, {
    params: {
      receiveType,
      warehouseId,
    },
    ...axiosAuth(token),
  });
  return response.data;
};