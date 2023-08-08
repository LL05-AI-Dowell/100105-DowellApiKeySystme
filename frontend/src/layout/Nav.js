import React, { useState, useEffect } from "react";
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
  Badge,
} from "@mui/material";

////icons
import { AccountCircle } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import NotificationsIcon from "@mui/icons-material/Notifications";

import ViewInArIcon from "@mui/icons-material/ViewInAr";
import CategoryIcon from "@mui/icons-material/Category";

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
import { useSelector, useDispatch } from "react-redux";
import { GetAllVouchers_v3 } from "../util/api_v3";

const Nav = () => {
  const [open, setOpen] = React.useState(false);
  const [anchor, setAnchor] = useState(null);
  const [voucher, setVoucher] = useState(null);
  const [redeemed, setRedeemed] = useState(null);
  const [snackBar, setSnackBar] = useState(false);
  const { currentUser } = useUserContext();

  const { api_data, loading, error } = useSelector((state) => state.data);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState(null);
  const [notAnchor, setNotAnchor] = useState(false);

  var storedData = sessionStorage.getItem("userinfo");
  var storedObj = JSON.parse(storedData);

  const [drawer, setDrawer] = useState(false);
  // console.log("the current user data is ", currentUser)
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile");
  };
  const goToSettings = () => {
    navigate("/settings");
  };

  const handleCloseMenu = () => {
    setAnchor(null);
  };
  const handleMenu = (e) => {
    setAnchor(e.currentTarget);
  };
  const handleNotification = () => {
    setNotAnchor(true);
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

  useEffect(() => {
    const id = api_data?.workspaceId;
    const RedeemedData = async () => {
      const res = await GetAllVouchers_v3({ id: id });
      console.log("the unredeemed data are ", res);
      const unredeemedVoucher = res.data.data.find(
        (voucher) =>
          voucher.is_redeemed === false && voucher.is_verified === true
      );
      if (unredeemedVoucher) {
        setShowNotification(true);
        setNotificationData(unredeemedVoucher);
      } else {
        setShowNotification(false);
        setNotificationData(null);
      }
    };
    RedeemedData();
  }, []);
  console.log("the unredeemed voucher is ", notificationData);
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
            Dowell Services
          </Typography>
          <Box display={"flex"}>
            <Typography
              variant="h6"
              sx={{
                color: "#005734",
                mt: 1.5,
                mr: 1,
                display: { xs: "none", md: "block" },
              }}
            >
              {storedObj?.username}{" "}
              {api_data?.total_credits
                ? `, ${api_data?.total_credits} Credits`
                : ""}
            </Typography>
            <IconButton size="large" onClick={showNotification ? handleNotification : undefined}>
              <Badge badgeContent={showNotification ? 1 : null} color="success">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Box mt={3}>
              <Menu
                id="menu-appbar"
                anchorEl={notAnchor}
                keepMounted
                elevation={2}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(notAnchor)}
                onClose={() => setNotAnchor(false)}
                sx={{mt:5}}
              >
                <MenuItem onClick={goToSettings} sx={{ display: "block", width: "400px", }}>
                  <Typography fontWeight={"bold"}>
                    Congratulatins! You have unredeemed voucher
                  </Typography>
                  <Typography variant="subtitle2">
                    Your {notificationData?.claim_method} <br /> is ready to be
                    Redeemed. If you  want to redeem it, click here.
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>

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
              <MenuItem onClick={goToSettings}>
                <SettingsIcon />
                &nbsp; Your Settings
              </MenuItem>
              {/* <MenuItem onClick={handleVoucherOpen}>
                <ConfirmationNumberIcon />
                &nbsp; Redeem Voucher
              </MenuItem> */}
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
              <ListItemText primary="API Service" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/pythonService");
                setDrawer(false);
              }}
            >
              <ListItemIcon>
                <ViewInArIcon />
              </ListItemIcon>
              <ListItemText primary="Python Library" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/moduleService");
                setDrawer(false);
              }}
            >
              <ListItemIcon>
                <ViewInArIcon />
              </ListItemIcon>
              <ListItemText primary="R Library" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/wpPluginService");
                setDrawer(false);
              }}
            >
              <ListItemIcon>
                <ViewInArIcon />
              </ListItemIcon>
              <ListItemText primary="WP Plugins" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/flutterService");
                setDrawer(false);
              }}
            >
              <ListItemIcon>
                <ViewInArIcon />
              </ListItemIcon>
              <ListItemText primary="Flutter Component" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/reactService");
                setDrawer(false);
              }}
            >
              <ListItemIcon>
                <ViewInArIcon />
              </ListItemIcon>
              <ListItemText primary="React Component" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/productService");
                setDrawer(false);
              }}
            >
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Product Service" />
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
            <ListItemButton
              onClick={() => {
                navigate("/settings");
                setDrawer(false);
              }}
            >
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
