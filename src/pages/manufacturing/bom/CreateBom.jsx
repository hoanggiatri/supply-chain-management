import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createBom } from "@/services/manufacturing/BomService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import BomForm from "@/components/manufacturing/BomForm";
import BomDetailTable from "@/components/manufacturing/BomDetailTable";
import toastrService from "@/services/toastrService";

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
    status: "",
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
      console.log(request);

      await createBom(request, token);
      toastrService.success("Tạo BOM thành công!");
      navigate("/boms");
    } catch (error) {
      console.log(error.response);
      toastrService.error(error.response?.data?.message || "Lỗi khi tạo BOM!");
    }
  };

  const handleCancel = () => {
    navigate("/boms");
  };

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÊM MỚI BOM
        </Typography>

        <BomForm
          bom={bom}
          onChange={handleChange}
          errors={errors}
          readOnlyFields={{ bomCode: true }}
          setBom={setBom}
        />
        <Typography variant="h5" mt={3} mb={3}>
          DANH SÁCH NGUYÊN VẬT LIỆU:
        </Typography>

        <BomDetailTable
          bomDetails={bomDetails}
          setBomDetails={setBomDetails}
          items={items}
          errors={errors.bomDetailErrors}
        />

        <Grid container spacing={2} mt={3} justifyContent="flex-end">
          <Grid item>
            <Button variant="contained" color="default" onClick={handleSubmit}>
              Thêm
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

export default CreateBom;
