import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import SelectAutocomplete from "@components/content-components/SelectAutocomplete";
import { getAllItemsInCompany } from "@/services/general/ItemService";

const RfqDetailTable = ({
  rfqDetails,
  setRfqDetails,
  requestedCompanyId,
  errors,
}) => {
  const [myItems, setMyItems] = useState([]);
  const [supplierItems, setSupplierItems] = useState([]);
  const companyId = localStorage.getItem("companyId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const data = await getAllItemsInCompany(companyId, token);
        console.log("data", data);
        setMyItems(data);
      } catch (err) {
        alert("Lỗi khi tải danh sách hàng hóa công ty mình.");
      }
    };
    fetchMyItems();
  }, [companyId, token]);

  useEffect(() => {
    const fetchSupplierItems = async () => {
      if (!requestedCompanyId) return setSupplierItems([]);
      try {
        const data = await getAllItemsInCompany(requestedCompanyId, token);
        const sellableItems = data.filter((item) => item.isSellable);
        setSupplierItems(sellableItems);
      } catch (err) {
        alert("Lỗi khi tải danh sách hàng hóa của công ty cung cấp.");
      }
    };
    fetchSupplierItems();
  }, [requestedCompanyId, token]);

  const handleDetailChange = (index, field, value, type) => {
    let newValue = value;
    if (type === "number") {
      const num = parseFloat(value);
      newValue = isNaN(num) ? "" : Math.max(num, 0);
    }
    setRfqDetails((prev) =>
      prev.map((detail, i) =>
        i === index ? { ...detail, [field]: newValue } : detail
      )
    );
  };

  const handleAddRow = () => {
    setRfqDetails((prev) => [
      ...prev,
      {
        itemId: "",
        itemName: "",
        quantity: 0,
        note: "",
        supplierItemId: "",
        supplierItemName: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    setRfqDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const itemOptions = myItems.map((item) => ({
    value: item.itemId,
    label: item.itemCode + " - " + item.itemName,
  }));

  const supplierItemOptions = supplierItems.map((item) => ({
    value: item.itemId,
    label: item.itemCode + " - " + item.itemName,
  }));

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã hàng hóa</TableCell>
              <TableCell>Mã hàng hóa NCC</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rfqDetails.map((detail, index) => (
              <TableRow key={index}>
                <TableCell sx={{ width: 400 }}>
                  <SelectAutocomplete
                    options={itemOptions}
                    value={detail.itemId}
                    onChange={(selected) => {
                      handleDetailChange(
                        index,
                        "itemId",
                        selected?.value || ""
                      );
                    }}
                    placeholder="Chọn hàng hóa"
                    error={
                      !!errors?.find(
                        (err) => err.index === index && err.field === "itemId"
                      )
                    }
                    helperText={
                      errors?.find(
                        (err) => err.index === index && err.field === "itemId"
                      )?.message
                    }
                  />
                </TableCell>
                <TableCell sx={{ width: 400 }}>
                  <SelectAutocomplete
                    options={supplierItemOptions}
                    value={detail.supplierItemId}
                    onChange={(selected) => {
                      handleDetailChange(
                        index,
                        "supplierItemId",
                        selected?.value || ""
                      );
                    }}
                    placeholder="Chọn hàng hóa NCC"
                    error={
                      !!errors?.find(
                        (err) =>
                          err.index === index && err.field === "supplierItemId"
                      )
                    }
                    helperText={
                      errors?.find(
                        (err) =>
                          err.index === index && err.field === "supplierItemId"
                      )?.message
                    }
                    disabled={!requestedCompanyId}
                  />
                </TableCell>
                <TableCell sx={{ width: 100 }}>
                  <TextField
                    type="number"
                    size="small"
                    value={detail.quantity}
                    onChange={(e) =>
                      handleDetailChange(
                        index,
                        "quantity",
                        e.target.value,
                        "number"
                      )
                    }
                    error={
                      !!errors?.find(
                        (err) => err.index === index && err.field === "quantity"
                      )
                    }
                    helperText={
                      errors?.find(
                        (err) => err.index === index && err.field === "quantity"
                      )?.message
                    }
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={detail.note}
                    onChange={(e) =>
                      handleDetailChange(index, "note", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteRow(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button color="default" sx={{ m: 0.5 }} onClick={handleAddRow}>
        Thêm hàng
      </Button>
    </>
  );
};

export default RfqDetailTable;
