import React from 'react';
import {
  Box,
  Typography,
  Divider,
  MenuItem,
  ListItemIcon,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Business as BusinessIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserProfileMenu = ({ onClose }) => {
  const navigate = useNavigate();
  
  // Lấy thông tin user từ localStorage
  const employeeName = localStorage.getItem('employeeName') || 'Người dùng';
  const role = localStorage.getItem('role') || 'user';
  const departmentName = localStorage.getItem('departmentName') || 'Chưa có bộ phận';
  const companyType = localStorage.getItem('companyType') || 'Doanh nghiệp';

  const getRoleName = (role) => {
    switch (role) {
      case 's-admin':
        return 'Super Admin';
      case 'admin':
        return 'Quản trị viên';
      case 'manager':
        return 'Quản lý';
      default:
        return 'Nhân viên';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 's-admin':
        return 'error';
      case 'admin':
        return 'warning';
      case 'manager':
        return 'info';
      default:
        return 'default';
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    onClose();
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <Box sx={{ width: 280, bgcolor: 'background.paper' }}>
      {/* User Info Section */}
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              fontSize: '1.5rem',
              fontWeight: 600,
            }}
          >
            {getInitials(employeeName)}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              noWrap
              sx={{ mb: 0.5 }}
            >
              {employeeName}
            </Typography>
            <Chip
              label={getRoleName(role)}
              size="small"
              color={getRoleColor(role)}
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            p: 1.5,
            bgcolor: 'action.hover',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary" noWrap>
              {departmentName}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.disabled" noWrap>
            {companyType}
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Menu Items */}
      <Box sx={{ py: 1 }}>
        <MenuItem
          onClick={() => handleNavigate('/my-profile')}
          sx={{
            py: 1.5,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Hồ sơ cá nhân</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => handleNavigate('/change-password')}
          sx={{
            py: 1.5,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ListItemIcon>
            <LockIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Đổi mật khẩu</Typography>
        </MenuItem>

        <MenuItem
          sx={{
            py: 1.5,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Cài đặt</Typography>
        </MenuItem>
      </Box>

      <Divider />

      {/* Logout */}
      <Box sx={{ p: 1 }}>
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            color: 'error.main',
            '&:hover': {
              bgcolor: 'error.lighter',
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="body2">Đăng xuất</Typography>
        </MenuItem>
      </Box>
    </Box>
  );
};

export default UserProfileMenu;
