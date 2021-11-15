import { Button, Link, Menu, MenuItem, Typography } from '@material-ui/core';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import closeHamburgerMenu from '../public/images/logos/closeHamburgerMenu.svg';
import hamburgerMenu from '../public/images/logos/hamburgerMenu.png';
import headerLogo from '../public/images/logos/header-logo.png';
import useStyles from '../utils/styles';

export default function Header() {
  // Using the classes and styles from Material UI
  const classes = useStyles();

  const router = useRouter();

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

  // change navbar background color on scroll
  const [navbar, setNavbar] = useState(false);

  useEffect(() => {
    const changeBackground = () => {
      if (window === undefined) {
        return;
      } else {
        if (window.scrollY >= 50) {
          setNavbar(true);
        } else {
          setNavbar(false);
        }
      }
    };

    changeBackground();

    window.addEventListener('scroll', changeBackground);
  }, [navbar]);

  return (
    <header
      className={navbar ? classes.onScrollClassName : classes.lowerNavigation}
    >
      <nav className={classes.navMenu}>
        <div className={classes.logo}>
          <NextLink href="/" passHref>
            <Link>
              <Image src={headerLogo} alt="Pure Farm Logo"></Image>
            </Link>
          </NextLink>
        </div>

        <div className={classes.navbarButtons}>
          <NextLink href="/" passHref>
            <Link>
              <Typography variant="h2" component="h2">
                HOME
              </Typography>
            </Link>
          </NextLink>

          <NextLink href="/farmers" passHref>
            <Link>
              <Typography variant="h2" component="h2">
                FARMERS
              </Typography>
            </Link>
          </NextLink>

          <NextLink href="/market" passHref>
            <Link>
              <Typography variant="h2" component="h2">
                MARKETS
              </Typography>
            </Link>
          </NextLink>

          <NextLink href="/about" passHref>
            <Link>
              <Typography variant="h2" component="h2">
                ABOUT US
              </Typography>
            </Link>
          </NextLink>

          <NextLink href="/contact" passHref>
            <Link>
              <Typography variant="h2" component="h2">
                CONTACT US
              </Typography>
            </Link>
          </NextLink>

          <NextLink href="/blog" passHref>
            <Link>
              <Typography variant="h2" component="h2">
                BLOG
              </Typography>
            </Link>
          </NextLink>
        </div>
      </nav>

      <div className={classes.mobileDisplayNav}>
        <div className={classes.mobileLogo}>
          <NextLink href="/" passHref>
            <Link>
              <Image src={headerLogo} alt="Pure Farm Logo"></Image>
            </Link>
          </NextLink>
        </div>

        <div className={classes.hamburgerMenuContainer}>
          <Button
            component="button"
            aria-controls="simple-Menu"
            aria-haspopup="true"
            onClick={
              loginClickHandler
            } /* Change this handler to showUserProfileMenuClickHandler */
          >
            <Image
              src={hamburgerMenu}
              alt="Hamburger Menu for Mobile display"
            ></Image>
          </Button>

          <Menu
            className={classes.hamburgerMenuBox}
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={
              loginMenuCloseHandler
            } /* Change this handler to closeUserProfileMenuClickHandler */
          >
            <MenuItem
              className={classes.hamburgerMenuItem}
              onClick={loginMenuCloseHandler}
            >
              <div className={classes.closeHamburgerMenuImage}>
                <Image
                  component="img"
                  src={closeHamburgerMenu}
                  alt="Hamburger Menu for Mobile display"
                ></Image>
              </div>
            </MenuItem>

            <MenuItem
              className={classes.hamburgerMenuItem}
              onClick={(event) => loginMenuCloseHandler(event, '/farmers')}
            >
              <Typography component="p" variant="p">
                FARMERS
              </Typography>
            </MenuItem>

            <MenuItem
              className={classes.hamburgerMenuItem}
              onClick={(event) => loginMenuCloseHandler(event, '/market')}
            >
              <Typography component="p" variant="p">
                MARKET
              </Typography>
            </MenuItem>

            <MenuItem
              className={classes.hamburgerMenuItem}
              onClick={(event) => loginMenuCloseHandler(event, '/about')}
            >
              <Typography component="p" variant="p">
                ABOUT US
              </Typography>
            </MenuItem>

            <MenuItem
              className={classes.hamburgerMenuItem}
              onClick={(event) => loginMenuCloseHandler(event, '/contact')}
            >
              <Typography component="p" variant="p">
                CONTACT US
              </Typography>
            </MenuItem>

            <MenuItem
              className={classes.hamburgerMenuItem}
              onClick={(event) => loginMenuCloseHandler(event, '/blog')}
            >
              <Typography component="p" variant="p">
                BLOG
              </Typography>
            </MenuItem>

            <div className={classes.searchBar}>
              <input type="search" />
            </div>
          </Menu>
        </div>
      </div>
    </header>

    /*     <div className={classes.lowerNavigation}>
      <AppBar position="static" className={classes.navbar}>
        <Toolbar>
          <NextLink href="/" passHref>
            <Link>
              <Image src={pureFarm} alt="Pure Farm Logo"></Image>
            </Link>
          </NextLink>

          <div>
            <NextLink href="/" passHref>
              <Link>
                <Typography>HOME</Typography>
              </Link>
            </NextLink>

            <NextLink href="/farmers" passHref>
              <Link>
                <Typography>FARMERS</Typography>
              </Link>
            </NextLink>

            <NextLink href="/market" passHref>
              <Link>
                <Typography>MARKETS</Typography>
              </Link>
            </NextLink>

            <NextLink href="/about" passHref>
              <Link>
                <Typography>ABOUT US</Typography>
              </Link>
            </NextLink>

            <NextLink href="/contact" passHref>
              <Link>
                <Typography>CONTACT US</Typography>
              </Link>
            </NextLink>

            <NextLink href="/blog" passHref>
              <Link>
                <Typography>BLOG</Typography>{' '}
              </Link>
            </NextLink>
          </div>
        </Toolbar>
      </AppBar>
    </div> */
  );
}
