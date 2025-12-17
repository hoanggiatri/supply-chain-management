import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";

export const getInvoicePdf = async (soId, token) => {
  const response = await axios.post(`${BASE_URL}/invoices/sales-orders/${soId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.data && response.data.file) {
    const base64Data = response.data.file;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }
};
