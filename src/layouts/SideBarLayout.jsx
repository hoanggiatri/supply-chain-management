import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import AdminSideBar from "@/components/layout-components/AdminSideBar";
import SideBar from "@/components/layout-components/SideBar";
import Header from "@/components/layout-components/Header";
import Breadcrumbs from "@/components/layout-components/Breadcrumbs";

const SideBarLayout = ({ role }) => {
  const [openSidebar, setOpenSidebar] = useState(true);
  const toggleSidebar = () => {
    setOpenSidebar((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {role === "s-admin" && (
        <AdminSideBar openSidebar={openSidebar} toggleSidebar={toggleSidebar} />
      )}
      {role !== "s-admin" && (
        <SideBar openSidebar={openSidebar} toggleSidebar={toggleSidebar} />
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0, // Prevent overflow
        }}
      >
        {/* Fixed Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1100,
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Header toggleSidebar={toggleSidebar} />
          <Breadcrumbs />
        </Box>

        {/* Scrollable Content */}
        <Box sx={{ 
          p: 0, 
          flexGrow: 1, 
          overflowY: "auto",
          bgcolor: 'background.default',
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.03) 0%, transparent 50%)',
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default SideBarLayout;
