import React, { useState, useEffect } from "react";
import { GetVoucherDetails_v3, VerifyVoucher_v3 } from "../../util/api_v3";
import {
  Box,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  Button,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  TablePagination,
} from "@mui/material";

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [openSnack, setOpenSnack] = useState();
  const [item, setItem] = useState();

  ////pagination data
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

  const openDialog = (e) => {
    setItem(e);
    setDialog(true);
  };
  const handleVerify = async () => {
    const res = await VerifyVoucher_v3({ id: item._id });
    console.log("the response for verification is ", res);
    setOpenSnack(res.data.message);
    const resAgain = await GetVoucherDetails_v3();
    console.log(resAgain.data.data);
    setVouchers(resAgain.data.data);
    setItem();
    setDialog(false);
  };
  useEffect(() => {
    const Vouchers = async () => {
      const res = await GetVoucherDetails_v3();
      console.log(res.data);
      console.log(res.data.data);
      setVouchers(res.data.data);
    };
    Vouchers();
  }, []);
  return (
    <div>
      <Box>
        {vouchers === [] ? (
          <Box>loading</Box>
        ) : (
          <Box>
            <TableContainer component={Paper} sx={{ mb: 3, mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Voucher Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Claim Method
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Description
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {" "}
                      Voucher Worth
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Is Verified
                    </TableCell>

                    <TableCell sx={{ fontWeight: "bold" }}>
                      Verify Voucher
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vouchers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((i) => {
                      return (
                        <TableRow key={i?._id}>
                          <TableCell>{i?.name}</TableCell>
                          <TableCell>{i?.claim_method}</TableCell>
                          <TableCell>{i?.description}</TableCell>
                          <TableCell align="right">
                            {i?.voucher_worth}
                          </TableCell>
                          <TableCell>
                            {i?.is_verified ? "True" : "Not Verified"}
                          </TableCell>
                          <TableCell>
                            {i?.is_verified ? (
                              "Verified"
                            ) : (
                              <Button
                                color="success"
                                size="small"
                                onClick={() => openDialog(i)}
                              >
                                Verify
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10]}
                component="div"
                count={vouchers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
            <Dialog
              open={dialog}
              onClose={() => setDialog(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Verify Voucher</DialogTitle>
              <DialogContent sx={{ width: { xs: "100%", md: "400px" } }}>
                Do you want to Verify this voucher?
              </DialogContent>
              <DialogActions>
                <Button
                  color="error"
                  autoFocus
                  onClick={() => setDialog(false)}
                >
                  Go Back
                </Button>
                <Button color="success" autoFocus onClick={handleVerify}>
                  Verify
                </Button>
              </DialogActions>
            </Dialog>
            <Snackbar
              anchorOrigin={{ horizontal: "right", vertical: "top" }}
              open={openSnack}
              autoHideDuration={5000}
              onClose={() => setOpenSnack()}
            >
              <Alert severity={"success"} sx={{ width: "100%" }}>
                {openSnack}
              </Alert>
            </Snackbar>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Vouchers;
