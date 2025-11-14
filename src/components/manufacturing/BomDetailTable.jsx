import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, IconButton, Button } from "@mui/material";
import { Delete } from "@mui/icons-material";
import SelectAutocomplete from "@components/content-components/SelectAutocomplete";

const BomDetailTable = ({ bomDetails, setBomDetails, items, errors }) => {
  const handleDetailChange = (index, field, value, type) => {
    let newValue = value;

    if (type === "number") {
      const num = parseFloat(value);
      if (isNaN(num)) {
        newValue = "";
      } else {
        newValue = num < 0 ? 0 : num;
      }
    }
  
    setBomDetails(prev =>
      prev.map((detail, i) =>
        i === index ? { ...detail, [field]: newValue } : detail
      )
    );
  };

  const handleAddRow = () => {
    setBomDetails(prev => [...prev, { itemId: "", itemName: "", quantity: 0, note: "" }]);
  };

  const handleDeleteRow = (index) => {
    setBomDetails(prev => prev.filter((_, i) => i !== index));
  };

  const materialOptions = items
    .filter(item => item.itemType === "Nguyên vật liệu" || item.itemType === "Bán thành phẩm")
    .map(item => ({ value: item.itemId, label: item.itemCode + " - " + item.itemName }));

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã nguyên vật liệu</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {bomDetails.map((bomDetail, index) => (
              <TableRow key={index}>
                <TableCell sx={{ width: 400 }}>
                  <SelectAutocomplete
                    options={materialOptions}
                    value={bomDetail.itemId}
                    onChange={(selected) => {
                      handleDetailChange(index, "itemId", selected?.value || "");
                    }}
                    placeholder="Chọn nguyên vật liệu"
                    error={!!errors?.find(err => err.index === index && err.field === "itemId")}
                    helperText={errors?.find(err => err.index === index && err.field === "itemId")?.message}
                  />
                </TableCell>
                <TableCell sx={{ width: 100 }}>
                  <TextField
                    type="number"
                    size="small"
                    value={bomDetail.quantity}
                    onChange={(e) => handleDetailChange(index, "quantity", e.target.value, "number")}
                    error={!!errors?.find(err => err.index === index && err.field === "quantity")}
                    helperText={errors?.find(err => err.index === index && err.field === "quantity")?.message}
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={bomDetail.note}
                    onChange={(e) => handleDetailChange(index, "note", e.target.value)}
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

export default BomDetailTable;
