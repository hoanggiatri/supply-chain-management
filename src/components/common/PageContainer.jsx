import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const PageContainer = ({ 
  children, 
  title, 
  subtitle,
  variant = 'default', // default, gradient, minimal, card
  maxWidth = 'xl',
  noPadding = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)',
          minHeight: 'calc(100vh - 120px)',
        };
      case 'minimal':
        return {
          bgcolor: 'transparent',
          minHeight: 'calc(100vh - 120px)',
        };
      case 'card':
        return {
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 120px)',
        };
      default:
        return {
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 120px)',
        };
    }
  };

  return (
    <Box
      sx={{
        ...getVariantStyles(),
        p: noPadding ? 0 : 3,
        transition: 'all 0.3s ease',
      }}
    >
      {title && (
        <Box sx={{ mb: 3 }}>
          {variant === 'gradient' ? (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
                color: 'white',
                borderRadius: 3,
              }}
            >
              <Typography 
                variant="h4" 
                fontWeight={700}
                sx={{ 
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mt: 1, 
                    opacity: 0.9,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Paper>
          ) : variant === 'card' ? (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                border: 1,
                borderColor: 'divider',
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.03) 0%, rgba(156, 39, 176, 0.03) 100%)',
              }}
            >
              <Typography 
                variant="h4" 
                fontWeight={700}
                color="primary"
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {subtitle}
                </Typography>
              )}
            </Paper>
          ) : (
            <>
              <Typography 
                variant="h4" 
                fontWeight={700}
                color="text.primary"
                sx={{ mb: 1 }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                >
                  {subtitle}
                </Typography>
              )}
            </>
          )}
        </Box>
      )}
      {children}
    </Box>
  );
};

export default PageContainer;
