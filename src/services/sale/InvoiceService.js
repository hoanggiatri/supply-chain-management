import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";

export const getInvoicePdf = async (soId, token) => {
  const response = await axios.get(
    `${BASE_URL}/invoices/sales-orders/${soId}`,
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  window.open(url);
};
