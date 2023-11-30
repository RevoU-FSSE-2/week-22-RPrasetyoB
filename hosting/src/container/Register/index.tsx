import { useState } from 'react';
import { Form, Formik, useFormik } from 'formik';
import { Button, TextField, Card, Typography, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import useFetchApi from '../../utils/FetchApi'
import { resolveTimeFormat } from '@mui/x-date-pickers/internals/utils/time-utils';

const validationSchema = Yup.object().shape({
    username: Yup.string().required('Name is Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters long')
        .required('Password is required')
});

const initialValues = {
  username: '',
  password: '',
  role: '',
};

const Register = () => {
  const navigate = useNavigate()
  const { registerUser } = useFetchApi()
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values : typeof initialValues) => {
    setIsLoading(true);
    const newRole = values.role ? values.role : 'user'
    const newValues = {username: values.username, password: values.password, role: newRole}
    try {
      const response = await registerUser(newValues)
      console.log(response)   
      if (response?.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Registration',
          text: 'Registered successfully, redirect to loginpage.',
        });        
        navigate('/')
      } else if(response?.status == 400)  {
        Swal.fire({
          icon: 'error',
          title: 'Registration failure',
          text: 'Username already taken',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration failure',
          text: 'Registration failed. Please check your data.',
        });
      }      
      setIsLoading(false);    
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred while processing your request. Please try again later.')
      Swal.fire({
        icon: 'error',
        title: 'Registration failure',
        text: 'An error occurred while processing your request. Please try again later.',
      });
    }
  }

  // const formik = useFormik({
  //   initialValues: initialValues,
  //   validationSchema: validationSchema,
  //   onSubmit: (values) => handleSubmit(values),
  // });

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleSubmit,
          touched,
          errors,
          handleChange,
          handleBlur,
          isSubmitting,
          values
        }) => (
          <Card style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            padding: '20px'}}>
            <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
              Registration Form
            </Typography>
            <Form onSubmit={handleSubmit}>
              <CardContent>
              <TextField
                  label="Username"
                  variant="outlined"
                  name="username"
                  placeholder='Enter name'
                  fullWidth
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.username && errors.username)}
                  helperText={touched.username && errors.username}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  name="password"
                  type="password"
                  placeholder='Enter password'
                  fullWidth
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel htmlFor="role">Role</InputLabel>
                    <Select
                        label="Role"
                        name="role"
                        placeholder='Choose role'
                        value={values.role}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    >
                        <MenuItem value={"admin"}>Admin</MenuItem>
                        <MenuItem value={"user"}>User</MenuItem>
                    </Select>
                </FormControl>
              </CardContent>              
              <Button
                type='submit'
                variant="contained"
                color="primary"
                disabled={isLoading || isSubmitting}
                fullWidth
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Button>
              <h4 style={{ color: 'grey', fontSize: '18px', marginTop: '10px', marginBottom: '10px', textAlign: 'center' }}>or</h4>              
              <Button
                onClick={()=> navigate('/')}
                type="button"
                variant="outlined"
                color="primary"
                disabled={isLoading || isSubmitting}
                fullWidth
              >
                Login
              </Button>
            </Form>
          </Card> 
        )}
      </Formik>
    </>
  );
};

export default Register