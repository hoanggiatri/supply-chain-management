// import React from "react";
// import {
//   Navbar,
//   Typography,
//   IconButton,
//   Menu,
//   MenuHandler,
//   MenuList,
//   MenuItem,
// } from "@material-tailwind/react";
// import {
//   UserCircleIcon,
//   BellIcon,
//   Cog6ToothIcon,
// } from "@heroicons/react/24/solid";
// import { useNavigate } from "react-router-dom";

// const HeaderMT = () => {
//   const navigate = useNavigate();

//   const handleProfileClick = () => {
//     navigate("/my-profile");
//   };

//   return (
//     <Navbar className="z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-3 border-b border-blue-gray-100 bg-white shadow-sm">
//       <div className="flex items-center justify-between">
//         {/* Empty Left Side (removed toggle button) */}
//         <div></div>

//         {/* Right Side Icons */}
//         <div className="flex items-center gap-2">
//           {/* Profile Button */}
//           <IconButton
//             variant="text"
//             className="hover:bg-blue-gray-50"
//             onClick={handleProfileClick}
//           >
//             <UserCircleIcon className="h-6 w-6" />
//           </IconButton>

//           {/* Notifications Menu */}
//           <Menu placement="bottom-end">
//             <MenuHandler>
//               <IconButton variant="text" className="hover:bg-blue-gray-50">
//                 <BellIcon className="h-6 w-6" />
//               </IconButton>
//             </MenuHandler>
//             <MenuList>
//               <MenuItem disabled>
//                 <Typography variant="small" className="font-normal">
//                   Không có thông báo
//                 </Typography>
//               </MenuItem>
//             </MenuList>
//           </Menu>

//           {/* Settings Menu */}
//           <Menu placement="bottom-end">
//             <MenuHandler>
//               <IconButton variant="text" className="hover:bg-blue-gray-50">
//                 <Cog6ToothIcon className="h-6 w-6" />
//               </IconButton>
//             </MenuHandler>
//             <MenuList>
//               <MenuItem disabled>
//                 <Typography variant="small" className="font-normal">
//                   Không có nội dung thiết lập
//                 </Typography>
//               </MenuItem>
//             </MenuList>
//           </Menu>
//         </div>
//       </div>
//     </Navbar>
//   );
// };

// export default HeaderMT;

import React, { useState, useEffect, useRef } from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Badge,
  Input,
  Card,
  List,
  ListItem,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  CommandLineIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";

// Navigation Items for Search
const NAV_ITEMS = [
  { title: "Trang chủ", path: "/homepage", keywords: "home trang chu dashboard" },
  { title: "Sản phẩm", path: "/products", keywords: "san pham product list" },
  { title: "Quét QR Code", path: "/product/scan", keywords: "scan quet qr code" },
  { title: "Công lệnh sản xuất (MO)", path: "/mos", keywords: "mo manufacturing order san xuat" },
  { title: "Định mức (BOM)", path: "/boms", keywords: "bom dinh muc bill of materials" },
  { title: "Tồn kho", path: "/inventory", keywords: "ton kho inventory stock" },
  { title: "Kiểm kê kho", path: "/inventory-count", keywords: "kiem ke count check" },
  { title: "Nhập kho", path: "/receive-tickets", keywords: "nhap kho receive in" },
  { title: "Xuất kho", path: "/issue-tickets", keywords: "xuat kho issue out" },
  { title: "Chuyển kho", path: "/transfer-tickets", keywords: "chuyen kho transfer" },
  { title: "Nhân viên", path: "/employees", keywords: "nhan vien employee staff" },
  { title: "Tài khoản", path: "/users", keywords: "tai khoan user account" },
  { title: "Công ty", path: "/company", keywords: "cong ty company info" },
  { title: "Phòng ban", path: "/departments", keywords: "phong ban department" },
  { title: "Mua hàng (PO)", path: "/pos", keywords: "mua hang purchase order po" },
  { title: "Bán hàng (SO)", path: "/sos", keywords: "ban hang sales order so" },
  { title: "Hàng hoá", path: "/items", keywords: "hang hoa item list" }
];

