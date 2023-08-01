import React, { useState } from "react";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  DialogTitle,
  TextField,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";

import { useNavigate, Link } from "react-router-dom";

import Nav from "../layout/Nav";
import Sidebar from "../layout/Sidebar";

const Settings = () => {
  const [dialog, setDialog] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleDialog = async () => {
    setDialog(true);
  };
  const handleSubmit = async (e) => {
    if (password !== "") {
      console.log(password);
      navigate("/addService");
    }
  };
  return (
    <div>
      <Nav />
      <Box sx={{ display: "flex", bgcolor: "#edf2f3", minHeight: "90vh" }}>
        <Sidebar page="settings" />
        <Box sx={{ width: { xs: "90%", md: "80%" } }} pt={4}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            ml={2}
            mr={2}
            sx={{ borderBottom: "1px solid black" }}
          >
            <Box display={"flex"}>
              <SettingsIcon sx={{ mt: 0.5 }} />
              <Typography variant="h5" ml={1} fontWeight={"bold"}>
                Settings
              </Typography>
            </Box>
            <EditIcon onClick={handleDialog} />
          </Box>
          <Dialog
            open={dialog}
            onClose={() => setDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Enter your passowrd
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="password"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialog(false)}>Go Back</Button>
              <Button onClick={handleSubmit} autoFocus>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </div>
  );
};

export default Settings;
