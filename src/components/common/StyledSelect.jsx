import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const StyledSelect = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  fullWidth = true,
  ...props 
}) => {
  return (
    <FormControl 
      fullWidth={fullWidth}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          transition: 'all 0.3s ease',
          bgcolor: 'background.paper',
          '& fieldset': {
            borderWidth: 2,
            borderColor: 'divider',
          },
          '&:hover fieldset': {
            borderColor: 'primary.main',
            borderWidth: 2,
          },
          '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
            borderWidth: 2,
            boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.1)',
          },
        },
        '& .MuiInputLabel-root': {
          fontWeight: 600,
          '&.Mui-focused': {
            color: 'primary.main',
            fontWeight: 700,
          },
        },
        '& .MuiSelect-select': {
          py: 1.5,
          fontSize: '0.95rem',
        },
        ...props.sx,
      }}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        {...props}
      >
        {options.map((option) => (
          <MenuItem 
            key={option.value} 
            value={option.value}
            sx={{
              fontSize: '0.95rem',
              py: 1.5,
              '&:hover': {
                bgcolor: 'primary.lighter',
              },
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'primary.main',
                },
              },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default StyledSelect;
