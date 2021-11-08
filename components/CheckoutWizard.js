import { Step, StepLabel, Stepper } from '@material-ui/core';
import React from 'react';
import useStyles from '../utils/styles';

export default function CheckoutWizard({ activeStep = 0 }) {
  const classes = useStyles();
  // using the stepper from Material ui for the checkout steps
  // assigning the activeStep from material ui to the activeStep props

  // Assign all the steps to an array variable
  const checkoutSteps = [
    'Login',
    'Shipping Address',
    'Payment Method',
    'Place Order',
  ];
  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      className={classes.transparentBackground}
    >
      {checkoutSteps.map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
