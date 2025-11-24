import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const routeNameMap = {
  '/homepage': 'Trang chủ',
  '/company': 'Thông tin công ty',
  '/departments': 'Quản lý bộ phận',
  '/employees': 'Quản lý nhân viên',
  '/users': 'Quản lý tài khoản',
  '/items': 'Quản lý hàng hóa',
  '/warehouses': 'Quản lý kho',
  '/plants': 'Quản lý xưởng sản xuất',
  '/lines': 'Quản lý dây chuyền',
  '/mos': 'Công lệnh sản xuất',
  '/boms': 'BOM',
  '/stages': 'Quy trình sản xuất',
  '/manufacture-report': 'Báo cáo sản xuất',
  '/inventory-count': 'Kiểm kê',
  '/inventory': 'Theo dõi tồn kho',
  '/receive-tickets': 'Nhập kho',
  '/issue-tickets': 'Xuất kho',
  '/transfer-tickets': 'Chuyển kho',
  '/receive-report': 'Báo cáo nhập kho',
  '/issue-report': 'Báo cáo xuất kho',
  '/supplier-search': 'Tìm nhà cung cấp',
  '/rfqs': 'Yêu cầu báo giá',
  '/customer-quotations': 'Báo giá từ nhà cung cấp',
  '/pos': 'Đơn mua hàng',
  '/purchase-report': 'Báo cáo mua hàng',
  '/supplier-rfqs': 'Gửi báo giá',
  '/quotations': 'Báo giá',
  '/supplier-pos': 'Yêu cầu mua hàng',
  '/sos': 'Đơn bán hàng',
  '/sales-report': 'Báo cáo bán hàng',
  '/dos': 'Đơn vận chuyển',
  '/my-profile': 'Hồ sơ cá nhân',
};

const Breadcrumbs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0 || location.pathname === '/homepage') {
    return null;
  }

  const handleClick = (event, path) => {
    event.preventDefault();
    navigate(path);
  };

  return (
    <Box sx={{ 
      px: 3, 
      py: 1, 
      bgcolor: 'transparent', 
      borderBottom: 1, 
      borderColor: 'divider',
      transition: 'background-color 0.3s ease',
    }}>
      <MuiBreadcrumbs 
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          underline="hover"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer',
            color: 'text.primary',
            '&:hover': {
              color: 'primary.main',
            }
          }}
          onClick={(e) => handleClick(e, '/homepage')}
        >
          <Home sx={{ mr: 0.5 }} fontSize="small" />
          Trang chủ
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const routeName = routeNameMap[to] || value;

          return last ? (
            <Typography 
              key={to} 
              color="text.primary" 
              sx={{ fontWeight: 600 }}
            >
              {routeName}
            </Typography>
          ) : (
            <Link
              key={to}
              underline="hover"
              sx={{ 
                cursor: 'pointer',
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                }
              }}
              onClick={(e) => handleClick(e, to)}
            >
              {routeName}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
