import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getCompanyById = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/company/${companyId}`, axiosAuth(token));
  return res.data;
};

export const getAllCompanies = async (token, { page = 1, pageSize = 100 } = {}) => {
  const res = await axios.get(`${BASE_URL}/company`, {
    ...axiosAuth(token),
    params: { page, pageSize },
  });
  return res.data;
};

export const updateCompany = async (companyId, data, token) => {
  return await axios.put(`${BASE_URL}/admin/company/${companyId}`, data, axiosAuth(token));
};

export const updateCompanyLogo = async (companyId, file, token) => {
  const formData = new FormData();
  formData.append("logo", file);
  const res = await axios.post(`${BASE_URL}/admin/company/${companyId}/logo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const monthlyCompanyReport = async (token) => {
  const res = await axios.get(`${BASE_URL}/admin/company/monthly-report`, axiosAuth(token));
  return res.data;
}

