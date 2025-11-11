import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createQuotation = async (quotationRequest, token) => {
  const res = await axios.post(`${BASE_URL}/quotations`, quotationRequest, axiosAuth(token));
  return res.data;
};

export const getAllQuotationsInCompany = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/quotations/company/${companyId}`, axiosAuth(token));
  return res.data;
};

export const getAllQuotationsInRequestCompany = async (requestCompanyId, token) => {
  const res = await axios.get(`${BASE_URL}/quotations/request-company/${requestCompanyId}`, axiosAuth(token));
  return res.data;
};

export const getQuotationById = async (quotationId, token) => {
  const res = await axios.get(`${BASE_URL}/quotations/${quotationId}`, axiosAuth(token));
  return res.data;
};

export const getQuotationByRfq = async (rfqId, token) => {
  const res = await axios.get(`${BASE_URL}/quotations/rfq/${rfqId}`, axiosAuth(token));
  return res.data;
};

export const updateQuotationStatus = async (quotationId, status, token) => {
  const res = await axios.put(`${BASE_URL}/quotations/${quotationId}/status`, { status }, axiosAuth(token));
  return res.data;
};
