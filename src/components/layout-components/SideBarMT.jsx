// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   Typography,
//   List,
//   ListItem,
//   ListItemPrefix,
//   Accordion,
//   AccordionHeader,
//   AccordionBody,
//   Button,
// } from "@material-tailwind/react";
// import {
//   HomeIcon,
//   InformationCircleIcon,
//   BuildingOfficeIcon,
//   UserGroupIcon,
//   UserIcon,
//   EnvelopeIcon,
//   CubeIcon,
//   BuildingStorefrontIcon,
//   WrenchScrewdriverIcon,
//   ListBulletIcon,
//   ChartBarIcon,
//   ShoppingCartIcon,
//   ShoppingBagIcon,
//   TruckIcon,
//   ClipboardDocumentListIcon,
//   DocumentTextIcon,
//   ArrowsRightLeftIcon,
//   InboxArrowDownIcon,
//   ArrowUpTrayIcon,
//   MagnifyingGlassIcon,
//   ArrowRightOnRectangleIcon,
//   ChevronDownIcon,
//   QrCodeIcon,
// } from "@heroicons/react/24/solid";
// import { useNavigate, useLocation } from "react-router-dom";

// const SideBarMT = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const companyType = localStorage.getItem("companyType");

//   const [openMenus, setOpenMenus] = useState(() => {
//     const saved = localStorage.getItem("openMenus");
//     return saved
//       ? JSON.parse(saved)
//       : {
//           info: false,
//           manufacturing: false,
//           inventory: false,
//           inventoryReport: false,
//           purchasing: false,
//           sales: false,
//           delivery: false,
//           product: false,
//         };
//   });

//   const [selectedPath, setSelectedPath] = useState(() => {
//     return (
//       localStorage.getItem("selectedMenuPath") ||
//       location.pathname ||
//       "/homepage"
//     );
//   });

//   useEffect(() => {
//     localStorage.setItem("openMenus", JSON.stringify(openMenus));
//   }, [openMenus]);

//   useEffect(() => {
//     localStorage.setItem("selectedMenuPath", selectedPath);
//   }, [selectedPath]);

//   const handleToggle = (menu) => {
//     setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
//   };

//   const handleSelect = (path) => {
//     setSelectedPath(path);
//     navigate(path);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const isActive = (path) =>
//     selectedPath === path || location.pathname === path;

//   return (
//     <Card className="h-screen w-[280px] rounded-none shadow-xl shadow-blue-gray-900/5 flex flex-col">
//       {/* Fixed Header */}
//       <div className="flex items-center justify-between p-4 min-h-[64px] border-b border-blue-gray-50">
//         <Typography variant="h6" color="blue-gray" className="font-bold">
//           Quản lí Chuỗi cung ứng
//         </Typography>
//       </div>

//       {/* Scrollable Menu */}
//       <div className="flex-1 overflow-y-auto overflow-x-hidden">
//         <List className="p-2">
//           {/* Home */}
//           <ListItem
//             selected={isActive("/homepage")}
//             onClick={() => handleSelect("/homepage")}
//           >
//             <ListItemPrefix>
//               <HomeIcon className="h-5 w-5" />
//             </ListItemPrefix>
//             Trang chủ
//           </ListItem>

