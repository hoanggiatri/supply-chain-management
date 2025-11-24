import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const StatsCard = ({ 
  title, 
  value, 
  icon,
  trend, // { value: 12, direction: 'up' | 'down' }
  color = 'primary',
  variant = 'default', // default, gradient, outlined
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${getColorValue(color, 'main')} 0%, ${getColorValue(color, 'dark')} 100%)`,
          color: 'white',
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

  const getColorValue = (color, shade) => {
    const colors = {
      primary: { main: '#1976d2', dark: '#1565c0' },
      success: { main: '#4caf50', dark: '#388e3c' },
      error: { main: '#f44336', dark: '#d32f2f' },
      warning: { main: '#ff9800', dark: '#f57c00' },
      info: { main: '#00acc1', dark: '#00838f' },
    };
    return colors[color]?.[shade] || colors.primary[shade];
  };

  return (
    <Paper
      elevation={0}
      sx={{
        ...getVariantStyles(),
        p: 3,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
        '&:before': variant === 'default' ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${getColorValue(color, 'main')} 0%, ${getColorValue(color, 'dark')} 100%)`,
        } : {},
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              opacity: variant === 'gradient' ? 0.9 : 0.7,
              color: variant === 'gradient' ? 'inherit' : 'text.secondary',
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h3" 
            fontWeight={700}
            sx={{ 
              mb: 1,
              color: variant === 'gradient' ? 'inherit' : `${color}.main`,
            }}
          >
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend.direction === 'up' ? (
                <TrendingUp fontSize="small" sx={{ color: variant === 'gradient' ? 'inherit' : 'success.main' }} />
              ) : (
                <TrendingDown fontSize="small" sx={{ color: variant === 'gradient' ? 'inherit' : 'error.main' }} />
              )}
              <Typography 
                variant="body2" 
                fontWeight={600}
                sx={{ 
                  color: variant === 'gradient' 
                    ? 'inherit' 
                    : trend.direction === 'up' ? 'success.main' : 'error.main',
                }}
              >
                {trend.value}%
              </Typography>
            </Box>
          )}
        </Box>
        {icon && (
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: variant === 'gradient' 
                ? 'rgba(255,255,255,0.2)' 
                : `${color}.lighter`,
              color: variant === 'gradient' ? 'inherit' : `${color}.main`,
              fontSize: '2rem',
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default StatsCard;
