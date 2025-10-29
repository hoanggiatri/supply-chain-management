import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { createRfq } from "@/services/purchasing/RfqService";
import RfqForm from "@/components/purchasing/RfqForm";
import RfqDetailTable from "@/components/purchasing/RfqDetailTable";
import dayjs from "dayjs";
import { getCompanyById } from "@/services/general/CompanyService";

const CreateRfq = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = parseInt(localStorage.getItem("companyId"));
  const employeeName = localStorage.getItem("employeeName");
  const location = useLocation();

  const [details, setDetails] = useState([]);
  const [errors, setErrors] = useState({ rfqDetailErrors: [] });
  const [readOnlyFields, setReadOnlyFields] = useState({ rfqCode: true, status: true });

  const [rfq, setRfq] = useState({
    companyId: companyId,
    requestedCompanyId: "",
    needByDate: "",
    createdBy: employeeName,
    status: "Chưa báo giá",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplierIdFromState = Number(location.state?.supplierId);
        if (supplierIdFromState) {
          const companyData = await getCompanyById(supplierIdFromState, token);
          setReadOnlyFields(prev => ({ ...prev, requestedCompanyId: true }));

          setRfq(prev => ({
            ...prev,
            requestedCompanyId: companyData.companyId,
            requestedCompanyCode: companyData.companyCode,
            requestedCompanyName: companyData.companyName,
          }));
        }
      } catch (error) {
        alert(error.response?.data?.message || "Có lỗi khi tải dữ liệu!");
      }
    };
    fetchData();
  }, [location.state, token]);

  const toLocalDateTimeString = (localDateTimeString) => {
    if (!localDateTimeString) return null;
    return dayjs(localDateTimeString).format("YYYY-MM-DDTHH:mm:ss");
  };

  const validateForm = () => {
    const formErrors = {};
    if (!rfq.requestedCompanyId) formErrors.requestedCompanyId = "Chưa chọn công ty cung cấp";
    if (!rfq.needByDate) formErrors.needByDate = "Chưa chọn hạn báo giá";
    return formErrors;
  };

  const validateDetails = () => {
    const detailErrors = [];

    details.forEach((detail, index) => {
      if (!detail.itemId) {
        detailErrors.push({ index, field: "itemId", message: "Phải chọn hàng hóa" });
      }
      if (!detail.supplierItemId) {
        detailErrors.push({ index, field: "supplierItemId", message: "Phải chọn hàng hóa NCC" });
      }
      if (detail.quantity <= 0) {
        detailErrors.push({ index, field: "quantity", message: "> 0" });
      }
    });

    return detailErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRfq(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    const rfqDetailErrors = validateDetails();

    if (Object.keys(formErrors).length > 0 || rfqDetailErrors.length > 0) {
      setErrors({ ...formErrors, rfqDetailErrors });
      return;
    }

    try {
      const request = {
        ...rfq,
        needByDate: toLocalDateTimeString(rfq.needByDate),
        requestedCompanyId: rfq.requestedCompanyId,
        rfqDetails: details.map(detail => ({
          itemId: detail.itemId,
          quantity: detail.quantity,
          note: detail.note,
          supplierItemId: detail.supplierItemId,
        })),
      };

      console.log("Create RFQ request", request);
      await createRfq(request, token);
      alert("Tạo RFQ thành công!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Lỗi khi tạo RFQ!");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          TẠO YÊU CẦU BÁO GIÁ (RFQ)
        </Typography>

        <RfqForm
          rfq={rfq}
          onChange={handleChange}
          setRfq={setRfq}
          errors={errors}
          readOnlyFields={readOnlyFields}
        />

        <Typography variant="h5" mt={3} mb={3}>
          DANH SÁCH HÀNG HÓA YÊU CẦU BÁO GIÁ:
        </Typography>

        <RfqDetailTable
          rfqDetails={details}
          setRfqDetails={setDetails}
          requestedCompanyId={rfq.requestedCompanyId}
          errors={errors.rfqDetailErrors}
        />

        <Grid container spacing={2} mt={3} justifyContent="flex-end">
          <Grid item>
            <Button variant="contained" color="default" onClick={handleSubmit}>
              Gửi yêu cầu
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="default" onClick={handleCancel}>
              Hủy
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CreateRfq;
