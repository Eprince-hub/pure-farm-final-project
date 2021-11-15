import {
  AppBar,
  Badge,
  Button,
  Container,
  createMuiTheme,
  CssBaseline,
  Link,
  Menu,
  MenuItem,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@material-ui/core';
import Cookies from 'js-cookie';
import Head from 'next/head';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import cartIcon from '../public/images/cart.png';
import profileIcon from '../public/images/profileLogo.png';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';
import Footer from './Footer';
import Header from './Header';

export default function Layout({
  description,
  title,
  children,
  customLayoutClassName,
}) {
  // setting the router
  const router = useRouter();

  // using the context from the StoreProvide component.
  const { state, dispatch } = useContext(Store);

  // deconstructing the darkmode and cart from the state
  const { darkMode, cart, userInfo } = state;

  // creating a material UI theme to customize my application
  const theme = createMuiTheme({
    // this was changed to createTheme as advised but it throws an error
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
        fontFamily: 'oswald',
      },

      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
        fontFamily: 'oswald',
      },
    },

    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#A2D761',
      },
      secondary: {
        main: '#002B2B',
      },
    },
  });

  // #############################################################################
  // fixing the darkmode toggle unstable error with the code below: START
  // const [darkModeState, setDarkModeState] = useState(false);

  // useEffect(() => {
  //   setDarkModeState(darkMode);
  // }, []);

  // #############################################################################

  // Using the classes and styles from Material UI
  const classes = useStyles();

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });

    // getting the new Dark mode which shouldn't be the current dark mode
    const newDarkMode = !darkMode;

    // setting a new darkModeState variable value
    // setDarkModeState(newDarkMode); // this is handling the toggle unstable problem

    // setting the new cookie value to the cookie for persistence
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

  // function that handles the user profile menu show and hide
  // first define state for the anchor element according to material ui documentary
  const [anchorEl, setAnchorEl] = useState(null);

  // define and set the function that shows the menu
  const loginClickHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // define and set the function that hides the menu
  const loginMenuCloseHandler = (event, redirect) => {
    setAnchorEl(null);

    if (redirect) {
      router.push(redirect);
    }
  };

  // function that handles the user logout
  const logoutClickHandler = (event) => {
    setAnchorEl(null); // first close the menu bar

    // dispatching the logout event to the react context
    dispatch({ type: 'USER_LOGOUT' });

    // remove user session after logout
    Cookies.remove('userInfo');

    // remove cartItems
    Cookies.remove('cartItems');

    // redirect user back to home screen
    router.push('/');
  };

  // console.log('User Information from layout; ', userInfo);

  return (
    <section className={customLayoutClassName}>
      <Head>
        <title>{title ? `${title} - Pure Farm` : 'Pure Farm'}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        {/* Deifining the Css Baseline for the theme provider */}

        <CssBaseline />

        {/* Upper Navigation (Cart, login, register) */}
        <AppBar position="static" className={classes.navbar}>
          <Toolbar>
            <NextLink href="/" passHref>
              <Link>
                <Typography className={classes.brand}>
                  {/* Pure Farm */}
                </Typography>
              </Link>
            </NextLink>

            <div className={classes.grow}></div>

            <div className={classes.flex}>
              <Switch
                className={classes.disableSwitch}
                checked={darkMode} /*{
                  darkModeState
                }  I changed back to the old value that was not persisting the toggle */
                onChange={darkModeChangeHandler}
              ></Switch>
              <NextLink href="/cart" passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge
                      color="secondary"
                      badgeContent={cart.cartItems.length}
                    >
                      <div className={classes.cartIcon}>
                        <Image src={cartIcon} alt="Pure Farm Cart Icon"></Image>
                      </div>
                    </Badge>
                  ) : (
                    <div className={classes.cartIcon}>
                      <Image src={cartIcon} alt="Pure Farm Cart Icon"></Image>
                    </div>
                  )}
                </Link>
              </NextLink>
              {/* Hide login and register if the user is already logged in */}
              {userInfo ? (
                /* Set css styles for this button later */
                <>
                  <Button
                    aria-controls="simple-Menu"
                    aria-haspopup="true"
                    onClick={
                      loginClickHandler
                    } /* Change this handler to showUserProfileMenuClickHandler */
                    className={classes.navbarButton}
                  >
                    Welcome: {userInfo.name}
                  </Button>

                  {/* Simple Menu from Material UI */}
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={
                      loginMenuCloseHandler
                    } /* Change this handler to closeUserProfileMenuClickHandler */
                  >
                    <MenuItem
                      onClick={(event) =>
                        loginMenuCloseHandler(event, '/profile')
                      }
                    >
                      Profile
                    </MenuItem>

                    {!userInfo.isSiteAdmin && (
                      <MenuItem
                        onClick={(event) =>
                          loginMenuCloseHandler(event, '/order-history')
                        }
                      >
                        Order History
                      </MenuItem>
                    )}

                    {/* Checking if the user is an admin user or not */}

                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(event) =>
                          loginMenuCloseHandler(event, '/admin/dashboard')
                        }
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}

                    {/* Checking if the user is a site admin or not,, I am the only site admin */}

                    {userInfo.isSiteAdmin && (
                      <MenuItem
                        onClick={(event) =>
                          loginMenuCloseHandler(event, '/admin/site-admin')
                        }
                      >
                        View Site Stats
                      </MenuItem>
                    )}

                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                /* conditionally render the login and register button based on if the user is logged in or not */
                <div className={classes.flex}>
                  <NextLink href="/login" passHref>
                    <Link>
                      <span className={classes.profileIcon}>
                        <Image
                          src={profileIcon}
                          alt="Pure Farm Profile Icon"
                        ></Image>
                      </span>{' '}
                      Login
                    </Link>
                  </NextLink>

                  <span className={classes.lineUp}>&#8739;</span>

                  <NextLink href="/register-type" passHref>
                    <Link> Register</Link>
                  </NextLink>
                </div>
              )}
            </div>
          </Toolbar>
        </AppBar>

        <Header />

        <Container className={classes.main} maxWidth={false}>
          {children}
        </Container>
        <Footer className={classes.footer} />
      </ThemeProvider>
    </section>
  );
}
