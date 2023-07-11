import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
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
import { ActivateService, UpgradeKey } from "../util/api";

const DashboardCards = ({ data }) => {
  const [document, setDocument] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [addVoucher, setAddVoucher] = useState("");
  const [snackBar, setSnackBar] = useState(false);
  const [serviceSnackBar, setServiceSnackBar] = useState(false);
  const [upgradeSnackBar, setUpgradeSnackBar] = useState(false);
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
  const copiedKey = data[0].APIKey;
  const handleCopy = () => {
    const copiedKey = data[0].APIKey;

    console.log("copied data is ", copiedKey);
  };

  const handleService = async (e) => {
    console.log("the picked service is ", e);
    console.log(
      "user Id ",
      data[0].userId,
      " api key ",
      data[0].APIKey,
      " service id ",
      e.api_service_id
    );
    if (e.is_released == false) {
      setServiceSnackBar("info");
    } else {
      const res = await ActivateService({
        id: data[0].userId,
        api_key: data[0].APIKey,
        service_id: e.api_service_id,
      });
      if (res?.success == true) {
        setServiceSnackBar("success");
        // window.location.reload();
      } else {
        setServiceSnackBar("error");
      }
    }
  };
  const handleUpgrade = async () => {
    const val = data[0].APIKey;
    const res = await UpgradeKey({val:val});
    console.log(res)
    if (res?.Success == true) {
      setUpgradeSnackBar("success");
      window.location.reload();
    } else {
      setUpgradeSnackBar("error");
    }
  };

  return (
    <Box>
      <Box component={Paper} p={2} sx={{ m: { xs: 1, md: 2 } }}>
        <Typography variant="h6" fontWeight={"bold"}>
          {data.length > 0 && data[0].is_paid
            ? "This is Paid Version!"
            : "Upgrade your plan!"}
        </Typography>
        <Typography>
          You are currently on a{" "}
          {data.length > 0 && data[0].is_paid ? "Paid" : "free"} plan,{" "}
          {data.length > 0 && data[0].is_paid ? (
            ""
          ) : (
            <Button onClick={() => handleUpgrade()}>
              Click here to Upgrade
            </Button>
          )}
        </Typography>
      </Box>
      <Grid
        container
        spacing={0}
        key={data[0].userId}
        justifyContent="center"
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
            {data.length > 0 && data[0].is_active ? "Active" : "Not Active"}
          </Typography>
          <Box p={3}>
            <Typography
              bgcolor="#e6e8e9"
              pl={1}
              pt={2}
              pb={1}
              sx={{ height: "35px", borderRadius: "5px" }}
              textAlign={"center"}
            >
              {data.length > 0 && data[0]?.APIKey}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }} mb={3}>
            <CopyToClipboard text={copiedKey} onCopy={handleCopy}>
              <Button
                variant="contained"
                size="small"
                sx={{ mr: 1 }}
                color="success"
              >
                Copy to Clipboard
              </Button>
            </CopyToClipboard>
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
              {data.length > 0 && data[0].is_active
                ? "Deactivate"
                : "Activate Key"}
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
          <Box p={2} pt={1}>
            <Typography
              fontWeight={"bold"}
              mt={2}
              mb={2}
              variant="h5"
              sx={{ color: "#005734" }}
            >
              Credits
            </Typography>
            <Box mb={2} mt={4}>
              <Box
                width={"95%"}
                height={20}
                borderRadius={2}
                overflow={"hidden"}
                m={1}
                mb={2}
                sx={{
                  bgcolor: "#afcdb1",
                }}
              >
                <Box
                  width={`${
                    data.length > 0 && data[0].total_credits == null
                      ? 0
                      : (data[0].credits * 100) / data[0].total_credits
                  }%`}
                  height={20}
                  sx={{ bgcolor: "#2e7d32" }}
                >
                  <Typography textAlign={"center"} sx={{ color: "white" }}>{`${
                    data.length > 0 && data[0].total_credits == null
                      ? 0
                      : data[0].total_credits == 0
                      ? 0
                      : (data[0].credits * 100) / data[0].total_credits
                  }%`}</Typography>
                </Box>
              </Box>
              {/* <LinearProgress
                determinate
                variant="determinate"
                value={
                  data[0].total_credits == null
                    ? 0
                    : data[0].total_credits - data[0].credits
                }
                color="success"
                size="sm"
                thickness={32}
                sx={{ height: "15px", borderRadius: "3px" }}
              /> */}
            </Box>
            <Typography mb={2} textAlign={"center"}>
              Credit Balance : &nbsp;{" "}
              {data.length > 0 && data[0].credits == null
                ? "0"
                : data[0].credits}{" "}
            </Typography>
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
              <Box sx={{ display: { xs: "block", md: "flex" } }}>
                <Typography ml={2}>{i.api_service_id}</Typography>
                <Typography ml={2}>{i.api_service}</Typography>
              </Box>

              <Button
                // disabled={api.is_active}
                sx={{ border: "1px #005734 solid", color: "#005734", mb: 2 }}
                onClick={() => handleService(i)}
              >
                {i.is_active ? "Remove Service" : "Activate Service"}
              </Button>
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
          {data[0].is_active ? (
            ""
          ) : (
            <Box>
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
            </Box>
          )}

          <Button
            onClick={handleActivateApi}
            variant="outlined"
            fullWidth
            sx={{
              width: { xs: "100px", md: "300px" },
              ml: { xs: "100px", md: "145px" },
              mr: { xs: "100px", md: "145px" },
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
        open={upgradeSnackBar}
        autoHideDuration={5000}
        onClose={() => setUpgradeSnackBar("")}
      >
        <Alert severity={upgradeSnackBar} sx={{ width: "100%" }}>
          {upgradeSnackBar == "success"
            ? "Upgraded"
            : upgradeSnackBar == "info"
            ? "It is not released yet"
            : "Error Occured"}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        open={serviceSnackBar}
        autoHideDuration={5000}
        onClose={() => setServiceSnackBar("")}
      >
        <Alert severity={serviceSnackBar} sx={{ width: "100%" }}>
          {serviceSnackBar == "success"
            ? "Done"
            : serviceSnackBar == "info"
            ? "It is not released yet"
            : "Error Occured"}
        </Alert>
      </Snackbar>
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
