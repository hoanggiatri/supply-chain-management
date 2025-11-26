import NavBar from "@components/layout-components/NavBar";
import { Outlet } from "react-router-dom";

const NavBarLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default NavBarLayout;
