import {
  BriefcaseIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  HomeIcon,
  MagnifyingGlassCircleIcon,
  ShoppingCartIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Collapse,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Navbar,
  Typography,
} from "@material-tailwind/react";
import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Navigation items based on department
const BASE_NAV_ITEMS = [
  { label: "Bảng điều khiển", path: "/marketplace/dashboard", Icon: HomeIcon },
];

// Items cho dropdown Mua hàng
const PURCHASING_DROPDOWN_ITEMS = [
  {
    label: "Tìm NCC",
    path: "/marketplace/supplier-search",
    Icon: MagnifyingGlassCircleIcon,
  },
  {
    label: "Yêu cầu báo giá",
    path: "/marketplace/rfqs",
    Icon: DocumentTextIcon,
  },
  {
    label: "Báo giá từ NCC",
    path: "/marketplace/customer-quotations",
    Icon: CurrencyDollarIcon,
  },
  { label: "Đơn mua hàng", path: "/marketplace/pos", Icon: ShoppingCartIcon },
  {
    label: "Báo cáo mua hàng",
    path: "/marketplace/purchase-report",
    Icon: ChartBarIcon,
  },
];

// Items cho dropdown Bán hàng
const SALES_DROPDOWN_ITEMS = [
  {
    label: "Yêu cầu từ KH",
    path: "/marketplace/supplier-rfqs",
    Icon: ClipboardDocumentListIcon,
  },
  {
    label: "Báo giá",
    path: "/marketplace/quotations",
    Icon: CurrencyDollarIcon,
  },
  {
    label: "Yêu cầu mua hàng",
    path: "/marketplace/supplier-pos",
    Icon: BuildingStorefrontIcon,
  },
  { label: "Đơn bán hàng", path: "/marketplace/sos", Icon: TruckIcon },
];

