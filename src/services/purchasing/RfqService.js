import axios from "axios";

const BASE_URL = "http://localhost:8080";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createRfq = async (rfqRequest, token) => {
  const res = await axios.post(`${BASE_URL}/user/create-rfq`, rfqRequest, axiosAuth(token));
  return res.data;
};

export const getAllRfqsInCompany = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-all-rfq-in-com/${companyId}`, axiosAuth(token));
  return res.data;
};

export const getAllRfqsInRequestedCompany = async (requestedCompanyId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-all-rfq-in-requested-company/${requestedCompanyId}`, axiosAuth(token));
  return res.data;
};

export const getRfqById = async (rfqId, token) => {
  const res = await axios.get(`${BASE_URL}/user/get-rfq-by-id/${rfqId}`, axiosAuth(token));
  return res.data;
};

export const updateRfqStatus = async (rfqId, status, token) => {
  const res = await axios.put(`${BASE_URL}/user/update-rfq-status/${rfqId}?status=${status}`, {}, axiosAuth(token));
  return res.data;
};
