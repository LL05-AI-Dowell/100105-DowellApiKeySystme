import React, { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import Nav from "../layout/Nav";
import DocumentationCards from "../components/documentationCards";
import { Box, Grid, CircularProgress } from "@mui/material";

import { useUserContext } from "../contexts/UserContext";
import { GenerateApiKey_v2, GetApiKey_v2 } from "../util/api";

const Documentation = () => {
  const { currentUser } = useUserContext();
  const [apiKey, setApiKey] = useState(null);
  var storedData = sessionStorage.getItem("userinfo");
  var storedObj = JSON.parse(storedData);
  // console.log("the stored data is ", storedData);
  // console.log("the stored obj is ", storedObj);

  useEffect(() => {
    const ApiData = async () => {
      // console.log("the vas data is ", currentUser, storedObj);
      const get = await GetApiKey_v2({ id: storedObj?.userID });
      // console.log("the response from the get is ", get.data.data);
      if (get?.data?.success == false) {
        const res = await GenerateApiKey_v2({
          username: storedObj?.username,
          email: storedObj?.email,
          userDetails: {
            first_name: storedObj?.first_name,
            last_name: storedObj?.last_name,
            profile_img: storedObj?.profile_img,
            phone: storedObj?.phone
          },
          userId: storedObj?.userID,
        });
        // console.log("the generated api key is ", res.data);
        setApiKey(res.data.data);
      } else {
        setApiKey(get.data.data);
      }
    };

    if (currentUser) {
      ApiData();
    }
  }, [currentUser]);

  return (
    <div>
      <Nav />
      <Box sx={{ display: "flex", bgcolor: "#edf2f3" }}>
        <Sidebar page="documentation" />
        <Box width="80%" pt={4} ml={4}>
          {apiKey !== null ? (
            <DocumentationCards data={apiKey[0]} />
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

export default Documentation;
