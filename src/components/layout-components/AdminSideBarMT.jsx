import React, { useState, useEffect } from "react";
import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Button,
} from "@material-tailwind/react";
import {
  ChartBarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@assets/img/logo-sidebar.png";

const AdminSideBarMT = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedPath, setSelectedPath] = useState(() => {
    return (
      localStorage.getItem("selectedMenuPath") ||
      location.pathname ||
      "/homepage"
    );
  });

  useEffect(() => {
    localStorage.setItem("selectedMenuPath", selectedPath);
  }, [selectedPath]);

  const handleSelect = (path) => {
    setSelectedPath(path);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) =>
    selectedPath === path || location.pathname === path;

  return (
    <Card className="h-screen w-[280px] rounded-none shadow-xl shadow-blue-gray-900/5 flex flex-col">
      {/* Logo */}
      <div className="p-4 text-center border-b border-blue-gray-50">
        <img src={logo} alt="Logo" className="w-full" />
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto">
        <List className="p-2">
          <ListItem
            selected={isActive("/admin/dashboard")}
            onClick={() => handleSelect("/admin/dashboard")}
          >
            <ListItemPrefix>
              <ChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dashboard
          </ListItem>
          <ListItem
            selected={isActive("/admin/all-company")}
            onClick={() => handleSelect("/admin/all-company")}
          >
            <ListItemPrefix>
              <BuildingOfficeIcon className="h-5 w-5" />
            </ListItemPrefix>
            Quản lý công ty
          </ListItem>
          <ListItem
            selected={isActive("/admin/all-user")}
            onClick={() => handleSelect("/admin/all-user")}
          >
            <ListItemPrefix>
              <UserGroupIcon className="h-5 w-5" />
            </ListItemPrefix>
            Quản lý tài khoản
          </ListItem>
        </List>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-gray-50">
        <Button
          color="gray"
          fullWidth
          onClick={handleLogout}
          className="flex items-center justify-center gap-2"
        >
          <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
          Đăng xuất
        </Button>
      </div>
    </Card>
  );
};

export default AdminSideBarMT;
