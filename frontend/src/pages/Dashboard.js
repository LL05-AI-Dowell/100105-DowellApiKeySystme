import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

import Nav from "../layout/Nav";
import Sidebar from "../layout/Sidebar";
import DashboardCard from "../components/dashboardCard";
import DashboardCards from "../components/dashboardCards";

import { useUserContext } from "../contexts/UserContext";
import { GenerateApiKey_v2, GetApiKey_v2 } from "../util/api";

const data = [
  {
    name: "Email",
    api: "lakjdfopiqeurouqieru",
    activated: true,
  },
  {
    name: "Weather",
    api: "lakjdfopiqeurouqieru",
    activated: false,
  },
  {
    name: "Scale api",
    api: "lakjdfopiqeurouqieru",
    activated: false,
  },
];

const Dashboard = () => {
  const { currentUser } = useUserContext();
  const [apiKey, setApiKey] = useState(null);
  const person = {
    username: "jhon123",
    email: "jhon123123@gmail.com",
    userDetails: "jhon is devv1231",
    userId: "jhon1234567123",
  };
  useEffect(() => {
    const ApiData = async () => {
      console.log("the val data is ", currentUser);
      const get = await GetApiKey_v2({ id: currentUser?.userinfo?.userID });
      console.log("the response from the get is ", get.data.data);
      if (get?.data?.success == false) {
        const res = await GenerateApiKey_v2({
          username: currentUser?.userinfo?.username,
          email: currentUser?.userinfo?.email,
          userDetails: {
            name: currentUser?.userinfo?.username,
            email: currentUser?.userinfo?.email,
            phone: currentUser?.userinfo?.phone,
            profile_img: currentUser?.userinfo?.profile_img,
            userID: currentUser?.userinfo?.userID,
            first_name: currentUser?.userinfo?.first_name,
            last_name: currentUser?.userinfo?.last_name,
            user_country: currentUser?.userinfo?.user_country,
            client_admin_id: currentUser?.userinfo?.client_admin_id,
            login_eventID: currentUser?.userinfo?.login_eventID,
          },
          userId: currentUser?.userinfo?.userID,
        });
        console.log("the generated api key is ", res.data);
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
      <Box sx={{ display: "flex", bgcolor: "#edf2f3", minHeight:'90vh' }}>
        <Sidebar page="dashboard" />
        <Box sx={{width:{xs:'90%', md:"80%"}}} pt={4}>
          {apiKey !== null ? (
            <DashboardCards data={apiKey} />
          ) : (
            <Box display={'flex'} justifyContent={'center'} mt={4}>
              <CircularProgress color="success" />
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