//           {/* Info Management */}
//           <Accordion
//             open={openMenus.info || false}
//             icon={
//               <ChevronDownIcon
//                 strokeWidth={2.5}
//                 className={`mx-auto h-4 w-4 transition-transform ${
//                   openMenus.info ? "rotate-180" : ""
//                 }`}
//               />
//             }
//           >
//             <ListItem className="p-0" selected={openMenus.info}>
//               <AccordionHeader
//                 onClick={() => handleToggle("info")}
//                 className="border-b-0 p-3"
//               >
//                 <ListItemPrefix>
//                   <InformationCircleIcon className="h-5 w-5" />
//                 </ListItemPrefix>
//                 <Typography color="blue-gray" className="mr-auto font-normal">
//                   Quản lý thông tin chung
//                 </Typography>
//               </AccordionHeader>
//             </ListItem>
//             <AccordionBody className="py-1">
//               <List className="p-0">
//                 <ListItem
//                   selected={isActive("/company")}
//                   onClick={() => handleSelect("/company")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <BuildingOfficeIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Thông tin công ty
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/departments")}
//                   onClick={() => handleSelect("/departments")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <UserGroupIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Quản lý bộ phận
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/employees")}
//                   onClick={() => handleSelect("/employees")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <UserIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Quản lý nhân viên
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/users")}
//                   onClick={() => handleSelect("/users")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <EnvelopeIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Quản lý tài khoản
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/items")}
//                   onClick={() => handleSelect("/items")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <CubeIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Quản lý hàng hóa
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/warehouses")}
//                   onClick={() => handleSelect("/warehouses")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <BuildingStorefrontIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Quản lý kho
//                 </ListItem>
//                 {companyType === "Doanh nghiệp sản xuất" && (
//                   <>
//                     <ListItem
//                       selected={isActive("/plants")}
//                       onClick={() => handleSelect("/plants")}
//                       className="pl-8"
//                     >
//                       <ListItemPrefix>
//                         <BuildingOfficeIcon className="h-5 w-5" />
//                       </ListItemPrefix>
//                       Quản lý xưởng sản xuất
//                     </ListItem>
//                     <ListItem
//                       selected={isActive("/lines")}
//                       onClick={() => handleSelect("/lines")}
//                       className="pl-8"
//                     >
//                       <ListItemPrefix>
//                         <WrenchScrewdriverIcon className="h-5 w-5" />
//                       </ListItemPrefix>
//                       Quản lý dây chuyền
//                     </ListItem>
//                   </>
//                 )}

//                 <Accordion
//                   open={openMenus.product || false}
//                   icon={
//                     <ChevronDownIcon
//                       strokeWidth={2.5}
//                       className={`mx-auto h-4 w-4 transition-transform ${
//                         openMenus.product ? "rotate-180" : ""
//                       }`}
//                     />
//                   }
//                 >
//                   <ListItem className="p-0 pl-5" selected={openMenus.product}>
//                     <AccordionHeader
//                       onClick={() => handleToggle("product")}
//                       className="border-b-0 p-3"
//                     >
//                       <ListItemPrefix>
//                         <CubeIcon className="h-5 w-5" />
//                       </ListItemPrefix>
//                       <Typography
//                         color="blue-gray"
//                         className="mr-auto font-normal"
//                       >
//                         Quản lý sản phẩm
//                       </Typography>
//                     </AccordionHeader>
//                   </ListItem>
//                   <AccordionBody className="py-1">
//                     <List className="p-0">
//                       <ListItem
//                         selected={isActive("/products")}
//                         onClick={() => handleSelect("/products")}
//                         className="pl-12"
//                       >
//                         <ListItemPrefix>
//                           <ListBulletIcon className="h-5 w-5" />
//                         </ListItemPrefix>
//                         Sản phẩm đã tạo
//                       </ListItem>
//                       <ListItem
//                         selected={isActive("/product/scan")}
//                         onClick={() => handleSelect("/product/scan")}
//                         className="pl-12"
//                       >
//                         <ListItemPrefix>
//                           <QrCodeIcon className="h-5 w-5" />
//                         </ListItemPrefix>
//                         Quét QR Code
//                       </ListItem>
//                     </List>
//                   </AccordionBody>
//                 </Accordion>
//               </List>
//             </AccordionBody>
//           </Accordion>

