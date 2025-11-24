import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';

const FormSection = ({ 
  title, 
  subtitle,
  icon,
  children, 
  variant = 'default', // default, gradient, outlined
  color = 'primary',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)`,
          border: 1,
          borderColor: 'divider',
        };
      case 'outlined':
        return {
          bgcolor: 'transparent',
          border: 2,
          borderColor: `${color}.main`,
        };
      default:
        return {
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
        };
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        ...getVariantStyles(),
        p: 3,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: variant === 'outlined' ? 4 : 2,
        },
      }}
    >
      {title && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {icon && (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: `${color}.lighter`,
                  color: `${color}.main`,
                }}
              >
                {icon}
              </Box>
            )}
            <Box>
              <Typography 
                variant="h6" 
                fontWeight={700}
                color={variant === 'outlined' ? `${color}.main` : 'text.primary'}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
        </>
      )}
      {children}
    </Paper>
  );
};

export default FormSection;
