import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, IconButton, Button } from "@mui/material";
import { Delete } from "@mui/icons-material";

const StageDetailTable = ({ stageDetails, setStageDetails, errors }) => {
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
  
    setStageDetails(prev =>
      prev.map((detail, i) =>
        i === index ? { ...detail, [field]: newValue } : detail
      )
    );
  };

  const handleAddRow = () => {
    setStageDetails(prev => [
      ...prev,
      {
        stageName: "",
        stageOrder: prev.length + 1,
        estimatedTime: 0,
        description: ""
      }
    ]);
  };

  const handleDeleteRow = (index) => {
    const updated = stageDetails.filter((_, i) => i !== index)
      .map((detail, i) => ({ ...detail, stageOrder: i + 1 })); // update lại stageOrder sau khi xóa
    setStageDetails(updated);
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Thứ tự</TableCell>
              <TableCell>Tên công đoạn</TableCell>
              <TableCell>Thời gian dự kiến (phút)</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {stageDetails.map((detail, index) => (
              <TableRow key={index}>
                <TableCell>{detail.stageOrder}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={detail.stageName}
                    onChange={(e) => handleDetailChange(index, "stageName", e.target.value)}
                    error={!!errors?.find(err => err.index === index && err.field === "stageName")}
                    helperText={errors?.find(err => err.index === index && err.field === "stageName")?.message}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    value={detail.estimatedTime}
                    inputProps={{ min: 0 }}
                    onChange={(e) => handleDetailChange(index, "estimatedTime", e.target.value, "number")}
                    error={!!errors?.find(err => err.index === index && err.field === "estimatedTime")}
                    helperText={errors?.find(err => err.index === index && err.field === "estimatedTime")?.message}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={detail.description}
                    onChange={(e) => handleDetailChange(index, "description", e.target.value)}
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
        Thêm công đoạn
      </Button>
    </>
  );
};

export default StageDetailTable;