const MarketplaceHeader = () => {
  const [openNav, setOpenNav] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user info from localStorage
  const fullName = localStorage.getItem("fullName") || "Người dùng";
  const department =
    localStorage.getItem("departmentName") ||
    localStorage.getItem("department") ||
    "";
  const companyName = localStorage.getItem("companyName") || "";

  // Determine department type
  const isPurchasing = department === "Mua hàng";
  const isSales = department === "Bán hàng";

  // Handle navigation
  const handleNavClick = useCallback(
    (path) => {
      navigate(path);
      setOpenNav(false);
    },
    [navigate]
  );

  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate("/login");
  }, [navigate]);

  // Check if path is active
  const isActive = (path) => location.pathname.startsWith(path);

  // Check if any dropdown item is active
  const isDropdownActive = () => {
    if (isPurchasing) {
      return PURCHASING_DROPDOWN_ITEMS.some((item) => isActive(item.path));
    } else if (isSales) {
      return SALES_DROPDOWN_ITEMS.some((item) => isActive(item.path));
    }
    return false;
  };

  // Navigation list component
  const navList = (
    <ul className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-1">
      {/* Dashboard button */}
      {BASE_NAV_ITEMS.map(({ path, label, Icon }) => (
        <li key={path}>
          <Button
            variant={isActive(path) ? "filled" : "text"}
            color={isActive(path) ? "blue" : "blue-gray"}
            size="sm"
            className={`flex items-center gap-2 px-4 py-2 ${
              isActive(path)
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-gray-50"
            }`}
            onClick={() => handleNavClick(path)}
          >
            {Icon && <Icon className="h-5 w-5" />}
            <span className="font-medium">{label}</span>
          </Button>
        </li>
      ))}

      {/* Dropdown cho Mua hàng */}
      {isPurchasing && (
        <li>
          <Menu placement="bottom-start">
            <MenuHandler>
              <Button
                variant={isDropdownActive() ? "filled" : "text"}
                color={isDropdownActive() ? "blue" : "blue-gray"}
                size="sm"
                className={`flex items-center gap-2 px-4 py-2 ${
                  isDropdownActive()
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-gray-50"
                }`}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span className="font-medium">Mua hàng</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </Button>
            </MenuHandler>
            <MenuList className="p-1">
              {PURCHASING_DROPDOWN_ITEMS.map(({ path, label, Icon }) => (
                <MenuItem
                  key={path}
                  className={`flex items-center gap-2 rounded ${
                    isActive(path) ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleNavClick(path)}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <Typography variant="small" className="font-medium">
                    {label}
                  </Typography>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </li>
      )}

      {/* Dropdown cho Bán hàng */}
      {isSales && (
        <li>
          <Menu placement="bottom-start">
            <MenuHandler>
              <Button
                variant={isDropdownActive() ? "filled" : "text"}
                color={isDropdownActive() ? "blue" : "blue-gray"}
                size="sm"
                className={`flex items-center gap-2 px-4 py-2 ${
                  isDropdownActive()
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-gray-50"
                }`}
              >
                <BriefcaseIcon className="h-5 w-5" />
                <span className="font-medium">Bán hàng</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </Button>
            </MenuHandler>
            <MenuList className="p-1">
              {SALES_DROPDOWN_ITEMS.map(({ path, label, Icon }) => (
                <MenuItem
                  key={path}
                  className={`flex items-center gap-2 rounded ${
                    isActive(path) ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleNavClick(path)}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <Typography variant="small" className="font-medium">
                    {label}
                  </Typography>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </li>
      )}
    </ul>
  );

  return (
    <Navbar className="sticky top-0 z-50 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-3 shadow-md border-b border-blue-gray-100">
      <div className="flex items-center justify-between text-blue-gray-900">
        {/* Logo and Company Name */}
        <button
          type="button"
          className="flex items-center gap-3 cursor-pointer bg-transparent border-0 p-0"
          onClick={() => navigate("/marketplace/dashboard")}
        >
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-md">
            <Typography variant="h5" className="text-white font-bold">
              HGT
            </Typography>
          </div>
          <div className="hidden sm:block">
            <Typography
              variant="h6"
              className="font-bold text-blue-gray-900 leading-tight"
            >
              SCMS
            </Typography>
            <Typography variant="small" className="text-blue-gray-500 text-xs">
              {companyName || "Supply Chain Management"}
            </Typography>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">{navList}</div>

        {/* User Menu and Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* Department Badge */}
          {department && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-gray-50 rounded-full">
              <span className="text-sm">
                {department === "Mua hàng" ? (
                  <ShoppingCartIcon className="h-4 w-4 text-blue-gray-700" />
                ) : (
                  <BriefcaseIcon className="h-4 w-4 text-blue-gray-700" />
                )}
              </span>
              <Typography
                variant="small"
                className="font-medium text-blue-gray-700"
              >
                {department}
              </Typography>
            </div>
          )}

          {/* User Menu */}
          <Menu placement="bottom-end">
            <MenuHandler>
              <Button
                variant="text"
                color="blue-gray"
                className="flex items-center gap-2 px-2 py-1"
              >
                <Avatar
                  variant="circular"
                  size="sm"
                  alt={fullName}
                  className="border border-blue-gray-200"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    fullName
                  )}&background=1e88e5&color=fff`}
                />
                <div className="hidden md:block text-left">
                  <Typography
                    variant="small"
                    className="font-medium text-blue-gray-900"
                  >
                    {fullName}
                  </Typography>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </Button>
            </MenuHandler>
            <MenuList className="p-1">
              <MenuItem
                className="flex items-center gap-2 rounded"
                onClick={() => navigate("/marketplace/my-profile")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <Typography variant="small" className="font-medium">
                  Hồ sơ của tôi
                </Typography>
              </MenuItem>
              <hr className="my-1 border-blue-gray-50" />
              <MenuItem
                className="flex items-center gap-2 rounded text-red-500 hover:!text-red-500 hover:!bg-red-50"
                onClick={handleLogout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                  />
                </svg>
                <Typography variant="small" className="font-medium">
                  Đăng xuất
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>

          {/* Mobile menu button */}
          <IconButton
            variant="text"
            className="lg:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>

      {/* Mobile Navigation */}
      <Collapse open={openNav}>
        <div className="container mx-auto pt-4 pb-2">{navList}</div>
      </Collapse>
    </Navbar>
  );
};

export default MarketplaceHeader;
