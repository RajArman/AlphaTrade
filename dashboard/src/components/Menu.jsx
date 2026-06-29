import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Menu.css";
import GeneralContext from "./GeneralContext";

import {
  Menu as MuiMenu,
  MenuItem,
  Avatar,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { Logout, Person, DarkMode, LightMode } from "@mui/icons-material";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const { user } = useContext(GeneralContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  const initials = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "U";

  const displayUsername = user?.username || "User";

  const navItems = [
    { label: "Overview", path: "/" },
    { label: "Orders", path: "/orders" },
    { label: "Holdings", path: "/holdings" },
    { label: "Positions", path: "/positions" },
    { label: "Funds", path: "/funds" },
    { label: "Insights", path: "/insights" },
  ];

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3002/auth/logout",
        {},
        { withCredentials: true }
      );

      handleClose();

      setTimeout(() => {
        window.location.href = "http://localhost:5174";
      }, 500);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="menu-container">
      <Link
        to="/"
        onClick={() => handleMenuClick(0)}
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "12px",
            background: "#2563eb",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700",
            fontSize: "1rem",
          }}
        >
          AT
        </div>

        <span
          className="brand-text"
          style={{
            fontWeight: "700",
            fontSize: "1.1rem",
          }}
        >
          AlphaTrade
        </span>
      </Link>

      <div className="menus">
        <ul>
          {navItems.map((item, index) => (
            <li key={item.label}>
              <Link
                style={{ textDecoration: "none" }}
                to={item.path}
                onClick={() => handleMenuClick(index)}
              >
                <p
                  className={
                    selectedMenu === index ? activeMenuClass : menuClass
                  }
                >
                  {item.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <hr />

        <div
          className="profile"
          onClick={handleProfileClick}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "#e0ecff",
              color: "#2563eb",
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          >
            {initials}
          </Avatar>

          <p className="username" style={{ margin: 0 }}>
            {displayUsername}
          </p>
        </div>

        <MuiMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.22))",
              mt: 1.5,
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>

          <MenuItem onClick={toggleTheme}>
            <ListItemIcon>
              {isDarkMode ? (
                <LightMode fontSize="small" />
              ) : (
                <DarkMode fontSize="small" />
              )}
            </ListItemIcon>
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <Logout fontSize="small" color="error" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </MuiMenu>
      </div>
    </div>
  );
};

export default Menu;