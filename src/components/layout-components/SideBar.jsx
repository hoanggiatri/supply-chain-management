import React, { useState, useEffect } from 'react';
import {
  Drawer, List, Divider, Collapse,
  ListItemButton, ListItemIcon, ListItemText, Button, Box
} from '@mui/material';
import {
  Home, Info, ContactMail, ExpandLess, ExpandMore, Factory, Business, People, Person, Category, Warehouse, BuildCircle, Checklist, ShoppingBag, BarChart,
  ShoppingCart, Sell, Inventory, LocalShipping, ListAlt, RequestQuote, CompareArrows, FactCheck, Note, Schema, MoveToInbox, Outbox, Search,
} from '@mui/icons-material';

import { useNavigate, useLocation } from 'react-router-dom';
import logo from "@assets/img/logo-sidebar.png";
import MenuItem from './MenuItem';

const SideBar = ({ openSidebar, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const companyType = localStorage.getItem("companyType");

  const [openMenus, setOpenMenus] = useState(() => {
    const saved = localStorage.getItem("openMenus");
    return saved ? JSON.parse(saved) : {
      info: false,
      manufacturing: false,
    };
  });

  const [selectedPath, setSelectedPath] = useState(() => {
    return localStorage.getItem("selectedMenuPath") || location.pathname || "/homepage";
  });

  useEffect(() => {
    localStorage.setItem("openMenus", JSON.stringify(openMenus));
  }, [openMenus]);

  useEffect(() => {
    localStorage.setItem("selectedMenuPath", selectedPath);
  }, [selectedPath]);

  const handleToggle = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

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
        <MenuItem icon={<Home />} title="Trang chủ" path="/homepage" selectedPath={selectedPath} onSelect={handleSelect} />

        <ListItemButton onClick={() => handleToggle('info')}>
          <ListItemIcon><Info /></ListItemIcon>
          <ListItemText primary="Quản lý thông tin chung" />
          {openMenus.info ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openMenus.info} timeout="auto" unmountOnExit sx={{ pl: 2 }}>
          <List component="div" disablePadding>
            <MenuItem icon={<Business />} title="Thông tin công ty" path="/company" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<People />} title="Quản lý bộ phận" path="/departments" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<Person />} title="Quản lý nhân viên" path="/employees" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<ContactMail />} title="Quản lý tài khoản" path="/users" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<Category />} title="Quản lý hàng hóa" path="/items" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<Warehouse />} title="Quản lý kho" path="/warehouses" selectedPath={selectedPath} onSelect={handleSelect} />
            {companyType === "Doanh nghiệp sản xuất" && (
              <>
                <MenuItem icon={<Factory />} title="Quản lý xưởng sản xuất" path="/plants" selectedPath={selectedPath} onSelect={handleSelect} />
                <MenuItem icon={<BuildCircle />} title="Quản lý dây chuyền" path="/lines" selectedPath={selectedPath} onSelect={handleSelect} />
              </>
            )}
          </List>
        </Collapse>

        {companyType === "Doanh nghiệp sản xuất" && (
          <>
            <ListItemButton onClick={() => handleToggle('manufacturing')}>
              <ListItemIcon><Factory /></ListItemIcon>
              <ListItemText primary="Quản lý sản xuất" />
              {openMenus.manufacturing ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openMenus.manufacturing} timeout="auto" unmountOnExit sx={{ pl: 2 }}>
              <List component="div" disablePadding>
                <MenuItem icon={<FactCheck />} title="Công lệnh sản xuất" path="/mos" selectedPath={selectedPath} onSelect={handleSelect} />
                <MenuItem icon={<Note />} title="BOM" path="/boms" selectedPath={selectedPath} onSelect={handleSelect} />
                <MenuItem icon={<Schema />} title="Quy trình sản xuất" path="/stages" selectedPath={selectedPath} onSelect={handleSelect} />
                <MenuItem icon={<BarChart />} title="Báo cáo sản xuất" path="/manufacture-report" selectedPath={selectedPath} onSelect={handleSelect} />
              </List>
            </Collapse>
          </>
        )}

        <ListItemButton onClick={() => handleToggle('inventory')}>
          <ListItemIcon><Warehouse /></ListItemIcon>
          <ListItemText primary="Quản lý kho" />
          {openMenus.inventory ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMenus.inventory} timeout="auto" unmountOnExit sx={{ pl: 2 }}>
          <List component="div" disablePadding>
            <MenuItem icon={<Checklist />} title="Kiểm kê" path="/inventory-count" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<Inventory />} title="Theo dõi tồn kho" path="/inventory" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<MoveToInbox />} title="Nhập kho" path="/receive-tickets" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<Outbox />} title="Xuất kho" path="/issue-tickets" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<CompareArrows />} title="Chuyển kho" path="/transfer-tickets" selectedPath={selectedPath} onSelect={handleSelect} />
            <ListItemButton onClick={() => handleToggle('inventoryReport')}>
              <ListItemIcon><BarChart /></ListItemIcon>
              <ListItemText primary="Báo cáo nhập xuất" />
              {openMenus.inventoryReport ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openMenus.inventoryReport} timeout="auto" unmountOnExit sx={{ pl: 2 }}>
              <List component="div" disablePadding>
                <MenuItem icon={<MoveToInbox />} title="Báo cáo nhập kho" path="/receive-report" selectedPath={selectedPath} onSelect={handleSelect} />
                <MenuItem icon={<Outbox />} title="Báo cáo xuất kho" path="/issue-report" selectedPath={selectedPath} onSelect={handleSelect} />
              </List>
            </Collapse>
          </List>
        </Collapse>

        <ListItemButton onClick={() => handleToggle('purchasing')}>
          <ListItemIcon><ShoppingCart /></ListItemIcon>
          <ListItemText primary="Quản lý mua hàng" />
          {openMenus.purchasing ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMenus.purchasing} timeout="auto" unmountOnExit sx={{ pl: 2 }}>
          <List component="div" disablePadding>
            <MenuItem icon={<Search />} title="Tìm nhà cung cấp" path="/supplier-search" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<RequestQuote />} title="Yêu cầu báo giá" path="/rfqs" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<Sell />} title="Báo giá từ nhà cung cấp" path="/customer-quotations" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<ListAlt />} title="Đơn mua hàng" path="/pos" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<BarChart />} title="Báo cáo mua hàng" path="/purchase-report" selectedPath={selectedPath} onSelect={handleSelect} />
          </List>
        </Collapse>

        <ListItemButton onClick={() => handleToggle('sales')}>
          <ListItemIcon><Sell /></ListItemIcon>
          <ListItemText primary="Quản lý bán hàng" />
          {openMenus.sales ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMenus.sales} timeout="auto" unmountOnExit sx={{ pl: 2 }}>
          <List component="div" disablePadding>
            <MenuItem icon={<RequestQuote />} title="Gửi báo giá" path="/supplier-rfqs" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<Sell />} title="Báo giá" path="/quotations" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<ShoppingBag />} title="Yêu cầu mua hàng" path="/supplier-pos" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<ListAlt />} title="Đơn bán hàng" path="/sos" selectedPath={selectedPath} onSelect={handleSelect} />
            <MenuItem icon={<BarChart />} title="Báo cáo bán hàng" path="/sales-report" selectedPath={selectedPath} onSelect={handleSelect} />
          </List>
        </Collapse>

        <ListItemButton onClick={() => handleToggle('delivery')}>
          <ListItemIcon><LocalShipping /></ListItemIcon>
          <ListItemText primary="Quản lý vận chuyển" />
          {openMenus.delivery ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMenus.delivery} timeout="auto" unmountOnExit sx={{ pl: 2 }}>
          <List component="div" disablePadding>
            <MenuItem icon={<LocalShipping />} title="Đơn vận chuyển" path="/dos" selectedPath={selectedPath} onSelect={handleSelect} />
          </List>
        </Collapse>
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

export default SideBar;
