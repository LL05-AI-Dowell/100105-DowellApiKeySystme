import React, { useState } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    CircularProgress,
    Alert,
    Snackbar,
    Box
} from "@mui/material";
import axios from "axios";
const ExperienceCoupon = () => {
    const [number, setNumber] = useState("");
    const [coupon, setCoupon] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [showAddCouponButton, setShowAddCouponButton] = useState(false);
    const [loadingGetCoupon, setLoadingGetCoupon] = useState(false);
    const [loadingGenerateCoupon, setLoadingGenerateCoupon] = useState(false);
    const numbers = [5,10,15,20]
    const handleGetCoupon = () => {
        setLoadingGetCoupon(true);
        axios
            .post(
                "https://100105.pythonanywhere.com/api/v3/experience_database_services/?type=claim_coupon",
                {
                    number_of_coupons_to_claim: number,
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    setCoupon(response.data.coupon_claimed);
                    setErrorMessage("");
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    setErrorMessage(error.response.data.message);
                    setShowAddCouponButton(true);
                } else {
                    console.log(error);
                    setErrorMessage("An unexpected error occurred");
                }
            })
            .finally(() => {
                setLoadingGetCoupon(false);
            });
    };

    const handleGenerateCoupon = () => {
        setLoadingGenerateCoupon(true);
        axios
            .post(
                "https://100105.pythonanywhere.com/api/v3/experience_database_services/?type=generate_coupon",
                {
                    number_of_coupons: number,
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data);
                    setErrorMessage("Coupons added successfully");
                    setShowAddCouponButton(false);
                }
            })
            .catch((error) => {
                console.log(error);
                setErrorMessage("An unexpected error occurred");
            })
            .finally(() => {
                setLoadingGenerateCoupon(false);
            });
    };

    const handleDownload = () => {
        const content = coupon.join("\n");
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "coupon_claimed.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div
            style={{
                position: "relative",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "24px",
                maxWidth: "900px",
                margin: "0 auto",
                textAlign: "center",
                marginTop: "30px"
            }}
        >
            {/* <img
        src="https://www.uxlivinglab.org/wp-content/uploads/2023/10/image_1-3.png"
        width="30%"
        style={{
          display: "block",
          margin: "0 auto",
          marginTop: "20px",
        }}
        alt="Coupon Redemption"
      /> */}
            {/* <h1
        style={{
          color: "green",
        }}
      >
        DoWell Coupon Redemption
      </h1> */}
            <FormControl style={{ width: "100%", marginTop: "50px" }}>
                <InputLabel>Select</InputLabel>
                {
                  <Select value={number} onChange={(e)=>{setNumber(e.target.value)}}>
                    {
                      numbers.map((value)=>(
                        <MenuItem key={value} value={value}>{value}</MenuItem>
                      ))
                    }
                  
                  </Select>
                }
            </FormControl>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Button
                variant="contained"
                sx={{ marginTop: "16px", backgroundColor: "#2e7d32", width: "380px" }}
                fullWidth
                onClick={handleGetCoupon}
                disabled={loadingGetCoupon || loadingGenerateCoupon}
            >
                {loadingGetCoupon ? <CircularProgress size={24} /> : "Get Coupon"}
            </Button>
            {errorMessage && <Snackbar
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
                open={errorMessage}
                autoHideDuration={5000}
                onClose={() => setErrorMessage("")}
            >
                <Alert severity="error" sx={{ width: "100%" , marginTop :"130px"}}>
                    {errorMessage}
                </Alert>
            </Snackbar>}
            {coupon.length > 0 && (
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ marginTop: "16px" ,backgroundColor: "#2e7d32",width :"380px"}}
                    fullWidth
                    onClick={handleDownload}
                >
                    Download Coupons
                </Button>
            )}
            {showAddCouponButton && (
                <Button
                    variant="contained"
                    color="primary"
                   sx={{ marginTop: "16px" ,backgroundColor: "#2e7d32",width :"380px"}}
                    fullWidth
                    onClick={handleGenerateCoupon}
                    disabled={loadingGetCoupon || loadingGenerateCoupon}
                >
                    {loadingGenerateCoupon ? (
                        <CircularProgress size={24} />
                    ) : (
                        "Generate Coupon"
                    )}
                </Button>
             
            )}
               </Box>
        </div>
    );
}
export default ExperienceCoupon;