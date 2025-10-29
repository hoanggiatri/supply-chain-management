import React from 'react'; 
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

const SelectInput = ({ label, name, value, onChange, options, error, ...props }) => ( 
  <FormControl fullWidth error={!!error}> 
    <InputLabel>{label}</InputLabel> 
    <Select name={name} value={value} onChange={onChange} {...props}> 
      {options.map((option) => ( 
        <MenuItem key={option.value} value={option.value}> 
          {option.label} 
        </MenuItem> 
      ))} 
    </Select> 
    {error && <FormHelperText>{error}</FormHelperText>} 
  </FormControl> 
);

export default SelectInput;
