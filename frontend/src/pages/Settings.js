import React, { useState, useEffect } from "react";
import axios from "axios"
import { Box,Button, Stack, Alert , Snackbar } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import ComingSoon from '../icons/comingSoon.png'
import Nav from "../layout/Nav";
import Sidebar from "../layout/Sidebar";
import ClaimVoucher from "../components/settings/claimVoucher";
import ExperienceCoupon from "../components/settings/experienceCoupon";
import CouponPage from "./CouponPage"
const Settings = () => {
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
    const userID = userInfo ? userInfo.userID : null;

    if (userID) {
      axios.get(`https://100105.pythonanywhere.com/api/v3/experience_database_services/?type=user_id_claim&user_id=${userID}`)
        .then((response) => {
          const data = response.data;
        })
        .catch((error) => {
          setError(error.response.data.message);
        });
    }
  }, []);
  
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
            <Button
              color="success"
              sx={{
                borderBottom: page == 3 ? "solid 5px green" : "",
                borderRadius: 0,
              }}
              onClick={() => setPage(3)}
            >
              Experience Coupon
            </Button>
          </Stack>
          {page === 1 ? (
  <ClaimVoucher />
) : (
  <>
    {page === 3 ? (
      error ? (
        // <Snackbar  anchorOrigin={{ horizontal: "right", vertical: "top" }} 
        // open={true} autoHideDuration={3000}
        // onClose={()=>{
        //   navigate("/")
        // }}
        // sx={{ marginTop: "130px" }}>
        //   <Alert severity="error"
        //    onClose={()=>{
        //     navigate("/")
        //   }} >
        //     {error}
        //   </Alert>
        // </Snackbar>
        <CouponPage />
      ) : (
        <ExperienceCoupon />
      )
    ) : (
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        height={"80vh"}
      >
        <img src={ComingSoon} width={"60%"} alt="Coming Soon" />
      </Box>
    )}
  </>
)}

       
        </Box>
      </Box>
    </div>
  );
};

export default Settings;
