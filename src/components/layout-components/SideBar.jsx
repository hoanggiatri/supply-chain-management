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
          transition: "width 0.3s ease",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Fixed Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: openSidebar ? "space-between" : "center",
          p: 2,
          minHeight: 64,
        }}
      >
        {openSidebar ? (
          <>
            <Box
              sx={{
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              Quản lí Chuỗi cung ứng
            </Box>
            <IconButton onClick={toggleSidebar} size="small">
              <ChevronLeft />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={toggleSidebar} size="small">
            <ChevronRight />
          </IconButton>
        )}
      </Box>
      <Divider />

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
          />

          <Tooltip
            title={!openSidebar ? "Quản lý thông tin chung" : ""}
            placement="right"
          >
            <ListItemButton onClick={() => handleToggle("info")}>
              <ListItemIcon>
                <Info />
              </ListItemIcon>
              {openSidebar && (
                <ListItemText primary="Quản lý thông tin chung" />
              )}
              {openSidebar &&
                (openMenus.info ? <ExpandLess /> : <ExpandMore />)}
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
              />
              <MenuItem
                icon={<People />}
                title="Quản lý bộ phận"
                path="/departments"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
              />
              <MenuItem
                icon={<Person />}
                title="Quản lý nhân viên"
                path="/employees"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
              />
              <MenuItem
                icon={<ContactMail />}
                title="Quản lý tài khoản"
                path="/users"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
              />
              <MenuItem
                icon={<Category />}
                title="Quản lý hàng hóa"
                path="/items"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
              />
              <MenuItem
                icon={<Warehouse />}
                title="Quản lý kho"
                path="/warehouses"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
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
                  />
                  <MenuItem
                    icon={<BuildCircle />}
                    title="Quản lý dây chuyền"
                    path="/lines"
                    selectedPath={selectedPath}
                    onSelect={handleSelect}
                    collapsed={!openSidebar}
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
                <ListItemButton onClick={() => handleToggle("manufacturing")}>
                  <ListItemIcon>
                    <Factory />
                  </ListItemIcon>
                  {openSidebar && <ListItemText primary="Quản lý sản xuất" />}
                  {openSidebar &&
                    (openMenus.manufacturing ? <ExpandLess /> : <ExpandMore />)}
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
                  />
                  <MenuItem
                    icon={<Note />}
                    title="BOM"
                    path="/boms"
                    selectedPath={selectedPath}
                    onSelect={handleSelect}
                    collapsed={!openSidebar}
                  />
                  <MenuItem
                    icon={<Schema />}
                    title="Quy trình sản xuất"
                    path="/stages"
                    selectedPath={selectedPath}
                    onSelect={handleSelect}
                    collapsed={!openSidebar}
                  />
                  <MenuItem
                    icon={<BarChart />}
                    title="Báo cáo sản xuất"
                    path="/manufacture-report"
                    selectedPath={selectedPath}
                    onSelect={handleSelect}
                    collapsed={!openSidebar}
                  />
                </List>
              </Collapse>
            </>
          )}

          <Tooltip title={!openSidebar ? "Quản lý kho" : ""} placement="right">
            <ListItemButton onClick={() => handleToggle("inventory")}>
              <ListItemIcon>
                <Warehouse />
              </ListItemIcon>
              {openSidebar && <ListItemText primary="Quản lý kho" />}
              {openSidebar &&
                (openMenus.inventory ? <ExpandLess /> : <ExpandMore />)}
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
              />
              <MenuItem
                icon={<Inventory />}
                title="Theo dõi tồn kho"
                path="/inventory"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
              />
              <MenuItem
                icon={<MoveToInbox />}
                title="Nhập kho"
                path="/receive-tickets"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
              />
              <MenuItem
                icon={<Outbox />}
                title="Xuất kho"
                path="/issue-tickets"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
              />
              <MenuItem
                icon={<CompareArrows />}
                title="Chuyển kho"
                path="/transfer-tickets"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
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
                  />
                  <MenuItem
                    icon={<Outbox />}
                    title="Báo cáo xuất kho"
                    path="/issue-report"
                    selectedPath={selectedPath}
                    onSelect={handleSelect}
                    collapsed={!openSidebar}
                  />
                </List>
              </Collapse>
            </List>
          </Collapse>

          <Tooltip
            title={!openSidebar ? "Quản lý mua hàng" : ""}
            placement="right"
          >
            <ListItemButton onClick={() => handleToggle("purchasing")}>
              <ListItemIcon>
                <ShoppingCart />
              </ListItemIcon>
              {openSidebar && <ListItemText primary="Quản lý mua hàng" />}
              {openSidebar &&
                (openMenus.purchasing ? <ExpandLess /> : <ExpandMore />)}
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
              />
              <MenuItem
                icon={<RequestQuote />}
                title="Yêu cầu báo giá"
                path="/rfqs"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
              />
              <MenuItem
                icon={<Sell />}
                title="Báo giá từ nhà cung cấp"
                path="/customer-quotations"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
              />
              <MenuItem
                icon={<ListAlt />}
                title="Đơn mua hàng"
                path="/pos"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
              />
              <MenuItem
                icon={<BarChart />}
                title="Báo cáo mua hàng"
                path="/purchase-report"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
              />
            </List>
          </Collapse>

          <Tooltip
            title={!openSidebar ? "Quản lý bán hàng" : ""}
            placement="right"
          >
            <ListItemButton onClick={() => handleToggle("sales")}>
              <ListItemIcon>
                <Sell />
              </ListItemIcon>
              {openSidebar && <ListItemText primary="Quản lý bán hàng" />}
              {openSidebar &&
                (openMenus.sales ? <ExpandLess /> : <ExpandMore />)}
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
              />
              <MenuItem
                icon={<Sell />}
                title="Báo giá"
                path="/quotations"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
              />
              <MenuItem
                icon={<ShoppingBag />}
                title="Yêu cầu mua hàng"
                path="/supplier-pos"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
              />
              <MenuItem
                icon={<ListAlt />}
                title="Đơn bán hàng"
                path="/sos"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
              />
              <MenuItem
                icon={<BarChart />}
                title="Báo cáo bán hàng"
                path="/sales-report"
                selectedPath={selectedPath}
                onSelect={handleSelect}
                collapsed={!openSidebar}
              />
            </List>
          </Collapse>

          <Tooltip
            title={!openSidebar ? "Quản lý vận chuyển" : ""}
            placement="right"
          >
            <ListItemButton onClick={() => handleToggle("delivery")}>
              <ListItemIcon>
                <LocalShipping />
              </ListItemIcon>
              {openSidebar && <ListItemText primary="Quản lý vận chuyển" />}
              {openSidebar &&
                (openMenus.delivery ? <ExpandLess /> : <ExpandMore />)}
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
