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
  Stack,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import AdminCard from "../components/adminCard";
import Workspaces from "../components/admin/workspaces";
import Vouchers from "../components/admin/vouchers";
import AddServices from "../components/admin/addServices";

const AdminPage = () => {
  const [page, setPage] = useState(1);
  const { api_data, loading, error } = useSelector((state) => state.data);
  return (
    <div>
      <Nav />
      <Box sx={{ display: "flex", bgcolor: "#edf2f3", minHeight: "100vh" }}>
        <Sidebar page="admin" />
        <Box width="80%" pt={4} ml={4}>
          {api_data?.workspaceId == "641d50d96e2378d97406fac0" ? (
            <Box>
              <Stack
                direction="row"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  borderBottom: "solid 1px green",
                }}
              >
                <Button
                  color="success"
                  sx={{
                    borderBottom: page == 1 ? "solid 5px green" : "",
                    borderRadius: 0,
                  }}
                  onClick={() => setPage(1)}
                >
                  Workspaces
                </Button>
                <Button
                  color="success"
                  sx={{
                    borderBottom: page == 2 ? "solid 5px green" : "",
                    borderRadius: 0,
                  }}
                  onClick={() => setPage(2)}
                >
                  Vocuher Details
                </Button>
                <Button
                  color="success"
                  sx={{
                    borderBottom: page == 3 ? "solid 5px green" : "",
                    borderRadius: 0,
                  }}
                  onClick={() => setPage(3)}
                >
                  Add Services
                </Button>
              </Stack>
              {page == 1 ? (
                <Workspaces />
              ) : page == 2 ? (
                <Vouchers />
              ) : (
                <AddServices />
              )}
            </Box>
          ) : (
            <Box>
              <Typography
                textAlign={"center"}
                color={"error"}
                variant="h4"
                fontWeight={"bold"}
              >
                Sorry, You are not an Admin!
              </Typography>{" "}
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default AdminPage;
