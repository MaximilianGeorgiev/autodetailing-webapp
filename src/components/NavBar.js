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
import { ChangeLanguage } from "./custom/ChangeLanguage";

import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import i18next from "i18next";
import { clientHasLoginCookies, getCookieByName } from "../utils/cookies.js";

export const NavBar = () => {
  const [cookies] = useCookies(['']);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);

  /* Sometimes on redirects from other pages back here they provide a some sort of notification.
 Via the useLocation react-router hook information sent from the previous page can be accessed */
  const location = useLocation();
  const { t } = useTranslation();

  // user_id cookie is assigned during login and removed during logout; menu options are different for logged in users
  useEffect(() => {
    setTimeout(() => {
      if (getCookieByName("user_id") !== "undefined" && getCookieByName("user_id") !== "") setIsLoggedIn(true);
      else setIsLoggedIn(false);
  
      const userRoles = getCookieByName("user_roles");
      console.log("roles " + JSON.stringify(userRoles))
      
      if (userRoles.includes("Admin")) {
        setIsAdmin(true);
      } else if (userRoles.includes("Moderator")){
        setIsModerator(true);
      }
    }, 200);

  }, [getCookieByName("user_id")]);

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
          <MenuItem component={Link} to={`/users/edit/${getCookieByName("user_id")}`}>{t("Profile")}</MenuItem>
          <MenuItem component={Link} to={'/orders'}>{t("Orders")}</MenuItem>
          <MenuItem component={Link} to={'/reservations'}>{t("Reservations")}</MenuItem>{
            isAdmin === true && 
            <>
            <MenuItem component={Link} to={'/promotions/show/all'}>{t("Promotions")}</MenuItem>
            <MenuItem component={Link} to={'/users/show/all'}>{t("Users")}</MenuItem>
            <MenuItem component={Link} to={'/products/show/all'}>{t("Products")}</MenuItem>
            <MenuItem component={Link} to={'/services/show/all'}>{t("Services")}</MenuItem>
            <MenuItem component={Link} to={'/products/create'}>{t("Create product")}</MenuItem>
            <MenuItem component={Link} to={'/services/create'}>{t("Create service")}</MenuItem>
            <MenuItem component={Link} to={'/blogs/create'}>{t("Create article")}</MenuItem>
            <MenuItem component={Link} to={'/promotions/create'}>{t("Create promotion")}</MenuItem>
            </>
          }
          {
            isModerator === true &&
            <>
            <MenuItem component={Link} to={'/blogs/create'}>{t("Create article")}</MenuItem>
            </>
          }
          <MenuItem component={Link} to={'/logout'}>{t("Logout")}</MenuItem></>)
        : (
          <>
            <MenuItem component={Link} to={'/login'}>{t("Sign in")}</MenuItem>
            <MenuItem component={Link} to={'/register'}>{t("Register")}</MenuItem></>)
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
        <p>{t("Profile")}</p>
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
          
          <Box sx={{ flexGrow: 1 }}><ChangeLanguage /></Box>
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
