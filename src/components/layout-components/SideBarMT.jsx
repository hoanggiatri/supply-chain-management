import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Button,
} from "@material-tailwind/react";
import {
  HomeIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  UserIcon,
  EnvelopeIcon,
  CubeIcon,
  BuildingStorefrontIcon,
  WrenchScrewdriverIcon,
  ListBulletIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ArrowsRightLeftIcon,
  InboxArrowDownIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";

const SideBarMT = () => {
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
          inventory: false,
          inventoryReport: false,
          purchasing: false,
          sales: false,
          delivery: false,
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

  const isActive = (path) => selectedPath === path || location.pathname === path;

  return (
    <Card className="h-screen w-[280px] rounded-none shadow-xl shadow-blue-gray-900/5 flex flex-col">
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-4 min-h-[64px] border-b border-blue-gray-50">
        <Typography variant="h6" color="blue-gray" className="font-bold">
          Quản lí Chuỗi cung ứng
        </Typography>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <List className="p-2">
          {/* Home */}
          <ListItem
            selected={isActive("/homepage")}
            onClick={() => handleSelect("/homepage")}
          >
            <ListItemPrefix>
              <HomeIcon className="h-5 w-5" />
            </ListItemPrefix>
            Trang chủ
          </ListItem>

          {/* Info Management */}
          <Accordion
            open={openMenus.info || false}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${
                  openMenus.info ? "rotate-180" : ""
                }`}
              />
            }
          >
            <ListItem className="p-0" selected={openMenus.info}>
              <AccordionHeader
                onClick={() => handleToggle("info")}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <InformationCircleIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Quản lý thông tin chung
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem
                  selected={isActive("/company")}
                  onClick={() => handleSelect("/company")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <BuildingOfficeIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Thông tin công ty
                </ListItem>
                <ListItem
                  selected={isActive("/departments")}
                  onClick={() => handleSelect("/departments")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <UserGroupIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Quản lý bộ phận
                </ListItem>
                <ListItem
                  selected={isActive("/employees")}
                  onClick={() => handleSelect("/employees")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <UserIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Quản lý nhân viên
                </ListItem>
                <ListItem
                  selected={isActive("/users")}
                  onClick={() => handleSelect("/users")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <EnvelopeIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Quản lý tài khoản
                </ListItem>
                <ListItem
                  selected={isActive("/items")}
                  onClick={() => handleSelect("/items")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <CubeIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Quản lý hàng hóa
                </ListItem>
                <ListItem
                  selected={isActive("/warehouses")}
                  onClick={() => handleSelect("/warehouses")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <BuildingStorefrontIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Quản lý kho
                </ListItem>
                {companyType === "Doanh nghiệp sản xuất" && (
                  <>
                    <ListItem
                      selected={isActive("/plants")}
                      onClick={() => handleSelect("/plants")}
                      className="pl-8"
                    >
                      <ListItemPrefix>
                        <BuildingOfficeIcon className="h-5 w-5" />
                      </ListItemPrefix>
                      Quản lý xưởng sản xuất
                    </ListItem>
                    <ListItem
                      selected={isActive("/lines")}
                      onClick={() => handleSelect("/lines")}
                      className="pl-8"
                    >
                      <ListItemPrefix>
                        <WrenchScrewdriverIcon className="h-5 w-5" />
                      </ListItemPrefix>
                      Quản lý dây chuyền
                    </ListItem>
                  </>
                )}
              </List>
            </AccordionBody>
          </Accordion>

          {/* Manufacturing */}
          {companyType === "Doanh nghiệp sản xuất" && (
            <Accordion
              open={openMenus.manufacturing || false}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    openMenus.manufacturing ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0" selected={openMenus.manufacturing}>
                <AccordionHeader
                  onClick={() => handleToggle("manufacturing")}
                  className="border-b-0 p-3"
                >
                  <ListItemPrefix>
                    <WrenchScrewdriverIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Quản lý sản xuất
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  <ListItem
                    selected={isActive("/mos")}
                    onClick={() => handleSelect("/mos")}
                    className="pl-8"
                  >
                    <ListItemPrefix>
                      <ClipboardDocumentListIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Công lệnh sản xuất
                  </ListItem>
                  <ListItem
                    selected={isActive("/boms")}
                    onClick={() => handleSelect("/boms")}
                    className="pl-8"
                  >
                    <ListItemPrefix>
                      <DocumentTextIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    BOM
                  </ListItem>
                  <ListItem
                    selected={isActive("/stages")}
                    onClick={() => handleSelect("/stages")}
                    className="pl-8"
                  >
                    <ListItemPrefix>
                      <ListBulletIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Quy trình sản xuất
                  </ListItem>
                  <ListItem
                    selected={isActive("/manufacture-report")}
                    onClick={() => handleSelect("/manufacture-report")}
                    className="pl-8"
                  >
                    <ListItemPrefix>
                      <ChartBarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Báo cáo sản xuất
                  </ListItem>
                </List>
              </AccordionBody>
            </Accordion>
          )}

          {/* Inventory */}
          <Accordion
            open={openMenus.inventory || false}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${
                  openMenus.inventory ? "rotate-180" : ""
                }`}
              />
            }
          >
            <ListItem className="p-0" selected={openMenus.inventory}>
              <AccordionHeader
                onClick={() => handleToggle("inventory")}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <BuildingStorefrontIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Quản lý kho
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem
                  selected={isActive("/inventory-count")}
                  onClick={() => handleSelect("/inventory-count")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <ClipboardDocumentListIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Kiểm kê
                </ListItem>
                <ListItem
                  selected={isActive("/inventory")}
                  onClick={() => handleSelect("/inventory")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <CubeIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Theo dõi tồn kho
                </ListItem>
                <ListItem
                  selected={isActive("/receive-tickets")}
                  onClick={() => handleSelect("/receive-tickets")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <InboxArrowDownIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Nhập kho
                </ListItem>
                <ListItem
                  selected={isActive("/issue-tickets")}
                  onClick={() => handleSelect("/issue-tickets")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <ArrowUpTrayIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Xuất kho
                </ListItem>
                <ListItem
                  selected={isActive("/transfer-tickets")}
                  onClick={() => handleSelect("/transfer-tickets")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <ArrowsRightLeftIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Chuyển kho
                </ListItem>

                {/* Nested Inventory Report */}
                <Accordion
                  open={openMenus.inventoryReport || false}
                  icon={
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={`mx-auto h-4 w-4 transition-transform ${
                        openMenus.inventoryReport ? "rotate-180" : ""
                      }`}
                    />
                  }
                >
                  <ListItem className="p-0 pl-8" selected={openMenus.inventoryReport}>
                    <AccordionHeader
                      onClick={() => handleToggle("inventoryReport")}
                      className="border-b-0 p-3"
                    >
                      <ListItemPrefix>
                        <ChartBarIcon className="h-5 w-5" />
                      </ListItemPrefix>
                      <Typography color="blue-gray" className="mr-auto font-normal">
                        Báo cáo nhập xuất
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                  <AccordionBody className="py-1">
                    <List className="p-0">
                      <ListItem
                        selected={isActive("/receive-report")}
                        onClick={() => handleSelect("/receive-report")}
                        className="pl-16"
                      >
                        <ListItemPrefix>
                          <InboxArrowDownIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Báo cáo nhập kho
                      </ListItem>
                      <ListItem
                        selected={isActive("/issue-report")}
                        onClick={() => handleSelect("/issue-report")}
                        className="pl-16"
                      >
                        <ListItemPrefix>
                          <ArrowUpTrayIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Báo cáo xuất kho
                      </ListItem>
                    </List>
                  </AccordionBody>
                </Accordion>
              </List>
            </AccordionBody>
          </Accordion>

          {/* Purchasing */}
          <Accordion
            open={openMenus.purchasing || false}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${
                  openMenus.purchasing ? "rotate-180" : ""
                }`}
              />
            }
          >
            <ListItem className="p-0" selected={openMenus.purchasing}>
              <AccordionHeader
                onClick={() => handleToggle("purchasing")}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <ShoppingCartIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Quản lý mua hàng
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem
                  selected={isActive("/supplier-search")}
                  onClick={() => handleSelect("/supplier-search")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Tìm nhà cung cấp
                </ListItem>
                <ListItem
                  selected={isActive("/rfqs")}
                  onClick={() => handleSelect("/rfqs")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <DocumentTextIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Yêu cầu báo giá
                </ListItem>
                <ListItem
                  selected={isActive("/customer-quotations")}
                  onClick={() => handleSelect("/customer-quotations")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <DocumentTextIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Báo giá từ nhà cung cấp
                </ListItem>
                <ListItem
                  selected={isActive("/pos")}
                  onClick={() => handleSelect("/pos")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <ListBulletIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Đơn mua hàng
                </ListItem>
                <ListItem
                  selected={isActive("/purchase-report")}
                  onClick={() => handleSelect("/purchase-report")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <ChartBarIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Báo cáo mua hàng
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>

          {/* Sales */}
          <Accordion
            open={openMenus.sales || false}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${
                  openMenus.sales ? "rotate-180" : ""
                }`}
              />
            }
          >
            <ListItem className="p-0" selected={openMenus.sales}>
              <AccordionHeader
                onClick={() => handleToggle("sales")}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <ShoppingBagIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Quản lý bán hàng
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem
                  selected={isActive("/supplier-rfqs")}
                  onClick={() => handleSelect("/supplier-rfqs")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <DocumentTextIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Gửi báo giá
                </ListItem>
                <ListItem
                  selected={isActive("/quotations")}
                  onClick={() => handleSelect("/quotations")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <DocumentTextIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Báo giá
                </ListItem>
                <ListItem
                  selected={isActive("/supplier-pos")}
                  onClick={() => handleSelect("/supplier-pos")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <ShoppingBagIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Yêu cầu mua hàng
                </ListItem>
                <ListItem
                  selected={isActive("/sos")}
                  onClick={() => handleSelect("/sos")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <ListBulletIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Đơn bán hàng
                </ListItem>
                <ListItem
                  selected={isActive("/sales-report")}
                  onClick={() => handleSelect("/sales-report")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <ChartBarIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Báo cáo bán hàng
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>

          {/* Delivery */}
          <Accordion
            open={openMenus.delivery || false}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${
                  openMenus.delivery ? "rotate-180" : ""
                }`}
              />
            }
          >
            <ListItem className="p-0" selected={openMenus.delivery}>
              <AccordionHeader
                onClick={() => handleToggle("delivery")}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <TruckIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Quản lý vận chuyển
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem
                  selected={isActive("/dos")}
                  onClick={() => handleSelect("/dos")}
                  className="pl-8"
                >
                  <ListItemPrefix>
                    <TruckIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Đơn vận chuyển
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>
        </List>
      </div>

      {/* Fixed Logout Button */}
      <div className="p-4 border-t border-blue-gray-50">
        <Button
          color="red"
          fullWidth
          onClick={handleLogout}
          className="flex items-center justify-center gap-2"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Đăng xuất
        </Button>
      </div>
    </Card>
  );
};

export default SideBarMT;
