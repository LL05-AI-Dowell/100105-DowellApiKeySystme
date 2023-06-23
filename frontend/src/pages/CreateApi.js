import React, { useState, useEffect } from "react";
import Header from "../layout/Header";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  IconButton,
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
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Link, json } from "react-router-dom";

const CreateApi = () => {
  const [tableData, setTableData] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [addVoucher, setAddVoucher] = useState("");

  const url = "https://100105.pythonanywhere.com/api/v1/generate-api-key/";

  const handleClickOpen = (item) => {
    setSelectedData(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSend = async () => {
    const val = {
      name: "manish",
      email: "manish@dowellresearch.in",
      api_services: `${selectedData.api_service}`,
      workspace_id: "162573bcsfer",
      userDetails: {
        name: "manish",
        email: "manish@dowellresearch.in",
      },
      voucher_code: addVoucher,
    };
    console.log(JSON.stringify(val));
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(val),
    });
    const resData = await res.json()
    console.log('thes response is ', resData)
    // setOpen(null);
  };

  useEffect(() => {
    const TableVal = async () => {
      const res = await fetch(
        "https://100105.pythonanywhere.com/api/v1/list-of-api/"
      );
      const val = await res.json();
      // console.log("the data is ", val);
      setTableData(val.data);
    };
    TableVal();
  }, []);
  return (
    <div>
      <Header />
      <Box display="flex" width="100vw">
        <Stack
          direction="column"
          height="89vh"
          width="60px"
          mt={1}
          pt={4}
          component={Paper}
        >
          <List>
            <ListItemButton sx={{ borderRight: "5px solid #005734" }}>
              <HomeOutlinedIcon fontSize="large" sx={{ color: "#005734" }} />
            </ListItemButton>
          </List>
        </Stack>
        <Box width="90vw">
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
            <TableContainer component={Paper} sx={{ m: 4, width: "80%" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Api Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Documentaion
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Api Key</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.length !== 0 &&
                    tableData.map((i) => (
                      <TableRow key={i.api_service}>
                        <TableCell>{i.api_service}</TableCell>
                        <TableCell>
                          <LinkMUI href={i.document_link}>
                            {i.document_link}
                          </LinkMUI>
                        </TableCell>
                        <TableCell>
                          {i.is_active ? "Created" : "Not Created"}
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
              sx={{ width: "500px", bgcolor: "#dce8e4", fontWeight: "bold" }}
              textAlign="center"
            >
              {selectedData && <Typography> {selectedData.name}</Typography>}
            </DialogTitle>

            <DialogActions sx={{ display: "block", bgcolor: "#dce8e4" }}>
              <Box display="flex" pl={2} pr={2}>
                <Typography sx={{ width: "150px", pt: 2, color: "#005734" }}>
                  Add Voucher
                </Typography>{" "}
                <TextField
                  fullWidth
                  sx={{ bgcolor: "white" }}
                  value={addVoucher}
                  onChange={(e) => setAddVoucher(e.target.value)}
                />
              </Box>
              <Button
                onClick={handleSend}
                variant="outlined"
                fullWidth
                sx={{
                  width: "300px",
                  ml: "100px",
                  mt: 3,
                  mb: 3,
                  color: "#005734",
                  borderColor: "#005734",
                }}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </div>
  );
};

export default CreateApi;
