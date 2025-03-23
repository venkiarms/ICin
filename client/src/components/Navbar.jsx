import axios from "axios";
import React, { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "../context/LocationContext";
import Modal from "react-modal";
import TheatersIcon from '@mui/icons-material/Theaters';
import { AppBar, Toolbar, IconButton, Link, Button, Typography, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // For profile icon
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PersonIcon from '@mui/icons-material/Person'; // For Profile icon
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // For Logout icon
import ReelRover from "../../images/logo.png";

const Navbar = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, SetLoggingOut] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const { selectedLocation, updateLocation } = useLocation();

  const handleLocation = (location) => {
    updateLocation(location);
    setLocationModalOpen(false);
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const openLocationModal = () => {
    setLocationModalOpen(true);
  };

  const closeLocationModal = () => {
    setLocationModalOpen(false);
  };

  const navigate = useNavigate();
  const isActive = (path) => window.location.pathname === path;
  const onLogout = async () => {
    try {
      SetLoggingOut(true);
      const response = await axios.get("/auth/logout");
      // console.log(response)
      setAuth({ username: null, email: null, role: null, token: null });
      sessionStorage.clear();
      navigate("/");
      toast.success("Logout successful!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } finally {
      SetLoggingOut(false);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null); // Add this to manage dropdown menu anchor
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLoginModalClose = () => setLoginModalOpen(false);

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setTimeout(() => {
      if (!isMenuOpen) {
        setAnchorEl(null);
      }
    }, 100);
  };


  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };
  const handleLogin = () => {
    setIsLoggedIn(true);
    handleLoginModalClose();
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    handleCloseUserMenu();
  };


  const handleProfileHover = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //styles
  const locationButtonStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '150px',
    borderRadius: "20px", // Rounded corners
    backgroundColor: "#ff4757", // Red color for the button
    color: "white", // Text color
    padding: "10px 20px", // Padding
    border: "none", // No border
    cursor: "pointer", // Pointer on hover
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Box shadow for depth
    display: "flex", // To align the icon and text
    alignItems: "center", // Center items vertically
    justifyContent: "center", // Center items horizontally
    gap: "8px", // Space between icon and text
    fontWeight: "500", // Font weight
    fontSize: "0.875rem", // Font size

  };

  // Icon style if you're using an SVG or Material UI icon
  const locationIconStyle = {
    marginRight: "5px", // Space between icon and text
  };

  const toolbarStyles = {
    display: 'flex',
    justifyContent: 'flex-end', // Align items to the end of the toolbar
    alignItems: 'center', // Center items vertically
    // Add any additional styles you need for the toolbar
  };

  const buttonStyle = {
    borderRadius: "20px", // Rounded corners
    padding: "10px 60px", // Padding on all sides
    border: "none", // No border
    cursor: "pointer", // Pointer on hover
    fontSize: "0.875rem", // Font size
    fontWeight: "500", // Font weight
    textAlign: "center", // Center text
    textDecoration: "none", // No underline on text,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '170px',
    display: "inline-flex", // Use inline-flex to allow flexbox properties
    alignItems: 'center', // Align text and icon vertically
    justifyContent: 'center', // Center text and icon horizontally
    margin: "0 10px", // Margin on all sides
    transition: "background-color 0.3s", // Smooth background transition
    backgroundColor: "#ff3d71", // Default background
    color: "white", // Text color
    // Add more styles for hover state as needed
    ':hover': {
      backgroundColor: '#ff6384',
    }
  };

  const linkStyle = (isActive) => ({
    ...buttonStyle,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    borderRadius: "20px",
    padding: "10px 16px",
    textDecoration: "none",
    color: isActive ? "white" : "#9ca3af", // Active color is white, inactive is grey
    backgroundColor: isActive ? "#4f46e5" : "3b82f6", // Active link has a background
    border: "1px solid #9ca3af", // Border to match the inactive text color
    fontWeight: "500",
    margin: "0 8px",
    transition: "all 0.3s ease",
  });

  const logoutButtonStyle = {
    ...buttonStyle,
    backgroundColor: isLoggingOut ? "#64748b" : "#3b82f6", // Conditional background color
  };



  const logoStyle = (isActive) => ({
    borderRadius: "20px", // Rounded corners
    border: "none", // No border
     // Pointer on hover
    fontSize: "1.875rem", // Font size
    fontWeight: "500", // Font weight
    textAlign: "center", // Center text
    backgroundColor: "#bg-gradient-to-br from-red-500 to-indigo-900", // Default background
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "white",
    textDecoration: "none",
    cursor: "pointer",
    height: "70px",
    width: "150px"
  });

  const styles = {
    navbar: `bg-gradient-to-br from-red-500 to-indigo-900 `
  };

  return (
    <>
      <AppBar position="static" className={styles.navbar}>
        <Toolbar style={toolbarStyles}>

          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, width: '100ch' }}>

            <Typography variant="h2" component="div" sx={{ ml: 2 }}>
              
              {/* <img style={logoStyle(isActive("/cinema"))} onClick={() => navigate("/")}
                src={ReelRover}
                alt="ReelRover Logo"
              />
             */}
             iCinema Apps
            </Typography>
          </Box>
          <div>
            <Link color="inherit" underline="none" sx={{ mx: 1 }}>
              <button style={locationButtonStyle} onClick={openLocationModal}>
                <span style={locationIconStyle}> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                </span>{" "}
                {selectedLocation || "Location"}
              </button>
              {locationModalOpen && (
                <Modal
                  isOpen={locationModalOpen}
                  onRequestClose={closeLocationModal}
                  shouldCloseOnOverlayClick={false}
                  contentLabel="Location Modal"
                  style={{
                    overlay: {
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      zIndex: 50,
                    },
                    content: {
                      top: '50%',
                      left: '50%',
                      right: 'auto',
                      bottom: 'auto',
                      marginRight: '-50%',
                      transform: 'translate(-50%, -50%)',
                      border: 'none',
                      borderRadius: '1rem',
                      padding: '2rem',
                      maxWidth: '32rem',
                      width: '90%',
                      backgroundColor: '#fff',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <h2
                    style={{
                      textAlign: "center",
                      fontWeight: "600",
                      marginBottom: "24px",
                    }}
                  >
                    Select location:
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "16px",
                      marginBottom: "24px",
                    }}
                  >
                    <button
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        padding: "12px 24px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "500",
                        fontSize: "1rem",
                      }}
                      onClick={() => handleLocation("Madurai")}
                    >
                      Madurai
                    </button>
                    <button
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        padding: "12px 24px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "500",
                        fontSize: "1rem",
                      }}
                      onClick={() => handleLocation("Kalavasal")}
                    >
                    Kalavasal
                    </button>
                    <button
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        padding: "12px 24px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "500",
                        fontSize: "1rem",
                      }}
                      onClick={() => handleLocation("Periyar")}
                    >
                      Periyar
                    </button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "12px 24px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                      onClick={closeLocationModal}
                    >
                      Close
                    </button>
                  </div>
                </Modal>
              )}</Link>

          </div>
          {auth.token ? (
            <div>
              <div onMouseLeave={handleCloseMenu}>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleUserMenu}
                  sx={{ ml: 'auto' }} // Align to the right
                  onMouseEnter={handleProfileHover}

                >
                  <AccountCircleIcon fontSize="large" />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
                  MenuListProps={{ onMouseEnter: () => setIsMenuOpen(true), onMouseLeave: handleCloseMenu }}
                >
                  {auth.role != "admin" && (

                    <MenuItem onClick={() => navigate("/ticket")} style={linkStyle(isActive("/ticket"))} className="menuItem">
                      <PersonIcon />My Profile
                    </MenuItem>

                  )}
                  {auth.role === "admin" && (
                    <>

                      <MenuItem onClick={() => navigate("/movie")} style={linkStyle(isActive("/movie"))} className="menuItem">
                        Add Movies
                      </MenuItem>
                      <MenuItem onClick={() => navigate("/analytics")} style={linkStyle(isActive("/analytics"))} className="menuItem">
                        Analytics Dashboard
                      </MenuItem>

                    </>
                  )}
                  {auth.role === "admin" && (
                  <MenuItem onClick={() => navigate("/cinema")} style={linkStyle(isActive("/cinema"))} className="menuItem">
                    <TheatersIcon /> Configure Theaters
                  </MenuItem>) }

                  <MenuItem style={logoutButtonStyle} disabled={isLoggingOut} onClick={() => onLogout()} className="menuItem">
                    <ExitToAppIcon /> {isLoggingOut ? "Processing..." : "Logout"}
                  </MenuItem>
                </Menu>
              </div>
            </div>
          ) : (
            <div style={toolbarStyles}>
              <Link to={"/login"}>
                <Button color="inherit" style={buttonStyle} onClick={() => navigate("/login")} sx={{ ml: 'auto' }}>Login / Sign Up</Button>
              </Link>
            </div>
          )}
        </Toolbar>

      </AppBar>

    </>

  );
};

export default Navbar;

