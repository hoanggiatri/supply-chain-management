import React from 'react';
import { TextField } from '@mui/material';

const StyledTextField = ({ variant = 'outlined', ...props }) => {
  return (
    <TextField
      variant={variant}
      {...props}
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
          '&.Mui-error fieldset': {
            borderColor: 'error.main',
          },
        },
        '& .MuiInputLabel-root': {
          fontWeight: 600,
          '&.Mui-focused': {
            color: 'primary.main',
            fontWeight: 700,
          },
        },
        '& .MuiInputBase-input': {
          fontSize: '0.95rem',
          py: 1.5,
        },
        ...props.sx,
      }}
    />
  );
};

export default StyledTextField;
