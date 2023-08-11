import React, { useState, useEffect } from "react";

import {
  Box,
  CircularProgress,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { AddService_v3 } from "../../util/api_v3";

const AddServices = () => {
  const [dialog, setDialog] = useState(false);
  const [fdialog, setFdialog] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (
      data.get("name") == "" ||
      data.get("service_id") == "" ||
      data.get("link") == "" ||
      data.get("description") == "" ||
      data.get("service_type") == "" ||
      data.get("credits") == ""
    ) {
      console.log("add the remaining parts");
      setFdialog(true);
    } else {
      setData({
        name: data.get("name"),
        service_id: data.get("service_id"),
        link: data.get("link"),
        description: data.get("description"),
        service_type: data.get("service_type"),
        credits: parseInt(data.get("credits")),
      });
      setDialog(true);
    }
  };
  const handleAddService = async () => {
    console.log(data, password);
    setLoading(true);
    const res = await AddService_v3({
      data: data,
      password: password,
    });
    if (res == undefined) {
      console.log(res);
      console.log("error occured");
      setLoading(false);
      setDialog(false);
      setSnackBar("error");
      setPassword("");
    } else {
      setSnackBar("success");
      console.log(res);
      console.log("success");
      setLoading(false);
      setDialog(false);
      setPassword("");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  return (
    <div>
      <Box width="80%" pt={4} ml={4}>
        <Typography
          variant="h4"
          fontWeight={"bold"}
          sx={{ color: "#005734", width: "100%", textAlign: "center" }}
        >
          ADD SERVICE
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            mt: 1,
            width: { xs: "100%", md: "60%" },
            ml: { xs: 0, md: "20%" },
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Service Name"
            name="name"
            autoComplete="name"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="service_id"
            label="Service ID"
            type="text"
            id="service_id"
            autoComplete="ID for the service"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="link"
            label="Link"
            type="text"
            id="link"
            autoComplete="URL for the service"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="description"
            label="Description"
            type="text"
            id="description"
            autoComplete="description for the service"
          />
          <FormControl
            variant="standard"
            sx={{ m: 1, minWidth: 120 }}
            fullWidth
          >
            <InputLabel>Service Type</InputLabel>
            <Select label="Service Type" name="service_type" id="service_type">
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"API"}>API</MenuItem>
              <MenuItem value={"PYTHON LIBRARY"}>PYTHON LIBRARY</MenuItem>
              <MenuItem value={"R LIBRARY"}>R LIBRARY</MenuItem>
              <MenuItem value={"WORDPRESS PLUGIN"}>WORDPRESS PLUGIN</MenuItem>
              <MenuItem value={"FLUTTER COMPONENT"}>FLUTTER COMPONENT</MenuItem>
              <MenuItem value={"REACT COMPONENT"}>REACT COMPONENT</MenuItem>
              <MenuItem value={"PRODUCT"}>PRODUCT</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            name="credits"
            label="Credits"
            type="number"
            id="credits"
            autoComplete="Credits for the service"
          />
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              ml: { xs: 0, md: "25%" },
            }}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: "#005734" }}
            >
              Submit
            </Button>
          </Box>
        </Box>
        <Dialog
          open={dialog}
          onClose={() => setDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Enter your passowrd</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog(false)}>Go Back</Button>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button onClick={handleAddService} autoFocus>
                Submit
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <Dialog
          open={fdialog}
          onClose={() => setFdialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Enter your again</DialogTitle>
          <DialogContent>
            <DialogContentText>
              The Form you trying to submit lacks some information.
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Snackbar
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          open={snackBar}
          autoHideDuration={5000}
          onClose={() => setSnackBar("")}
        >
          <Alert severity={snackBar} sx={{ width: "100%" }}>
            {snackBar == "success"
              ? "Service Added"
              : "Error Occured / Wrong Password"}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
};

export default AddServices;
