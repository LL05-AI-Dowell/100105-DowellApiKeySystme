import React, { useState, useEffect } from "react";
import Logo from "../dowellLogo.png";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Divider,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import Row from "./Row";

import { setService, setSError, setSLoading } from "../store/reducers/service";
import { useSelector, useDispatch } from "react-redux";
import { ActivateService_v3, GetAllService_v3 } from "../util/api_v3";

const DocumentationCards = ({ card, title }) => {
  const [snackBar, setSnackBar] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { service_data, sloading, serror } = useSelector(
    (state) => state.service
  );
  const { api_data, loading, error } = useSelector((state) => state.data);

  const navigate = useNavigate();

  ///activate service function
  const handleService = async (e) => {
    console.log("the picked service is ", e);
    console.log(" api key ", api_data?.api_key, " service id ", e.service_id);
    if (e.is_released == false) {
      setSnackBar("info");
    } else {
      const res = await ActivateService_v3({
        api_key: api_data?.api_key,
        service_id: e.service_id,
      });
      console.log("the service res is ", res);
      if (res?.data.success == true) {
        setSnackBar("success");
        // window.location.reload();
        const get = await GetAllService_v3();
        console.log("the response for all service is ", get);
        dispatch(setService(get.data.data));
        navigate("/");
      } else {
        setSnackBar("error");
      }
    }
  };
  const filteredService = service_data?.filter(
    (i) =>
      i?.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      i?.service_type == card
  );
  console.log("the fileted service is ", filteredService);

  return (
    <Box>
      <Box mb={3}>
        <Box
          sx={{
            display: { xs: "block", md: "flex" },
            justifyContent: { xs: "center", md: "space-between" },
            mr: { xs: 0, md: "5%" },
          }}
        >
          <Typography
            variant="h5"
            fontWeight={"bold"}
            mt={1}
            sx={{ color: "#005734" }}
          >
            {title}
          </Typography>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", md: "45%" },
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Service"
              inputProps={{ "aria-label": "search google maps" }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
        {searchTerm !== "" ? (
          <Box>
            <TableContainer component={Paper} sx={{ mb: 3, mt: 3 }}>
              {filteredService.length > 0 ? (
                filteredService.map((row) => {
                  return (
                    <Row
                      key={row.name}
                      row={row}
                      handleService={handleService}
                    />
                  );
                })
              ) : (
                <Box
                  width={"50%"}
                  mt={4}
                  display={"flex"}
                  justifyContent={"center"}
                >
                  <Typography variant="h6">No Service Found</Typography>
                </Box>
              )}
              <Snackbar
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
                open={snackBar}
                autoHideDuration={5000}
                onClose={() => setSnackBar("")}
              >
                <Alert severity={snackBar} sx={{ width: "100%" }}>
                  {snackBar == "success"
                    ? "Done"
                    : snackBar == "info"
                    ? "It is not released yet"
                    : "Error Occured"}
                </Alert>
              </Snackbar>
            </TableContainer>
            <Divider sx={{ height: 28, m: 0.5 }} />
          </Box>
        ) : (
          ""
        )}
      </Box>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: "bold" }}>Service Id</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Service Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Documentation</TableCell>
              {card == "PRODUCT" ? (
                ""
              ) : (
                <TableCell sx={{ fontWeight: "bold" }}>Credits</TableCell>
              )}
              <TableCell sx={{ fontWeight: "bold" }}>Activate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {service_data?.map((row) => {
              if (row.service_type == card) {
                return (
                  <Row key={row.name} row={row} handleService={handleService} />
                );
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        open={snackBar}
        autoHideDuration={5000}
        onClose={() => setSnackBar("")}
      >
        <Alert severity={snackBar} sx={{ width: "100%" }}>
          {snackBar == "success"
            ? "Done"
            : snackBar == "info"
            ? "It is not released yet"
            : "Error Occured"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DocumentationCards;
