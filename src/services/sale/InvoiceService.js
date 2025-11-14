import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";

export const getInvoicePdf = async (soId, token) => {
  const response = await axios.get(`${BASE_URL}/user/get-invoice/${soId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: "blob"
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  window.open(url);
};
