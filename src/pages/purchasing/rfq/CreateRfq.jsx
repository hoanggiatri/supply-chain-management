import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { useNavigate, useLocation } from "react-router-dom";
import { createRfq } from "@/services/purchasing/RfqService";
import RfqForm from "@/components/purchasing/RfqForm";
import RfqDetailTable from "@/components/purchasing/RfqDetailTable";
import dayjs from "dayjs";
import { getCompanyById } from "@/services/general/CompanyService";
import toastrService from "@/services/toastrService";

const CreateRfq = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = parseInt(localStorage.getItem("companyId"));
  const employeeName = localStorage.getItem("employeeName");
  const location = useLocation();

  const [details, setDetails] = useState([]);
  const [errors, setErrors] = useState({ rfqDetailErrors: [] });
  const [readOnlyFields, setReadOnlyFields] = useState({
    rfqCode: true,
    status: true,
  });

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
          setReadOnlyFields((prev) => ({ ...prev, requestedCompanyId: true }));

          setRfq((prev) => ({
            ...prev,
            requestedCompanyId: companyData.companyId || companyData.id,
            requestedCompanyCode: companyData.companyCode,
            requestedCompanyName: companyData.companyName,
          }));
        }
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi tải dữ liệu!"
        );
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
    if (!rfq.requestedCompanyId)
      formErrors.requestedCompanyId = "Chưa chọn công ty cung cấp";
    if (!rfq.needByDate) formErrors.needByDate = "Chưa chọn hạn báo giá";
    return formErrors;
  };

  const validateDetails = () => {
    const detailErrors = [];

    details.forEach((detail, index) => {
      if (!detail.itemId) {
        detailErrors.push({
          index,
          field: "itemId",
          message: "Phải chọn hàng hóa",
        });
      }
      if (!detail.supplierItemId) {
        detailErrors.push({
          index,
          field: "supplierItemId",
          message: "Phải chọn hàng hóa NCC",
        });
      }
      if (detail.quantity <= 0) {
        detailErrors.push({ index, field: "quantity", message: "> 0" });
      }
    });

    return detailErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRfq((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    const rfqDetailErrors = validateDetails();

    if (Object.keys(formErrors).length > 0 || rfqDetailErrors.length > 0) {
      setErrors({ ...formErrors, rfqDetailErrors });
      return;
    }

    try {
      // Only send allowed fields, exclude read-only and computed fields
      const request = {
        companyId: Number(rfq.companyId),
        requestedCompanyId: Number(rfq.requestedCompanyId),
        needByDate: toLocalDateTimeString(rfq.needByDate),
        createdBy: rfq.createdBy,
        status: rfq.status,
        rfqDetails: details.map((detail) => ({
          itemId: Number(detail.itemId),
          quantity: parseFloat(detail.quantity),
          note: detail.note || "",
          supplierItemId: Number(detail.supplierItemId),
        })),
      };

      await createRfq(request, token);
      toastrService.success("Tạo RFQ thành công!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      toastrService.error(error.response?.data?.message || "Lỗi khi tạo RFQ!");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <Card className="shadow-lg">
        <CardBody>
          <Typography
            variant="h4"
            color="blue-gray"
            className="mb-6 font-bold uppercase"
          >
            TẠO YÊU CẦU BÁO GIÁ (RFQ)
          </Typography>

          <RfqForm
            rfq={rfq}
            onChange={handleChange}
            setRfq={setRfq}
            errors={errors}
            readOnlyFields={readOnlyFields}
          />

          <Typography
            variant="h5"
            color="blue-gray"
            className="mt-8 mb-4 font-semibold"
          >
            DANH SÁCH HÀNG HÓA YÊU CẦU BÁO GIÁ
          </Typography>

          <RfqDetailTable
            rfqDetails={details}
            setRfqDetails={setDetails}
            requestedCompanyId={rfq.requestedCompanyId}
            errors={errors.rfqDetailErrors}
          />

          <div className="mt-8 flex justify-end gap-3">
            <Button color="blue" onClick={handleSubmit}>
              Gửi yêu cầu
            </Button>
            <Button variant="outlined" color="blue-gray" onClick={handleCancel}>
              Hủy
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateRfq;
