import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";

const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getAllProducts = async (companyId, params, token) => {
  const res = await axios.get(`${BASE_URL}/product/company/${companyId}`, {
    ...axiosAuth(token),
    params,
  });
  return res.data;
};

export const getProductById = async (productId, token) => {
  const res = await axios.get(
    `${BASE_URL}/product/${productId}`,
    axiosAuth(token)
  );
  return res.data;
};

export const getProductsByBatch = async (batchNo, token) => {
  const res = await axios.get(
    `${BASE_URL}/product/batch/${batchNo}`,
    axiosAuth(token)
  );
  return res.data;
};

export const scanQRCodeDetail = async (qrCode, token) => {
  const res = await axios.get(
    `${BASE_URL}/product/scan/${qrCode}`,
    axiosAuth(token)
  );
  return res.data;
};

export const downloadQRPDF = async (batchNo, token) => {
  const res = await axios.get(`${BASE_URL}/product/batch/${batchNo}/qr-pdf`, {
    ...axiosAuth(token),
    responseType: "blob",
  });
  return res.data;
};

export const downloadSingleQR = async (productId, token) => {
  const res = await axios.get(`${BASE_URL}/product/${productId}/qr-pdf`, {
    ...axiosAuth(token),
    responseType: "blob",
  });
  return res.data;
};

export const downloadMultipleQR = async (productIds, token) => {
  const res = await axios.post(
    `${BASE_URL}/product/multiple/qr-pdf`,
    { productIds },
    {
      ...axiosAuth(token),
      responseType: "blob",
    }
  );
  return res.data;
};
