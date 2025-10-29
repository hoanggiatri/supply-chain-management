import React, { useState } from 'react';
import { IconButton, Box, Popover, Typography } from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [anchorElSetting, setAnchorElSetting] = useState(null);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/my-profile');
  };

  const handleNotifClick = (event) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleNotifClose = () => {
    setAnchorElNotif(null);
  };

  const handleSettingClick = (event) => {
    setAnchorElSetting(event.currentTarget);
  };

  const handleSettingClose = () => {
    setAnchorElSetting(null);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 15px', alignItems: 'center' }}>
      <IconButton onClick={toggleSidebar} color="inherit"><MenuIcon /></IconButton>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton color="inherit" onClick={handleProfileClick}><PersonIcon /></IconButton>
        <IconButton color="inherit" onClick={handleNotifClick}><NotificationsIcon /></IconButton>
        <IconButton color="inherit" onClick={handleSettingClick}><SettingsIcon /></IconButton>
      </Box>

      <Popover
        id="notification-popover"
        open={Boolean(anchorElNotif)}
        anchorEl={anchorElNotif}
        onClose={handleNotifClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Typography sx={{ p: 2 }}>Không có thông báo</Typography>
      </Popover>

      <Popover
        id="setting-popover"
        open={Boolean(anchorElSetting)}
        anchorEl={anchorElSetting}
        onClose={handleSettingClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Typography sx={{ p: 2 }}>Không có nội dung thiết lập</Typography>
      </Popover>
    </div>
  );
};

export default Header;
