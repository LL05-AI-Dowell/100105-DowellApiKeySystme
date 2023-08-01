import React, { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import Nav from "../layout/Nav";
import DocumentationCards from "../components/documentationCards";
import { Box, CircularProgress, Typography } from "@mui/material";

import { useNavigate, Link } from "react-router-dom";

import { useUserContext } from "../contexts/UserContext";
import { GetAllService_v3 } from "../util/api_v3";

import { useDispatch, useSelector } from "react-redux";
import { setService, setSLoading, setSError } from "../store/reducers/service";

const ProductServicePage = () => {
  const { currentUser } = useUserContext();
  const navigate = useNavigate();

  var storedData = sessionStorage.getItem("userinfo");
  var storedObj = JSON.parse(storedData);
  const dispatch = useDispatch();
  const { service_data, sloading, serror } = useSelector(
    (state) => state.service
  );

  useEffect(() => {
    const ApiData = async () => {
      const get = await GetAllService_v3();
      console.log("the response for all service is ", get);
      dispatch(setService(get.data.data));
    };

    if (currentUser) {
      ApiData();
    }
  }, [currentUser]);

  const handleClick = () => {
    navigate("/addService");
  };

  return (
    <div>
      <Nav />
      <Box sx={{ display: "flex", bgcolor: "#edf2f3", minHeight: "100vh" }}>
        <Sidebar page="productService" />
        <Box width="80%" pt={4} ml={4}>
          <Box display={"flex"} justifyContent={"end"}>
            <Typography alignItems={"end"} onClick={handleClick}>
              ||
            </Typography>
          </Box>
          {service_data !== null ? (
            <DocumentationCards card="PRODUCT" title="PRODUCT" />
          ) : (
            <Box display={"flex"} justifyContent={"center"} mt={4}>
              <CircularProgress color="success" />
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default ProductServicePage;
