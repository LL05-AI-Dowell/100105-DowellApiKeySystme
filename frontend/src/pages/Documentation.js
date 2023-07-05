import React , { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import Nav from "../layout/Nav";
import DocumentationCards from "../components/documentationCards";
import { Box, Grid, CircularProgress } from "@mui/material";

import { useUserContext } from "../contexts/UserContext";
import { GenerateApiKey_v2, GetApiKey_v2 } from "../util/api";


const Documentation = () => {
  const { currentUser } = useUserContext();
  const [apiKey, setApiKey] = useState(null);

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
      <Box sx={{ display: "flex", bgcolor:"#edf2f3" }}>
        <Sidebar page="documentation"/>
        <Box  width="80%"  pt={4} ml={4}>
        {apiKey !== null ? (
           <DocumentationCards data={apiKey[0]}/>
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

export default Documentation;
