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
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";

import Logo from "../dowellLogo.png";

import { useSelector, useDispatch } from "react-redux";
import {
  ActivateApiKey_v3,
  DeactivateApiKey_v3,
  GetApiKey_v3,
  ActivateService_v3,
  UpdateApiKey_v3,
} from "../util/api_v3";
import { setData, setLoading, setError } from "../store/reducers/data";

const DashboardCards = () => {
  const [snackBar, setSnackBar] = useState(false);
  const [serviceSnackBar, setServiceSnackBar] = useState(false);
  const [upgradeSnackBar, setUpgradeSnackBar] = useState(false);
  const [genKey, setGenKey] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [buyCredit, setBuyCredit] = useState("");
  const [removeService, setRemoveService] = useState(null);

  var storedData = sessionStorage.getItem("userinfo");
  var storedObj = JSON.parse(storedData);
  const id = storedObj?.client_admin_id 

  const dispatch = useDispatch();
  const { api_data, loading, error } = useSelector((state) => state.data);
  console.log("the data from store is ", api_data);

  const copiedKey = api_data.api_key;
  const handleCopy = () => {
    const copiedKey = api_data.api_key;

    console.log("copied data is ", copiedKey);
  };

  const handleService = async (e) => {
    console.log("the picked service is ", e);
    console.log(" api key ", api_data.api_key, " service id ", e.service_id);

    const res = await ActivateService_v3({
      api_key: api_data.api_key,
      service_id: e.service_id,
    });
    console.log("the response is ", res);
    if (res?.data.success == true) {
      setServiceSnackBar("success");
      // window.location.reload();
      const get = await GetApiKey_v3({ id: id});
      dispatch(setData(get.data.data));
      setRemoveService(null);
    } else {
      setServiceSnackBar("error");
      setRemoveService(null);
    }
  };

  //upgrade api function
  const handleUpgrade = async () => {
    console.log("the credits buy is ", buyCredit);
    // const val = api_data.APIKey;
    // const res = await UpgradeKey({ val: val });
    // console.log(res);
    // if (res?.Success == true) {
    //   setUpgradeSnackBar("success");
    //   window.location.reload();
    // } else {
    //   setUpgradeSnackBar("error");
    // }
  };

  /// activate api key
  const activateApiKey = async () => {
    const res = await ActivateApiKey_v3(api_data.api_key);
    console.log("the response for activation is ", res);

    const get = await GetApiKey_v3({ id: id });
    console.log("the get from api key data is ", get);
    dispatch(setData(get.data.data));
    setGenKey(true);
    setSnackBar(true);
  };
  const deactivateApiKey = async () => {
    const res = await DeactivateApiKey_v3(api_data.api_key);
    console.log("the response for deactivation is ", res);

    const get = await GetApiKey_v3({ id: id });
    console.log("the get from api key data is ", get);
    dispatch(setLoading());
    dispatch(setData(get.data.data));
    setGenKey(true);
    setSnackBar(true);
  };
  const handleRefresh = async () => {
    if (api_data?.api_key) {
      const apiKey = api_data.api_key;
      const res = await UpdateApiKey_v3({ api_key: apiKey });
      console.log("the api updata res is ", res);
    }
  };

  if (loading == true) {
    console.log("loading phase ");
    return (
      <Box display={"flex"} justifyContent={"center"} mt={4}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  const filteredServiceData = api_data?.services.filter((item) => item.is_active === true);
  const showHeaderText = filteredServiceData.length > 0;

  return (
    <Box>
      <Box component={Paper} p={2} sx={{ m: { xs: 1, md: 2 } }}>
        <Typography variant="h6" fontWeight={"bold"}>
          {api_data?.is_paid ? "This is Paid Version!" : "Upgrade your plan!"}
        </Typography>
        <Typography>
          You are currently on a {api_data?.is_paid ? "Paid" : "free"} plan,{" "}
          {api_data?.is_paid ? (
            ""
          ) : (
            <Button >Add Credits</Button>
          )}
        </Typography>
      </Box>
      <Grid
        container
        spacing={0}
        key={api_data?.userId}
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
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Typography p={2} fontWeight="bold">
              Service Key
            </Typography>
            <Tooltip title="Refresh to add new services">
              <IconButton onClick={handleRefresh}>
                <CachedIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography
            pl={3}
            pt={2}
            fontWeight={"bold"}
            variant="h5"
            sx={{ color: "#005734" }}
          >
            {api_data?.is_active ? "Active" : "Not Active"}
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
              {api_data?.api_key}
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
              // onClick={setDialog}
              onClick={api_data?.is_active ? deactivateApiKey : activateApiKey}
              sx={{
                bgcolor: "#e6e8e9",
                color: "black",
                "&:hover": {
                  backgroundColor: "#edf2f3",
                },
              }}
            >
              {api_data?.is_active ? "Deactivate" : "Activate Key"}
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

            <Box display={"flex"} justifyContent={"center"}>
              {" "}
              <Typography variant="h3" sx={{ color: "#005734" }}>
                {" "}
                {api_data?.total_credits}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box>
        {showHeaderText && (
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            component={Paper}
            pl={2}
            pr={2}
            sx={{ m: { xs: 1, md: 2 } }}
          >
            <Box
              sx={{
                display: { xs: "block", md: "flex" },
                width: "80%",
                alignItems: "center",
              }}
            >
              <Typography ml={2} sx={{ width: { xs: "85%", md: "20%" }, display:{xs:"none", md:"block"} }}>
                Service ID
              </Typography>
              <Typography ml={2} sx={{ width: { xs: "85%", md: "30%" }, display:{xs:"none", md:"block"} }}>
                Service service_type
              </Typography>
              <Typography ml={2} sx={{ width: { xs: "85%", md: "40%" }, mt:{xs:2, md:0} }}>
                Service name
              </Typography>
            </Box>

            <Typography ml={2} m={1}>
                Remove Service
              </Typography>
          </Box>
        )}
        {api_data.services.length > 0 &&
          api_data.services.map((i) =>
            i.is_active ? (
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                component={Paper}
                pl={2}
                pr={2}
                sx={{m:1, ml: { xs: 1, md: 2 },mr: { xs: 1, md: 2 } }}
              >
                <Box
                  sx={{
                    display: { xs: "block", md: "flex" },
                    width: "80%",
                    alignItems: "center",
                  }}
                >
                  <Typography ml={2} sx={{ width: { xs: "85%", md: "20%" } }}>
                    {i.service_id}
                  </Typography>
                  <Typography ml={2} sx={{ width: { xs: "85%", md: "30%" }, display:{xs:"none", md:"block"} }}>
                    {i.service_type}
                  </Typography>
                  <Typography ml={2} sx={{ width: { xs: "85%", md: "40%" } }}>
                    {i.name}
                  </Typography>
                </Box>

                <Button
                  // disabled={api.is_active}
                  sx={{
                    border: "1px #005734 solid",
                    color: "#005734",
                    mb: 1,
                    mt: 1,
                    height: { xs: "60px", md: "40px" },
                  }}
                  onClick={() => {
                    setRemoveService(i);
                  }}
                >
                  {i.is_active ? "Remove Service" : "Activate Service"}
                </Button>
              </Box>
            ) : (
              ""
            )
          )}
      </Box>
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
            {api_data.is_active
              ? "You Activated your key!"
              : "You Deactivated your key!"}
          </Alert>
        )}
      </Snackbar>
      <Dialog
        open={removeService}
        onClose={() => setRemoveService(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure, Do you want to remove the {removeService?.name} Service?
        </DialogTitle>

        <DialogActions>
          <Button color="error" onClick={() => setRemoveService(null)}>
            Go Back
          </Button>

          <Button
            onClick={() => handleService(removeService)}
            autoFocus
            sx={{ color: "#005734" }}
          >
            Remove Service
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Choose the amout you want
        </DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="buy-credits"
              name="Buy credits"
              value={buyCredit}
              onChange={(e) => setBuyCredit(e.target.value)}
            >
              <FormControlLabel
                value="99"
                control={<Radio />}
                label="100 for 99 ₹"
              />
              <FormControlLabel
                value="899"
                control={<Radio />}
                label="1000 for 899 ₹"
              />
              <FormControlLabel
                value="7999"
                control={<Radio />}
                label="10000 for 7999 ₹"
              />
              <FormControlLabel
                value="69999"
                control={<Radio />}
                label="100000 for 69999 ₹"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setDialog(false)}>
            Go Back
          </Button>

          <Button
            onClick={handleUpgrade}
            autoFocus
            color="success"
            variant="contained"
          >
            Buy Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardCards;
