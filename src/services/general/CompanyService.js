import axios from "axios";

const BASE_URL = "http://localhost:8080";
const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getCompanyById = async (companyId, token) => {
  const res = await axios.get(`${BASE_URL}/all/get-company/${companyId}`, axiosAuth(token));
  return res.data;
};

export const getAllCompanies = async (token) => {
  const res = await axios.get(`${BASE_URL}/all/get-all-companies`, axiosAuth(token));
  return res.data;
};

export const updateCompany = async (companyId, data, token) => {
  return await axios.put(`${BASE_URL}/comsys/update-company/${companyId}`, data, axiosAuth(token));
};

export const updateCompanyLogo = async (companyId, file, token) => {
  const formData = new FormData();
  formData.append("logo", file);
  const res = await axios.put(`${BASE_URL}/comsys/update-company-logo/${companyId}`,
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
  const res = await axios.get(`${BASE_URL}/sysad/monthly-company-report`, axiosAuth(token));
  return res.data;
}

