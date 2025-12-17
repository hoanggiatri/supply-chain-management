import {
    ArrowRightOnRectangleIcon,
    BuildingOfficeIcon,
    HomeIcon,
    UserGroupIcon,
} from "@heroicons/react/24/solid";
import {
    Button,
    Card,
    List,
    ListItem,
    ListItemPrefix,
    Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AdminSideBarMT = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedPath, setSelectedPath] = useState(() => {
    return (
      localStorage.getItem("adminSelectedMenuPath") ||
      location.pathname ||
      "/admin/dashboard"
    );
  });

  useEffect(() => {
    localStorage.setItem("adminSelectedMenuPath", selectedPath);
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
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-4 min-h-[64px] border-b border-blue-gray-50">
        <Typography variant="h6" color="blue-gray" className="font-bold">
          Admin Dashboard
        </Typography>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <List className="p-2">
          {/* Dashboard */}
          <ListItem
            selected={isActive("/admin/dashboard")}
            onClick={() => handleSelect("/admin/dashboard")}
          >
            <ListItemPrefix>
              <HomeIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dashboard
          </ListItem>

          {/* Company Management */}
          <ListItem
            selected={isActive("/admin/all-company")}
            onClick={() => handleSelect("/admin/all-company")}
          >
            <ListItemPrefix>
              <BuildingOfficeIcon className="h-5 w-5" />
            </ListItemPrefix>
            Quản lý công ty
          </ListItem>

          {/* User Management */}
          <ListItem
            selected={isActive("/admin/all-user")}
            onClick={() => handleSelect("/admin/all-user")}
          >
            <ListItemPrefix>
              <UserGroupIcon className="h-5 w-5" />
            </ListItemPrefix>
            Quản lý người dùng
          </ListItem>
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

export default AdminSideBarMT;
