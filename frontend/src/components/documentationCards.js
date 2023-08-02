import React, { useState, useEffect } from "react";
import Logo from "../dowellLogo.png";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Divider,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

import { setService, setSError, setSLoading } from "../store/reducers/service";
import { useSelector, useDispatch } from "react-redux";
import { ActivateService_v3, GetAllService_v3 } from "../util/api_v3";

const DocumentationCards = ({ card, title }) => {
  const [snackBar, setSnackBar] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { service_data, sloading, serror } = useSelector(
    (state) => state.service
  );
  const { api_data, loading, error } = useSelector((state) => state.data);

  const navigate = useNavigate();

  ///activate service function
  const handleService = async (e) => {
    console.log("the picked service is ", e);
    console.log(" api key ", api_data?.api_key, " service id ", e.service_id);
    if (e.is_released == false) {
      setSnackBar("info");
    } else {
      const res = await ActivateService_v3({
        api_key: api_data?.api_key,
        service_id: e.service_id,
      });
      console.log("the service res is ", res);
      if (res?.data.success == true) {
        setSnackBar("success");
        // window.location.reload();
        const get = await GetAllService_v3();
        console.log("the response for all service is ", get);
        dispatch(setService(get.data.data));
        navigate("/")
      } else {
        setSnackBar("error");
      }
    }
  };
  const filteredService = service_data?.filter(
    (i) =>
      i?.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      i?.service_type == card
  );
  console.log("the fileted service is ", filteredService);

  return (
    <Box>
      <Box mb={3}>
        <Box
          sx={{
            display: { xs: "block", md: "flex" },
            justifyContent: { xs: "center", md: "space-between" },
            mr: { xs: 0, md: "13%" },
          }}
        >
          <Typography
            variant="h5"
            fontWeight={"bold"}
            mt={1}
            sx={{ color: "#005734" }}
          >
            {title}
          </Typography>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", md: "50%" },
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Service"
              inputProps={{ "aria-label": "search google maps" }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
        {searchTerm !== "" ? (
          <Box>
            <Grid container spacing={2} mt={4}>
              {filteredService.length > 0 ? (
                filteredService.map((api) => {
                  return (
                    <Grid
                      item
                      xs={12}
                      md={5}
                      component={Paper}
                      m={2}
                      borderRadius={4}
                      key={api.api_service}
                    >
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        sx={{ pl: { xs: 1, md: 4 }, pr: { xs: 1, md: 4 } }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight={"bold"}
                            mt={1}
                            sx={{ color: "#005734" }}
                          >
                            {api.name}
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight={"bold"}
                            mt={0}
                            mb={1}
                            sx={{ color: "#005734" }}
                          >
                            {api.service_id}
                          </Typography>
                        </Box>

                        <img src={Logo} width="50px" />
                      </Box>
                      <Box width="95%" mt={2}>
                        <Box display={"flex"}>
                          <Typography mt={1} mr={2}>
                            Documentation Link :{" "}
                          </Typography>
                          <Button
                            sx={{
                              wordBreak: "break-word",
                              border: "1px #005734 solid",
                              borderRadius: "5px",

                              mt: 1,

                              color: "#005734",
                            }}
                            href={api.link}
                            target="_blank"
                            size="small"
                          >
                            Click
                          </Button>
                        </Box>
                        <Box mb={2}>
                          <Typography>Credits : {api.credits}</Typography>
                        </Box>
                      </Box>

                      <Box
                        width="95%"
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          // disabled={api.is_active}
                          sx={{
                            border: "1px #005734 solid",
                            color: "#005734",
                            mb: 2,
                          }}
                          onClick={() => handleService(api)}
                        >
                          {api.is_active
                            ? "Remove Service"
                            : "Activate Service"}
                        </Button>
                      </Box>
                    </Grid>
                  );
                })
              ) : (
                <Box
                  width={"50%"}
                  mt={4}
                  display={"flex"}
                  justifyContent={"center"}
                >
                  <Typography variant="h6">No Service Found</Typography>
                </Box>
              )}
              <Snackbar
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
                open={snackBar}
                autoHideDuration={5000}
                onClose={() => setSnackBar("")}
              >
                <Alert severity={snackBar} sx={{ width: "100%" }}>
                  {snackBar == "success"
                    ? "Done"
                    : snackBar == "info"
                    ? "It is not released yet"
                    : "Error Occured"}
                </Alert>
              </Snackbar>
            </Grid>
            <Divider sx={{ height: 28, m: 0.5 }} />
          </Box>
        ) : (
          ""
        )}
      </Box>

      <Grid container spacing={2}>
        {service_data?.map((api) => {
          if (api.service_type == card) {
            return (
              <Grid
                item
                xs={12}
                md={5}
                component={Paper}
                m={2}
                borderRadius={4}
                key={api.api_service}
              >
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  sx={{ pl: { xs: 1, md: 4 }, pr: { xs: 1, md: 4 } }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={"bold"}
                      mt={1}
                      sx={{ color: "#005734" }}
                    >
                      {api.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={"bold"}
                      mt={0}
                      mb={1}
                      sx={{ color: "#005734" }}
                    >
                      {api.service_id}
                    </Typography>
                  </Box>

                  <img src={Logo} width="50px" />
                </Box>
                <Box width="95%" mt={2}>
                  <Box display={"flex"}>
                    <Typography mt={1} mr={2}>
                      Documentation Link :{" "}
                    </Typography>
                    <Button
                      sx={{
                        wordBreak: "break-word",
                        border: "1px #005734 solid",
                        borderRadius: "5px",

                        mt: 1,

                        color: "#005734",
                      }}
                      href={api.link}
                      target="_blank"
                      size="small"
                    >
                      Click
                    </Button>
                  </Box>
                  <Box mb={2}>
                    <Typography>Credits : {api.credits}</Typography>
                  </Box>
                </Box>

                <Box
                  width="95%"
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    // disabled={api.is_active}
                    sx={{
                      border: "1px #005734 solid",
                      color: "#005734",
                      mb: 2,
                    }}
                    onClick={() => handleService(api)}
                  >
                    {api.is_active ? "Remove Service" : "Activate Service"}
                  </Button>
                </Box>
              </Grid>
            );
          }
        })}
        <Snackbar
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          open={snackBar}
          autoHideDuration={5000}
          onClose={() => setSnackBar("")}
        >
          <Alert severity={snackBar} sx={{ width: "100%" }}>
            {snackBar == "success"
              ? "Done"
              : snackBar == "info"
              ? "It is not released yet"
              : "Error Occured"}
          </Alert>
        </Snackbar>
      </Grid>
    </Box>
  );
};

export default DocumentationCards;
