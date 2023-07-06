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
        // window.location.reload();
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
              <Box display={'flex'}>
                <Typography mt={1} mr={2}>Documentation Link : </Typography>
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
              <Box  mb={2}>
                <Typography>Credits use : {api.credits_count}</Typography>
              </Box>
            </Box>

            <Box width="95%" sx={{ display: "flex", justifyContent: "center" }}>
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
  );
};

export default DocumentationCards;
