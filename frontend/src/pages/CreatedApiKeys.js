import React, { useState, useEffect } from "react";
import Header from "../layout/Header";
import {
  Box,
  Button,
  List,
  ListItemButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useUserContext } from "../contexts/UserContext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Link } from "react-router-dom";
import { GetUserApiKey } from "../util/api";


const CreatedApiKeys = () => {
  const [data, setData] = useState();
  const [viewKey, setViewKey] = useState(false);
  const { currentUser } = useUserContext();
  const workspace_id = currentUser?.userinfo?.client_admin_id
  const value = sessionStorage.getItem('key2');

  useEffect(() => {
    const GetApi = async () => {
      const key = workspace_id == null ? value.slice(1, -1) : workspace_id;
      // console.log('worksps id ', workspace_id)
      // console.log('key 2 ', value)
      // console.log("the key is ", key)
      const res = await GetUserApiKey(key);
      console.log(res?.data.data);
      setData(res?.data.data);
    };
    GetApi();
  }, []);
  return (
    <div>
      <Header />
      <Box display="flex" width="100vw" height="100vh">
        <Stack
          direction="column"
          width="60px"
          mt={1}
          pt={4}
          component={Paper}
          sx={{display:{xs:'none',sm:'block'}}}
        >
          <List>
            <ListItemButton sx={{ borderRight: "5px solid #005734" }}>
              <HomeOutlinedIcon fontSize="large" sx={{ color: "#005734" }} />
            </ListItemButton>
          </List>
        </Stack>
        <Box sx={{width:{xs:"100%",sm:"90%"}}}>
          <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "center", mt: 4 }}
          >
            <Button
              variant="outlined"
              sx={{ mr: 3, color: "#005734", borderColor: "#005734" }}
              component={Link}
              to="/"
            >
              Create Api Key
            </Button>
            <Button
              variant="outlined"
              sx={{ color: "#005734", borderColor: "#005734" }}
              component={Link}
              to="/createdapikeys"
            >
              Created Api Keys
            </Button>
          </Stack>
          <Box display="flex" justifyContent="center">
            <TableContainer component={Paper} sx={{ mt: 4, width:{xs:"100%", md:"80%", l:"60%"} }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      NO
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Api Service
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Api Key</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Credit</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Paid</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.length > 0 &&
                    data.map((i, index) => (
                      <TableRow key={i.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{i.api_services}</TableCell>
                        <TableCell>
                          <ApiCell api={i.APIKey} />
                        </TableCell>
                        <TableCell>{i.credits}</TableCell>
                        <TableCell sx={{ display: "flex" }}>
                          <Typography
                            sx={{
                              bgcolor: "#FBE7E9",
                              borderRadius: "6px",
                              p: 0.5,
                            }}
                          >
                            {i.is_paid ? "True" : "False"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default CreatedApiKeys;

const ApiCell = ({api }) => {
  const [showApi, setShowApi] = useState(false);

  const handleClick = () => {
    setShowApi(!showApi);
  };

  useEffect(() => {
    let timer;
    if (showApi) {
      timer = setTimeout(() => {
        setShowApi(false);
      }, 10000); // Hide password after 10 seconds
    }
    return () => clearTimeout(timer);
  }, [showApi]);

  return (
    <Box>
      {showApi ? api : <Button onClick={handleClick}>Show Api</Button>}
    </Box>
  );
};
