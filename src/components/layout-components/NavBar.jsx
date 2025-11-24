import { AppBar, Toolbar, Box, Button, Typography, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { Login as LoginIcon } from "@mui/icons-material";
import logo from "@assets/img/logo-navbar.png";

const NavBar = () => {
  return (
    <AppBar 
      position="static" 
      elevation={8}
      sx={{
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }} 
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1.5, minHeight: 70 }}>
          <Link to="/" style={{ textDecoration: "none", display: 'flex', alignItems: 'center', gap: 16 }}>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                p: 1,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.25)',
                  transform: 'scale(1.05)',
                }
              }}
            >
              <img 
                src={logo} 
                alt="Logo" 
                style={{ 
                  height: 40,
                  display: 'block',
                }} 
              />
            </Box>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#FFFFFF !important',
                fontWeight: 700,
                letterSpacing: '0.5px',
                display: { xs: 'none', md: 'block' },
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              Hệ thống Quản lý Chuỗi cung ứng
            </Typography>
          </Link>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Link to="/login" style={{ textDecoration: "none" }}>
            <Button 
              variant="contained" 
              startIcon={<LoginIcon />}
              sx={{ 
                bgcolor: "#FFFFFF",
                color: "#1976d2",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
                "&:hover": { 
                  bgcolor: "#f5f5f5", 
                  color: "#1565c0",
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                },
              }}
            >
              Đăng nhập
            </Button>
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
