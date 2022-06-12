import * as React from "react";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";

import { SideBar } from "./SideBar.js";

import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

import { useEffect } from "react";

export const NavBar = () => {
  const [cookies] = useCookies(['']);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (cookies["user_id"] !== "undefined") setIsLoggedIn(true)
    else setIsLoggedIn(false)

  }, []);

  const [visibleElement, setVisibleEvent] = useState(null);
  const [visibleElementMobile, setVisibleElementMobile] = useState(null);
  const [sideBarVisible, setSideBarVisible] = useState(false);


  const isMenuOpen = Boolean(visibleElement);
  const isMobileMenuOpen = Boolean(visibleElementMobile);

  const handleProfileMenuOpen = (event) => {
    setVisibleEvent(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setVisibleElementMobile(null);
  };

  const handleMenuClose = () => {
    setVisibleEvent(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    visibleElementMobile(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMenu = (
    <Menu
      anchorEl={visibleElement}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {isLoggedIn === true ? (
        <>
          <MenuItem component={Link} to={'/login'}>Profile</MenuItem>
          <MenuItem component={Link} to={'/orders'}>My orders</MenuItem>
          <MenuItem component={Link} to={'/reservations'}>My reservations</MenuItem>
          <MenuItem component={Link} to={'/logout'}>Logout</MenuItem></>)
        : (
          <>
            <MenuItem component={Link} to={'/login'}>Sign in</MenuItem>
            <MenuItem component={Link} to={'/register'}>Register</MenuItem></>)
      }
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={visibleElementMobile}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {sideBarVisible && (<SideBar close={setSideBarVisible} />)}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => setSideBarVisible((visible) => !visible)}
          >
            <MenuIcon size="large" />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            MUI
          </Typography>



          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};
