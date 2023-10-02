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
import Paypal from "../icons/paypal.png";
import Stripe from "../icons/stripe.png";
import VoucherImg from "../icons/voucher.png"

import { useSelector, useDispatch } from "react-redux";
import {
  ActivateApiKey_v3,
  DeactivateApiKey_v3,
  GetApiKey_v3,
  ActivateService_v3,
  UpdateApiKey_v3,
  InitializePay_Stripe,
  InitializePay_Paypal, TopupPublicVoucher_v3
} from "../util/api_v3";
import { setData, setLoading, setError } from "../store/reducers/data";
import { useNavigate } from "react-router-dom";

const creditOptions = [
  { id: 1, name: "Basic", price: 2, credit: 100 },
  { id: 2, name: "Standard", price: 8, credit: 1000 },
  { id: 3, name: "Premium", price: 16, credit: 2000 },
  { id: 4, name: "Business", price: 75, credit: 10000 },
];

const DashboardCards = () => {
  const navigate = useNavigate();

  const [snackBar, setSnackBar] = useState(false);
  const [serviceSnackBar, setServiceSnackBar] = useState(false);
  const [upgradeSnackBar, setUpgradeSnackBar] = useState(false);
  const [genKey, setGenKey] = useState(null);
  const [removeService, setRemoveService] = useState(null);
  const [topup, setTopup] = useState(false);
  const [topupValue, setTopupValue] = useState("");
  const [topupSnackbar, setTopupSnackbar] = useState(false);
  const [topupSnackbarData, setTopupSnackbarData]= useState({})

  const [dialog, setDialog] = useState(false);
  const [buyCredit, setBuyCredit] = useState("");

  ///for buy credit
  const [selectedOPtion, setSelectedOption] = useState(null);
  const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  var storedData = sessionStorage.getItem("userinfo");
  var storedObj = JSON.parse(storedData);
  const id = storedObj?.client_admin_id;

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
      const get = await GetApiKey_v3({ id: id });
      dispatch(setData(get.data.data));
      setRemoveService(null);
    } else {
      setServiceSnackBar("error");
      setRemoveService(null);
    }
  };

  //upgrade api function
  const handleUpgrade = async () => {
    console.log("the credits buy is ", selectedOPtion);
    setDialog(false);
    setOpenPaymentMethod(true);
  };
  const handlePayment = async () => {
    // setOpenPaymentMethod(false)
    console.log(
      "the chosen payments are first ",
      creditOptions[selectedOPtion - 1],
      " and payment method is ",
      paymentMethod
    );
    const p_data = creditOptions[selectedOPtion - 1];
    sessionStorage.setItem("api_key", JSON.stringify(api_data.api_key));
    sessionStorage.setItem("payment_data", JSON.stringify(p_data));
    sessionStorage.setItem("payment_method", JSON.stringify(paymentMethod));
    const pay_data = {
      price: creditOptions[selectedOPtion - 1].price,
      product: "credit",
      currency_code: "usd",
      callback_url:
        "https://ll05-ai-dowell.github.io/100105-DowellApiKeySystem/#/checkPayment",
      description:'credit',
      credit: creditOptions[selectedOPtion - 1].credit
    };
    const data = JSON.stringify(pay_data);
    console.log("the pay data is ", data);
    if (paymentMethod == "stripe") {
      try {
        const res = await InitializePay_Stripe({ data: data });
        sessionStorage.setItem(
          "payment_id",
          JSON.stringify(res.data.payment_id)
        );
        console.log("the response from pay is ", res);
        const url = res.data.approval_url;
        window.location.href = `${url}`;
        // navigate("/checkPayment");
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await InitializePay_Paypal({ data: data });
        sessionStorage.setItem(
          "payment_id",
          JSON.stringify(res.data.payment_id)
        );
        console.log("the response from pay is ", res);
        const url = res.data.approval_url;
        window.location.href = `${url}`;
        // navigate("/checkPayment");
      } catch (err) {
        console.log(err);
      }
    }
    // navigate("/checkPayment");
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

  const filteredServiceData = api_data?.services.filter(
    (item) => item.is_active === true
  );
  const showHeaderText = filteredServiceData.length > 0;

  /////top up

  const openTopup = () => {
    setDialog(false);
    setTopup(true);
  };
  const handleTopup = async() => {
  
    const id = api_data?.workspaceId
    const dataObj = {
      workspace_id : id,
      voucher_code : topupValue
    }
    const data = JSON.stringify(dataObj)
    // console.log("the data is ", data)
    const res = await TopupPublicVoucher_v3({data: data})
    console.log("the topup response is ", res)
    setTopup(false)
    setTopupValue("")
    if(res){
      setTopupSnackbar(res)
    }
    else{
      setTopupSnackbar({message:"semething went wrong", success:"false"})
    }

  };

  /////////////

  return (
    <Box>
      <Box component={Paper} p={2} sx={{ m: { xs: 1, md: 2 } }}>
        <Typography variant="h6" fontWeight={"bold"}>
          {api_data?.is_paid ? "This is Paid Version!" : "Upgrade your plan!"}
        </Typography>
        <Typography>
          You are currently on a {api_data?.is_paid ? "Paid" : "free"} plan,{" "}
          <Button onClick={() => setDialog(true)}>Add Credits</Button>
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
            {api_data?.disable_key ? (
              ""
            ) : (
              <Button
                variant="contained"
                size="small"
                // onClick={setDialog}
                onClick={
                  api_data?.is_active ? deactivateApiKey : activateApiKey
                }
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
            )}
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
              <Typography
                ml={2}
                sx={{
                  width: { xs: "85%", md: "20%" },
                  display: { xs: "none", md: "block" },
                }}
              >
                Service ID
              </Typography>
              <Typography
                ml={2}
                sx={{
                  width: { xs: "85%", md: "30%" },
                  display: { xs: "none", md: "block" },
                }}
              >
                Service service_type
              </Typography>
              <Typography
                ml={2}
                sx={{ width: { xs: "85%", md: "40%" }, mt: { xs: 2, md: 0 } }}
              >
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
                sx={{ m: 1, ml: { xs: 1, md: 2 }, mr: { xs: 1, md: 2 } }}
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
                  <Typography
                    ml={2}
                    sx={{
                      width: { xs: "85%", md: "30%" },
                      display: { xs: "none", md: "block" },
                    }}
                  >
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
      {/* remove service */}
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
      {/* select plan */}
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ textAlign: "center", fontWeight: "bold" }}
        >
          Select Your Plan
        </DialogTitle>
        <DialogContent sx={{ width: { xs: "84%", md: "350px" } }}>
          {creditOptions.map((option) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
                border:
                  selectedOPtion === option.id
                    ? "3px solid green"
                    : "2px solid #ccc",
                padding: "12px",
                margin: "4px",
                borderRadius: "20px",
              }}
              onClick={() => setSelectedOption(option.id)}
            >
              <Box sx={{ width: { xs: "60%", md: "75%" } }}>
                <Typography variant="h6" fontWeight={"bold"}>
                  {option.name}
                </Typography>
                <Typography fontWeight={"bold"}>
                ({option.credit} credits)
                  {/* [totalCredits] ({option.credit} credits) */}
                </Typography>
                {/* <Typography>Free Support</Typography>
                <Typography>Database</Typography> */}
              </Box>
              <Box fontWeight={"bold"} mt={1}>$ {option.price}</Box>
            </Box>
          ))}
          <Button
            onClick={openTopup}
            autoFocus
            color="success"
            variant="contained"
            sx={{ margin: "4px", mt: 2, width: { xs: "100%", md: "342px" } }}
          >
            Top Up
          </Button>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleUpgrade}
            autoFocus
            color="success"
            variant="contained"
            disabled={!selectedOPtion}
            fullWidth
            sx={{ ml: "5%", mr: "5%", mb: 2 }}
          >
            Buy Now
          </Button>
        </DialogActions>
      </Dialog>
      {/* payment method */}
      <Dialog
        open={openPaymentMethod}
        onClose={() => setOpenPaymentMethod(false)}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Choose Payment Method
        </DialogTitle>
        <DialogContent sx={{ width: { xs: "84%", md: "350px" } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "60px",
              justifyContent: "space-between",
              cursor: "pointer",
              border:
                paymentMethod === "stripe"
                  ? "3px solid green"
                  : "2px solid #ccc",
              padding: "12px",
              margin: "4px",
              borderRadius: "20px",
            }}
            onClick={() => setPaymentMethod("stripe")}
          >
            <Box sx={{ width: { xs: "60%", md: "50%" } }}>
              <img src={Stripe} width="70" height="30" />
            </Box>
            <Box fontWeight={"bold"} width={"30%"}>
              Stripe Pay
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              border:
                paymentMethod === "pay pal"
                  ? "3px solid green"
                  : "2px solid #ccc",
              padding: "12px",
              margin: "4px",
              borderRadius: "20px",
              height: "60px",
            }}
            onClick={() => setPaymentMethod("pay pal")}
          >
            <Box sx={{ width: { xs: "60%", md: "50%" } }}>
              <img src={Paypal} width="80" height="25" />
            </Box>
            <Box fontWeight={"bold"} width={"30%"}>
              PayPal Pay
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handlePayment}
            autoFocus
            color="success"
            variant="contained"
            disabled={!paymentMethod}
            fullWidth
            sx={{ ml: "5%", mr: "5%", mb: 2 }}
          >
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
      {/* top up */}
      <Dialog open={topup} onClose={() => setTopup(false)}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          <img src={VoucherImg} width={"60pc"} />
          <Typography variant="h5" fontWeight={'bold'} sx={{color:"green"}}>ADD YOUR VOUCHER CODE</Typography>
        </DialogTitle>
        <DialogContent sx={{ width: { xs: "84%", md: "350px" } }}>
          <TextField
            name="topup"
            value={topupValue}
            type="text"
            fullWidth
            onChange={(e) => setTopupValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleTopup}
            autoFocus
            color="success"
            variant="contained"
            disabled={!topupValue}
            fullWidth
            sx={{ ml: "5%", mr: "5%", mb: 2 }}
          >
            Top Up
          </Button>
        </DialogActions>
      </Dialog>
      {/* topup snackbar */}
      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        open={topupSnackbar}
        autoHideDuration={5000}
        onClose={() => setTopupSnackbar(false)}
      >
        <Alert
          severity={topupSnackbar?.success == "true" ? "success" : "error"}
        >
          {topupSnackbar?.message  }
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardCards;
