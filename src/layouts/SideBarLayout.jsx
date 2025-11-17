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
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {role === "S-ADMIN" && (
        <AdminSideBar openSidebar={openSidebar} toggleSidebar={toggleSidebar} />
      )}
      {role !== "S-ADMIN" && (
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
        </Box>

        {/* Scrollable Content */}
        <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default SideBarLayout;
