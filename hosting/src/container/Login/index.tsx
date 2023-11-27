import React, { useContext, useState } from "react";
import { Form, Formik } from "formik";
import { Button, TextField, Card, Typography, CardContent } from "@mui/material";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import  useFetchApi  from "../../utils/FetchApi";
import Swal from "sweetalert2";
import { useFormik } from 'formik';
import { AppContext } from "../../provider/AppProvider";
import { useGetToken } from "../../hook";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const initialValues = {
  username: "",
  password: "",
};

const Login: React.FC = () => {
  const { loginUser } = useFetchApi();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: typeof initialValues) => {
    setIsLoading(true)
    try {
      const response = await loginUser(values);
      if (response?.status == 200) {
        Swal.fire({
          icon: "success",
          title: "Login",
          text: "Login successful",
        });
        window.location.replace("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Username or Password incorrect",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "An error occurred while processing your request. Please try again later.",
      });
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ touched, errors }) => (
          <Card
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "300px",
              padding: "20px",
            }}
          >
            <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
              Login Form
            </Typography>
            <Form onSubmit={formik.handleSubmit}>
              <CardContent>
                <TextField
                  label="username"
                  variant="outlined"
                  name="username"
                  placeholder="Enter username"
                  fullWidth
                  required
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(touched.username && errors.username)}
                  helperText={touched.username && errors.username}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="password"
                  variant="outlined"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  fullWidth
                  required
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ mb: 2 }}
                />
              </CardContent>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <h4
                style={{
                  color: "grey",
                  fontSize: "18px",
                  marginTop: "10px",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                or
              </h4>
              <Button
                onClick={() => navigate("/register")}
                variant="outlined"
                color="primary"
                disabled={isLoading}
                fullWidth
              >
                Sign Up
              </Button>
            </Form>
          </Card>
        )}
      </Formik>
    </>
  );
};

export default Login;
