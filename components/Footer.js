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
import Image from 'next/image';
import NextLink from 'next/link';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import footerLogo from '../public/images/logos/footer-logo.png';
import facebook from '../public/images/socialIcons/facebook.png';
import instagram from '../public/images/socialIcons/instagram.png';
import linkedIn from '../public/images/socialIcons/linkedIn.png';
import newsLetter from '../public/images/socialIcons/sendNewsLetter.png';
import twitter from '../public/images/socialIcons/twitter.png';
import youtube from '../public/images/socialIcons/youtube.png';
import { getError } from '../utils/error';
import useStyles from '../utils/styles';

export default function Footer(props) {
  // css
  const classes = useStyles();

  // destructuring the snackbar
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  // defining the variables from useForm from react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  // function that handles the newsletter signup
  const newsLetterSubmitHandler = async ({ email }) => {
    closeSnackbar();

    // send an ajax post request with the email address
    try {
      const { data } = await axios.post('/api/users/newsletter', {
        email,
      });

      // success message
      enqueueSnackbar('Thanks for registering for our newsletter', {
        variant: 'success',
      });

      setValue('email', '');
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <footer className={props.className}>
      <section>
        <Grid container spacing={1}>
          <Grid item md={3} xs={12}>
            <div className={classes.logo}>
              <NextLink href="/" passHref>
                <Link>
                  <Image src={footerLogo} alt="Pure Farm Logo"></Image>
                </Link>
              </NextLink>
            </div>

            <Typography component="p" variant="p">
              With the every increase desire in local farm produce and the
              difficulty the whole world is facing right now with the series of
              lock-downs, due to the pandemic. Farmers faces a hard time selling
              their farm produce as all the physical market places they used to
              sale their produce are on lock and this has lead to lots of loses
              for the farmers and inability for the consumers to get what they
              want and when they want it. Pure Farm has come to solve this
              problem - matching local farmers with consumers that are
              interested in buying locally produced farm products.
            </Typography>
            <div className={classes.footerSocialIcons}>
              <div className={classes.icons}>
                <NextLink href="/" passHref>
                  <Link>
                    <Image src={twitter} alt="Twitter Social Icon"></Image>
                  </Link>
                </NextLink>
              </div>

              <div className={classes.icons}>
                <NextLink href="/" passHref>
                  <Link>
                    <Image src={facebook} alt="Facebook Social Icon"></Image>
                  </Link>
                </NextLink>
              </div>

              <div className={classes.icons}>
                <NextLink href="/" passHref>
                  <Link>
                    <Image src={instagram} alt="Instagram Social Icon"></Image>
                  </Link>
                </NextLink>
              </div>

              <div className={classes.icons}>
                <NextLink href="/" passHref>
                  <Link>
                    <Image src={linkedIn} alt="LinkedIn Social Icon"></Image>
                  </Link>
                </NextLink>
              </div>

              <div className={classes.icons}>
                <NextLink href="/" passHref>
                  <Link>
                    <Image src={youtube} alt="Youtube Social Icon"></Image>
                  </Link>
                </NextLink>
              </div>
            </div>
          </Grid>

          <Grid item md={3} xs={12}>
            <Typography>Blog</Typography>
          </Grid>
          <Grid item md={3} xs={12}>
            <Typography>Contact Us</Typography>
          </Grid>
          <Grid item md={3} xs={12}>
            <Typography>Join Our Newsletter</Typography>

            <Typography component="p" variant="p">
              Follow Our Blog Updates <span>&</span> Get All the Special Offers!
            </Typography>

            <form onSubmit={handleSubmit(newsLetterSubmitHandler)}>
              <List className={classes.formInputContainer}>
                <ListItem>
                  {/* Define the controller component that comes from the react-hook-form
              using the controller to wrap all our textField, but before it works we need to define the render property. and give it a function that will return the textField*/}
                  {/* User's Email */}
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
                        contained
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

                  <Button
                    className={classes.footerButton}
                    variant="contained"
                    type="submit"
                    contained
                  >
                    <Image src={newsLetter} alt="Youtube Social Icon"></Image>
                  </Button>
                </ListItem>
              </List>
            </form>
          </Grid>
        </Grid>

        <span>
          <Typography component="p" variant="p">
            All rights reserved. Final Project Pure Farm.
          </Typography>
        </span>
      </section>
    </footer>
  );
}
