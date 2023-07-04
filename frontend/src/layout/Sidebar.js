import React, { useState } from "react";
import "./Sidebar.css";
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

const Sidebar = () => {
  const [item, setItem] = useState("dashboard");
  const navigate = useNavigate();
  console.log(item)

  return (
    <Box
      width="230px"
      bgcolor="#edf2f3"
      minHeight="90vh"
      sx={{
        display: { xs: "none", md: "block" },
        position: "fixed",
        bottom: 0,
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              setItem("dashboard");
            }}
            className={item === "dashboard" ? "clickedItem" : ""}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              setItem("documentation");
            }}
            className={item === "documentation" ? "clickedItem" : ""}
          >
            <ListItemIcon>
              <SubjectIcon />
            </ListItemIcon>
            <ListItemText primary="Documentation" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              setItem("feedback");
            }}
            className={item === "feedback" ? "clickedItem" : ""}
          >
            <ListItemIcon>
              <MessageIcon />
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
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>

      <Box
        sx={{ p: 2, mt: 46, display: "flex", justifyContent: "center" }}
        component="footer"
      >
        <Button sx={{ color: "#005734" }} startIcon={<PowerSettingsNewIcon />}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
