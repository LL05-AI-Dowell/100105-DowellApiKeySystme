import React from "react";
import { Box, Typography } from "@mui/material";

const RecievedFeedback = ({ data }) => {
  return (
    <Box
      display={"flex"}
      justifyContent={"start"}
      mt={1}
      sx={{ ml: { xs: 1, md: 4 } }}
    >
      <Typography
        sx={{
          bgcolor: "#dce7e6",
          boxShadow: 3,
          pl: "10px",
          pt:"5px",
          pb:"5px",
          pr: "5px",
          borderRadius: "10px",
          borderBottomLeftRadius: "0",
          maxWidth: "70%",
        }}
      >
        {data}
      </Typography>
    </Box>
  );
};

export default RecievedFeedback;
