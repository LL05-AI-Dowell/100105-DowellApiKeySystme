import React, { useState, useEffect } from "react";

import {
  Box,
  CircularProgress,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
  Paper,
  Container,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { AddService_v3 } from "../../util/api_v3";

import Review from "../addService/review";
import ServiceComponents from "../addService/serviceComponents";
import ServiceInfo from "../addService/serviceInfo";

const AddServices = () => {
  const [dialog, setDialog] = useState(false);
  const [fdialog, setFdialog] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  const [serviceInfo, setServiceInfo] = useState({
    name: "",
    service_id: "",
    link: "",
    description: "",
    service_type: "",
    credits: null,
  });
  const [serviceInfoNot, setServiceInfoNot] = useState(null);
  const [subService, setSubService] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Service Info", "Service Components", "Review"];
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setServiceInfo({ ...serviceInfo, [name]: value });
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <ServiceInfo
            handleChange={handleChange}
            serviceInfo={serviceInfo}
            serviceInfoNot={serviceInfoNot}
          />
        );
      case 1:
        return <ServiceComponents setSubService={setSubService} />;
      case 2:
        return <Review serviceInfo={serviceInfo} subService={subService} />;
      default:
        throw new Error("Unknown step");
    }
  }
  const handleAddServiceTest = async (e) => {
    setLoading(true);
    // await new Promise((r) => setTimeout(r, 500));
    const res = await AddService_v3({
      data: e,
    });
    // const res = 'success'
    if (res == undefined) {
      console.log(res);
      console.log("error occured");
      setApiResponse("An error occured while adding, please try again later");
      setLoading(false);
    } else {
      console.log(res);
      console.log("success");
      setApiResponse(res.data.message);
      setLoading(false);
    }
    setLoading(false);
  };
  const handleNext = () => {
    if (activeStep == 0) {
      console.log("this is first step", serviceInfo);
      if (
        serviceInfo.name !== "" &&
        serviceInfo.description !== "" &&
        serviceInfo.link !== "" &&
        serviceInfo.service_id !== "" &&
        serviceInfo.service_type !== ""
      ) {
        setServiceInfoNot(null);
        setActiveStep(activeStep + 1);
      } else {
        setServiceInfoNot("Please fill the required ones first*");
      }
    } else if (activeStep == 1) {
      console.log("this sub services are ", subService);

      setActiveStep(activeStep + 1);
    } else {
      let dataObj = {};

      dataObj = {
        name: serviceInfo.name,
        service_id: serviceInfo.service_id,
        link: serviceInfo.link,
        description: serviceInfo.description,
        service_type: serviceInfo.service_type,
        ...(serviceInfo?.credits !== null &&
          serviceInfo?.credits !== "0" && {
            credits: Number(serviceInfo.credits),
          }),
        sub_service: subService,
      };

      console.log("the final data is ", dataObj);
      handleAddServiceTest(dataObj);

      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep == 1) {
      setSubService([]);
    }
    setActiveStep(activeStep - 1);
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (
      data.get("name") == "" ||
      data.get("service_id") == "" ||
      data.get("link") == "" ||
      data.get("description") == "" ||
      data.get("service_type") == "" ||
      data.get("credits") == ""
    ) {
      console.log("add the remaining parts");
      setFdialog(true);
    } else {
      setData({
        name: data.get("name"),
        service_id: data.get("service_id"),
        link: data.get("link"),
        description: data.get("description"),
        service_type: data.get("service_type"),
        credits: parseInt(data.get("credits")),
      });
      setDialog(true);
    }
  };
  const handleAddService = async () => {
    console.log(data, password);
    setLoading(true);
    const res = await AddService_v3({
      data: data,
      password: password,
    });
    if (res == undefined) {
      console.log(res);
      console.log("error occured");
      setLoading(false);
      setDialog(false);
      setSnackBar("error");
      setPassword("");
    } else {
      setSnackBar("success");
      console.log(res);
      console.log("success");
      setLoading(false);
      setDialog(false);
      setPassword("");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  return (
    <div>
      <Box
        pt={4}
        ml={4}
        sx={{ ml: { xs: 0, md: 4 }, width: { xs: "100%", md: "90%" } }}
      >
        <Container component="main" sx={{ mb: 4 }}>
          <Paper
            variant="outlined"
            sx={{
              my: { xs: 3, md: 0 },
              p: { xs: 2, md: 3 },
              width: "100%",
              ml: 0,
            }}
          >
            <Typography component="h1" variant="h4" align="center">
              Add Service
            </Typography>
            <Stepper
              activeStep={activeStep}
              sx={{ pt: 3, pb: 5 }}
              color="success"
            >
              {steps.map((label) => (
                <Step key={label} color="success" sx={{ color: "green" }}>
                  <StepLabel color="success" sx={{ color: "green" }}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Box
                  mt={3}
                  display={"flex"}
                  justifyContent={"center"}
                  sx={{ minHeight: "30vh" }}
                >
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <Typography variant="h5">{apiResponse}</Typography>
                  )}
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    {activeStep === steps.length - 1 ? "Add Service" : "Next"}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Paper>
        </Container>
      </Box>
    </div>
  );
};

export default AddServices;
