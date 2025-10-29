import React, { useEffect, useState } from "react";
import { Grid, TextField, MenuItem } from "@mui/material";
import { getAllPlantsInCompany } from "@/services/general/ManufacturePlantService";

const LineForm = ({ line, onChange, errors = {}, readOnlyFields = {} }) => {
  const [plants, setPlants] = useState([]);
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const isFieldReadOnly = (field) => readOnlyFields[field] ?? false;

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const data = await getAllPlantsInCompany(companyId, token);
        setPlants(data);
      } catch (error) {
        alert(error.response?.data?.message || "Có lỗi khi lấy danh sách xưởng sản xuất!");
      }
    };
    fetchPlants();
  }, [companyId, token]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField select fullWidth label="Xưởng sản xuất" name="plantId" value={line.plantId} onChange={onChange}
          error={!!errors.plantId} helperText={errors.plantId} required
          InputProps={{ readOnly: isFieldReadOnly("plantId") }}
        >
          {plants.map((plant) => (
            <MenuItem key={plant.plantId} value={plant.plantId}>
              {plant.plantCode} - {plant.plantName}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Mã dây chuyền" name="lineCode" value={line.lineCode} onChange={onChange}
          error={!!errors.lineCode} helperText={errors.lineCode} required
          InputProps={{ readOnly: isFieldReadOnly("lineCode") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Tên dây chuyền" name="lineName" value={line.lineName} onChange={onChange}
          error={!!errors.lineName} helperText={errors.lineName} required
          InputProps={{ readOnly: isFieldReadOnly("lineName") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Công suất" name="capacity" type="number" value={line.capacity} onChange={onChange}
          error={!!errors.capacity} helperText={errors.capacity} required
          InputProps={{ readOnly: isFieldReadOnly("capacity") }}
          inputProps={{ min: 0 }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField fullWidth label="Mô tả" name="description" value={line.description} onChange={onChange} multiline
          rows={3} InputProps={{ readOnly: isFieldReadOnly("description") }}
        />
      </Grid>
    </Grid>
  );
};

export default LineForm;
