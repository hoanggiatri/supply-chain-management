import React from 'react';
import { Button } from '@mui/material';

const AnimatedButton = ({ children, sx, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default AnimatedButton;
