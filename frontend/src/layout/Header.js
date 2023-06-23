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
  Link,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import Logo from "../dowellLogo.png";

const Header = () => {
  const [open, setOpen] = React.useState(false);
  const [anchor, setAnchor] = useState(null);
  const [voucher, setVoucher] = useState(null);

  const url =
    "https://100105.pythonanywhere.com/api/v1/redeem-voucher/kamanish@dowellresearch.in/";
  const url2 =
    "https://100105.pythonanywhere.com/api/v1/redeem-voucher/";
  const data = { name: "kamanish", email: "kamanish@dowellresearch.in" };

  const handleClose = () => {
    setAnchor(null);
  };
  const handleMenu = (e) => {
    setAnchor(e.currentTarget);
  };
  const handleClickOpen = async () => {
    const res = await fetch(url);
    const resData = await res.json();
    console.log("the fetched data is ", resData);
    if (resData.data.length > 0) {
      setVoucher(resData.data[0]);
    }
    setOpen(true);
    setAnchor(null);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleRedeemVoucher = async () => {
    const response = await fetch(url2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Response:", result);
  };
  return (
    <Box sx={{ zIndex: "5" }}>
      <AppBar position="static" sx={{ bgcolor: "#00573412" }}>
        <Toolbar color="#00573412">
          <img src={Logo} width="70" style={{ marginRight: "30px" }} />
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ flexGrow: 1, color: "#005734" }}
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
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClickOpen}>Redeem Voucher</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Dialog open={open} onClose={handleCloseDialog} sx={{ p: 4 }}>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            bgcolor: "#dce8e4",
            width: "500px",
          }}
        >
          <Typography variant="h4" mr={2} fontWeight="bold">
            Download <br /> Redeem Code
          </Typography>
          <img src={Logo} width="80" />
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
            {voucher == null ? <CircularProgress /> : voucher.voucher_code}
          </Box>
          <Typography>
            If you haven't redeemed,{" "}
            <Link color="#005734" onClick={handleRedeemVoucher} component={Button}>
              Click here to redeem
            </Link>
          </Typography>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Header;
