import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";

const axiosAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getAllProducts = async (companyId, token) => {
  const res = await axios.get(
    `${BASE_URL}/product/company/${companyId}`,
    axiosAuth(token)
  );
  return res.data;
};

export const getProductById = async (productId, token) => {
  const res = await axios.get(
    `${BASE_URL}/product/${productId}`,
    axiosAuth(token)
  );
  return res.data;
};

export const scanQRCodeDetail = async (qrCode, token) => {
  const config = token ? axiosAuth(token) : {};
  const res = await axios.get(
    `${BASE_URL}/product/scan/${qrCode}`,
    config
  );
  return res.data;
};

export const downloadQRPDF = async (batchNo, token) => {
  const res = await axios.get(
    `${BASE_URL}/product/batch/${batchNo}/qr-pdf`,
    axiosAuth(token)
  );

  const base64Data = res.data;
  const binaryString = window.atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: "application/pdf" });
};


export const downloadMultipleQR = async (productIds, token) => {
  const res = await axios.post(
    `${BASE_URL}/product/multiple/qr-pdf`,
    { productIds },
    axiosAuth(token)
  );

  const base64Data = res.data;
  const binaryString = window.atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: "application/pdf" });
};
