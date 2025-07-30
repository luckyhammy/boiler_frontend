import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Breadcrumbs from "examples/Breadcrumbs";
import AuthService from "services/auth-service";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";
import { useDispatch } from 'react-redux';
import { notification } from "antd";

import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
} from "context";
import MDButton from "components/MDButton";
import { AuthContext } from "context";

function DashboardNavbar({ absolute = false, light = false, isMini = false }) {
  const authContext = useContext(AuthContext);
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const route = useLocation().pathname.split("/").slice(1);

  const [searchValue, setSearchValue] = useState("");
  const dispatch1 = useDispatch(); // Initialize Redux dispatch
  
  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);

    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  
  const handleLogOut = async () => {
    try {


      // Call the logout service (which now just returns success)
      await AuthService.logout();
      
      // Show success notification
      notification.success({
        message: 'Logged Out Successfully!',
        description: 'You have been logged out successfully.',
        placement: 'topRight',
        duration: 3,
      });

      // Call the context logout function to clear state and redirect
      authContext.logout();
    } catch (error) {
      console.error('Logout error:', error);
      
      // Show error notification
      notification.error({
        message: 'Logout Error',
        description: 'An error occurred during logout, but you have been logged out locally.',
        placement: 'topRight',
        duration: 4,
      });
      
      // Even if there's an error, we should still logout locally
      authContext.logout();
    }
  };
  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox display="flex" alignItems="center" color={light ? "white" : "inherit"}>
              {/* User Info Display */}
              {authContext.userInfo && (
                <MDBox mr={2} display="flex" alignItems="center">
                  <MDTypography variant="button" fontWeight="medium" color="inherit">
                    {authContext.userInfo.first_name}
                  </MDTypography>
                  {authContext.isAdmin && (
                    <MDBox ml={1} display="flex" alignItems="center">
                      <Icon sx={{ fontSize: '16px', color: 'success.main' }}>admin_panel_settings</Icon>
                      <MDTypography variant="caption" color="success.main" ml={0.5}>
                        Admin
                      </MDTypography>
                    </MDBox>
                  )}
                </MDBox>
              )}
              
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <MDBox>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  type="button"
                  onClick={handleLogOut}
                >
                  Log Out
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
