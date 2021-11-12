import { Link, Typography } from '@material-ui/core';
import Image from 'next/image';
import NextLink from 'next/link';
import React from 'react';
import headerLogo from '../public/images/logos/header-logo.png';
import useStyles from '../utils/styles';

export default function Header() {
  // Using the classes and styles from Material UI
  const classes = useStyles();

  return (
    <header className={classes.lowerNavigation}>
      <nav className={classes.navMenu}>
        <div className={classes.logo}>
          <NextLink href="/" passHref>
            <Link>
              <Image src={headerLogo} alt="Pure Farm Logo"></Image>
            </Link>
          </NextLink>
        </div>

        <div className={classes.searchBar}>
          <input type="search" />
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
