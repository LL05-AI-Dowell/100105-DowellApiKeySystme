import React from "react";
import { Box, Typography } from "@mui/material";

const SentFeedback = ({ data }) => {
  return (
    <Box
      display={"flex"}
      justifyContent={"end"}
      mt={1}
      sx={{ mr: { xs: 1, md: 4 } }}
    >
      <Typography
        sx={{
          bgcolor: "#006734",
          color:'white',
          pl: "10px",
          pr: "5px",
          pt:"5px",
          pb:"5px",
          borderRadius: "10px",
          borderBottomRightRadius: "0",
          maxWidth: "70%",
          boxShadow: 3,
        }}
      >
        {data}
      </Typography>
    </Box>
  );
};

export default SentFeedback;
