import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetAllService_v3 } from "../../util/api_v3";
import { useUserContext } from "../../contexts/UserContext";
import {
  setService,
  setSLoading,
  setSError,
} from "../../store/reducers/service";
import {
  Paper,
  Box,
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";

const UpdateService = () => {
  const [filteredServices, setFilteredServices] = useState([]);
  const [pickedService, setPickedService] = useState(null);
  const { currentUser } = useUserContext();
  const dispatch = useDispatch();
  const { service_data, sloading, serror } = useSelector(
    (state) => state.service
  );

  useEffect(() => {
    const ApiData = async () => {
      const get = await GetAllService_v3();
      console.log("the response for all service is ", get);
      dispatch(setService(get.data.data));
      setFilteredServices(get.data.data);
    };

    if (currentUser) {
      ApiData();
    }
  }, [currentUser]);

  const filterService = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "") {
      setFilteredServices(service_data); // Reset to the full list when no filter is selected
    } else {
      const filtered = service_data.filter(
        (service) => service.service_type === selectedValue
      );
      setFilteredServices(filtered);
    }
  };
  const handlePickedService = (e) => {
    setPickedService(e.target.value);
  };
  const initialValues = {
    sub_services: [
      {
        sub_service_name: "",
        sub_service_id: "",
        quantity: null,
        sub_service_credits: null,
      },
    ],
  };
  const subService = {
    sub_service_name: "",
    sub_service_id: "",
    quantity: null,
    sub_service_credits: null,
  };

  return (
    <Box m={3}>
      <Paper sx={{ p: 2, minHeight: "60vh" }}>
        <Typography>Filter the Service</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            {" "}
            <FormControl variant="standard" fullWidth>
              <InputLabel>Filter by Service Type</InputLabel>
              <Select
                label="Filter by Service Type"
                name="service_type"
                id="service_type"
                onChange={(e) => filterService(e)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"API"}>API</MenuItem>
                <MenuItem value={"PYTHON LIBRARY"}>PYTHON LIBRARY</MenuItem>
                <MenuItem value={"R LIBRARY"}>R LIBRARY</MenuItem>
                <MenuItem value={"WORDPRESS PLUGIN"}>WORDPRESS PLUGIN</MenuItem>
                <MenuItem value={"FLUTTER COMPONENT"}>
                  FLUTTER COMPONENT
                </MenuItem>
                <MenuItem value={"REACT COMPONENT"}>REACT COMPONENT</MenuItem>
                <MenuItem value={"PRODUCT"}>PRODUCT</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            {" "}
            <FormControl variant="standard" fullWidth>
              <InputLabel>Select the Service</InputLabel>
              <Select
                label="Service"
                name="service"
                id="service"
                value={pickedService?.name}
                onChange={(e) => handlePickedService(e)}
              >
                {filteredServices?.map((i) => (
                  <MenuItem key={i._id} value={i}>
                    {i?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box mt={2}>
          {pickedService === null ? (
            <Typography textAlign={"center"}>
              Pick the service you want to updateService
            </Typography>
          ) : (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography>Service Name : {pickedService?.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {" "}
                  <Typography>
                    Service ID : {pickedService?.service_id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    Service Type : {pickedService?.service_type}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>Credits : {pickedService?.credits}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    Service Description : {pickedService?.description}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Service Link : {pickedService?.link}</Typography>
                </Grid>
              </Grid>

              {pickedService?.sub_service ? (
                <Grid container spacing={2} mt={2}>
                  <Typography fontWeight={'bold'} textAlign={"center"} ml={2}>
                    Sub Services
                  </Typography>
                  {pickedService?.sub_service.map((i) => (
                    <Grid
                      container
                      spacing={1}
                      key={i.sub_service_id}
                      m={2}
                      mt={0}
                      sx={{
                        bgcolor: "#edf2f3",
                        // borderBottom: "1px solid black",
                      }}
                    >
                      <Grid item xs={6} sm={3}>
                        Name : {i.sub_service_name}
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        ID : {i.sub_service_id}
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        Quantitiy : {i.quantity}
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        Credits : {i.sub_service_credits}
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              ) : null}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default UpdateService;
