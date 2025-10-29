import { AppBar, Toolbar, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "@assets/img/logo-navbar.png";

const NavBar = () => {
  return (
    <AppBar position="static" sx={{bgcolor: "#05518B"}} >
      <Toolbar>
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={logo} alt="Logo" style={{ height: 40, marginRight: 10, marginTop: 2 }} />
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Button variant="outlined" sx={{ color: "#FFFFFF", borderColor: "#FFFFFF", "&:hover": { bgcolor: "#FFFFFF", color: "#05518B" } }}>
            Đăng nhập
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