//           {/* Manufacturing */}
//           {companyType === "Doanh nghiệp sản xuất" && (
//             <Accordion
//               open={openMenus.manufacturing || false}
//               icon={
//                 <ChevronDownIcon
//                   strokeWidth={2.5}
//                   className={`mx-auto h-4 w-4 transition-transform ${
//                     openMenus.manufacturing ? "rotate-180" : ""
//                   }`}
//                 />
//               }
//             >
//               <ListItem className="p-0" selected={openMenus.manufacturing}>
//                 <AccordionHeader
//                   onClick={() => handleToggle("manufacturing")}
//                   className="border-b-0 p-3"
//                 >
//                   <ListItemPrefix>
//                     <WrenchScrewdriverIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   <Typography color="blue-gray" className="mr-auto font-normal">
//                     Quản lý sản xuất
//                   </Typography>
//                 </AccordionHeader>
//               </ListItem>
//               <AccordionBody className="py-1">
//                 <List className="p-0">
//                   <ListItem
//                     selected={isActive("/mos")}
//                     onClick={() => handleSelect("/mos")}
//                     className="pl-8"
//                   >
//                     <ListItemPrefix>
//                       <ClipboardDocumentListIcon className="h-5 w-5" />
//                     </ListItemPrefix>
//                     Công lệnh sản xuất
//                   </ListItem>
//                   <ListItem
//                     selected={isActive("/boms")}
//                     onClick={() => handleSelect("/boms")}
//                     className="pl-8"
//                   >
//                     <ListItemPrefix>
//                       <DocumentTextIcon className="h-5 w-5" />
//                     </ListItemPrefix>
//                     BOM
//                   </ListItem>
//                   <ListItem
//                     selected={isActive("/stages")}
//                     onClick={() => handleSelect("/stages")}
//                     className="pl-8"
//                   >
//                     <ListItemPrefix>
//                       <ListBulletIcon className="h-5 w-5" />
//                     </ListItemPrefix>
//                     Quy trình sản xuất
//                   </ListItem>
//                   <ListItem
//                     selected={isActive("/manufacture-report")}
//                     onClick={() => handleSelect("/manufacture-report")}
//                     className="pl-8"
//                   >
//                     <ListItemPrefix>
//                       <ChartBarIcon className="h-5 w-5" />
//                     </ListItemPrefix>
//                     Báo cáo sản xuất
//                   </ListItem>
//                 </List>
//               </AccordionBody>
//             </Accordion>
//           )}

//           {/* Inventory */}
//           <Accordion
//             open={openMenus.inventory || false}
//             icon={
//               <ChevronDownIcon
//                 strokeWidth={2.5}
//                 className={`mx-auto h-4 w-4 transition-transform ${
//                   openMenus.inventory ? "rotate-180" : ""
//                 }`}
//               />
//             }
//           >
//             <ListItem className="p-0" selected={openMenus.inventory}>
//               <AccordionHeader
//                 onClick={() => handleToggle("inventory")}
//                 className="border-b-0 p-3"
//               >
//                 <ListItemPrefix>
//                   <BuildingStorefrontIcon className="h-5 w-5" />
//                 </ListItemPrefix>
//                 <Typography color="blue-gray" className="mr-auto font-normal">
//                   Quản lý kho
//                 </Typography>
//               </AccordionHeader>
//             </ListItem>
//             <AccordionBody className="py-1">
//               <List className="p-0">
//                 <ListItem
//                   selected={isActive("/inventory-count")}
//                   onClick={() => handleSelect("/inventory-count")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <ClipboardDocumentListIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Kiểm kê
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/inventory")}
//                   onClick={() => handleSelect("/inventory")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <CubeIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Theo dõi tồn kho
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/receive-tickets")}
//                   onClick={() => handleSelect("/receive-tickets")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <InboxArrowDownIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Nhập kho
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/issue-tickets")}
//                   onClick={() => handleSelect("/issue-tickets")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <ArrowUpTrayIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Xuất kho
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/transfer-tickets")}
//                   onClick={() => handleSelect("/transfer-tickets")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <ArrowsRightLeftIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Chuyển kho
//                 </ListItem>

