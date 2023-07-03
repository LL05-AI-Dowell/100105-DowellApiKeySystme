import React, { useState, useEffect } from "react";
import Header from "../layout/Header";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  List,
  ListItemButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Link as LinkMUI,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Link } from "react-router-dom";
import { FetchAll, GenerateApiKey } from "../util/api";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

import Logo from "../dowellLogo.png";

const CreateApi = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [addVoucher, setAddVoucher] = useState("");
  const { currentUser } = useUserContext();

  const [genKey, setGenKey] = useState(null);
  const [snackBar, setSnackBar] = useState(false);

  const url = "https://100105.pythonanywhere.com/api/v1/generate-api-key/";

  const handleClickOpen = (item) => {
    setSelectedData(item);
    console.log(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSend = async () => {
    const val = {
      name: currentUser?.userinfo?.username,
      email: currentUser?.userinfo?.email,
      api_services: `${selectedData.api_service}`,
      workspace_id: currentUser?.userinfo?.client_admin_id,
      userDetails: {
        name: currentUser?.userinfo?.username,
        email: currentUser?.userinfo?.email,
        phone: currentUser?.userinfo?.phone,
        profile_img: currentUser?.userinfo?.profile_img,
        userID: currentUser?.userinfo?.userID,
        first_name: currentUser?.userinfo?.first_name,
        last_name: currentUser?.userinfo?.last_name,
        user_country: currentUser?.userinfo?.user_country,
        client_admin_id: currentUser?.userinfo?.client_admin_id,
        login_eventID: currentUser?.userinfo?.login_eventID,
      },
      voucher_code: addVoucher,
    };
    const axiosRes = await GenerateApiKey(val);
    console.log("the axios genrated KEY is ", axiosRes);
    setGenKey(axiosRes);
    setSnackBar(true);
    setOpen(null);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const TableVal = async () => {
      const val = await FetchAll();
      setTableData(val.data);
    };
    TableVal();
  }, []);
  return (
    <div>
      <Header />
      <Box display="flex" width="100vw" minHeight="100vh" >
        <Stack
          direction="column"
          width="60px"
          mt={1}
          pt={4}
          component={Paper}
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          <List>
            <ListItemButton sx={{ borderRight: "5px solid #005734" }}>
              <HomeOutlinedIcon fontSize="large" sx={{ color: "#005734" }} />
            </ListItemButton>
          </List>
        </Stack>
        <Box sx={{ width: { xs: "100%", sm: "90%" } }}>
          <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "center", mt: 4 }}
          >
            <Button
              variant="outlined"
              sx={{ mr: 3, color: "#005734", borderColor: "#005734" }}
              component={Link}
              to="/"
            >
              Create Api Key
            </Button>
            <Button
              variant="outlined"
              sx={{ color: "#005734", borderColor: "#005734" }}
              component={Link}
              to="/createdapikeys"
            >
              Created Api Keys
            </Button>
          </Stack>
          <Box display="flex" justifyContent="center">
            <TableContainer
              component={Paper}
              sx={{ mt: 4, width: { xs: "100%", md: "80%", l: "60%" } }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>NO</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      API SERVICES
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Documentaion
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      CREATE KEY
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.length !== 0 &&
                    tableData.map((i, index) => (
                      <TableRow key={i.api_service}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{i.api_service}</TableCell>
                        <TableCell>
                          <LinkMUI href={i.document_link}>
                            {i.document_link}
                          </LinkMUI>
                        </TableCell>
                        <TableCell>
                          {i.is_active ? "RELEASED" : "NOT RELEASED"}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            endIcon={<ArrowForwardIcon />}
                            sx={{ color: "#005734", borderColor: "#005734" }}
                            onClick={() => handleClickOpen(i)}
                          >
                            Create
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle
              sx={{
                bgcolor: "#dce8e4",
                fontWeight: "bold",
                display: "flex",
              }}
              textAlign="center"
            >
              <img src={Logo} width="80" />
              {selectedData && (
                <Typography variant="h5" ml={6} mt={3}>
                  {" "}
                  {selectedData.api_service}
                </Typography>
              )}
            </DialogTitle>

            <DialogActions sx={{ display: "block", bgcolor: "#dce8e4" }}>
              <Box display="flex" pl={8} pr={8}>
                <TextField
                  fullWidth
                  sx={{ bgcolor: "white" }}
                  value={addVoucher}
                  onChange={(e) => setAddVoucher(e.target.value)}
                  placeholder="Add Voucher"
                />
              </Box>
              <Box pl={8} pr={8}>
                <Typography variant="span" sx={{ fontSize: "13px" }}>
                  If you don't know what voucher is go to right top and click on
                  the Icon, Then click on "Redeem Voucher". Then Copy the
                  voucher
                </Typography>
              </Box>

              <Button
                onClick={handleSend}
                variant="outlined"
                fullWidth
                sx={{
                  width: "300px",
                  ml: "145px",
                  mt: 2,
                  mb: 3,
                  color: "#005734",
                  borderColor: "#005734",
                }}
              >
                Create
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            open={snackBar}
            autoHideDuration={5000}
            onClose={() => setSnackBar(false)}
          >
            {genKey == null ? (
              <Alert severity="error">You already have created Key</Alert>
            ) : (
              <Alert severity="success" sx={{ width: "100%" }}>
                You created your key!
              </Alert>
            )}
          </Snackbar>
        </Box>
      </Box>
    </div>
  );
};

export default CreateApi;