const HeaderMT = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("email") || "";

  // Handle click outside search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = NAV_ITEMS.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.keywords.includes(query)
    ).slice(0, 5); // Limit to 5 results

    setSearchResults(results);
    setShowResults(true);
  }, [searchQuery]);

  // Dark Mode Logic
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleNavigate = (path) => {
    navigate(path);
    setSearchQuery("");
    setShowResults(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Improved Breadcrumb Logic
  const getBreadcrumbs = () => {
    // Nếu là trang chủ
    if (location.pathname === "/homepage" || location.pathname === "/") {
      return [{ label: "Trang chủ", path: "/homepage", isActive: true }];
    }

    const paths = location.pathname.split("/").filter(Boolean);
    // Filter out 'homepage' to avoid duplication
    const filteredPaths = paths.filter(p => p !== "homepage");

    const breadcrumbs = [{ label: "Trang chủ", path: "/homepage" }];

    // Comprehensive Path Map
    const pathMap = {
      // General
      company: "Thông tin công ty",
      departments: "Phòng ban",
      employees: "Nhân viên",
      users: "Tài khoản",
      items: "Hàng hóa",
      warehouses: "Kho hàng",
      plants: "Nhà máy",
      lines: "Dây chuyền",

      // Product
      products: "Sản phẩm",
      product: "Sản phẩm",
      scan: "Quét QR",

      // Manufacturing
      mos: "Công lệnh (MO)",
      "create-mo": "Tạo MO",
      boms: "Định mức (BOM)",
      stages: "Công đoạn",
      "manufacture-report": "Báo cáo SX",

      // Inventory
      inventory: "Tồn kho",
      "inventory-count": "Kiểm kê",
      "receive-tickets": "Nhập kho",
      "issue-tickets": "Xuất kho",
      "transfer-tickets": "Chuyển kho",
      "receive-report": "Báo cáo nhập",
      "issue-report": "Báo cáo xuất",

      // Purchasing & Sales
      "supplier-search": "Tìm NCC",
      rfqs: "RFQ",
      "customer-quotations": "Báo giá NCC",
      pos: "Đơn mua (PO)",
      "purchase-report": "Báo cáo mua",
      "supplier-rfqs": "Yêu cầu KH",
      quotations: "Báo giá bán",
      "supplier-pos": "Đơn đặt hàng",
      sos: "Đơn bán (SO)",
      "sales-report": "Báo cáo bán",

      // Delivery
      dos: "Vận chuyển",

      // Profile
      "my-profile": "Hồ sơ của tôi"
    };

    let currentPath = "";
    filteredPaths.forEach((path, index) => {
      currentPath += `/${path}`;

      // Check if it's an ID (number or long string)
      const isId = path.length > 15 || !isNaN(path);

      if (pathMap[path]) {
        breadcrumbs.push({
          label: pathMap[path],
          path: currentPath,
          isActive: index === filteredPaths.length - 1
        });
      } else if (isId) {
        if (index === filteredPaths.length - 1) {
          breadcrumbs.push({
            label: "Chi tiết",
            path: currentPath,
            isActive: true
          });
        }
      } else {
        breadcrumbs.push({
          label: path.charAt(0).toUpperCase() + path.slice(1),
          path: currentPath,
          isActive: index === filteredPaths.length - 1
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <Navbar className="sticky top-0 z-30 h-max max-w-full rounded-none px-4 py-2 lg:px-8 border-b border-blue-gray-100 dark:border-dark-border bg-white/90 dark:bg-dark-surface/95 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm overflow-hidden whitespace-nowrap mr-4">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRightIcon className="h-3 w-3 text-blue-gray-400 dark:text-dark-muted flex-shrink-0" />
                )}
                <button
                  onClick={() => !crumb.isActive && navigate(crumb.path)}
                  disabled={crumb.isActive}
                  className={`transition-colors truncate max-w-[150px] ${crumb.isActive
                    ? "text-blue-600 dark:text-blue-400 font-semibold cursor-default"
                    : "text-blue-gray-600 dark:text-dark-muted hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                >
                  {crumb.label}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Smart Search Navigation */}
            <div className="hidden md:block w-64 lg:w-96 relative" ref={searchRef}>
              <div className="relative group">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm chức năng (Ctrl+K)..."
                  onFocus={() => searchQuery && setShowResults(true)}
                  className="
                    w-full h-[40px]
                    bg-blue-gray-50 dark:bg-dark-bg/40
                    border border-blue-gray-200 dark:border-dark-border
                    rounded-lg pl-10 pr-3
                    text-sm text-blue-gray-700 dark:text-dark-text
                    placeholder:text-blue-gray-400 dark:placeholder:text-dark-muted
                    outline-none
                    transition-all duration-300
                    focus:bg-white dark:focus:bg-dark-surface
                    focus:border-blue-500
                    focus:shadow-lg
                    focus:w-full
                  "
                />

                <MagnifyingGlassIcon
                  className="
                    absolute left-3 top-1/2 -translate-y-1/2
                    h-5 w-5
                    text-blue-gray-400
                    group-focus-within:text-blue-500
                    transition-colors
                  "
                />
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <Card
                  className="
                    absolute top-full left-0 right-0 mt-2 z-50
                    max-h-96 overflow-y-auto
                    rounded-xl shadow-lg backdrop-blur-md 
                    border border-blue-gray-100 dark:border-dark-border/60
                    bg-white/90 dark:bg-dark-surface/90
                    animate-fade-in
                  "
                >
                  <List className="p-1">
                    {searchResults.map((item, index) => (
                      <ListItem
                        key={index}
                        onClick={() => handleNavigate(item.path)}
                        className="
                          rounded-lg cursor-pointer
                          hover:bg-blue-50 dark:hover:bg-white/10
                          active:bg-blue-100 dark:active:bg-white/20
                          transition-colors duration-150
                        "
                      >
                        <div className="flex items-center gap-3">
                          {/* Icon Container */}
                          <div className="
                            p-2 rounded-lg
                            bg-gradient-to-br from-blue-500 to-indigo-500
                            text-white shadow-sm
                          ">
                            <CommandLineIcon className="h-4 w-4" />
                          </div>

                          <div>
                            <Typography
                              variant="small"
                              className="font-semibold text-blue-gray-900 dark:text-dark-text"
                            >
                              {item.title}
                            </Typography>
                          </div>
                        </div>
                      </ListItem>
                    ))}
                  </List>
                </Card>

              )}
            </div>

            {/* Dark Mode Toggle
            <IconButton
              variant="text"
              className="hover:bg-blue-gray-50 dark:hover:bg-white/10 rounded-full transition-transform hover:rotate-12"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-blue-gray-700 dark:text-dark-muted" />
              )}
            </IconButton> */}

            {/* User Profile */}
            <Menu placement="bottom-end">
              <MenuHandler>
                <div
                  className="
                    inline-flex items-center justify-center
                    p-0.5 rounded-full cursor-pointer
                    transition-all
                    hover:bg-blue-gray-50 dark:hover:bg-white/10
                    hover:border-blue-gray-100 dark:hover:border-dark-border
                    border border-transparent
                    w-fit
                  "
                >
                  <Avatar
                    src={`https://ui-avatars.com/api/?name=${userName}&background=2563eb&color=fff`}
                    alt={userName}
                    size="sm"
                    className="
                      border-2 border-white dark:border-dark-surface
                      shadow-sm rounded-full
                    "
                  />
                </div>
              </MenuHandler>
              <MenuList className="dark:bg-dark-surface dark:border-dark-border shadow-xl min-w-[180px]">
                <MenuItem onClick={() => navigate("/my-profile")} className="hover:bg-blue-gray-50 dark:hover:bg-white/5 flex items-center gap-2">
                  <UserCircleIcon className="h-4 w-4 dark:text-dark-text" />
                  <Typography variant="small" className="font-normal dark:text-dark-text">
                    Hồ sơ của tôi
                  </Typography>
                </MenuItem>
                <hr className="my-2 border-blue-gray-50 dark:border-dark-border" />
                <MenuItem onClick={handleLogout} className="hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                  <ArrowRightOnRectangleIcon className="h-4 w-4 text-red-500" />
                  <Typography
                    variant="small"
                    className="font-normal text-red-500"
                  >
                    Đăng xuất
                  </Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </div>
    </Navbar >
  );
};

export default HeaderMT;