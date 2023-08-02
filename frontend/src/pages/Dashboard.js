import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

import Nav from "../layout/Nav";
import Sidebar from "../layout/Sidebar";
import DashboardCards from "../components/dashboardCards";

import { useUserContext } from "../contexts/UserContext";
import { GenerateApiKey_v2, GetApiKey_v2 } from "../util/api";

import { GetApiKey_v3, CreateApiKey_v3, UpdateApiKey_v3 } from "../util/api_v3";

import { useDispatch, useSelector } from "react-redux";
import { setData, setLoading, setError } from "../store/reducers/data";

const Dashboard = () => {
  const { currentUser } = useUserContext();
  const [apiKey, setApiKey] = useState(null);
  var storedData = sessionStorage.getItem("userinfo");
  var storedObj = JSON.parse(storedData);

  const dispatch = useDispatch();
  const { api_data, loading, error } = useSelector((state) => state.data);

  useEffect(() => {
    const ApiData = async () => {
      // const oldget = await GetApiKey_v2({ id: storedObj?.userID });
      const id = storedObj?.client_admin_id 
      console.log("the workspace id is ", id)
      const get = await GetApiKey_v3({ id: id });
      console.log("the response from the new get is ", get);
      if (get?.data?.success === false) {
        const res = await CreateApiKey_v3({
          username: storedObj?.username,
          email: storedObj?.email,
          userDetails: {
            first_name: storedObj?.first_name,
            last_name: storedObj?.last_name,
            profile_img: storedObj?.profile_img,
            phone: storedObj?.phone,
          },
         workspaceId: storedObj?.client_admin_id,
        //  userId : storedObj?.userID
        });
        console.log("the generated api key is ", res.data);
        
        const get = await GetApiKey_v3({ id:  id});
        console.log("api data after creating api key is ", get)
        setApiKey(get.data.data);
        dispatch(setData(get.data.data));
      } else {
        dispatch(setData(get.data.data));
        setApiKey(get.data.data);
      }
    };

    if (currentUser) {
      ApiData();
    }
  }, [currentUser]);
  
  // useEffect(() => {
  //   const updataApi = async () => {
     
  //     if (api_data?.api_key) {    
  //       const apiKey= api_data.api_key
  //       const res = await UpdateApiKey_v3({ api_key: apiKey });
  //       console.log("the api updata res is ", res)
  //     }
  //   };
    // const intervalId = setInterval(updataApi, 30000);
    // return () => clearInterval(intervalId);
  //   updataApi()
  // }, []);

  return (
    <div>
      <Nav />
      <Box sx={{ display: "flex", bgcolor: "#edf2f3", minHeight: "100vh" }}>
        <Sidebar page="dashboard" />
        <Box sx={{ width: { xs: "90%", md: "80%" } }} pt={4}>
          {api_data !== null ? (
            <DashboardCards />
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

export default Dashboard;
