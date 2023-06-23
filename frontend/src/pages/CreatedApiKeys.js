import React, { useState, useEffect } from "react";
import Header from "../layout/Header";
import {
  Box,
  Button,
  Drawer,
  IconButton,
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
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Link } from "react-router-dom";
import { GetUserApiKey } from "../util/api";

const CreatedApiKeys = () => {
  const [data, setData] = useState();
  const [viewKey, setViewKey] = useState(false);
  const workspace_id = '162573bcsfer'

  useEffect(() => {
    const GetApi = async () => {
      const res = await GetUserApiKey(workspace_id);
      console.log(res?.data.data);
      setData(res?.data.data);
    };
    GetApi();
  }, []);
  return (
    <div>
      <Header />
      <Box display="flex" width="100vw">
        <Stack
          direction="column"
          height="89vh"
          width="60px"
          mt={1}
          pt={4}
          component={Paper}
        >
          <List>
            <ListItemButton sx={{ borderRight: "5px solid #005734" }}>
              <HomeOutlinedIcon fontSize="large" sx={{ color: "#005734" }} />
            </ListItemButton>
          </List>
        </Stack>
        <Box width="90vw">
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
            <TableContainer component={Paper} sx={{ m: 4, width: "80%" }}>
              <Table>
                <TableHead>
                  <TableRow>
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
                    data.map((i) => (
                      <TableRow key={i.id}>
                        <TableCell>{i.api_services}</TableCell>
                        <TableCell>
                          <ApiCell api={i.APIKey} />
                        </TableCell>
                        <TableCell></TableCell>
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
