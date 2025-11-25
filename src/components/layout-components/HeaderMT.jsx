import React from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  BellIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const HeaderMT = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/my-profile");
  };

  return (
    <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-3">
      <div className="flex items-center justify-between">
        {/* Empty Left Side (removed toggle button) */}
        <div></div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-2">
          {/* Profile Button */}
          <IconButton
            variant="text"
            className="hover:bg-blue-gray-50"
            onClick={handleProfileClick}
          >
            <UserCircleIcon className="h-6 w-6" />
          </IconButton>

          {/* Notifications Menu */}
          <Menu placement="bottom-end">
            <MenuHandler>
              <IconButton variant="text" className="hover:bg-blue-gray-50">
                <BellIcon className="h-6 w-6" />
              </IconButton>
            </MenuHandler>
            <MenuList>
              <MenuItem disabled>
                <Typography variant="small" className="font-normal">
                  Không có thông báo
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>

          {/* Settings Menu */}
          <Menu placement="bottom-end">
            <MenuHandler>
              <IconButton variant="text" className="hover:bg-blue-gray-50">
                <Cog6ToothIcon className="h-6 w-6" />
              </IconButton>
            </MenuHandler>
            <MenuList>
              <MenuItem disabled>
                <Typography variant="small" className="font-normal">
                  Không có nội dung thiết lập
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </Navbar>
  );
};

export default HeaderMT;
