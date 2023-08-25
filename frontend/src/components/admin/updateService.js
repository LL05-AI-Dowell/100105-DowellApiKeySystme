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
  Snackbar,
  Alert,
} from "@mui/material";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import { UpdateService_v3 } from "../../util/api_v3";

const UpdateService = () => {
  const [filteredServices, setFilteredServices] = useState([]);
  const [pickedService, setPickedService] = useState(null);
  const [pickedServiceData, setPickedServiceData] = useState(null);
  const [snackbar, setSnackbar] = useState(false);
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
    console.log(e.target.value);
    setPickedService(e.target.value);
    setPickedServiceData(e.target.value);
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

  const updateProperty = (property, value) => {
    setPickedService((prevData) => ({
      ...prevData,
      [property]: value,
    }));
    console.log("the updated service is ", pickedService);
  };
  // console.log("the updated service issssssssss ", pickedService);

  const removeSubService = (index) => {
    setPickedService((prevData) => {
      const newSubServiceArray = [...prevData.sub_service];
      newSubServiceArray.splice(index, 1);
      return { ...prevData, sub_service: newSubServiceArray };
    });
  };
  const addSubService = () => {
    setPickedService((prevData) => ({
      ...prevData,
      sub_service: [
        ...prevData.sub_service,
        {
          sub_service_id: "",
          sub_service_name: "",
          quantity: 0,
          sub_service_credits: 0,
        },
      ],
    }));
  };
  const handleUpdate = async () => {
    console.log("the picked service updated value is ", pickedService);
    checkForChanges();
  };
  const handleSubServicePropertyChange = (index, property, value) => {
    const updatedSubServiceArray = [...pickedService.sub_service];
    updatedSubServiceArray[index] = {
      ...updatedSubServiceArray[index],
      [property]: value,
    };
    setPickedService((prevData) => ({
      ...prevData,
      sub_service: updatedSubServiceArray,
    }));
  };

  const checkForChanges = async () => {
    const changedData = {};

    // Check if the main service data has changed
    const hasServiceChanged =
      JSON.stringify(pickedServiceData) !== JSON.stringify(pickedService);

    if (hasServiceChanged) {
      // Compare properties and add only the changed ones
      for (const key in pickedService) {
        if (pickedService[key] !== pickedServiceData[key]) {
          changedData[key] = pickedService[key];
        }
      }
    }
    console.log(pickedServiceData._id);
    console.log(changedData);
    if (Object.keys(changedData).length === 0) {
      setSnackbar({ success: false, message: "You haven't changed any field!" });
    } else {
      const update_field = {
        update_field: changedData,
      };
      const res = await UpdateService_v3({
        data: update_field,
        id: pickedServiceData._id,
      });
      setSnackbar(res.data);
      console.log("the result is ", res);
    }
  };

  return (
    <Box sx={{ m: { xs: 0, sm: 3 }, mt: 3 }}>
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
                <Grid item xs={12} sm={6} display={"flex"}>
                  <Typography mt={0.5}>Service Name : &nbsp;</Typography>
                  <TextField
                    type="text"
                    variant="standard"
                    value={pickedService?.name}
                    onChange={(e) => updateProperty("name", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} display={"flex"}>
                  {" "}
                  <Typography mt={0.5}>Service ID : &nbsp;</Typography>
                  <TextField
                    type="text"
                    variant="standard"
                    value={pickedService.service_id}
                    onChange={(e) =>
                      updateProperty("service_id", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} display={"flex"}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel>Service Type : &nbsp;</InputLabel>
                    <Select
                      label="Service Type"
                      name="service_type"
                      id="service_type"
                      value={pickedService?.service_type}
                      onChange={(e) =>
                        updateProperty("service_type", e.target.value)
                      }
                    >
                      <MenuItem value={"API"}>API</MenuItem>
                      <MenuItem value={"PYTHON LIBRARY"}>
                        PYTHON LIBRARY
                      </MenuItem>
                      <MenuItem value={"R LIBRARY"}>R LIBRARY</MenuItem>
                      <MenuItem value={"WORDPRESS PLUGIN"}>
                        WORDPRESS PLUGIN
                      </MenuItem>
                      <MenuItem value={"FLUTTER COMPONENT"}>
                        FLUTTER COMPONENT
                      </MenuItem>
                      <MenuItem value={"REACT COMPONENT"}>
                        REACT COMPONENT
                      </MenuItem>
                      <MenuItem value={"PRODUCT"}>PRODUCT</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} display={"flex"} mt={2}>
                  <Typography mt={0.5}>Credits : &nbsp;</Typography>
                  <TextField
                    type="number"
                    variant="standard"
                    value={pickedService?.credits}
                    onChange={(e) =>
                      updateProperty("credits", Number(e.target.value))
                    }
                  />
                </Grid>

                <Grid item xs={12} display={"flex"}>
                  <Typography mt={0.5}>Service Description : &nbsp;</Typography>
                  <TextField
                    type="text"
                    variant="standard"
                    value={pickedService?.description}
                    onChange={(e) =>
                      updateProperty("description", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} display={"flex"}>
                  <Typography mt={0.5}>Service Link : &nbsp;</Typography>
                  <TextField
                    type="text"
                    variant="standard"
                    value={pickedService.link}
                    onChange={(e) => updateProperty("link", e.target.value)}
                  />
                </Grid>
              </Grid>

              {pickedService?.sub_service ? (
                <Grid container spacing={2} mt={2}>
                  <Typography fontWeight={"bold"} textAlign={"center"} ml={2}>
                    Sub Services
                  </Typography>
                  {pickedService?.sub_service.map((i, index) => (
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
                      <Grid item xs={6} sm={2.5} display={"flex"}>
                        <Typography mt={0.5}>Name : &nbsp;</Typography>
                        <TextField
                          type="text"
                          variant="standard"
                          value={i.sub_service_name}
                          sx={{ width: "50%" }}
                          onChange={(e) =>
                            handleSubServicePropertyChange(
                              index,
                              "sub_service_name",
                              e.target.value
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={6} sm={2.5} display={"flex"}>
                        <Typography mt={0.5}>ID : &nbsp;</Typography>
                        <TextField
                          type="text"
                          variant="standard"
                          value={i.sub_service_id}
                          sx={{ width: "50%" }}
                          onChange={(e) =>
                            handleSubServicePropertyChange(
                              index,
                              "sub_service_id",
                              e.target.value
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={6} sm={2.5} display={"flex"}>
                        <Typography mt={0.5}>Quantitiy : &nbsp;</Typography>
                        <TextField
                          type="number"
                          variant="standard"
                          value={i.quantity}
                          sx={{ width: "50%" }}
                          onChange={(e) =>
                            handleSubServicePropertyChange(
                              index,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={6} sm={2.5} display={"flex"}>
                        <Typography mt={0.5}>Credits : &nbsp;</Typography>
                        <TextField
                          type="number"
                          variant="standard"
                          value={i.sub_service_credits}
                          sx={{ width: "50%" }}
                          onChange={(e) =>
                            handleSubServicePropertyChange(
                              index,
                              "sub_service_credits",
                              Number(e.target.value)
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={6} sm={2}>
                        <Button
                          color="error"
                          onClick={() => removeSubService(index)}
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              ) : null}
              <Box>
                <Button onClick={addSubService}>Add Sub Service</Button>
              </Box>
              <Box display={"flex"} justifyContent={"center"}>
                <Button variant="contained" onClick={handleUpdate}>
                  Update Service
                </Button>
              </Box>
            </Box>
          )}
        </Box>
        <Snackbar
          open={snackbar}
          autoHideDuration={6000}
          onClose={() => setSnackbar(false)}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
        >
          {snackbar?.success == true ? (
            <Alert
              onClose={() => setSnackbar(false)}
              severity="success"
              sx={{ width: "100%" }}
            >
              {snackbar?.message}
            </Alert>
          ) : (
            <Alert
              onClose={() => setSnackbar(false)}
              severity="warning"
              sx={{ width: "100%" }}
            >
              {snackbar?.message}
            </Alert>
          )}
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default UpdateService;
