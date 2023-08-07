import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  DialogTitle,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";

import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ClaimVoucher_v3,
  GetRedeemedVouchers_v3,
  GetNotRedeemedVouchers_v3,
  RedeemVoucher_v3,
} from "../util/api_v3";

import Nav from "../layout/Nav";
import Sidebar from "../layout/Sidebar";

const Settings = () => {
  const [claimVoucher, setClaimVoucher] = useState(false);
  const [claimMethod, setClaimMethod] = useState("");
  const [claimDescription, setClaimDescription] = useState("");
  const [claimRes, setClaimRes] = useState("");
  const [claimSnackbar, setClaimSnackbar] = useState(false);
  const [timeZone, setTimeZone] = useState("");
  const [redeemed, setRedeemed] = useState("not redeemed");
  const [voucher, setVoucher] = useState([]);

  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const { api_data, loading, error } = useSelector((state) => state.data);

  const handleClaimVoucher = async () => {
    if (claimMethod !== "" && claimDescription !== "") {
      const dataObj = {
        claim_method: claimMethod,
        description: claimDescription,
        timezone: timeZone,
      };
      const data = JSON.stringify(dataObj);
      console.log(data);
      const id = api_data?.workspaceId;
      const res = await ClaimVoucher_v3({ id: id, data: data });
      console.log(" the response is ", res);
      setClaimRes(res.data.message);
      setClaimSnackbar(true);
      setClaimVoucher(false);
      setClaimMethod("");
      setClaimDescription("");
    }
  };
  const handleRedeem = async (e) => {
    const id = api_data?.workspaceId;
    setRedeemed(e.target.value);
    if (e.target.value == "redeemed") {
      const res = await GetRedeemedVouchers_v3({ id: id });
      setVoucher(res.data.data);
      console.log("the handle redeemed data res is ", res);
    } else {
      const res = await GetNotRedeemedVouchers_v3({ id: id });
      setVoucher(res.data.data);
      console.log("the handle not redeemed data res is ", res);
    }
  };
  const redeemVoucher = async (e) => {
    console.log(" the picked id is ", e);
    const id = e;
    const dataObj = {
      timezone: timeZone,
    };
    const data = JSON.stringify(dataObj);
    const res = await RedeemVoucher_v3({ id: id, data: data });
    console.log(" the redeem response is ", res);
    const idNew = api_data?.workspaceId;
    const fetch = await GetNotRedeemedVouchers_v3({ id: idNew });
    console.log("the unredeemed data are ", res);
    setVoucher(fetch.data.data);
  };
  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimeZone(timeZone);
    const id = api_data?.workspaceId;
    const RedeemedData = async () => {
      const res = await GetNotRedeemedVouchers_v3({ id: id });
      console.log("the unredeemed data are ", res);
      setVoucher(res.data.data);
    };
    RedeemedData();
  }, []);

  return (
    <div>
      <Nav />
      <Box sx={{ display: "flex", bgcolor: "#edf2f3", minHeight: "90vh" }}>
        <Sidebar page="settings" />
        <Box sx={{ width: { xs: "90%", md: "80%" } }} pt={4} ml={4}>
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
              Voucher
            </Button>
            <Button
              color="success"
              sx={{
                borderBottom: page == 2 ? "solid 5px green" : "",
                borderRadius: 0,
              }}
              onClick={() => setPage(2)}
            >
              Billing Information
            </Button>
          </Stack>
          {page == 1 ? (
            <Box>
              <Box
                sx={{
                  display: { xs: "block", md: "flex" },
                  justifyContent: { xs: "center", md: "space-between" },
                  mr: { xs: 0, md: "5%" },
                  mt: 2,
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={"bold"}
                  mt={1}
                  mb={2}
                  sx={{ color: "#005734" }}
                >
                  VOUCHER
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setClaimVoucher(true)}
                  mt={2}
                  sx={{ height: "40px" }}
                >
                  Claim Voucher
                </Button>
              </Box>

              <Box>
                <Box
                  display={"flex"}
                  justifyContent={"end"}
                  mr={{ xs: 0, md: "4.8%" }}
                  mt={3}
                >
                  <Box width={"170px"}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={redeemed}
                        onChange={(e) => handleRedeem(e)}
                      >
                        <MenuItem value={"redeemed"}>Reedemed</MenuItem>
                        <MenuItem value={"not redeemed"}>Not Redeemed</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <Box
                  mt={2}
                  sx={{
                    overflowX: "auto",
                  }}
                >
                  <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Claim Method
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Description
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Verified
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Redeemed
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {voucher.length === 0
                          ? ""
                          : voucher.map((i) => (
                              <TableRow key={i._id}>
                                <TableCell>{i.claim_method}</TableCell>
                                <TableCell>{i.description}</TableCell>
                                <TableCell>
                                  {i.is_verified ? "Verified" : "Not Verified"}
                                </TableCell>
                                <TableCell>
                                  {i.is_verified == true &&
                                  i.is_redeemed == true ? (
                                    "Redeemed"
                                  ) : i.is_verified == true &&
                                    i.is_redeemed == false ? (
                                    <Button
                                      color="success"
                                      onClick={() => redeemVoucher(i._id)}
                                    >
                                      Redeem
                                    </Button>
                                  ) : (
                                    "Not Redeemed"
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
              <Dialog
                open={claimVoucher}
                onClose={() => setClaimVoucher(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  Enter Vocher data
                </DialogTitle>
                <DialogContent sx={{ width: { xs: "100%", md: "400px" } }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Set Claim Method
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={claimMethod}
                      label="Claim Method"
                      onChange={(e) => setClaimMethod(e.target.value)}
                    >
                      <MenuItem value="DIRECT FROM DOWELLPAY">
                        DIRECT FROM DOWELLPAY
                      </MenuItem>
                      <MenuItem value="STORE MARKETPLACE">
                        STORE MARKETPLACE
                      </MenuItem>
                      <MenuItem value="SALES AGENTS BOOKING COUPONS">
                        SALES AGENTS BOOKING COUPONS
                      </MenuItem>
                      <MenuItem value="REFERENCES CREDIT COUPONS">
                        REFERENCES CREDIT COUPONS
                      </MenuItem>
                      <MenuItem value="ACTIVITY CREDIT COUPONS">
                        ACTIVITY CREDIT COUPONS
                      </MenuItem>
                      <MenuItem value="DOWNLOADS - GOOGLEPLAY/APPLE STORE">
                        DOWNLOADS - GOOGLEPLAY/APPLE STORE
                      </MenuItem>
                      <MenuItem value="PUBLIC REVIEW CREDITS COUPONS">
                        PUBLIC REVIEW CREDITS COUPONS
                      </MenuItem>
                      <MenuItem value="SIGNUP CREDITS">SIGNUP CREDITS</MenuItem>
                      <MenuItem value="STARTUP CREDIT COUPONS">
                        STARTUP CREDIT COUPONS
                      </MenuItem>
                      <MenuItem value="INTERNAL CREDIT COUPONS">
                        INTERNAL CREDIT COUPONS
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="description"
                    label="Description"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={claimDescription}
                    onChange={(e) => setClaimDescription(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={handleClaimVoucher}>
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
              <Snackbar
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
                open={claimSnackbar}
                autoHideDuration={5000}
                onClose={() => setClaimSnackbar(false)}
              >
                <Alert
                  severity={
                    claimRes == "Voucher created successfully"
                      ? "success"
                      : "error"
                  }
                  sx={{ width: "100%" }}
                >
                  {claimRes}
                </Alert>
              </Snackbar>
            </Box>
          ) : (
            <Box display={'flex'} justifyContent={'center'}>
              <Typography mt={4} variant="h5">Coming Soon!</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Settings;
