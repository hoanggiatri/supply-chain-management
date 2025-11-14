import React from "react";
import { Input, Grid, Typography } from "@mui/material";
import useExcelUpload from "@/hooks/useExcelUpload";

const ExcelUpload = ({ onDataLoaded }) => {
  const { excelData, handleExcelUpload } = useExcelUpload();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => handleExcelUpload(e, onDataLoaded)}
          inputProps={{ accept: ".xlsx, .xls" }}
        />
      </Grid>
      {excelData.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="h6">Dữ liệu từ file Excel:</Typography>
          <ul>
            {excelData.map((item, index) => (
              <li key={index}>{item.itemName}</li>
            ))}
          </ul>
        </Grid>
      )}
    </Grid>
  );
};

export default ExcelUpload;
