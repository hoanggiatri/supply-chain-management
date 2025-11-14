import React from "react";
import { Grid, TextField } from "@mui/material";

const PlantForm = ({ plant, onChange, errors, readOnlyFields }) => {
  const isFieldReadOnly = (field) => readOnlyFields[field] ?? false;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Mã xưởng" name="plantCode" value={plant.plantCode} required 
        onChange={onChange} error={!!errors.plantCode} helperText={errors.plantCode} 
        InputProps={{ readOnly: isFieldReadOnly("plantCode") }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Tên xưởng" name="plantName" value={plant.plantName} required 
        onChange={onChange} error={!!errors.plantName} helperText={errors.plantName} 
        InputProps={{ readOnly: isFieldReadOnly("plantName") }} />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth multiline rows={3} label="Mô tả" name="description" value={plant.description} 
        onChange={onChange} error={!!errors.description} helperText={errors.description} 
        InputProps={{ readOnly: isFieldReadOnly("description") }} />
      </Grid>
    </Grid>
  );
};

export default PlantForm;
