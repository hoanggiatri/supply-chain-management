import axios from "axios";

const BASE_URL = "http://localhost:8080";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createQuotation = async (quotationRequest, token) => {
  const res = await axios.post(`${BASE_URL}/user/create-quotation`, quotationRequest, axiosAuth(token));
  return res.data;
};

export const getAllQuotationsInCompany = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-all-quotations-in-com/${companyId}`, axiosAuth(token));
  return res.data;
};

export const getAllQuotationsInRequestCompany = async (requestCompanyId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-all-quotation-in-request-company/${requestCompanyId}`, axiosAuth(token));
  return res.data;
};

export const getQuotationById = async (quotationId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-quotation-by-id/${quotationId}`, axiosAuth(token));
  return res.data;
};

export const getQuotationByRfq = async (rfqId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-quotation-by-rfq/${rfqId}`, axiosAuth(token));
  return res.data;
};

export const updateQuotationStatus = async (quotationId, status, token) => {
  const res = await axios.put(`${BASE_URL}/user/update-quotation-status/${quotationId}?status=${status}`, {}, axiosAuth(token));
  return res.data;
};
