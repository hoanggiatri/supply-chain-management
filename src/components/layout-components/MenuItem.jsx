import React from 'react';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useLocation } from 'react-router-dom';

const MenuItem = ({ icon, title, path, selectedPath, onSelect }) => {
  const location = useLocation();
  const isSelected = selectedPath === path || location.pathname === path;

  return (
    <ListItemButton selected={isSelected} onClick={() => onSelect(path)}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title} />
    </ListItemButton>
  );
};

export default MenuItem;
