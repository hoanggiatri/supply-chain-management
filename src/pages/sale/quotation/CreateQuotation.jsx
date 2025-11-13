import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getRfqById, updateRfqStatus } from "@/services/purchasing/RfqService";
import { createQuotation } from "@/services/sale/QuotationService";
import QuotationForm from "@/components/sale/QuotationForm";
import QuotationDetailTable from "@/components/sale/QuotationDetailTable";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";

const CreateQuotation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = parseInt(localStorage.getItem("companyId"));
  const employeeName = localStorage.getItem("employeeName");
  const { rfqId } = useParams();

  const [rfq, setRfq] = useState(null);
  const [quotation, setQuotation] = useState({
    companyId,
    requestCompanyId: "",
    rfqId,
    taxRate: 0,
    subTotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    createdBy: employeeName,
    status: "Đã báo giá",
  });
  const [quotationDetails, setQuotationDetails] = useState([]);

  useEffect(() => {
    const fetchRfq = async () => {
      try {
        console.log("rfqId:", rfqId);
        const data = await getRfqById(rfqId, token);
        setRfq(data);
        const details = data.rfqDetails.map((d) => ({
          itemId: d.supplierItemId,
          itemCode: d.supplierItemCode,
          itemName: d.supplierItemName,
          discount: 0,
          quantity: d.quantity,
          note: d.note,
          customerItemId: d.itemId,
          itemPrice: d.supplierItemPrice,
        }));
        setQuotationDetails(details);
      } catch (e) {
        toastrService.error(e.response?.data?.message || "Lỗi khi tải RFQ!");
      }
    };
    fetchRfq();
  }, [rfqId, token]);

  useEffect(() => {
    const subTotal = quotationDetails.reduce(
      (sum, d) => sum + (d.itemPrice * d.quantity - d.discount || 0),
      0
    );
    const taxAmount = (subTotal * quotation.taxRate) / 100;
    const totalAmount = subTotal + taxAmount;
    setQuotation((prev) => ({ ...prev, subTotal, taxAmount, totalAmount }));
  }, [quotation.taxRate, quotationDetails]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let newValue = value;
    if (type === "number") {
      const num = parseFloat(value);
      if (isNaN(num)) {
        newValue = "";
      } else {
        newValue = num < 0 ? 0 : num;
      }
    }

    setQuotation((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async () => {
    try {
      const request = {
        ...quotation,
        requestCompanyId: rfq.companyId,
        quotationDetails: quotationDetails.map((d) => ({
          itemId: d.itemId,
          discount: d.discount,
          quantity: d.quantity,
          itemPrice: d.itemPrice,
          note: d.note,
          customerItemId: d.customerItemId,
        })),
      };
      await createQuotation(request, token);

      await updateRfqStatus(rfqId, "Đã báo giá", token);

      toastrService.success("Gửi báo giá thành công!");
      navigate("/supplier-rfqs");
    } catch (e) {
      console.error(e);
      toastrService.error(e.response?.data?.message || "Lỗi khi gửi báo giá!");
    }
  };

  if (!rfq) return <LoadingPaper title="TẠO BÁO GIÁ" />;

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          TẠO BÁO GIÁ
        </Typography>

        <QuotationForm rfq={rfq} quotation={quotation} />

        <Typography variant="h5" mt={3} mb={2}>
          DANH SÁCH HÀNG HÓA BÁO GIÁ:
        </Typography>

        <QuotationDetailTable
          quotationDetails={quotationDetails}
          setQuotationDetails={setQuotationDetails}
        />

        <Grid container justifyContent="flex-end" mt={2}>
          <Grid item>
            {[
              {
                label: "Tổng tiền hàng (VNĐ):",
                value: quotation.subTotal.toLocaleString(),
                isInput: false,
              },
              { label: "Thuế (%):", value: quotation.taxRate, isInput: true },
              {
                label: "Tiền thuế (VNĐ):",
                value: quotation.taxAmount.toLocaleString(),
                isInput: false,
              },
              {
                label: "Tổng cộng (VNĐ):",
                value: quotation.totalAmount.toLocaleString(),
                isInput: false,
              },
            ].map((item, index) => (
              <Grid
                container
                key={index}
                justifyContent="space-between"
                spacing={2}
              >
                <Grid item mb={3}>
                  <Typography fontWeight="bold">{item.label}</Typography>
                </Grid>
                <Grid item>
                  {item.isInput ? (
                    <TextField
                      type="number"
                      name="taxRate"
                      value={quotation.taxRate}
                      onChange={handleChange}
                      size="small"
                      inputProps={{ min: 0, step: "any" }}
                      sx={{ width: 100 }}
                    />
                  ) : (
                    <Typography fontWeight="bold" align="right">
                      {item.value}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={1} justifyContent="flex-end">
          <Grid item>
            <Button variant="contained" color="default" onClick={handleSubmit}>
              Gửi báo giá
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="default"
              onClick={() => navigate(-1)}
            >
              Hủy
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CreateQuotation;
