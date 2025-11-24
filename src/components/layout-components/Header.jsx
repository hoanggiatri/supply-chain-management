import React, { useState } from "react";
import { IconButton, Box, Popover, Badge, Avatar, Tooltip } from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from "@mui/icons-material";
import { useThemeMode } from "../../contexts/ThemeContext";
import { useNotifications } from "../../contexts/NotificationContext";
import NotificationPanel from "./NotificationPanel";
import UserProfileMenu from "./UserProfileMenu";
import GlobalSearch from "./GlobalSearch";

const Header = ({ toggleSidebar }) => {
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const { mode, toggleTheme } = useThemeMode();
  const { unreadCount } = useNotifications();

  // Lấy thông tin user
  const employeeName = localStorage.getItem('employeeName') || 'User';
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNotifClick = (event) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleNotifClose = () => {
    setAnchorElNotif(null);
  };

  const handleProfileClick = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorElProfile(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 3,
        py: 0.5,
        gap: 2,
        minHeight: 56,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton onClick={toggleSidebar} color="inherit">
          <MenuIcon />
        </IconButton>
        <GlobalSearch />
      </Box>
      
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title={mode === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}>
          <IconButton 
            color="inherit" 
            onClick={toggleTheme}
            sx={{
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'rotate(180deg)',
              }
            }}
          >
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Thông báo">
          <IconButton 
            color="inherit" 
            onClick={handleNotifClick}
            sx={{
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              }
            }}
          >
            <Badge 
              badgeContent={unreadCount} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'scale(1)',
                      opacity: 1,
                    },
                    '50%': {
                      transform: 'scale(1.1)',
                      opacity: 0.8,
                    },
                    '100%': {
                      transform: 'scale(1)',
                      opacity: 1,
                    },
                  },
                },
              }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title="Hồ sơ cá nhân">
          <IconButton 
            onClick={handleProfileClick}
            sx={{
              p: 0.5,
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {getInitials(employeeName)}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      <Popover
        id="notification-popover"
        open={Boolean(anchorElNotif)}
        anchorEl={anchorElNotif}
        onClose={handleNotifClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        disableScrollLock
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              mt: 1.5,
              overflow: 'visible',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                boxShadow: 1,
              },
            },
          },
        }}
      >
        <NotificationPanel />
      </Popover>

      <Popover
        id="profile-popover"
        open={Boolean(anchorElProfile)}
        anchorEl={anchorElProfile}
        onClose={handleProfileClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        disableScrollLock
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              mt: 1.5,
              overflow: 'visible',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                boxShadow: 1,
              },
            },
          },
        }}
      >
        <UserProfileMenu onClose={handleProfileClose} />
      </Popover>
    </Box>
  );
};

export default Header;
