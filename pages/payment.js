import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';

export default function Payment() {
  // setting the state hook for the Payment Method
  const [paymentMethod, setPaymentMethod] = useState('');

  // css styles
  const classes = useStyles();

  // setting up notistack notification by destructuring the enqeuesnackbar and closesnackbar properties from the usesnackbar according to the documentation.
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // setting the router
  const router = useRouter();

  // defining the state and dispatch from useContext
  const { state, dispatch } = useContext(Store);

  // destructuring the shippingAddress from the state,ShippingAddress is property of the cart object
  const {
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    // First check if shipping address exists already
    // if it doesn't exist then the user didn't fil the shipping form and must be redirected

    if (!shippingAddress.address) {
      router.push('/shipping');
    } else {
      // set the payment method to the value from cookies
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, []);

  // function for handling the submit
  const submitHandler = (event) => {
    closeSnackbar();
    event.preventDefault();

    // check if the user have selected a payment method
    if (!paymentMethod) {
      enqueueSnackbar('Please choose a payment method!', { variant: 'error' }); // no payment type selected!
    } else {
      // payment method exists
      // dispatch the payment method event to the react context

      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });

      // save the payment method to the cookies
      Cookies.set('paymentMethod', paymentMethod);

      console.log('Payment method from payment file: ', paymentMethod);

      // redirect to the next step => placing order
      router.push('/placeorder');
    }
  };
  return (
    <Layout title="Payment Method">
      <section>
        <CheckoutWizard activeStep={2} />

        <form className={classes.form} onSubmit={submitHandler}>
          <Typography component="h1" variant="h1">
            Payment Method
          </Typography>

          <List>
            <ListItem>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="Payment Method"
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                >
                  <FormControlLabel
                    label="PayPal"
                    value="PayPal"
                    control={<Radio />}
                  ></FormControlLabel>

                  <FormControlLabel
                    label="Stripe"
                    value="Stripe"
                    control={<Radio />}
                  ></FormControlLabel>

                  {/* <FormControlLabel
                    label="Cash"
                    value="Cash"
                    control={<Radio />}
                  ></FormControlLabel> */}
                </RadioGroup>
              </FormControl>
            </ListItem>

            <ListItem>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
              >
                Continue
              </Button>
            </ListItem>

            <ListItem>
              <Button
                fullWidth
                type="button"
                variant="contained"
                onClick={() => router.push('/shipping')}
              >
                One Step Back
              </Button>
            </ListItem>
          </List>
        </form>
      </section>
    </Layout>
  );
}
