import React, { useState, useEffect } from 'react';
import { Drawer, List, Divider, Button, Box } from '@mui/material';
import { Business, Dashboard, People } from '@mui/icons-material';

import { useNavigate, useLocation } from 'react-router-dom';
import logo from "@assets/img/logo-sidebar.png";
import MenuItem from './MenuItem';

const AdminSideBar = ({ openSidebar, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedPath, setSelectedPath] = useState(() => {
    return localStorage.getItem("selectedMenuPath") || location.pathname || "/homepage";
  });

  useEffect(() => {
    localStorage.setItem("selectedMenuPath", selectedPath);
  }, [selectedPath]);

  const handleSelect = (path) => {
    setSelectedPath(path);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Drawer variant={openSidebar ? 'permanent' : 'temporary'} anchor="left" open={openSidebar} onClose={toggleSidebar}
      sx={{
        width: openSidebar ? 280 : 0,
        transition: 'width 0.3s',
        overflowX: 'hidden',
      }}
    >
      <div style={{ padding: 10, textAlign: 'center' }}>
        <img src={logo} alt="Logo" style={{ width: openSidebar ? 280 : 0 }} />
      </div>
      <Divider />
      <List>
        <MenuItem icon={<Dashboard />} title="Dashboard" path="/admin/dashboard" selectedPath={selectedPath} onSelect={handleSelect} />
        <MenuItem icon={<Business />} title="Quản lý công ty" path="/admin/all-company" selectedPath={selectedPath} onSelect={handleSelect} />
        <MenuItem icon={<People />} title="Quản lý tài khoản" path="/admin/all-user" selectedPath={selectedPath} onSelect={handleSelect} />
      </List >
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button color="default" variant="contained" fullWidth onClick={handleLogout}>
          Đăng xuất
        </Button>
      </Box>
    </Drawer >
  );
};

export default AdminSideBar;
