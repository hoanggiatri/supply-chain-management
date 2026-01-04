import FormPageLayout from "@/components/layout/FormPageLayout";
import RfqDetailTable from "@/components/purchasing/RfqDetailTable";
import RfqForm from "@/components/purchasing/RfqForm";
import { Button } from "@/components/ui/button";
import { getCompanyById } from "@/services/general/CompanyService";
import { createRfq } from "@/services/purchasing/RfqService";
import toastrService from "@/services/toastrService";
import dayjs from "dayjs";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CreateRfq = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = parseInt(localStorage.getItem("companyId"));
  const employeeName = localStorage.getItem("employeeName");
  const location = useLocation();

  const [details, setDetails] = useState([]);
  const [errors, setErrors] = useState({ rfqDetailErrors: [] });
  const [readOnlyFields, setReadOnlyFields] = useState({
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

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách yêu cầu báo giá", path: "/rfqs" },
        { label: "Tạo mới" },
      ]}
      backLink="/rfqs"
      backLabel="Quay lại danh sách"
    >
      <RfqForm
        rfq={rfq}
        onChange={handleChange}
        setRfq={setRfq}
        errors={errors}
        readOnlyFields={readOnlyFields}
      />

      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
        Danh sách hàng hóa yêu cầu báo giá
      </h2>

      <RfqDetailTable
        rfqDetails={details}
        setRfqDetails={setDetails}
        requestedCompanyId={rfq.requestedCompanyId}
        errors={errors.rfqDetailErrors}
      />

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Hủy
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={handleSubmit}
          className="gap-2 bg-blue-600 hover:bg-blue-700 min-w-[120px]"
        >
          <Save className="w-4 h-4" />
          Gửi yêu cầu
        </Button>
      </div>
    </FormPageLayout>
  );
};

export default CreateRfq;
