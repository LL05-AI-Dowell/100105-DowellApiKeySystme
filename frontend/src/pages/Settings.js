import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import ComingSoon from '../icons/comingSoon.png'

import Nav from "../layout/Nav";
import Sidebar from "../layout/Sidebar";
import ClaimVoucher from "../components/settings/claimVoucher";
const Settings = () => {
  const [page, setPage] = useState(1);

  return (
    <div>
      <Nav />
      <Box sx={{ display: "flex", bgcolor: "#edf2f3", minHeight: "90vh" }}>
        <Sidebar page="settings" />
        <Box sx={{ width: { xs: "90%", md: "80%" } }} pt={4} ml={4}>
          <Stack
            direction="row"
            sx={{
              display: "flex",
              justifyContent: "center",
              borderBottom: "solid 1px green",
            }}
          >
            <Button
              color="success"
              sx={{
                borderBottom: page == 1 ? "solid 5px green" : "",
                borderRadius: 0,
              }}
              onClick={() => setPage(1)}
            >
              Voucher
            </Button>
            <Button
              color="success"
              sx={{
                borderBottom: page == 2 ? "solid 5px green" : "",
                borderRadius: 0,
              }}
              onClick={() => setPage(2)}
            >
              Billing Information
            </Button>
          </Stack>
          {page == 1 ? (
            <ClaimVoucher />
          ) : (
            <Box display={"flex"} justifyContent={"center"}>
              <img src={ComingSoon} width={"60%"} />
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Settings;
