import {
  Button,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';

export default function Shipping() {
  // destructuring the properties that i need from useForm from react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue, // will set the values entered by a user back into the respective input field.
  } = useForm();

  // setting up the use router hook
  const router = useRouter();

  // set redirect as a property of router.query
  const { redirect } = router.query; // not in use Check

  // using the context from the StoreProvide component.
  const { state, dispatch } = useContext(Store);

  // deconstructing the userInfo and cart from the state
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  // check if userInfo exists // which should be the user who is already logged in,
  // if it is not true then no need to go to the payment or shipping page anymore, Redirect to the home login page
  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    }

    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('country', shippingAddress.country);
  }, []);

  const classes = useStyles();

  // function that sends the user shipping information to the shipping authentication api using an ajax request

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    // save the data we got from the backend here to the react context
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country },
    });

    // after dispatching the above action then we set the cookies with the user information
    Cookies.set(
      'shippingAddress',
      JSON.stringify({ fullName, address, city, postalCode, country }),
    );

    // redirecting the user either to the shipping screen or homepage
    router.push('/payment'); // check if this needs an /
  };
  return (
    <Layout title="Shipping">
      <section className={classes.allPagesPadding}>
        <CheckoutWizard activeStep={1} />
        <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
          <Typography component="h1" variant="h1">
            Shipping Address
          </Typography>

          <List>
            {/* User's Full Name */}
            <ListItem>
              <Controller
                name="fullName"
                control={control}
                defaultValue=""
                rules={{
                  // validations
                  required: true,
                  minLength: 2,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="fullName"
                    label="Full Name"
                    inputProps={{ type: 'name' }}
                    error={Boolean(errors.fullName)}
                    helperText={
                      errors.fullName // errors exists or not
                        ? errors.fullName.type === 'minLength' // is it a pattern error?
                          ? 'Full Name length should not be less than 2 characters'
                          : 'Full Name is required' // else is a required error
                        : '' // else there are no errors
                    }
                    /* onChange={(event) => setFullName(event.target.value)} */
                    {...field}
                  ></TextField>
                )}
              ></Controller>
            </ListItem>

            {/* User's full address */}
            <ListItem>
              <Controller
                name="address"
                control={control}
                defaultValue=""
                rules={{
                  // validations
                  required: true,
                  minLength: 2,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="address"
                    label="Address"
                    inputProps={{ type: 'text' }} // default value
                    error={Boolean(errors.address)}
                    helperText={
                      errors.address // errors exists or not
                        ? errors.address.type === 'minLength' // is it a pattern error?
                          ? 'Address length should not be less than 2 characters'
                          : 'Address is required' // else is a required error
                        : '' // else there are no errors
                    }
                    /* onChange={(event) => setAddress(event.target.value)} */
                    {...field}
                  ></TextField>
                )}
              ></Controller>
            </ListItem>

            {/* User's City */}
            <ListItem>
              <Controller
                name="city"
                control={control}
                defaultValue=""
                rules={{
                  // validations
                  required: true,
                  minLength: 2,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="city"
                    label="City"
                    inputProps={{ type: 'text' }}
                    error={Boolean(errors.city)}
                    helperText={
                      errors.city // errors exists or not
                        ? errors.city.type === 'minLength' // is it a pattern error?
                          ? 'City length should not be less than 2 characters'
                          : 'City is required' // else is a required error
                        : '' // else there are no errors
                    }
                    /* onChange={(event) => setCity(event.target.value)} */
                    {...field}
                  ></TextField>
                )}
              ></Controller>
            </ListItem>

            {/* User's postal code */}
            <ListItem>
              <Controller
                name="postalCode"
                control={control}
                defaultValue=""
                rules={{
                  // validations
                  required: true,
                  minLength: 2,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="postalCode"
                    label="Postal Code"
                    inputProps={{ type: 'text' }}
                    error={Boolean(errors.postalCode)}
                    helperText={
                      errors.postalCode // errors exists or not
                        ? errors.postalCode.type === 'minLength' // is it a pattern error?
                          ? 'Postal Code length should not be less than 2 characters'
                          : 'Postal Code is required' // else is a required error
                        : '' // else there are no errors
                    }
                    /* onChange={(event) => setPostalCode(event.target.value)} */
                    {...field}
                  ></TextField>
                )}
              ></Controller>
            </ListItem>

            {/* User's country */}
            <ListItem>
              <Controller
                name="country"
                control={control}
                defaultValue=""
                rules={{
                  // validations
                  required: true,
                  minLength: 2,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="country"
                    label="Country"
                    inputProps={{ type: 'text' }}
                    error={Boolean(errors.country)}
                    helperText={
                      errors.country // errors exists or not
                        ? errors.country.type === 'minLength' // is it a pattern error?
                          ? 'Country length should not be less than 2 characters'
                          : 'Country is required' // else is a required error
                        : '' // else there are no errors
                    }
                    /* onChange={(event) => setCountry(event.target.value)} */
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
                Continue
              </Button>
            </ListItem>
          </List>
        </form>
      </section>
    </Layout>
  );
}
