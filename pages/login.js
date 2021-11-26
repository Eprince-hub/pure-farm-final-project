import {
  Button,
  Grid,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import farmImage from '../public/images/login-page-image.webp';
import { getError } from '../utils/error';
/* import { loginLayoutStyle } from '../styles/Home.module.css'; */
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';

export default function Login() {
  // defining the variables from useForm from react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  // setting up notistack notification by destructuring the enqeuesnackbar and closesnackbar properties from the usesnackbar according to the documentation.
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // setting up the use router hook
  const router = useRouter();

  // set redirect as a property of router.query
  const { redirect } = router.query; //url === login?redirect=/shipping

  // using the context from the StoreProvide component.
  const { state, dispatch } = useContext(Store);

  // deconstructing the darkmode and cart from the state
  const { userInfo } = state;

  // check if userInfo exists // which should be the user who is already logged in,
  // if it is true then no need to go to the login page anymore, Redirect to the home page/product page
  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);

  // defining states for email and password
  // const [email, setEmail] = useState('');

  // const [password, setPassword] = useState('');

  const classes = useStyles();

  // function that sends the user login information to the login authentication api using an ajax request

  // deconstructing the values in the submitHandler direct so that we don't need the ones from the useState
  const submitHandler = async ({ email, password }) => {
    // close the snackbar notification before sending teh request
    closeSnackbar();

    // prevent default
    // event.preventDefault(); // react hook form takes care of that

    // send an ajax post request with the user information

    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });

      // save the data we got from the backend here to the react context
      dispatch({ type: 'USER_LOGIN', payload: data });

      // after dispatching the above action then we set the cookies with the user information
      Cookies.set('userInfo', JSON.stringify(data));

      // success message
      enqueueSnackbar('You are logged in', { variant: 'success' }); // nothing was here before/watch error

      // redirecting the user either to the shipping screen or homepage
      router.push(redirect || '/');
    } catch (err) {
      enqueueSnackbar(
        // err.response.data ? err.response.data.message : err.message,
        getError(err),
        { variant: 'error' },
      );
    }
  };
  return (
    <Layout title="Login" customLayoutClassName={classes.loginLayoutStyle}>
      <section className={classes.loginPageStyle}>
        <Grid container spacing={1} className={classes.loginGrid}>
          <Grid item md={6} xs={12} className={classes.loginGridItem}>
            <div className={classes.loginPageImage}>
              <span>
                <Image
                  src={farmImage}
                  alt="illustration of a farmer plucking an apple"
                ></Image>
              </span>
            </div>
          </Grid>

          {/* Login Form */}
          <Grid item md={6} xs={12} className={classes.loginGridItem}>
            {/* Making the frontend form validation with react-hook-form */}
            {/* wrap the submithandler with the react-hook-form handleSubmit to let react hook form control the form submission */}
            <div className={classes.loginFormContainer}>
              <form onSubmit={handleSubmit(submitHandler)}>
                <Typography component="h1" variant="h1">
                  Login
                </Typography>

                <List>
                  <ListItem>
                    {/* Define the controller component that comes from the react-hook-form
              using the controller to wrap all our textField, but before it works we need to define the render property. and give it a function that will return the textField*/}
                    {/* Email */}
                    <Controller
                      name="email"
                      control={control}
                      defaultValue=""
                      rules={{
                        // validations
                        required: true,
                        pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                      }}
                      render={({ field }) => (
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="email"
                          label="Email"
                          inputProps={{ type: 'email' }}
                          error={Boolean(errors.email)}
                          helperText={
                            errors.email // errors exists or not
                              ? errors.email.type === 'pattern' // is it a pattern error?
                                ? 'Email is invalid'
                                : 'Email is required' // else is a required error
                              : '' // else there are no errors
                          }
                          /* onChange={(event) => setEmail(event.target.value)} */
                          {...field}
                        ></TextField>
                      )}
                    ></Controller>
                  </ListItem>

                  {/* Password */}
                  <ListItem>
                    <Controller
                      name="password"
                      control={control}
                      defaultValue=""
                      rules={{
                        // validations
                        required: true,
                        minLength: 8,
                      }}
                      render={({ field }) => (
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="password"
                          label="Password"
                          inputProps={{ type: 'password' }}
                          error={Boolean(errors.password)}
                          helperText={
                            errors.password // errors exists or not
                              ? errors.password.type === 'minLength' // is it a minLength error?
                                ? 'Password must be 8 character and above'
                                : 'Password is required' // else is a required error
                              : '' // else there are no errors
                          }
                          /* onChange={(event) => setPassword(event.target.value)} */
                          {...field}
                        ></TextField>
                      )}
                    ></Controller>
                  </ListItem>

                  <ListItem>
                    <Button
                      variant="contained"
                      type="submit"
                      fullWidth
                      color="primary"
                    >
                      <Typography component="h2" variant="h2">
                        Login
                      </Typography>
                    </Button>
                  </ListItem>

                  <div className={classes.loginFormTexts}>
                    <ListItem component="li" variant="li">
                      Not registered yet? <span>&nbsp;</span>
                      <div>
                        <NextLink
                          href={`/register?redirect=${redirect || '/'}`}
                          passHref
                        >
                          <Link>Register</Link>
                        </NextLink>
                      </div>
                    </ListItem>

                    <ListItem component="li" variant="li">
                      <Typography>Forgotten your password?</Typography>
                    </ListItem>

                    <ListItem component="li" variant="li">
                      <Typography>
                        Didn&apos;t receive confirmation instruction?
                      </Typography>
                    </ListItem>
                  </div>
                </List>
              </form>
            </div>
          </Grid>
        </Grid>
      </section>
    </Layout>
  );
}
