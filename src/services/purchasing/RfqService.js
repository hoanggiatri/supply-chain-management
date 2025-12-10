import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createRfq = async (rfqRequest, token) => {
  const res = await axios.post(`${BASE_URL}/request-for-quotations`, rfqRequest, axiosAuth(token));
  return res.data;
};

export const getAllRfqsInCompany = async (companyId, token) => {
  console.log('📥 RFQ API - Calling:', `${BASE_URL}/request-for-quotations/company/${companyId}`);
  const res = await axios.get(`${BASE_URL}/request-for-quotations/company/${companyId}`, axiosAuth(token));
  console.log('📥 RFQ API - Response:', res.data);
  return res.data;
};

export const getAllRfqsInRequestedCompany = async (requestedCompanyId, token) => {
  const res = await axios.get(`${BASE_URL}/request-for-quotations/request-company/${requestedCompanyId}`, axiosAuth(token));
  return res.data;
};

export const getRfqById = async (rfqId, token) => {
  const res = await axios.get(`${BASE_URL}/request-for-quotations/${rfqId}`, axiosAuth(token));
  return res.data;
};

export const updateRfqStatus = async (rfqId, status, token) => {
  const res = await axios.put(`${BASE_URL}/request-for-quotations/${rfqId}/status`, { status }, axiosAuth(token));
  return res.data;
};
