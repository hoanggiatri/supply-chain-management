import React from 'react';
import { Paper } from '@mui/material';

const ModernCard = ({ 
  children, 
  variant = 'elevated', // elevated, outlined, gradient, glass
  hover = true,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          backdropFilter: 'blur(10px)',
        };
      case 'glass':
        return {
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        };
      case 'outlined':
        return {
          bgcolor: 'background.paper',
          border: '2px solid',
          borderColor: 'divider',
        };
      default: // elevated
        return {
          bgcolor: 'background.paper',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        };
    }
  };

  return (
    <Paper
      elevation={0}
      {...props}
      sx={{
        ...getVariantStyles(),
        borderRadius: 3,
        p: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ...(hover && {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
          },
        }),
        ...props.sx,
      }}
    >
      {children}
    </Paper>
  );
};

export default ModernCard;