//                 {/* Nested Inventory Report */}
//                 <Accordion
//                   open={openMenus.inventoryReport || false}
//                   icon={
//                     <ChevronDownIcon
//                       strokeWidth={2.5}
//                       className={`mx-auto h-4 w-4 transition-transform ${
//                         openMenus.inventoryReport ? "rotate-180" : ""
//                       }`}
//                     />
//                   }
//                 >
//                   <ListItem
//                     className="p-0 pl-8"
//                     selected={openMenus.inventoryReport}
//                   >
//                     <AccordionHeader
//                       onClick={() => handleToggle("inventoryReport")}
//                       className="border-b-0 p-3"
//                     >
//                       <ListItemPrefix>
//                         <ChartBarIcon className="h-5 w-5" />
//                       </ListItemPrefix>
//                       <Typography
//                         color="blue-gray"
//                         className="mr-auto font-normal"
//                       >
//                         Báo cáo nhập xuất
//                       </Typography>
//                     </AccordionHeader>
//                   </ListItem>
//                   <AccordionBody className="py-1">
//                     <List className="p-0">
//                       <ListItem
//                         selected={isActive("/receive-report")}
//                         onClick={() => handleSelect("/receive-report")}
//                         className="pl-16"
//                       >
//                         <ListItemPrefix>
//                           <InboxArrowDownIcon className="h-5 w-5" />
//                         </ListItemPrefix>
//                         Báo cáo nhập kho
//                       </ListItem>
//                       <ListItem
//                         selected={isActive("/issue-report")}
//                         onClick={() => handleSelect("/issue-report")}
//                         className="pl-16"
//                       >
//                         <ListItemPrefix>
//                           <ArrowUpTrayIcon className="h-5 w-5" />
//                         </ListItemPrefix>
//                         Báo cáo xuất kho
//                       </ListItem>
//                     </List>
//                   </AccordionBody>
//                 </Accordion>
//               </List>
//             </AccordionBody>
//           </Accordion>

//           {/* Purchasing */}
//           <Accordion
//             open={openMenus.purchasing || false}
//             icon={
//               <ChevronDownIcon
//                 strokeWidth={2.5}
//                 className={`mx-auto h-4 w-4 transition-transform ${
//                   openMenus.purchasing ? "rotate-180" : ""
//                 }`}
//               />
//             }
//           >
//             <ListItem className="p-0" selected={openMenus.purchasing}>
//               <AccordionHeader
//                 onClick={() => handleToggle("purchasing")}
//                 className="border-b-0 p-3"
//               >
//                 <ListItemPrefix>
//                   <ShoppingCartIcon className="h-5 w-5" />
//                 </ListItemPrefix>
//                 <Typography color="blue-gray" className="mr-auto font-normal">
//                   Quản lý mua hàng
//                 </Typography>
//               </AccordionHeader>
//             </ListItem>
//             <AccordionBody className="py-1">
//               <List className="p-0">
//                 <ListItem
//                   selected={isActive("/supplier-search")}
//                   onClick={() => handleSelect("/supplier-search")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <MagnifyingGlassIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Tìm nhà cung cấp
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/rfqs")}
//                   onClick={() => handleSelect("/rfqs")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <DocumentTextIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Yêu cầu báo giá
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/customer-quotations")}
//                   onClick={() => handleSelect("/customer-quotations")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <DocumentTextIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Báo giá từ nhà cung cấp
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/pos")}
//                   onClick={() => handleSelect("/pos")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <ListBulletIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Đơn mua hàng
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/purchase-report")}
//                   onClick={() => handleSelect("/purchase-report")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <ChartBarIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Báo cáo mua hàng
//                 </ListItem>
//               </List>
//             </AccordionBody>
//           </Accordion>

//           {/* Sales */}
//           <Accordion
//             open={openMenus.sales || false}
//             icon={
//               <ChevronDownIcon
//                 strokeWidth={2.5}
//                 className={`mx-auto h-4 w-4 transition-transform ${
//                   openMenus.sales ? "rotate-180" : ""
//                 }`}
//               />
//             }
//           >
//             <ListItem className="p-0" selected={openMenus.sales}>
//               <AccordionHeader
//                 onClick={() => handleToggle("sales")}
//                 className="border-b-0 p-3"
//               >
//                 <ListItemPrefix>
//                   <ShoppingBagIcon className="h-5 w-5" />
//                 </ListItemPrefix>
//                 <Typography color="blue-gray" className="mr-auto font-normal">
//                   Quản lý bán hàng
//                 </Typography>
//               </AccordionHeader>
//             </ListItem>
//             <AccordionBody className="py-1">
//               <List className="p-0">
//                 <ListItem
//                   selected={isActive("/supplier-rfqs")}
//                   onClick={() => handleSelect("/supplier-rfqs")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <DocumentTextIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Gửi báo giá
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/quotations")}
//                   onClick={() => handleSelect("/quotations")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <DocumentTextIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Báo giá
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/supplier-pos")}
//                   onClick={() => handleSelect("/supplier-pos")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <ShoppingBagIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Yêu cầu mua hàng
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/sos")}
//                   onClick={() => handleSelect("/sos")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <ListBulletIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Đơn bán hàng
//                 </ListItem>
//                 <ListItem
//                   selected={isActive("/sales-report")}
//                   onClick={() => handleSelect("/sales-report")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <ChartBarIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Báo cáo bán hàng
//                 </ListItem>
//               </List>
//             </AccordionBody>
//           </Accordion>

