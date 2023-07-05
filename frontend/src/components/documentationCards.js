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
} from "@mui/material";
import { ActivateService } from "../util/api";

const DocumentationCards = ({ data }) => {
  const [document, setDocument] = useState([]);
  const [snackBar, setSnackBar] = useState("");

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
      } else {
        setSnackBar("error");
      }
    }
  };

  useEffect(() => {
    setDocument(data.api_services);
    // console.log(document)
  }, []);

  return (
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
              pl={4}
              pr={4}
            >
              <Box>
                <Typography
                  variant="body1"
                  fontWeight={"bold"}
                  mt={1}
                  mb={0}
                  sx={{ color: "#005734" }}
                >
                  {api.api_service_id}
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={"bold"}
                  mt={0}
                  sx={{ color: "#005734" }}
                >
                  {api.api_service}
                </Typography>
              </Box>

              <img src={Logo} width="50px" />
            </Box>
            <Box width="95%" mt={2}>
              <Box>
                <Typography>Credits : {api.credits_count}</Typography>
              </Box>
              <Typography>Documentation Link: </Typography>
              <Button
                sx={{
                  wordBreak: "break-word",
                  border: "1px #005734 solid",
                  borderRadius: "5px",
                  p: 1,
                  mt: 1,
                  mb: 2,
                  color: "#005734",
                }}
                href={api.document_link}
                target="_blank"
              >
                {api.document_link}
              </Button>
            </Box>

            <Box width="95%" sx={{ display: "flex", justifyContent: "end" }}>
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
            ? "Activated Successfully"
            : snackBar == "info"
            ? "It is not released yet"
            : "Error Occured"}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default DocumentationCards;
