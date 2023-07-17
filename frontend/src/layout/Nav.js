import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";

////icons
import { AccountCircle } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

import TopicIcon from "@mui/icons-material/Topic";
import SubjectIcon from "@mui/icons-material/Subject";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import CircularProgress from "@mui/material/CircularProgress";
import Logo from "../dowellLogo.png";
import { GetRedeemVoucher, RedeemVoucher } from "../util/api";
import { GetRedeemVoucher_v2, RedeemVoucher_v2 } from "../util/api";
import { useUserContext } from "../contexts/UserContext";
import { dowellLoginUrl } from "../utils";

import { useNavigate, Link } from "react-router-dom";

const Nav = () => {
  const [open, setOpen] = React.useState(false);
  const [anchor, setAnchor] = useState(null);
  const [voucher, setVoucher] = useState(null);
  const [redeemed, setRedeemed] = useState(null);
  const [snackBar, setSnackBar] = useState(false);
  const { currentUser } = useUserContext();

  const [drawer, setDrawer] = useState(false);
  // console.log("the current user data is ", currentUser)
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile");
  };

  const handleCloseMenu = () => {
    setAnchor(null);
  };
  const handleMenu = (e) => {
    setAnchor(e.currentTarget);
  };
  const handleVoucherOpen = async () => {
    const res = await GetRedeemVoucher_v2(currentUser?.userinfo?.userID);
    console.log("the axios data is voucher is", res);
    if (res?.data?.length > 0) {
      setVoucher(res.data[0]);
    }
    setOpen(true);
    setAnchor(null);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleRedeemVoucher = async () => {
    const axiosData = await RedeemVoucher_v2({
      name: currentUser?.userinfo?.username,
      email: currentUser?.userinfo?.email,
      id: currentUser?.userinfo?.userID,
    });
    console.log("the redeemed answer is ", axiosData);
    if (axiosData?.data.length > 0) {
      setVoucher(axiosData.data[0]);
    }
    setRedeemed(axiosData);
    setSnackBar(true);
    console.log("the axios respos is", axiosData);
  };

  const handleLogout = () => {
    // Set the new URL for logout
    window.location.href = "https://100014.pythonanywhere.com/en-gb/sign-out";
  };

  return (
    <Box sx={{ zIndex: "5" }}>
      <AppBar position="static" sx={{ bgcolor: "#dce7e6" }}>
        <Toolbar color="#00573412">
          <IconButton
            sx={{ display: { md: "none", xs: "block" } }}
            onClick={() => setDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Link to="/">
              <img
                src={Logo}
                width="70"
                style={{ marginRight: "30px" }}
                alt=""
              />
            </Link>
          </Box>

          <Typography
            fontWeight="bold"
            sx={{
              flexGrow: 1,
              color: "#005734",
              fontSize: {
                xs: "15px",
                md: "25px",
              },
            }}
          >
            Dowell API Services
          </Typography>
          <Box>
            <IconButton size="large" onClick={handleMenu}>
              <AccountCircle fontSize="large" sx={{ color: "#005734" }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorE1={anchor}
              keepMounted
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchor)}
              onClose={handleCloseMenu}
            >
              <MenuItem>Settings</MenuItem>
              <MenuItem onClick={goToProfile}>
                <PersonIcon />
                &nbsp; Profile
              </MenuItem>
              <MenuItem onClick={goToProfile}>
                <SettingsIcon />
                &nbsp; Your Settings
              </MenuItem>
              <MenuItem onClick={handleVoucherOpen}>
                <ConfirmationNumberIcon />
                &nbsp; Redeem Voucher
              </MenuItem>
              <MenuItem>Support</MenuItem>

              <MenuItem onClick={handleCloseMenu}>
                <MailIcon />
                &nbsp; Email Us
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <PowerSettingsNewIcon />
                &nbsp; Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawer} onClose={() => setDrawer(false)}>
        <List>
          <ListItem disablePadding>
            <img src={Logo} width="50px" />
            <Typography sx={{ color: "#005734" }}>
              Dowell Api Services
            </Typography>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/");
                setDrawer(false);
              }}
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
                navigate("/documentation");
                setDrawer(false);
              }}
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
                navigate("/feedback");
                setDrawer(false);
              }}
            >
              <ListItemIcon>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText primary="Give Feedback" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        sx={{ p: { xs: 1, md: 4 } }}
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            bgcolor: "#dce8e4",
            width: { xs: "94%", md: "500px" },
            p: { xs: 1, md: 2 },
          }}
        >
          <Typography variant="h4" mr={2} fontWeight="bold">
            Download <br /> Redeem Code
          </Typography>
          <img src={Logo} width="80" alt="" />
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#dce8e4", display: "block", p: 2 }}>
          <Box
            p={2}
            sx={{
              bgcolor: "white",
              mb: 2,
              color: "#005734",
              borderColor: "#005734",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {voucher == null ? "No Voucher" : voucher.voucher_code}
          </Box>
          <Typography>
            If you haven't redeemed,{" "}
            <Link
              color="#005734"
              onClick={handleRedeemVoucher}
              component={Button}
            >
              Click here to redeem
            </Link>
          </Typography>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        open={snackBar}
        autoHideDuration={5000}
        onClose={() => setSnackBar(false)}
      >
        {redeemed == null ? (
          <Alert severity="error">You already have redeemed voucher!</Alert>
        ) : (
          <Alert severity="success" sx={{ width: "100%" }}>
            You created voucher!
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default Nav;
