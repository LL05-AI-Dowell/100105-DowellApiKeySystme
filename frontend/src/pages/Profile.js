import React from "react";
import Header from "../layout/Header";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useUserContext } from "../contexts/UserContext";

const Profile = () => {
  const { currentUser } = useUserContext();
  console.log(currentUser);
  return (
    <div>
      <Header />
      <Box
        sx={{ display: { xs: "block", md: "flex" }, justifyContent: "center" }}
      >
        <Box display='flex' justifyContent="center">
          <img
            src={currentUser?.userinfo?.profile_img}
            alt="Profile Image"
            width="200px"
            height="200px"
            style={{ marginRight: "20px", marginTop: "30px" }}
            alt=""
          />
        </Box>
        <TableContainer
          component={Paper}
          sx={{ width: { xs: "100%", sm: "80%", md: "60%" }, mt: 2 }}
        >
          <Table sx={{ borderCollapse: "separate", borderSpacing: 0 }}>
            <TableBody>
              <TableRow sx={{ borderBottom: "none" }}>
                <TableCell>User Name</TableCell>
                <TableCell>{currentUser?.userinfo?.username}</TableCell>
              </TableRow>
              <TableRow sx={{ borderBottom: "none" }}>
                <TableCell>Full Name</TableCell>
                <TableCell>
                  {currentUser?.userinfo?.first_name} &nbsp;{" "}
                  {currentUser?.userinfo?.last_name}
                </TableCell>
              </TableRow>
              <TableRow sx={{ borderBottom: "none" }}>
                <TableCell>User Email</TableCell>
                <TableCell>{currentUser?.userinfo?.email}</TableCell>
              </TableRow>
              <TableRow sx={{ borderBottom: "none" }}>
                <TableCell>Phone</TableCell>
                <TableCell>{currentUser?.userinfo?.phone}</TableCell>
              </TableRow>
              <TableRow sx={{ borderBottom: "none" }}>
                <TableCell>Country</TableCell>
                <TableCell>{currentUser?.userinfo?.user_country}</TableCell>
              </TableRow>
              <TableRow sx={{ borderBottom: "none" }}>
                <TableCell>Payment Status</TableCell>
                <TableCell>{currentUser?.userinfo?.payment_status}</TableCell>
              </TableRow>
              <TableRow sx={{ borderBottom: "none" }}>
                <TableCell>User ID</TableCell>
                <TableCell>{currentUser?.userinfo?.userID}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default Profile;
