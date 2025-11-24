import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  Divider,
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Home,
  Info,
  ContactMail,
  ExpandLess,
  ExpandMore,
  Factory,
  Business,
  People,
  Person,
  Category,
  Warehouse,
  BuildCircle,
  Checklist,
  ShoppingBag,
  BarChart,
  ShoppingCart,
  Sell,
  Inventory,
  LocalShipping,
  ListAlt,
  RequestQuote,
  CompareArrows,
  FactCheck,
  Note,
  Schema,
  MoveToInbox,
  Outbox,
  Search,
  Logout,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import MenuItem from "./MenuItem";

const SideBar = ({ openSidebar, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const companyType = localStorage.getItem("companyType");

  const [openMenus, setOpenMenus] = useState(() => {
    const saved = localStorage.getItem("openMenus");
    return saved
      ? JSON.parse(saved)
      : {
          info: false,
          manufacturing: false,
        };
  });

  const [selectedPath, setSelectedPath] = useState(() => {
    return (
      localStorage.getItem("selectedMenuPath") ||
      location.pathname ||
      "/homepage"
    );
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

  const drawerWidth = openSidebar ? 280 : 72;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={openSidebar}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          transition: "width 0.3s ease, background-color 0.3s ease",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          borderRight: 0,
          boxShadow: '4px 0 24px rgba(0,0,0,0.08)',
        },
      }}
    >
      {/* Fixed Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: openSidebar ? "space-between" : "center",
          p: 2.5,
          minHeight: 72,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        {openSidebar ? (
          <>
            <Box
              sx={{
                fontSize: "1.1rem",
                fontWeight: 800,
                letterSpacing: '0.5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              SCMS
            </Box>
            <IconButton 
              onClick={toggleSidebar} 
              size="small"
              sx={{ 
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              <ChevronLeft />
            </IconButton>
          </>
        ) : (
          <IconButton 
            onClick={toggleSidebar} 
            size="small"
            sx={{ 
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            <ChevronRight />
          </IconButton>
        )}
      </Box>
      <Divider sx={{ borderColor: 'rgba(0,0,0,0.12)' }} />

      {/* Scrollable Menu */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
        <List>
          <MenuItem
            icon={<Home />}
            title="Trang chủ"
            path="/homepage"
            selectedPath={selectedPath}
            onSelect={handleSelect}
            collapsed={!openSidebar}
            color="#1976d2"
          />

          <Tooltip
            title={!openSidebar ? "Quản lý thông tin chung" : ""}
            placement="right"
          >
            <ListItemButton 
              onClick={() => handleToggle("info")}
              sx={{
                my: 0.5,
                mx: 1,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                }
              }}
            >
              <ListItemIcon>
                <Info sx={{ color: '#2196f3', fontSize: '1.5rem' }} />
              </ListItemIcon>
              {openSidebar && (
                <ListItemText 
                  primary="Quản lý thông tin chung"
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#2196f3',
                  }}
                />
              )}
              {openSidebar &&
                (openMenus.info ? <ExpandLess sx={{ color: '#2196f3' }} /> : <ExpandMore sx={{ color: '#2196f3' }} />)}
            </ListItemButton>
          </Tooltip>

          <Collapse
            in={openMenus.info && openSidebar}
            timeout="auto"
            unmountOnExit
            sx={{ pl: 2 }}
          >
            <List component="div" disablePadding>
              <MenuItem
                icon={<Business />}
                title="Thông tin công ty"
                path="/company"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#2196f3"
              />
              <MenuItem
                icon={<People />}
                title="Quản lý bộ phận"
                path="/departments"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#03a9f4"
              />
              <MenuItem
                icon={<Person />}
                title="Quản lý nhân viên"
                path="/employees"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#00bcd4"
              />
              <MenuItem
                icon={<ContactMail />}
                title="Quản lý tài khoản"
                path="/users"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#0097a7"
              />
              <MenuItem
                icon={<Category />}
                title="Quản lý hàng hóa"
                path="/items"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#00acc1"
              />
              <MenuItem
                icon={<Warehouse />}
                title="Quản lý kho"
                path="/warehouses"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#0288d1"
              />
              {companyType === "Doanh nghiệp sản xuất" && (
                <>
                  <MenuItem
                    icon={<Factory />}
                    title="Quản lý xưởng sản xuất"
                    path="/plants"
                    selectedPath={selectedPath}
                    onSelect={handleSelect}
                    collapsed={!openSidebar}
                    color="#01579b"
                  />
                  <MenuItem
                    icon={<BuildCircle />}
                    title="Quản lý dây chuyền"
                    path="/lines"
                    selectedPath={selectedPath}
                    onSelect={handleSelect}
                    collapsed={!openSidebar}
                    color="#0277bd"
                  />
                </>
              )}
            </List>
          </Collapse>

          {companyType === "Doanh nghiệp sản xuất" && (
            <>
              <Tooltip
                title={!openSidebar ? "Quản lý sản xuất" : ""}
                placement="right"
              >
                <ListItemButton 
                  onClick={() => handleToggle("manufacturing")}
                  sx={{
                    my: 0.5,
                    mx: 1,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'rgba(211, 47, 47, 0.08)',
                    }
                  }}
                >
                  <ListItemIcon>
                    <Factory sx={{ color: '#d32f2f', fontSize: '1.5rem' }} />
                  </ListItemIcon>
                  {openSidebar && (
                    <ListItemText 
                      primary="Quản lý sản xuất"
                      primaryTypographyProps={{
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: '#d32f2f',
                      }}
                    />
                  )}
                  {openSidebar &&
                    (openMenus.manufacturing ? <ExpandLess sx={{ color: '#d32f2f' }} /> : <ExpandMore sx={{ color: '#d32f2f' }} />)}
                </ListItemButton>
              </Tooltip>

              <Collapse
                in={openMenus.manufacturing && openSidebar}
                timeout="auto"
                unmountOnExit
                sx={{ pl: 2 }}
              >
                <List component="div" disablePadding>
                  <MenuItem
                    icon={<FactCheck />}
                    title="Công lệnh sản xuất"
                    path="/mos"
                    selectedPath={selectedPath}
                    onSelect={handleSelect}
                    collapsed={!openSidebar}
                    color="#d32f2f"
                  />
                  <MenuItem
                    icon={<Note />}
                    title="BOM"
                    path="/boms"
                    selectedPath={selectedPath}
                    onSelect={handleSelect}
                    collapsed={!openSidebar}
                    color="#c62828"
                  />
                  <MenuItem
                    icon={<Schema />}
                    title="Quy trình sản xuất"
                    path="/stages"
                    selectedPath={selectedPath}
                    onSelect={handleSelect}
                    collapsed={!openSidebar}
                    color="#b71c1c"
                  />
                  <MenuItem
                    icon={<BarChart />}
                    title="Báo cáo sản xuất"
                    path="/manufacture-report"
                    selectedPath={selectedPath}
                    onSelect={handleSelect}
                    collapsed={!openSidebar}
                    color="#e53935"
                  />
                </List>
              </Collapse>
            </>
          )}

          <Tooltip title={!openSidebar ? "Quản lý kho" : ""} placement="right">
            <ListItemButton 
              onClick={() => handleToggle("inventory")}
              sx={{
                my: 0.5,
                mx: 1,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 152, 0, 0.08)',
                }
              }}
            >
              <ListItemIcon>
                <Warehouse sx={{ color: '#ff9800', fontSize: '1.5rem' }} />
              </ListItemIcon>
              {openSidebar && (
                <ListItemText 
                  primary="Quản lý kho"
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#ff9800',
                  }}
                />
              )}
              {openSidebar &&
                (openMenus.inventory ? <ExpandLess sx={{ color: '#ff9800' }} /> : <ExpandMore sx={{ color: '#ff9800' }} />)}
            </ListItemButton>
          </Tooltip>

          <Collapse
            in={openMenus.inventory && openSidebar}
            timeout="auto"
            unmountOnExit
            sx={{ pl: 2 }}
          >
            <List component="div" disablePadding>
              <MenuItem
                icon={<Checklist />}
                title="Kiểm kê"
                path="/inventory-count"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#f57c00"
              />
              <MenuItem
                icon={<Inventory />}
                title="Theo dõi tồn kho"
                path="/inventory"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#ff9800"
              />
              <MenuItem
                icon={<MoveToInbox />}
                title="Nhập kho"
                path="/receive-tickets"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#fb8c00"
              />
              <MenuItem
                icon={<Outbox />}
                title="Xuất kho"
                path="/issue-tickets"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#f57c00"
              />
              <MenuItem
                icon={<CompareArrows />}
                title="Chuyển kho"
                path="/transfer-tickets"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#ef6c00"
              />

              <Tooltip
                title={!openSidebar ? "Báo cáo nhập xuất" : ""}
                placement="right"
              >
                <ListItemButton onClick={() => handleToggle("inventoryReport")}>
                  <ListItemIcon>
                    <BarChart />
                  </ListItemIcon>
                  {openSidebar && <ListItemText primary="Báo cáo nhập xuất" />}
                  {openSidebar &&
                    (openMenus.inventoryReport ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    ))}
                </ListItemButton>
              </Tooltip>

              <Collapse
                in={openMenus.inventoryReport && openSidebar}
                timeout="auto"
                unmountOnExit
                sx={{ pl: 2 }}
              >
                <List component="div" disablePadding>
                  <MenuItem
                    icon={<MoveToInbox />}
                    title="Báo cáo nhập kho"
                    path="/receive-report"
                    selectedPath={selectedPath}
                    onSelect={handleSelect}
                    collapsed={!openSidebar}
                    color="#fb8c00"
                  />
                  <MenuItem
                    icon={<Outbox />}
                    title="Báo cáo xuất kho"
                    path="/issue-report"
                    selectedPath={selectedPath}
                    onSelect={handleSelect}
                    collapsed={!openSidebar}
                    color="#f57c00"
                  />
                </List>
              </Collapse>
            </List>
          </Collapse>

          <Tooltip
            title={!openSidebar ? "Quản lý mua hàng" : ""}
            placement="right"
          >
            <ListItemButton 
              onClick={() => handleToggle("purchasing")}
              sx={{
                my: 0.5,
                mx: 1,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(156, 39, 176, 0.08)',
                }
              }}
            >
              <ListItemIcon>
                <ShoppingCart sx={{ color: '#9c27b0', fontSize: '1.5rem' }} />
              </ListItemIcon>
              {openSidebar && (
                <ListItemText 
                  primary="Quản lý mua hàng"
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#9c27b0',
                  }}
                />
              )}
              {openSidebar &&
                (openMenus.purchasing ? <ExpandLess sx={{ color: '#9c27b0' }} /> : <ExpandMore sx={{ color: '#9c27b0' }} />)}
            </ListItemButton>
          </Tooltip>

          <Collapse
            in={openMenus.purchasing && openSidebar}
            timeout="auto"
            unmountOnExit
            sx={{ pl: 2 }}
          >
            <List component="div" disablePadding>
              <MenuItem
                icon={<Search />}
                title="Tìm nhà cung cấp"
                path="/supplier-search"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#7b1fa2"
              />
              <MenuItem
                icon={<RequestQuote />}
                title="Yêu cầu báo giá"
                path="/rfqs"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#8e24aa"
              />
              <MenuItem
                icon={<Sell />}
                title="Báo giá từ nhà cung cấp"
                path="/customer-quotations"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#9c27b0"
              />
              <MenuItem
                icon={<ListAlt />}
                title="Đơn mua hàng"
                path="/pos"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#ab47bc"
              />
              <MenuItem
                icon={<BarChart />}
                title="Báo cáo mua hàng"
                path="/purchase-report"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#ba68c8"
              />
            </List>
          </Collapse>

          <Tooltip
            title={!openSidebar ? "Quản lý bán hàng" : ""}
            placement="right"
          >
            <ListItemButton 
              onClick={() => handleToggle("sales")}
              sx={{
                my: 0.5,
                mx: 1,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(76, 175, 80, 0.08)',
                }
              }}
            >
              <ListItemIcon>
                <Sell sx={{ color: '#4caf50', fontSize: '1.5rem' }} />
              </ListItemIcon>
              {openSidebar && (
                <ListItemText 
                  primary="Quản lý bán hàng"
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#4caf50',
                  }}
                />
              )}
              {openSidebar &&
                (openMenus.sales ? <ExpandLess sx={{ color: '#4caf50' }} /> : <ExpandMore sx={{ color: '#4caf50' }} />)}
            </ListItemButton>
          </Tooltip>

          <Collapse
            in={openMenus.sales && openSidebar}
            timeout="auto"
            unmountOnExit
            sx={{ pl: 2 }}
          >
            <List component="div" disablePadding>
              <MenuItem
                icon={<RequestQuote />}
                title="Gửi báo giá"
                path="/supplier-rfqs"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#388e3c"
              />
              <MenuItem
                icon={<Sell />}
                title="Báo giá"
                path="/quotations"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#43a047"
              />
              <MenuItem
                icon={<ShoppingBag />}
                title="Yêu cầu mua hàng"
                path="/supplier-pos"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#4caf50"
              />
              <MenuItem
                icon={<ListAlt />}
                title="Đơn bán hàng"
                path="/sos"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#66bb6a"
              />
              <MenuItem
                icon={<BarChart />}
                title="Báo cáo bán hàng"
                path="/sales-report"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#81c784"
              />
            </List>
          </Collapse>

          <Tooltip
            title={!openSidebar ? "Quản lý vận chuyển" : ""}
            placement="right"
          >
            <ListItemButton 
              onClick={() => handleToggle("delivery")}
              sx={{
                my: 0.5,
                mx: 1,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(0, 172, 193, 0.08)',
                }
              }}
            >
              <ListItemIcon>
                <LocalShipping sx={{ color: '#00acc1', fontSize: '1.5rem' }} />
              </ListItemIcon>
              {openSidebar && (
                <ListItemText 
                  primary="Quản lý vận chuyển"
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#00acc1',
                  }}
                />
              )}
              {openSidebar &&
                (openMenus.delivery ? <ExpandLess sx={{ color: '#00acc1' }} /> : <ExpandMore sx={{ color: '#00acc1' }} />)}
            </ListItemButton>
          </Tooltip>

          <Collapse
            in={openMenus.delivery && openSidebar}
            timeout="auto"
            unmountOnExit
            sx={{ pl: 2 }}
          >
            <List component="div" disablePadding>
              <MenuItem
                icon={<LocalShipping />}
                title="Đơn vận chuyển"
                path="/dos"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
                color="#00acc1"
              />
            </List>
          </Collapse>
        </List>
      </Box>

      {/* Fixed Logout Button */}
      <Divider />
      <Box sx={{ p: 2 }}>
        {openSidebar ? (
          <Button
            color="error"
            variant="contained"
            fullWidth
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        ) : (
          <Tooltip title="Đăng xuất" placement="right">
            <IconButton
              color="error"
              onClick={handleLogout}
              sx={{ width: "100%" }}
            >
              <Logout />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Drawer>
  );
};

export default SideBar;
