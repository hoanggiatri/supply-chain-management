import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createIssueTicket = async (request, token) => {
  const response = await axios.post(`${BASE_URL}/issue-ticket`, request, axiosAuth(token));
  return response.data;
};

export const getAllIssueTicketsInCompany = async (companyId, token) => {
  const response = await axios.get(`${BASE_URL}/issue-ticket/company/${companyId}`, axiosAuth(token));
  return response.data;
};

export const getIssueTicketById = async (ticketId, token) => {
  const response = await axios.get(`${BASE_URL}/issue-ticket/${ticketId}`, axiosAuth(token));
  return response.data;
};

export const updateIssueTicketStatus = async (ticketId, request, token) => {
  const response = await axios.put(`${BASE_URL}/issue-ticket/${ticketId}`, request, axiosAuth(token));
  return response.data;
};

export const getIssueReport = async (request, companyId, token) => {
  const response = await axios.post(`${BASE_URL}/issue-ticket/report/${companyId}`, request, axiosAuth(token));
  return response.data;
};

export const getMonthlyIssueReport = async (companyId, issueType, warehouseId, token) => {
  const response = await axios.get(`${BASE_URL}/issue-ticket/monthly-report/${companyId}`, {
    params: {
      issueType,
      warehouseId,
    },
    ...axiosAuth(token),
  });
  return response.data;
};

export const getIssueForecast = async (companyId, issueType, warehouseId, token) => {
  const response = await axios.get(`${BASE_URL}/issue-ticket/forecast/${companyId}`, {
    params: {
      issueType,
      warehouseId,
    },
    ...axiosAuth(token),
  });
  return response.data;
};
