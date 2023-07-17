import React, { useState } from "react";
import styles from "./Sidebar.css";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import SettingsIcon from "@mui/icons-material/Settings";
import SubjectIcon from "@mui/icons-material/Subject";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

import { useNavigate } from "react-router-dom";

const Sidebar = (props) => {
  const [item, setItem] = useState(props.page);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Set the new URL for logout
    window.location.href = "https://100014.pythonanywhere.com/en-gb/sign-out";
  };

  return (
    <Box
      width="230px"
      bgcolor="#edf2f3"
      sx={{
        display: { xs: "none", md: "block" },
        minHeight: { md: "90vh", lg: "92vh" },
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              setItem("dashboard");
              navigate("/");
            }}
            sx={{
              bgcolor: `${item === "dashboard" ? "#dce7e6" : "#edf2f3"}`,
              color: `${item === "dashboard" ? "#005734" : "black"}`,
              borderRight: `${
                item === "dashboard" ? "7px solid #005734" : "none"
              }`,
            }}
          >
            <ListItemIcon>
              <HomeIcon
                sx={{ color: `${item === "dashboard" ? "#005734" : "black"}` }}
              />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              setItem("documentation");
              navigate("/documentation");
            }}
            className={item === "documentation" ? "clickedItem" : ""}
            sx={{
              color: `${item === "documentation" ? "#005734" : "black"}`,
              bgcolor: `${item === "documentation" ? "#dce7e6" : "#edf2f3"}`,
              borderRight: `${
                item === "documentation" ? "7px solid #005734" : "none"
              }`,
            }}
          >
            <ListItemIcon>
              <SubjectIcon
                sx={{
                  color: `${item === "documentation" ? "#005734" : "black"}`,
                }}
              />
            </ListItemIcon>
            <ListItemText primary="Documentation" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              setItem("feedback");
              navigate("/feedback");
            }}
            className={item === "feedback" ? "clickedItem" : ""}
            sx={{
              color: `${item === "feedback" ? "#005734" : "black"}`,
              bgcolor: `${item === "feedback" ? "#dce7e6" : "#edf2f3"}`,
              borderRight: `${
                item === "feedback" ? "7px solid #005734" : "none"
              }`,
            }}
          >
            <ListItemIcon>
              <MessageIcon
                sx={{
                  color: `${item === "feedback" ? "#005734" : "black"}`,
                }}
              />
            </ListItemIcon>
            <ListItemText primary="Give Feedback" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              setItem("settings");
            }}
            className={item === "settings" ? "clickedItem" : ""}
            sx={{
              bgcolor: `${item === "settings" ? "#dce7e6" : "#edf2f3"}`,
              borderRight: `${
                item === "settings" ? "7px solid #005734" : "none"
              }`,
            }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>

      <Box
        sx={{
          p: 2,
          ml: 4,
          mt: { md: 46, lg: 47, xl: 47 },
          display: "flex",
          justifyContent: "center",
          bottom: 0,
        }}
        component="footer"
        position={"fixed"}
      >
        <Button
          onClick={handleLogout}
          sx={{ color: "#005734" }}
          startIcon={<PowerSettingsNewIcon />}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
