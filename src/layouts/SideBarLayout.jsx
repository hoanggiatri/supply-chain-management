import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import AdminSideBar from "@/components/layout-components/AdminSideBar";
import SideBar from "@/components/layout-components/SideBar";
import Header from "@/components/layout-components/Header";

const SideBarLayout = ({ role }) => {
  const [openSidebar, setOpenSidebar] = useState(true);
  const toggleSidebar = () => {
    setOpenSidebar((prev) => !prev);
  };

  return (
    <div style={{ display: "flex" }}>
      {role === "S-ADMIN" && (
        <AdminSideBar openSidebar={openSidebar} toggleSidebar={toggleSidebar} />
      )}
      {role !== "S-ADMIN" && (
        <SideBar openSidebar={openSidebar} toggleSidebar={toggleSidebar} />
      )}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Header toggleSidebar={toggleSidebar} />
        <Outlet />
      </Box>
    </div>
  );
};

export default SideBarLayout;
