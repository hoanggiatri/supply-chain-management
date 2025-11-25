import React from "react";
import { Outlet } from "react-router-dom";
import AdminSideBarMT from "@/components/layout-components/AdminSideBarMT";
import SideBarMT from "@/components/layout-components/SideBarMT";
import HeaderMT from "@/components/layout-components/HeaderMT";

const SideBarLayoutMT = ({ role }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {role === "s-admin" ? <AdminSideBarMT /> : <SideBarMT />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <HeaderMT />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SideBarLayoutMT;
