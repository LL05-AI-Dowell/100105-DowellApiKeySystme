import React from 'react'
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
import { Link } from 'react-router-dom';

const CreatedApiKeys = () => {
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
            <ListItemButton sx={{borderRight:"5px solid #005734"}}>
              <HomeOutlinedIcon fontSize="large" sx={{color:"#005734"}}/>
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
              to='/'
            >
              Create Api Key
            </Button>
            <Button
              variant="outlined"
              sx={{ color: "#005734", borderColor: "#005734" }}
              component={Link}
              to='/createdapikeys'
            >
              Created Api Keys
            </Button>
          </Stack>
          <Box display="flex" justifyContent="center">
            <TableContainer component={Paper} sx={{ m: 4, width: "80%" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Api Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Documentaion
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Api Key</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Credit</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Paid</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>scale</TableCell>
                    <TableCell>scaleee lle </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ color: "#005734", borderColor: "#005734" }}
                      >
                        Created
                      </Button>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell sx={{display:"flex"}}><Typography sx={{bgcolor:"#FBE7E9",borderRadius:"6px",p:0.5}}>False</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>scale</TableCell>
                    <TableCell>scaleee lle </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ color: "#005734", borderColor: "#005734" }}
                      >
                        Created
                      </Button>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell sx={{display:"flex"}}><Typography sx={{bgcolor:"#FBE7E9",borderRadius:"6px",p:0.5}}>False</Typography></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default CreatedApiKeys