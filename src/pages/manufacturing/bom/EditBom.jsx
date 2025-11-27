import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { getBomByItemId, updateBom } from "@/services/manufacturing/BomService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import BomForm from "@/components/manufacturing/BomForm";
import BomDetailTable from "@/components/manufacturing/BomDetailTable";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";
import BackButton from "@/components/common/BackButton";
import { getButtonProps } from "@/utils/buttonStyles";

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
    <div className="p-6">
      <Card className="shadow-lg max-w-6xl mx-auto">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              CẬP NHẬT BOM
            </Typography>
            <BackButton to="/boms" label="Quay lại danh sách" />
          </div>

          <BomForm
            bom={bom}
            onChange={handleChange}
            errors={errors}
            readOnlyFields={readOnlyFields}
            setBom={setBom}
          />

          <Typography variant="h5" color="blue-gray" className="mt-6 mb-4">
            DANH SÁCH NGUYÊN VẬT LIỆU
          </Typography>

          <BomDetailTable
            bomDetails={bomDetails}
            setBomDetails={setBomDetails}
            items={items}
            errors={errors.bomDetailErrors}
          />

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              {...getButtonProps("primary")}
              onClick={handleSubmit}
            >
              Lưu
            </Button>
            <Button
              type="button"
              {...getButtonProps("outlinedSecondary")}
              onClick={() => navigate("/boms")}
            >
              Hủy
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditBom;