//           {/* Delivery */}
//           <Accordion
//             open={openMenus.delivery || false}
//             icon={
//               <ChevronDownIcon
//                 strokeWidth={2.5}
//                 className={`mx-auto h-4 w-4 transition-transform ${
//                   openMenus.delivery ? "rotate-180" : ""
//                 }`}
//               />
//             }
//           >
//             <ListItem className="p-0" selected={openMenus.delivery}>
//               <AccordionHeader
//                 onClick={() => handleToggle("delivery")}
//                 className="border-b-0 p-3"
//               >
//                 <ListItemPrefix>
//                   <TruckIcon className="h-5 w-5" />
//                 </ListItemPrefix>
//                 <Typography color="blue-gray" className="mr-auto font-normal">
//                   Quản lý vận chuyển
//                 </Typography>
//               </AccordionHeader>
//             </ListItem>
//             <AccordionBody className="py-1">
//               <List className="p-0">
//                 <ListItem
//                   selected={isActive("/dos")}
//                   onClick={() => handleSelect("/dos")}
//                   className="pl-8"
//                 >
//                   <ListItemPrefix>
//                     <TruckIcon className="h-5 w-5" />
//                   </ListItemPrefix>
//                   Đơn vận chuyển
//                 </ListItem>
//               </List>
//             </AccordionBody>
//           </Accordion>
//         </List>
//       </div>

//       {/* Fixed Logout Button */}
//       <div className="p-4 border-t border-blue-gray-50">
//         <Button
//           color="red"
//           fullWidth
//           onClick={handleLogout}
//           className="flex items-center justify-center gap-2"
//         >
//           <ArrowRightOnRectangleIcon className="h-5 w-5" />
//           Đăng xuất
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default SideBarMT;

