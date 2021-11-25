import { Button, Card, Grid, TextField, Typography } from '@material-ui/core';
import CallIcon from '@material-ui/icons/Call';
import EmailIcon from '@material-ui/icons/Email';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import styles from '../styles/Contact.module.css';

export default function ContactPageHero() {
  // destructuring the properties that i need from useForm from react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue, // will set the values entered by a user back into the respective input field.
  } = useForm();

  function submitHandler() {
    console.log('Contact form submitted');
  }
  return (
    <section className={styles.contactSection}>
      <div className={styles.contactHero}>
        <div>
          <div>
            <Typography component="p" variant="p">
              LET&apos;S TALK
            </Typography>
            <Typography component="h1" variant="h1">
              Contact Us
            </Typography>
          </div>
        </div>
      </div>

      <div className={styles.contactFormContainer}>
        <div className={styles.contactInfoBox}>
          <Typography component="p" variant="p">
            PHONE AND EMAIL
          </Typography>

          <Typography component="h2" variant="h2">
            Get In Touch With Us Today!
          </Typography>
        </div>

        <Grid container spacing={0} className={styles.contactGrid}>
          <Grid item md={6} xs={12} className={styles.contactGridItem}>
            <Card
              raised
              style={{ height: '100%' }}
              className={styles.contactCard}
            >
              <div className={styles.dividerLeft}>
                <div>
                  <CallIcon color="secondary" fontSize="large" />
                </div>
                <Typography component="p" variant="p">
                  CALL US
                </Typography>
                <strong>
                  <Typography component="p" variant="p">
                    +433 555 99987
                  </Typography>
                </strong>
                <strong>
                  <Typography component="p" variant="p">
                    +433 555 77768
                  </Typography>
                </strong>
              </div>
            </Card>
          </Grid>

          <Grid item md={6} xs={12} className={styles.contactGridItem}>
            <Card
              raised
              style={{ height: '100%' }}
              className={styles.contactCard}
            >
              <div className={styles.dividerRight}>
                <div>
                  <EmailIcon color="secondary" fontSize="large" />
                </div>
                <Typography component="p" variant="p">
                  SEND AN E-MAIL
                </Typography>
                <strong>
                  <Typography component="p" variant="p">
                    info@purefarm.com
                  </Typography>
                </strong>
                <strong>
                  <Typography component="p" variant="p">
                    experience@purefarm.com
                  </Typography>
                </strong>
              </div>
            </Card>
          </Grid>
        </Grid>

        <div className={styles.formContainer}>
          <div>
            <Typography component="h2" variant="h2">
              Message Us!
            </Typography>

            <Typography component="p" variant="p">
              If there is anything that you would want to let us know? We will
              appreciate your feed back on your experience on our website in
              order to serve you better and don&apos;t hesitate to tell uis if
              you encounter any problem and we will be very happy to help.{' '}
              <strong> Have Fun!</strong>
            </Typography>
          </div>

          <form onSubmit={handleSubmit(submitHandler)}>
            <div className={styles.formInputs}>
              <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
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
                </Grid>

                <Grid item md={4} xs={12}>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    defaultValue=""
                    rules={{
                      // validations
                      required: false,
                    }}
                    render={({ field }) => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="phoneNumber"
                        label="Phone Number"
                        inputProps={{ type: 'text' }}
                        /* onChange={(event) => setPostalCode(event.target.value)} */
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </Grid>

                <Grid item md={4} xs={12}>
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
                </Grid>
              </Grid>
            </div>

            <div className={styles.formMessageInputs}>
              <Grid container>
                <Grid item md={12} xs={12}>
                  {' '}
                  <Controller
                    name="message"
                    control={control}
                    defaultValue=""
                    rules={{
                      // validations
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        minRows="8"
                        variant="outlined"
                        fullWidth
                        multiline
                        id="message"
                        label="Message"
                        error={Boolean(errors.Message)}
                        helperText={
                          errors.Message // errors exists or not
                            ? 'Message Body Can&apos;t be empty'
                            : ''
                        }
                        /* onChange={(event) => setName(event.target.value)} */
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </Grid>
              </Grid>
            </div>
            <div>
              <Button
                component="button"
                variant="contained"
                type="submit"
                color="primary"
              >
                SEND MESSAGE
              </Button>
            </div>
          </form>
        </div>

        <div>
          <Typography component="p" variant="p">
            LOCATION
          </Typography>
          <Typography component="h2" variant="h2">
            Where To Find Us!
          </Typography>
          <Typography component="p" variant="p">
            342 Computer Road, St. Maranon County, NY
          </Typography>

          <div>Implement Map here if time permits</div>
        </div>
      </div>
    </section>
  );
}
