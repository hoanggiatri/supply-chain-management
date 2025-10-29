import React from "react";
import NavBar from "@components/layout-components/NavBar";
import { Outlet } from "react-router-dom";

const NavBarLayout = () => {
  return (
    <>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default NavBarLayout;
