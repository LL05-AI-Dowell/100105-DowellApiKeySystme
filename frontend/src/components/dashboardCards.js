import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import Logo from "../dowellLogo.png";

import { ActivateApiKey_v2 } from "../util/api";

const DashboardCards = ({ data }) => {
  const [document, setDocument] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [addVoucher, setAddVoucher] = useState("");
  const [snackBar, setSnackBar] = useState(false);
  const [genKey, setGenKey] = useState(null);

  const openDialog = () => {
    setDialog(true);
  };
  const handleCloseDialog = () => {
    setDialog(null);
  };
  const handleActivateApi = async () => {
    console.log(data[0].userId, data[0].APIKey);
    const res = await ActivateApiKey_v2({
      id: data[0].userId,
      voucher_code: addVoucher,
      api_key: data[0].APIKey,
    });
    console.log("the axios response for activation is ", res);
    setSnackBar(true);
    setGenKey(res);
    setDialog(false);
    window.location.reload();
  };

  return (
    <Box>
      <Box component={Paper} p={2} sx={{ m: { xs: 1, md: 2 } }}>
        <Typography variant="h6" fontWeight={"bold"}>
          {data[0].is_paid ? "This is Paid Version!" : "Upgrade your plan!"}
        </Typography>
        <Typography>
          You are currently on a {data[0].is_paid ? "Paid" : "free"} plan
        </Typography>
      </Box>
      <Grid
        container
        spacing={0}
        key={data[0].userId}
        sx={{ m: { xs: 1, md: 2 } }}
      >
        <Grid
          item
          xs={12}
          md={5}
          p={2}
          borderRadius={4}
          component={Paper}
          sx={{ padding: 0, overflow: "hidden", m: { xs: 1, md: 2 } }}
        >
          <Box
            sx={{
              height: "50px",
              bgcolor: "#e3ede9",
              m: 0,
            }}
          >
            <Typography p={2} fontWeight="bold">
              API Key
            </Typography>
          </Box>
          <Typography
            pl={3}
            pt={2}
            fontWeight={"bold"}
            variant="h5"
            sx={{ color: "#005734" }}
          >
            {data[0].is_active ? "Active" : "Not Active"}
          </Typography>
          <Box p={3}>
            <Typography
              bgcolor="#e6e8e9"
              pl={1}
              pt={1}
              pb={1}
              sx={{ height: "35px", borderRadius: "5px" }}
            >
              {data[0].APIKey}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }} mb={3}>
            <Button
              variant="contained"
              size="small"
              sx={{ mr: 1 }}
              color="success"
            >
              Copy to Clipboard
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={setDialog}
              sx={{
                bgcolor: "#e6e8e9",
                color: "black",
                "&:hover": {
                  backgroundColor: "#edf2f3",
                },
              }}
            >
              {data[0].is_active ? "Deactivate" : "Activate Key"}
            </Button>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          borderRadius={4}
          p={2}
          component={Paper}
          sx={{ padding: 0, overflow: "hidden", m: { xs: 1, md: 2 } }}
        >
          <Box
            sx={{
              height: "50px",
              bgcolor: "#e3ede9",
              m: 0,
            }}
          >
            <Typography p={2} fontWeight="bold">
              Usage
            </Typography>
          </Box>
          <Box p={2}>
            <Typography mb={2}>
              You have remaining &nbsp; &nbsp; {data[0].credits} &nbsp;/ 100
              Credits
            </Typography>
            <LinearProgress variant="determinate" color="success" value={data[0].credits} />
          </Box>
        </Grid>
      </Grid>
      <Box>
        {data[0].api_services.map((i) =>
          i.is_active ? (
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              component={Paper}
              p={2}
              sx={{ m: { xs: 1, md: 2 } }}
            >
              <Typography ml={2}>{i.api_service}</Typography>
              <Typography mr={24}>
                Credits : &nbsp; {i.credits_count}
              </Typography>
            </Box>
          ) : (
            ""
          )
        )}
      </Box>

      <Dialog open={dialog} onClose={handleCloseDialog}>
        <DialogTitle
          sx={{
            bgcolor: "#dce8e4",
            fontWeight: "bold",
            display: "flex",
          }}
          textAlign="center"
        >
          <img src={Logo} width="80" />

          <Typography
            variant="h5"
            ml={6}
            mt={3}
            fontWeight={"bold"}
            sx={{ color: "#005734" }}
          >
            {" "}
            API Key
          </Typography>
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
              If you don't know what voucher is go to right top and click on the
              Icon, Then click on "Redeem Voucher". Then Copy the voucher
            </Typography>
          </Box>

          <Button
            onClick={handleActivateApi}
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
            {" "}
            {data[0].is_active ? "Deactivate" : "Activate"}
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
          <Alert severity="error">
            Error occured while generating your key
          </Alert>
        ) : (
          <Alert severity="success" sx={{ width: "100%" }}>
            {data[0].is_active
              ? "You Deactivated your key!"
              : "You Activated your key!"}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default DashboardCards;
