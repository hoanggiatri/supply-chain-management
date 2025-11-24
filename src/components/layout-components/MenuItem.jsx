import React from 'react';
import { ListItemButton, ListItemIcon, ListItemText, Tooltip, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

const MenuItem = ({ icon, title, path, selectedPath, onSelect, collapsed, color = '#1976d2' }) => {
  const location = useLocation();
  const isSelected = selectedPath === path || location.pathname === path;

  const menuItem = (
    <ListItemButton 
      selected={isSelected} 
      onClick={() => onSelect(path)}
      sx={{
        my: 0.5,
        mx: 1,
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        '&.Mui-selected': {
          bgcolor: `${color}15`,
          borderLeft: 3,
          borderColor: color,
          '&:hover': {
            bgcolor: `${color}20`,
          },
          '&:before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            bgcolor: color,
          }
        },
        '&:hover': {
          bgcolor: `${color}08`,
        },
        transition: 'all 0.2s ease',
      }}
    >
      <ListItemIcon>
        <Box
          sx={{
            color: isSelected ? color : 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.2s ease',
            transform: isSelected ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          {icon}
        </Box>
      </ListItemIcon>
      {!collapsed && (
        <ListItemText 
          primary={title}
          primaryTypographyProps={{
            fontWeight: isSelected ? 600 : 400,
            fontSize: '0.875rem',
            color: isSelected ? color : 'text.primary',
          }}
        />
      )}
    </ListItemButton>
  );

  // Show tooltip only when collapsed
  if (collapsed) {
    return (
      <Tooltip title={title} placement="right">
        {menuItem}
      </Tooltip>
    );
  }

  return menuItem;
};

export default MenuItem;
