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
  TablePagination,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ClaimVoucher_v3,
  GetRedeemedVouchers_v3,
  GetNotRedeemedVouchers_v3,
  RedeemVoucher_v3,
  GetAllVouchers_v3, RedeemVoucher_v3_1
} from "../../util/api_v3";
import VoucherImg from "../../icons/voucher.png";

const ClaimVoucher = () => {
  const [claimVoucher, setClaimVoucher] = useState(false);
  const [claimMethod, setClaimMethod] = useState("");
  const [claimDescription, setClaimDescription] = useState("");
  const [claimRes, setClaimRes] = useState("");
  const [claimSnackbar, setClaimSnackbar] = useState(false);
  const [timeZone, setTimeZone] = useState("");
  const [redeemed, setRedeemed] = useState("all");
  const [voucher, setVoucher] = useState([]);

  const [voucherId, setVoucherId] = useState("")

  ////tabel pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  /////////////////

  const navigate = useNavigate();
  const { api_data, loading, error } = useSelector((state) => state.data);

  const handleClaimVoucher = async () => {
    const dataObj = {
      timezone: timeZone,
      voucher_code: voucherId
    };
    const id = api_data?.workspaceId;
    const data = JSON.stringify(dataObj);
    console.log(data)
    const res = await RedeemVoucher_v3_1({id: id, data:data})
    console.log("the res is ", res)
    setClaimVoucher(false)
    setVoucherId("")
    if(res){
      setClaimSnackbar(res)
    }
    else{
      setClaimSnackbar({message:"semething went wrong", success:"false"})
    }

  };
  const handleRedeem = async (e) => {
    const id = api_data?.workspaceId;
    setRedeemed(e.target.value);
    if (e.target.value == "redeemed") {
      const res = await GetRedeemedVouchers_v3({ id: id });
      setVoucher(res.data.data);
      console.log("the handle redeemed data res is ", res);
    } else if (e.target.value == "all") {
      const res = await GetAllVouchers_v3({ id: id });
      setVoucher(res.data.data);
      console.log("the all voucher data res is ", res);
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
    const fetch = await GetAllVouchers_v3({ id: idNew });
    console.log("the unredeemed data are ", res);
    setVoucher(fetch.data.data);
  };
  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimeZone(timeZone);
    const id = api_data?.workspaceId;
    const RedeemedData = async () => {
      const res = await GetAllVouchers_v3({ id: id });
      console.log("the unredeemed data are ", res);
      setVoucher(res.data.data);
    };
    RedeemedData();
  }, []);

  return (
    <Box>
      <Box>
        <Box
          display={"flex"}
          justifyContent={"end"}
          mr={{ xs: 0, md: "4.8%" }}
          mt={3}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => setClaimVoucher(true)}
            mt={2}
            mr={2}
            sx={{ height: "40px" }}
          >
            Redeem Voucher
          </Button>
          {/* <Box width={"170px"} ml={2}>
            <FormControl fullWidth size="small">
              <Select value={redeemed} onChange={(e) => handleRedeem(e)}>
                <MenuItem value={"redeemed"}>Reedemed</MenuItem>
                <MenuItem value={"not redeemed"}>Not Redeemed</MenuItem>
                <MenuItem value={"all"}>All Voucher</MenuItem>
              </Select>
            </FormControl>
          </Box> */}
        </Box>
        <Box
          mt={2}
          sx={{
            overflowX: "auto",
          }}
        >
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Voucher Worth
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Verified</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Redeemed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {voucher.length === 0 ? (
                    <Box p={4} pr={0}>
                      <Typography>
                        You haven't{" "}
                        {redeemed == "not redeemed" ? "claimed" : "redeemed"}{" "}
                        any voucher
                      </Typography>
                    </Box>
                  ) : (
                    voucher
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((i) => (
                        <TableRow key={i._id}>
                          <TableCell>{i.claim_method}</TableCell>
                          <TableCell>{i.description}</TableCell>
                          <TableCell align="right">{i.voucher_worth}</TableCell>
                          <TableCell>
                            {i.is_verified ? "Verified" : "Not Verified"}
                          </TableCell>
                          <TableCell>
                            {i.is_verified == true && i.is_redeemed == true ? (
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
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={voucher?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </Box>
      <Dialog
        open={claimVoucher}
        onClose={() => setClaimVoucher(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          <img src={VoucherImg} width={"60pc"} />
          <Typography variant="h5" fontWeight={"bold"} sx={{ color: "green" }}>
            ADD YOUR VOUCHER CODE
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ width: { xs: "84%", md: "350px" } }}>
          <TextField
            name="topup"
            value={voucherId}
            type="text"
            fullWidth
            onChange={(e) => setVoucherId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClaimVoucher}
            autoFocus
            color="success"
            variant="contained"
            disabled={!voucherId}
            fullWidth
            sx={{ ml: "5%", mr: "5%", mb: 2 }}
          >
            Redeem
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
          severity={claimSnackbar?.success == "true" ? "success" : "error"}
        >
          {claimSnackbar?.message  }
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClaimVoucher;