import {
  ArrowRightOnRectangleIcon,
  ArrowsRightLeftIcon,
  ArrowUpTrayIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  HomeIcon,
  InboxArrowDownIcon,
  InformationCircleIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  QrCodeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TruckIcon,
  UserGroupIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/solid";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Button,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SideBarMT = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const companyType = localStorage.getItem("companyType");

  // Collapsible state
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });

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
        product: false,
      };
  });

  useEffect(() => {
    localStorage.setItem("openMenus", JSON.stringify(openMenus));
  }, [openMenus]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
  }, [isCollapsed]);

  const handleToggle = (menu) => {
    if (!isCollapsed) {
      setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Improved Active Logic
  const isActive = (path) => {
    if (path === "/homepage") {
      return location.pathname === "/homepage" || location.pathname === "/";
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setOpenMenus({
        info: false,
        manufacturing: false,
        inventory: false,
        inventoryReport: false,
        purchasing: false,
        sales: false,
        delivery: false,
        product: false,
      });
    }
  };

  // Render Icon Item for Collapsed State
  const renderCollapsedItem = (path, icon, label, isParent = false, menuKey = null) => {
    const Icon = icon;
    const active = !isParent && isActive(path);

    return (
      <Tooltip content={label} placement="right" className="z-50 bg-blue-gray-900 text-white px-2 py-1 rounded text-xs font-medium shadow-lg">
        <div className="flex justify-center w-full mb-2">
          <IconButton
            variant="text"
            color={active ? "blue" : "blue-gray"}
            className={`rounded-lg w-10 h-10 hover:bg-blue-gray-50 dark:hover:bg-white/10 ${active ? "bg-blue-50 text-blue-600" : "text-blue-gray-500"
              }`}
            onClick={() => {
              if (isParent) {
                setIsCollapsed(false);
                if (menuKey) handleToggle(menuKey);
              } else {
                handleNavigate(path);
              }
            }}
          >
            <Icon className="h-6 w-6" />
          </IconButton>
        </div>
      </Tooltip>
    );
  };

  // Helper to render menu item (Expanded)
  const renderMenuItem = (path, icon, label, isChild = false) => {
    const Icon = icon;
    const active = isActive(path);

    return (
      <ListItem
        selected={active}
        onClick={() => handleNavigate(path)}
        className={`mb-1 transition-colors ${isChild ? "pl-10" : "p-3"
          } ${active
            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
            : "hover:bg-blue-gray-50 text-blue-gray-700 dark:text-dark-text dark:hover:bg-white/10"
          }`}
      >
        <ListItemPrefix className="mr-3">
          <Icon className="h-5 w-5" />
        </ListItemPrefix>
        <Typography color="inherit" className="font-medium text-sm truncate">
          {label}
        </Typography>
      </ListItem>
    );
  };

  // Helper to render parent item (Expanded)
  const renderParentItem = (menuKey, icon, label, children) => {
    const Icon = icon;
    const isOpen = openMenus[menuKey];

    return (
      <Accordion
        open={isOpen || false}
        icon={
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`mx-auto h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""
              }`}
          />
        }
      >
        <ListItem className="p-0 mb-1" selected={isOpen}>
          <AccordionHeader
            onClick={() => handleToggle(menuKey)}
            className="border-b-0 p-3 hover:bg-blue-gray-50 dark:hover:bg-white/10"
          >
            <ListItemPrefix className="mr-3">
              <Icon className="h-5 w-5 text-blue-gray-700 dark:text-dark-text" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-medium text-sm dark:text-dark-text truncate">
              {label}
            </Typography>
          </AccordionHeader>
        </ListItem>
        <AccordionBody className="py-1">
          <List className="p-0">
            {children}
          </List>
        </AccordionBody>
      </Accordion>
    );
  };

  return (
    <Card
      className={`h-screen rounded-none shadow-xl shadow-blue-gray-900/5 flex flex-col transition-all duration-300 dark:bg-dark-surface dark:border-r dark:border-dark-border ${isCollapsed ? "w-[80px]" : "w-[280px]"
        }`}
    >
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-4 min-h-[67px] bg-blue-600 dark:bg-blue-900 transition-colors">
        {!isCollapsed && (
          <Typography variant="h6" color="white" className="font-bold tracking-wide">
            Quản lí Chuỗi cung ứng
          </Typography>
        )}
        <IconButton
          variant="text"
          size="sm"
          onClick={toggleSidebar}
          className={`${isCollapsed ? "mx-auto" : ""} text-white hover:bg-white/20 rounded-full`}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </IconButton>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {isCollapsed ? (
          // Collapsed View: Simple list of icons
          <div className="flex flex-col items-center py-4 gap-1">
            {renderCollapsedItem("/homepage", HomeIcon, "Trang chủ")}
            {renderCollapsedItem(null, InformationCircleIcon, "Quản lý thông tin", true, "info")}
            {companyType === "Doanh nghiệp sản xuất" &&
              renderCollapsedItem(null, WrenchScrewdriverIcon, "Quản lý sản xuất", true, "manufacturing")
            }
            {renderCollapsedItem(null, BuildingStorefrontIcon, "Quản lý kho", true, "inventory")}
            {renderCollapsedItem(null, ShoppingCartIcon, "Quản lý mua hàng", true, "purchasing")}
            {renderCollapsedItem(null, ShoppingBagIcon, "Quản lý bán hàng", true, "sales")}
            {renderCollapsedItem(null, TruckIcon, "Quản lý vận chuyển", true, "delivery")}
          </div>
        ) : (
          // Expanded View: Full List with Accordions
          <List className="p-2">
            {renderMenuItem("/homepage", HomeIcon, "Trang chủ")}

            {renderParentItem("info", InformationCircleIcon, "Quản lý thông tin", (
              <>
                {renderMenuItem("/company", BuildingOfficeIcon, "Thông tin công ty", true)}
                {renderMenuItem("/departments", UserGroupIcon, "Quản lý bộ phận", true)}
                {renderMenuItem("/employees", UserIcon, "Quản lý nhân viên", true)}
                {renderMenuItem("/users", EnvelopeIcon, "Quản lý tài khoản", true)}
                {renderMenuItem("/items", CubeIcon, "Quản lý hàng hóa", true)}
                {renderMenuItem("/warehouses", BuildingStorefrontIcon, "Quản lý kho", true)}
                {companyType === "Doanh nghiệp sản xuất" && (
                  <>
                    {renderMenuItem("/plants", BuildingOfficeIcon, "Xưởng sản xuất", true)}
                    {renderMenuItem("/lines", WrenchScrewdriverIcon, "Dây chuyền", true)}
                  </>
                )}
                {renderMenuItem("/products", ListBulletIcon, "Sản phẩm đã tạo", true)}
                {renderMenuItem("/product/scan", QrCodeIcon, "Quét QR Code", true)}
              </>
            ))}

            {companyType === "Doanh nghiệp sản xuất" && renderParentItem("manufacturing", WrenchScrewdriverIcon, "Quản lý sản xuất", (
              <>
                {renderMenuItem("/mos", ClipboardDocumentListIcon, "Công lệnh sản xuất", true)}
                {renderMenuItem("/boms", DocumentTextIcon, "BOM", true)}
                {renderMenuItem("/stages", ListBulletIcon, "Quy trình sản xuất", true)}
                {renderMenuItem("/manufacture-report", ChartBarIcon, "Báo cáo sản xuất", true)}
              </>
            ))}

            {renderParentItem("inventory", BuildingStorefrontIcon, "Quản lý kho", (
              <>
                {renderMenuItem("/inventory-count", ClipboardDocumentListIcon, "Kiểm kê", true)}
                {renderMenuItem("/receive-tickets", InboxArrowDownIcon, "Nhập kho", true)}
                {renderMenuItem("/issue-tickets", ArrowUpTrayIcon, "Xuất kho", true)}
                {renderMenuItem("/transfer-tickets", ArrowsRightLeftIcon, "Chuyển kho", true)}
                {renderMenuItem("/receive-report", InboxArrowDownIcon, "Báo cáo nhập kho", true)}
                {renderMenuItem("/issue-report", ArrowUpTrayIcon, "Báo cáo xuất kho", true)}
              </>
            ))}

            {renderParentItem("purchasing", ShoppingCartIcon, "Quản lý mua hàng", (
              <>
                {renderMenuItem("/supplier-search", MagnifyingGlassIcon, "Tìm nhà cung cấp", true)}
                {renderMenuItem("/rfqs", DocumentTextIcon, "Yêu cầu báo giá", true)}
                {renderMenuItem("/customer-quotations", DocumentTextIcon, "Báo giá từ NCC", true)}
                {renderMenuItem("/pos", ListBulletIcon, "Đơn mua hàng", true)}
                {renderMenuItem("/purchase-report", ChartBarIcon, "Báo cáo mua hàng", true)}
              </>
            ))}

            {renderParentItem("sales", ShoppingBagIcon, "Quản lý bán hàng", (
              <>
                {renderMenuItem("/supplier-rfqs", DocumentTextIcon, "Gửi báo giá", true)}
                {renderMenuItem("/quotations", DocumentTextIcon, "Báo giá", true)}
                {renderMenuItem("/supplier-pos", ShoppingBagIcon, "Yêu cầu mua hàng", true)}
                {renderMenuItem("/sos", ListBulletIcon, "Đơn bán hàng", true)}
                {renderMenuItem("/sales-report", ChartBarIcon, "Báo cáo bán hàng", true)}
              </>
            ))}

            {renderParentItem("delivery", TruckIcon, "Quản lý vận chuyển", (
              <>
                {renderMenuItem("/dos", TruckIcon, "Đơn vận chuyển", true)}
              </>
            ))}
          </List>
        )}
      </div>

      {/* Fixed Logout Button */}
      <div className="p-4 border-t border-blue-gray-50 dark:border-dark-border">
        {isCollapsed ? (
          <Tooltip content="Đăng xuất" placement="right" className="z-50 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium shadow-lg">
            <div className="flex justify-center">
              <IconButton
                color="red"
                onClick={handleLogout}
                className="w-10 h-10 rounded-lg shadow-none hover:shadow-md"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </IconButton>
            </div>
          </Tooltip>
        ) : (
          <Button
            color="red"
            fullWidth
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 shadow-none hover:shadow-md"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Đăng xuất
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SideBarMT;
