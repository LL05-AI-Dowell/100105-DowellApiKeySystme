import React from "react";
import { Box, Typography, Grid } from "@mui/material";

const Review = ({ serviceInfo, subService }) => {
  const data = {
    name: serviceInfo?.name,
    service_id: serviceInfo?.service_id,
    link: serviceInfo?.link,
    description: serviceInfo?.description,
    service_type: serviceInfo?.service_type,
    ...(serviceInfo?.credits !== null &&
      serviceInfo?.credits !== "0" && { credits: Number(serviceInfo.credits) }),
    sub_service: subService,
  };
  // console.log("the service data is ", data);
  return (
    <Box>
      <Typography variant="h5">Review the service</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography>Service Name : {serviceInfo.name}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          {" "}
          <Typography>Service ID : {serviceInfo.service_id}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>Service Link : {serviceInfo.link}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            Service Description : {serviceInfo.description}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Service Type : {serviceInfo.service_type}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Service Credits : {serviceInfo.credits}</Typography>
        </Grid>
      </Grid>
      <Box>
        <Typography variant="h6" textAlign={"center"}>
          Sub Services
        </Typography>
        {subService.length === 0 ? (
          <Typography>No Sub Services Added</Typography>
        ) : (
          <Grid container spacing={2} mt={1}>
            {subService.map((i) => (
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
        )}
      </Box>
    </Box>
  );
};

export default Review;
