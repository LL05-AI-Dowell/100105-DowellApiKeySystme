import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

import Nav from "../layout/Nav";
import {
  UpdateApiKey_v3,
  VerifyPay_Paypal,
  VerifyPay_Stripe,
  UpgradeCredit_v3,
} from "../util/api_v3";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const PaymentStatusPage = () => {
  const navigate = useNavigate();
  var storedData = sessionStorage.getItem("payment_data");
  var storedId = sessionStorage.getItem("payment_id");
  var storedMethod = sessionStorage.getItem("payment_method");

  var storedKey = sessionStorage.getItem("api_key");
  var storedKeyObj = JSON.parse(storedKey);

  const [display, setDisplay] = useState(null);

  var storedDataObj = JSON.parse(storedData);
  var storedMethodObj = JSON.parse(storedMethod);
  var storedIdObj = JSON.parse(storedId);
  useEffect(() => {
    // console.log("the payment data is ", storedDataObj);
    // console.log("the payment id is ", storedIdObj);
    // console.log("the payment method is ", storedMethodObj);
    const checker = async () => {
      const val = { id: storedIdObj };
      const data = JSON.stringify(val);
      const upgradeVal = { total_credits: storedDataObj?.credit };
      const upgradeData = JSON.stringify(upgradeVal);

      if (storedMethodObj == "stripe") {
        try {
          const res = await VerifyPay_Stripe({ data: data });
          console.log(" the response from checker is ", res);
          if (res.data.status == "succeeded") {
            setDisplay("succeed");
            const upgrade = await UpgradeCredit_v3({
              data: upgradeData,
              api_key: storedKeyObj,
            });
            console.log("the upgrad resul is ", upgrade)
            sessionStorage.setItem("payment_id", JSON.stringify("12345"));
          } else {
            setDisplay("failed");
            sessionStorage.setItem("payment_id", JSON.stringify("12345"));
          }
        } catch (err) {
          console.log("the checker error is ", err);
        }
      } else {
        try {
          const res = await VerifyPay_Paypal({ data: data });
          console.log(" the response from checker is ", res);
          if (res.data.status == "succeeded") {
            setDisplay("succeed");
            const upgrade = await UpgradeCredit_v3({
              data: upgradeData,
              api_key: storedKeyObj,
            });
            console.log("the upgrad resul is ", upgrade)
            sessionStorage.setItem("payment_id", JSON.stringify("12345"));
          } else {

            setDisplay("failed");
            sessionStorage.setItem("payment_id", JSON.stringify("12345"));
          }
        } catch (err) {
          console.log("the checker error is ", err);
        }
      }
    };
    checker();
  }, []);
  return (
    <div>
      <Nav />
      <Box
        sx={{
          display: "flex",
          bgcolor: "#edf2f3",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {display == null ? (
          <Box display={"flex"} justifyContent={"center"} mt={4}>
            <CircularProgress color="success" />
          </Box>
        ) : (
          <Box>
            {display == "failed" ? (
              <Typography color={"red"} textAlign={"center"} variant="h3">
                Sorry, You haven't Purchased the Credit!
              </Typography>
            ) : (
              <Typography color={"green"} textAlign={"center"} variant="h3">
                Thank you for Purchasing!
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button onClick={() => navigate("/")}>Return to Main</Button>
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default PaymentStatusPage;
