import FormPageLayout from "@/components/layout/FormPageLayout";
import BomDetailTable from "@/components/manufacturing/BomDetailTable";
import BomForm from "@/components/manufacturing/BomForm";
import { Button } from "@/components/ui/button";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { createBom } from "@/services/manufacturing/BomService";
import toastrService from "@/services/toastrService";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateBom = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  const [errors, setErrors] = useState({ bomDetailErrors: [] });
  const [bomDetails, setBomDetails] = useState([]);
  const [items, setItems] = useState([]);

  const [bom, setBom] = useState({
    companyId,
    bomCode: "",
    itemId: "",
    itemCode: "",
    itemName: "",
    description: "",
    status: "Đang sử dụng",
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItemsInCompany(companyId, token);
        setItems(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy danh sách hàng hóa!"
        );
      }
    };
    fetchItems();
  }, [companyId, token]);

  const validateForm = () => {
    const formErrors = {};
    if (!bom.itemCode) formErrors.itemCode = "Phải chọn hàng hóa";
    if (!bom.itemName) formErrors.itemName = "Chưa có tên hàng hóa";
    return formErrors;
  };

  const validateBomDetails = () => {
    const tableErrors = [];

    bomDetails.forEach((detail, index) => {
      if (!detail.itemId) {
        tableErrors.push({
          index,
          field: "itemId",
          message: "Phải chọn nguyên vật liệu",
        });
      }
      if (detail.quantity < 0) {
        tableErrors.push({ index, field: "quantity", message: ">= 0" });
      }
    });

    return tableErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBom((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    const bomDetailErrors = validateBomDetails();

    if (
      Object.keys(validationErrors).length > 0 ||
      bomDetailErrors.length > 0
    ) {
      setErrors({ ...validationErrors, bomDetailErrors });
      return;
    }

    try {
      const request = {
        itemId: bom.itemId,
        description: bom.description,
        status: bom.status,
        bomDetails: bomDetails.map((detail) => ({
          itemId: detail.itemId,
          quantity: detail.quantity,
          note: detail.note,
        })),
      };

      await createBom(request, token);
      toastrService.success("Tạo BOM thành công!");
      navigate("/boms");
    } catch (error) {
      toastrService.error(error.response?.data?.message || "Lỗi khi tạo BOM!");
    }
  };

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách BOM", path: "/boms" },
        { label: "Thêm mới" },
      ]}
      backLink="/boms"
      backLabel="Quay lại danh sách"
    >
      <BomForm
        bom={bom}
        onChange={handleChange}
        errors={errors}
        readOnlyFields={{ bomCode: true, status: true }}
        setBom={setBom}
        mode="create"
      />

      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
        Danh sách nguyên vật liệu
      </h2>

      <BomDetailTable
        bomDetails={bomDetails}
        setBomDetails={setBomDetails}
        items={items}
        errors={errors.bomDetailErrors}
      />

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/boms")}
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
          Thêm
        </Button>
      </div>
    </FormPageLayout>
  );
};

export default CreateBom;
