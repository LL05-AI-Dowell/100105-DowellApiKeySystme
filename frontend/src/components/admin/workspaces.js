import React, { useState, useEffect } from "react";
import { GetAllWorkspaces_v3, RestrictWorkspace_v3 } from "../../util/api_v3";
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
  Pagination, TablePagination
} from "@mui/material";

const Workspaces = () => {
  const [users, setUsers] = useState([]);
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
  const handleRestrict = async () => {
    const res = await RestrictWorkspace_v3({ id: item.workspaceId });
    console.log("the response for restriction is ", res);
    setOpenSnack(res.data.message);
    const resAgain = await GetAllWorkspaces_v3();
    console.log(resAgain.data.data);
    setUsers(resAgain.data.data);
    setItem();
    setDialog(false);
  };
  useEffect(() => {
    const Workspaces = async () => {
      const res = await GetAllWorkspaces_v3();
      console.log(res.data.data);
      setUsers(res.data.data);
    };
    Workspaces();
  }, []);
  return (
    <div>
      <Box>
        {users === [] ? (
          <Box>loading</Box>
        ) : (
          <Box>
            <TableContainer component={Paper} sx={{ mb: 3, mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>User Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>API Key</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Workspaces Id</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Total Credits
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Is Active</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Is Paid</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Is Disabled
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Restrict/ Activate
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((i) => {
                    return (
                      <TableRow key={i.api_key}>
                        <TableCell>{i.username}</TableCell>
                        <TableCell>{i.api_key}</TableCell>
                        <TableCell>{i.workspaceId}</TableCell>
                        <TableCell align="right">{i.total_credits}</TableCell>
                        <TableCell>{i.is_active ? "True" : "False"}</TableCell>
                        <TableCell>{i.is_paid ? "Paid" : "Not Paid"}</TableCell>
                        <TableCell>
                          {i.disable_key ? "Disabled" : "Active"}
                        </TableCell>
                        <TableCell>
                          {i.disable_key ? (
                            <Button
                              color="success"
                              size="small"
                              onClick={() => openDialog(i)}
                            >
                              Activate
                            </Button>
                          ) : (
                            <Button
                              color="success"
                              size="small"
                              onClick={() => openDialog(i)}
                            >
                              Restrict
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
                count={users.length}
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
              <DialogTitle id="alert-dialog-title">
                Restrict / Activate User
              </DialogTitle>
              <DialogContent sx={{ width: { xs: "100%", md: "400px" } }}>
                Do you want to {item?.disable_key ? "Activate" : "Restrict"}{" "}
                user {item?.username}
                &nbsp; Key?
              </DialogContent>
              <DialogActions>
                <Button
                  color="error"
                  autoFocus
                  onClick={() => setDialog(false)}
                >
                  Go Back
                </Button>
                <Button color="success" autoFocus onClick={handleRestrict}>
                  {item?.disable_key ? "Activate" : "Restrict"}
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

export default Workspaces;
