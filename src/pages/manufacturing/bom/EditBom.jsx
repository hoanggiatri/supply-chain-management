import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getBomByItemId, updateBom } from "@/services/manufacturing/BomService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import BomForm from "@/components/manufacturing/BomForm";
import BomDetailTable from "@/components/manufacturing/BomDetailTable";
import LoadingPaper from "@/components/content-components/LoadingPaper";

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
        alert(error.response?.data?.message || "Có lỗi khi tải dữ liệu!");
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
    if (!bom.status?.trim()) formErrors.status = "Trạng thái không được để trống";
    return formErrors;
  };

  const validateBomDetails = () => {
    const tableErrors = [];

    bomDetails.forEach((detail, index) => {
      if (!detail.itemId) {
        tableErrors.push({ index, field: "itemId", message: "Phải chọn nguyên vật liệu" });
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

    if (Object.keys(validationErrors).length > 0 || bomDetailErrors.length > 0) {
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
      alert("Cập nhật BOM thành công!");
      navigate(-1);
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi cập nhật BOM!");
    }
  };

  const handleCancel = () => {
    navigate("/boms");
  };

  if (loading) {
    return <LoadingPaper title="CẬP NHẬT BOM" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">CẬP NHẬT BOM</Typography>

        <BomForm bom={bom} onChange={handleChange} errors={errors} readOnlyFields={readOnlyFields} setBom={setBom} />


        <Typography variant="h5" mt={3} mb={3}>
          DANH SÁCH NGUYÊN VẬT LIỆU:
        </Typography>
        
        <BomDetailTable bomDetails={bomDetails} setBomDetails={setBomDetails} items={items} errors={errors.bomDetailErrors} />

        <Grid container spacing={2} mt={3} justifyContent="flex-end">
          <Grid item>
            <Button variant="contained" color="default" onClick={handleSubmit}>
              Lưu
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

export default EditBom;
