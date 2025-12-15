import LoadingPaper from "@/components/content-components/LoadingPaper";
import FormPageLayout from "@/components/layout/FormPageLayout";
import BomDetailTable from "@/components/manufacturing/BomDetailTable";
import BomForm from "@/components/manufacturing/BomForm";
import { Button } from "@/components/ui/button";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { getBomByItemId, updateBom } from "@/services/manufacturing/BomService";
import toastrService from "@/services/toastrService";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditBom = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  const [bom, setBom] = useState(null);
  const [bomDetails, setBomDetails] = useState([]);
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({ bomDetailErrors: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bomData, itemData] = await Promise.all([
          getBomByItemId(itemId, token),
          getAllItemsInCompany(companyId, token),
        ]);

        setBom({
          ...bomData,
          itemId: bomData.itemId || "",
          itemCode: bomData.itemCode || "",
          itemName: bomData.itemName || "",
          description: bomData.description || "",
          status: bomData.status || "",
        });

        setBomDetails(bomData.bomDetails || []);
        setItems(itemData);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi tải dữ liệu!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [itemId, companyId, token]);

  const validateForm = () => {
    const formErrors = {};
    if (!bom.itemCode) formErrors.itemCode = "Phải chọn hàng hóa";
    if (!bom.itemName) formErrors.itemName = "Chưa có tên hàng hóa";
    if (!bom.status?.trim())
      formErrors.status = "Trạng thái không được để trống";
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

  const readOnlyFields = {
    bomCode: true,
    itemCode: true,
    itemName: true,
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

      await updateBom(bom.bomId, request, token);
      toastrService.success("Cập nhật BOM thành công!");
      navigate(-1);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi cập nhật BOM!"
      );
    }
  };

  if (loading || !bom) {
    return <LoadingPaper title="CẬP NHẬT BOM" />;
  }

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách BOM", path: "/boms" },
        { label: "Chỉnh sửa" },
      ]}
      backLink="/boms"
      backLabel="Quay lại danh sách"
    >
      <BomForm
        bom={bom}
        onChange={handleChange}
        errors={errors}
        readOnlyFields={readOnlyFields}
        setBom={setBom}
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
          Lưu
        </Button>
      </div>
    </FormPageLayout>
  );
};

export default EditBom;
