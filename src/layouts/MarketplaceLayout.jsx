import React from "react";
import { Outlet } from "react-router-dom";
import MarketplaceHeader from "@/components/layout-components/MarketplaceHeader";
import MarketplaceFooter from "@/components/layout-components/MarketplaceFooter";

/**
 * MarketplaceLayout - New layout for purchasing and sales users
 * Features: Modern header with horizontal navigation, no sidebar, footer
 */
const MarketplaceLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Sticky Header */}
      <MarketplaceHeader />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <MarketplaceFooter />
    </div>
  );
};

export default MarketplaceLayout;
