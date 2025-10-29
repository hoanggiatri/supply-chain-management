import React from 'react'; 
import { TextField } from '@mui/material';

const TextFieldInput = ({ label, name, value, onChange, error, ...props }) => ( 
  <TextField fullWidth label={label} name={name} value={value} onChange={onChange} error={!!error} helperText={error} {...props} /> 
);

export default TextFieldInput;
