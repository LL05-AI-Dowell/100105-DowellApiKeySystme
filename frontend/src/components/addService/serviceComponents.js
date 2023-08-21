import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import { Box, TextField, Button, Grid, Typography } from "@mui/material";

const initialValues = {
  sub_services: [
    {
      sub_service_name: "",
      sub_service_id: "",
      quantity: null,
      sub_service_credits: null,
    },
  ],
};
const subService = {
  sub_service_name: "",
  sub_service_id: "",
  quantity: null,
  sub_service_credits: null,
};

const ServiceComponents = ({ setSubService }) => {
  const [addService, setAddService] = useState(null);
  return (
    <Box>
      <Typography variant="h5">Sub Services</Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          if (values?.sub_services.length == 0) {
            setAddService("There is no Sub Service Listed");
          } else {
            setAddService(
              `You have added ${values.sub_services.length} sub servies`
            );
            setSubService(values?.sub_services);
            // await new Promise((r) => setTimeout(r, 500));
            // alert(JSON.stringify(values?.sub_services, null, 2));
          }
        }}
      >
        {({ values }) => (
          <Form>
            <FieldArray name="sub_services">
              {({ insert, remove, push }) => (
                <Box>
                  {values.sub_services.length > 0 &&
                    values.sub_services.map((service, index) => (
                      <Grid container spacing={2} key={index}>
                        <Grid item xs={12} sm={3}>
                          <Field
                            name={`sub_services.${index}.sub_service_name`}
                            placeholder="Service Name"
                            as={TextField}
                            variant="standard"
                            type="text"
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Field
                            name={`sub_services.${index}.sub_service_id`}
                            placeholder="Service ID"
                            as={TextField}
                            variant="standard"
                            type="text"
                            required
                          />
                        </Grid>
                        <Grid item xs={6} sm={2}>
                          <Field
                            name={`sub_services.${index}.sub_service_credits`}
                            placeholder="Service Credits"
                            as={TextField}
                            variant="standard"
                            type="number"
                            required
                          />
                        </Grid>
                        <Grid item xs={6} sm={2}>
                          <Field
                            name={`sub_services.${index}.quantity`}
                            placeholder="Quantity"
                            as={TextField}
                            variant="standard"
                            type="number"
                            required
                          />
                        </Grid>
                        <Grid item xs={4} sm={2}>
                          <Button
                            type="button"
                            className="secondary"
                            color="error"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </Button>
                        </Grid>
                      </Grid>
                    ))}
                  <Box mt={2}>
                    <Button
                      type="button"
                      className="secondary"
                     
                      onClick={() => push(subService)}
                      mt={2}
                    >
                     Add More Sub Service
                    </Button>
                  </Box>
                </Box>
              )}
            </FieldArray>
            <Box display={"flex"} justifyContent={"center"} mt={2}>
              <Button variant="contained" color="success" type="submit">
                Approve Sub Services
              </Button>
            </Box>
            <Box>
              {addService == null ? (
                <Typography
                  variant="body2"
                  color={"error"}
                  textAlign={"center"}
                  mt={1}
                >
                  Click the "Approve Sub Services" button to add the listed sub
                  services
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  textAlign={"center"}
                  mt={1}
                  sx={{ color: "green" }}
                >
                  {addService}
                </Typography>
              )}
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ServiceComponents;
