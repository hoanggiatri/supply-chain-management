import React from 'react';
import { Card } from '@mui/material';

const AnimatedCard = ({ children, sx, elevation = 2, ...props }) => {
  return (
    <Card
      {...props}
      elevation={elevation}
      sx={{
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
        ...sx,
      }}
    >
      {children}
    </Card>
  );
};

export default AnimatedCard;
