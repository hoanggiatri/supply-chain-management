import logo from "@assets/img/logo-navbar.png";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Collapse,
  IconButton,
  Navbar,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="white"
        className="p-1 font-normal"
      >
        <Link to="/" className="flex items-center hover:text-blue-200 transition-colors">
          Trang chủ
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="white"
        className="p-1 font-normal"
      >
        <a href="#features" className="flex items-center hover:text-blue-200 transition-colors">
          Tính năng
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="white"
        className="p-1 font-normal"
      >
        <a href="#benefits" className="flex items-center hover:text-blue-200 transition-colors">
          Lợi ích
        </a>
      </Typography>
    </ul>
  );

  return (
    <Navbar className="fixed top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-3 bg-[#05518B] border-none">
      <div className="flex items-center justify-between text-white">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 mr-2" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">{navList}</div>
          <div className="flex items-center gap-x-2">
            <Link to="/login">
              <Button
                variant="outlined"
                size="sm"
                className="hidden lg:inline-block border-white text-white hover:bg-white hover:text-[#05518B]"
              >
                Đăng nhập
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className="hidden lg:inline-block bg-white text-[#05518B] hover:bg-blue-50"
              >
                Đăng ký
              </Button>
            </Link>
          </div>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
            )}
          </IconButton>
        </div>
      </div>
      <Collapse open={openNav}>
        {navList}
        <div className="flex flex-col gap-2 mt-3">
          <Link to="/login">
            <Button
              variant="outlined"
              size="sm"
              fullWidth
              className="border-white text-white hover:bg-white hover:text-[#05518B]"
            >
              Đăng nhập
            </Button>
          </Link>
          <Link to="/register">
            <Button
              size="sm"
              fullWidth
              className="bg-white text-[#05518B] hover:bg-blue-50"
            >
              Đăng ký
            </Button>
          </Link>
        </div>
      </Collapse>
    </Navbar>
  );
};

export default NavBar;
