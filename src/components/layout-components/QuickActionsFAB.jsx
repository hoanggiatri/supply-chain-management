import React, { useState } from 'react';
import {
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Backdrop,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  ShoppingCart as PurchaseIcon,
  Sell as SaleIcon,
  Inventory as InventoryIcon,
  LocalShipping as DeliveryIcon,
  Factory as ManufacturingIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const QuickActionsFAB = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const companyType = localStorage.getItem('companyType');
  const isManufacturing = companyType === 'Doanh nghiệp sản xuất';

  const actions = [
    {
      icon: <PurchaseIcon />,
      name: 'Tạo đơn mua hàng',
      path: '/pos/create',
      color: 'primary',
    },
    {
      icon: <SaleIcon />,
      name: 'Tạo đơn bán hàng',
      path: '/sos/create',
      color: 'success',
    },
    {
      icon: <ReceiptIcon />,
      name: 'Nhập kho',
      path: '/receive-tickets/create',
      color: 'info',
    },
    {
      icon: <InventoryIcon />,
      name: 'Xuất kho',
      path: '/issue-tickets/create',
      color: 'warning',
    },
    {
      icon: <DeliveryIcon />,
      name: 'Tạo đơn vận chuyển',
      path: '/dos/create',
      color: 'secondary',
    },
  ];

  // Add manufacturing action if applicable
  if (isManufacturing) {
    actions.unshift({
      icon: <ManufacturingIcon />,
      name: 'Tạo công lệnh sản xuất',
      path: '/mos/create',
      color: 'error',
    });
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAction = (path) => {
    navigate(path);
    handleClose();
  };

  return (
    <>
      <Backdrop 
        open={open} 
        sx={{ 
          zIndex: (theme) => theme.zIndex.speedDial - 1,
          bgcolor: 'rgba(0, 0, 0, 0.3)',
        }} 
      />
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{
          position: 'fixed',
          bottom: isMobile ? 16 : 32,
          right: isMobile ? 16 : 32,
          '& .MuiFab-primary': {
            width: isMobile ? 48 : 56,
            height: isMobile ? 48 : 56,
            boxShadow: 6,
            '&:hover': {
              boxShadow: 12,
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease',
          },
        }}
        icon={<SpeedDialIcon icon={<AddIcon />} />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction="up"
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={() => handleAction(action.path)}
            sx={{
              '& .MuiSpeedDialAction-fab': {
                bgcolor: `${action.color}.main`,
                color: 'white',
                '&:hover': {
                  bgcolor: `${action.color}.dark`,
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              },
            }}
          />
        ))}
      </SpeedDial>
    </>
  );
};

export default QuickActionsFAB;
