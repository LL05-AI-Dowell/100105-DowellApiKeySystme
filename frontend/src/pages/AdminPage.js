import React, { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import Nav from "../layout/Nav";

import {
  Box,
  CircularProgress,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
} from "@mui/material";

const AdminPage = () => {
  return (
    <div>
      <Nav />
      <Box sx={{ display: "flex", bgcolor: "#edf2f3", minHeight: "100vh" }}>
        <Sidebar page="admin" />
        <Box width="80%" pt={4} ml={4}>
          Admin Page
        </Box>
      </Box>
    </div>
  );
};

export default AdminPage;
