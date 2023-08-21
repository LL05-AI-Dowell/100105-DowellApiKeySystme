import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const ServiceInfo = ({ handleChange, serviceInfo,serviceInfoNot }) => {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Service Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            id="name"
            name="name"
            label="Service name"
            value={serviceInfo?.name}
            fullWidth
            autoComplete="given-name"
            variant="standard"
            onChange={(e) => handleChange(e)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            id="service_id"
            name="service_id"
            label="Service ID"
            value={serviceInfo?.service_id}
            fullWidth
            autoComplete="id"
            variant="standard"
            onChange={(e) => handleChange(e)}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            required
            id="credits"
            name="credits"
            label="Credits"
            type="number"
            value={serviceInfo?.credits}
            fullWidth
            autoComplete="credtis"
            variant="standard"
            onChange={(e) => handleChange(e)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="description"
            name="description"
            label="Description"
            value={serviceInfo?.description}
            fullWidth
            autoComplete="description"
            variant="standard"
            onChange={(e) => handleChange(e)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="link"
            name="link"
            label="Service Link"
            value={serviceInfo.link}
            fullWidth
            autoComplete="link"
            variant="standard"
            onChange={(e) => handleChange(e)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl variant="standard" fullWidth>
            <InputLabel>Service Type</InputLabel>
            <Select
              label="Service Type"
              name="service_type"
              id="service_type"
              value={serviceInfo.service_type}
              onChange={(e) => handleChange(e)}
            >
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
        </Grid>
      </Grid>
      <Typography mt={2} color={'error'}>{serviceInfoNot}</Typography>
    </React.Fragment>
  );
};

export default ServiceInfo;
