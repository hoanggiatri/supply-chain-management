import React from 'react';
import { ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { useLocation } from 'react-router-dom';

const MenuItem = ({ icon, title, path, selectedPath, onSelect, collapsed }) => {
  const location = useLocation();
  const isSelected = selectedPath === path || location.pathname === path;

  const menuItem = (
    <ListItemButton selected={isSelected} onClick={() => onSelect(path)}>
      <ListItemIcon>{icon}</ListItemIcon>
      {!collapsed && <ListItemText primary={title} />}
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
