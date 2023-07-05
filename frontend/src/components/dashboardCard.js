import React from "react";
import { Box, Button, Typography } from "@mui/material";

const DashboardCard = () => {
  return (
    <Box
      sx={{
        display: { xs: "block", md: "flex", lg: "flex" },
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "20px",
          minWidth: "350px",
          minHeight: "200px",
          mr: { xs: "none", md: "50px", lg: "50px" },
          mb: "20px",
        }}
      >
        <Box
          sx={{
            height: "50px",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            bgcolor: "#e3ede9",
          }}
        >
          <Typography p={2} fontWeight="bold">
            API Key
          </Typography>
        </Box>
        <Box p={3}>
          <Typography
            bgcolor="#e6e8e9"
            pl={1}
            pt={1}
            sx={{ height: "35px", borderRadius: "5px" }}
          >
            ladjlkajf-8310418490;ka
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            size="small"
            sx={{ mr: 1,  }}
            color="success"
          >
            Copy to Clipboard
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{bgcolor: "#e6e8e9", color:"black", '&:hover': {
                backgroundColor: '#edf2f3',
              }, }}
          >
            Activate Key
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "20px",
          minWidth: "350px",
          minHeight: "200px",
          mb: "20px",
        }}
      >
        <Box
          sx={{
            height: "50px",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            bgcolor: "#e3ede9",
          }}
        >
          <Typography p={2} fontWeight="bold">
            Usage
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardCard;
