import React, { useState, useEffect } from "react";
import Logo from "../dowellLogo.png";
import {
  Grid,
  Stack,
  Paper,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Divider,
} from "@mui/material";
import { ActivateService } from "../util/api";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

const DocumentationCards = ({ data }) => {
  const [document, setDocument] = useState([]);
  const [snackBar, setSnackBar] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleService = async (e) => {
    console.log("the picked service is ", e);
    console.log(
      "user Id ",
      data.userId,
      " api key ",
      data.APIKey,
      " service id ",
      e.api_service_id
    );
    if (e.is_released == false) {
      setSnackBar("info");
    } else {
      const res = await ActivateService({
        id: data.userId,
        api_key: data.APIKey,
        service_id: e.api_service_id,
      });
      if (res?.success == true) {
        setSnackBar("success");
        // window.location.reload();
      } else {
        setSnackBar("error");
      }
    }
  };
  const filteredService = document.filter((i) =>
    i?.api_service.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log("the fileted service is ", filteredService);
  useEffect(() => {
    setDocument(data.api_services);
    // console.log(document)
  }, []);
  console.log(document);
  return (
    <Box>
      <Box mb={3}>
        <Box
          display={"flex"}
          sx={{
            justifyContent: { xs: "center", md: "end" },
            mr: { xs: 0, md: "13%" },
          }}
        >
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
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
            {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> */}
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
                            variant="h5"
                            fontWeight={"bold"}
                            mt={1}
                            sx={{ color: "#005734" }}
                          >
                            {api.api_service}
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight={"bold"}
                            mb={1}
                            mt={0}
                            sx={{ color: "#005734" }}
                          >
                            {api.api_service_id}
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
                            href={api.document_link}
                            target="_blank"
                            size="small"
                          >
                            Click
                          </Button>
                        </Box>
                        <Box mb={2}>
                          <Typography>
                            Credits use : {api.credits_count}
                          </Typography>
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
        {document.map((api) => {
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
                    variant="h5"
                    fontWeight={"bold"}
                    mt={1}
                    sx={{ color: "#005734" }}
                  >
                    {api.api_service}
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={"bold"}
                    mb={1}
                    mt={0}
                    sx={{ color: "#005734" }}
                  >
                    {api.api_service_id}
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
                    href={api.document_link}
                    target="_blank"
                    size="small"
                  >
                    Click
                  </Button>
                </Box>
                <Box mb={2}>
                  <Typography>Credits use : {api.credits_count}</Typography>
                </Box>
              </Box>

              <Box
                width="95%"
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  // disabled={api.is_active}
                  sx={{ border: "1px #005734 solid", color: "#005734", mb: 2 }}
                  onClick={() => handleService(api)}
                >
                  {api.is_active ? "Remove Service" : "Activate Service"}
                </Button>
              </Box>
            </Grid>
          );
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
