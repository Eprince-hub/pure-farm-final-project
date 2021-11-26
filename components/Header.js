import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  Link,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import footerLogo from '../public/images/logos/footer-logo.png';
import headerLogo from '../public/images/logos/header-logo.png';
import { getError } from '../utils/error';
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

  // search sidebar implementation
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // function that handles opening of the category search side bar
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };

  // function that handles closing of the category search side bar
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  // state variable for the categories
  const [categories, setCategories] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  // api request to get the categories from the backend
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };

  // Implement the Search functionality
  const [query, setQuery] = useState('');

  const queryChangeHandler = (event) => {
    setQuery(event.target.value);
  };

  // function that handles the search function from the search input
  const formSubmitHandler = (event) => {
    event.preventDefault();

    router.push(`/search?query=${query}`);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <header
      className={navbar ? classes.onScrollClassName : classes.lowerNavigation}
    >
      <nav className={classes.navMenu}>
        {/* Side bar implementation started */}
        <div>
          <Box display="flex" alignItems="center">
            <IconButton
              edge="start"
              aria-label="open drawer"
              onClick={sidebarOpenHandler}
              className={classes.menuButton}
            >
              <MenuIcon
                className={
                  navbar
                    ? classes.navbarButtonOnScroll
                    : classes.sideNavbarButton
                }
              />
            </IconButton>

            <div className={classes.logo}>
              {navbar ? (
                <NextLink href="/" passHref>
                  <Link>
                    <Image src={footerLogo} alt="Pure Farm Logo"></Image>
                  </Link>
                </NextLink>
              ) : (
                <NextLink href="/" passHref>
                  <Link>
                    <Image src={headerLogo} alt="Pure Farm Logo"></Image>
                  </Link>
                </NextLink>
              )}
            </div>
          </Box>

          <Drawer
            anchor="left"
            open={sidebarVisible}
            onClose={sidebarCloseHandler}
          >
            <List>
              <ListItem>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Search Products By Category</Typography>
                  <IconButton
                    aria-label="search side bar close"
                    onClick={sidebarCloseHandler}
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>
              </ListItem>

              <Divider light />

              {categories.map((category) => (
                <NextLink
                  key={category}
                  href={`/search?category=${category}`}
                  passHref
                >
                  <ListItem button component="a" onClick={sidebarCloseHandler}>
                    <ListItemText primary={category}></ListItemText>
                  </ListItem>
                </NextLink>
              ))}
            </List>
          </Drawer>
        </div>

        <div className={classes.searchSection}>
          <form onSubmit={formSubmitHandler} className={classes.searchForm}>
            <InputBase
              name="query"
              className={classes.searchInput}
              placeholder="Search"
              onChange={queryChangeHandler}
            />

            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </form>
        </div>

        <div className={classes.navbarButtons}>
          <NextLink href="/" passHref>
            <Link>
              <Typography variant="h2" component="h2" selected>
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
        {/* Side bar implementation started */}
        <div className={classes.mobileSidebar}>
          <Box display="flex" alignItems="center">
            <IconButton
              edge="start"
              aria-label="open drawer"
              onClick={sidebarOpenHandler}
            >
              <MenuIcon
                className={
                  navbar
                    ? classes.navbarButtonOnScroll
                    : classes.sideNavbarButton
                }
              />
            </IconButton>
          </Box>

          <Drawer
            anchor="left"
            open={sidebarVisible}
            onClose={sidebarCloseHandler}
          >
            <List>
              <ListItem>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Search Products By Category</Typography>
                  <IconButton
                    aria-label="search side bar close"
                    onClick={sidebarCloseHandler}
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>
              </ListItem>

              <Divider light />

              {categories.map((category) => (
                <NextLink
                  key={category}
                  href={`/search?category=${category}`}
                  passHref
                >
                  <ListItem button component="a" onClick={sidebarCloseHandler}>
                    <ListItemText primary={category}></ListItemText>
                  </ListItem>
                </NextLink>
              ))}
            </List>
          </Drawer>
        </div>

        {navbar ? (
          <div className={classes.mobileLogo}>
            <NextLink href="/" passHref>
              <Link>
                <Image src={footerLogo} alt="Pure Farm Logo"></Image>
              </Link>
            </NextLink>
          </div>
        ) : (
          <div className={classes.mobileLogo}>
            <NextLink href="/" passHref>
              <Link>
                <Image src={headerLogo} alt="Pure Farm Logo"></Image>
              </Link>
            </NextLink>
          </div>
        )}

        <div className={classes.hamburgerMenuContainer}>
          {navbar ? (
            <Button
              component="button"
              aria-controls="simple-Menu"
              aria-haspopup="true"
              onClick={loginClickHandler}
            >
              <MenuIcon
                className={
                  navbar
                    ? classes.navbarButtonOnScroll
                    : classes.sideNavbarButton
                }
              />
            </Button>
          ) : (
            <Button
              component="button"
              aria-controls="simple-Menu"
              aria-haspopup="true"
              onClick={loginClickHandler}
            >
              <MenuIcon
                className={
                  navbar
                    ? classes.navbarButtonOnScroll
                    : classes.sideNavbarButton
                }
              />
            </Button>
          )}

          <Menu
            className={classes.hamburgerMenuBox}
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={loginMenuCloseHandler}
          >
            <MenuItem
              className={classes.hamburgerMenuItem}
              onClick={loginMenuCloseHandler}
            >
              <div className={classes.closeHamburgerMenuImage}>
                <CancelIcon className={classes.closeMobileMenu} />
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
          </Menu>
        </div>
      </div>
    </header>
  );
}
