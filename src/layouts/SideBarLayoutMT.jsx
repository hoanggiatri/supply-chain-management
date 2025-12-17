import AdminSideBarMT from "@/components/layout-components/AdminSideBarMT";
import HeaderMT from "@/components/layout-components/HeaderMT";
import SideBarMT from "@/components/layout-components/SideBarMT";
import { Outlet } from "react-router-dom";

const SideBarLayoutMT = ({ role }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="flex-shrink-0">
        {role === "s_admin" ? <AdminSideBarMT /> : <SideBarMT />}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Fixed Header */}
        <HeaderMT />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SideBarLayoutMT;
