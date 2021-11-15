import {
  AppBar,
  Badge,
  Container,
  createMuiTheme,
  CssBaseline,
  Grid,
  Link,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@material-ui/core';
import Image from 'next/image';
import NextLink from 'next/link';
import heroPagePic from '../public/images/heroPagePic.png';
import styles from '../styles/Home.module.css';
import useStyles from '../utils/styles';
import Header from './Header';

export default function HeroPage() {
  const classes = useStyles();

  return (
    <div className={styles.heroPageWrapper}>
      <Header />
      <section className={classes.heroPage}>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <div className={classes.heroPageHeader}>
              <Typography variant="h1" component="h1">
                SEASONAL FARM PRODUCE FOR HEALTHY LIVING
              </Typography>

              <Typography component="p" variant="p">
                When you picture yourself a traditional Austrian farm produce
                lover in {/* it's */} it classic, idyllic perception, this is
                what Pure Farm actually looks like! Charming nature that
                surrounds all of our farmers farming facilities and methods,
                making sure that every single item is within the season is what
                inspires and refreshes our website guests. When it is out of
                season then it is out of Pure Farm.
              </Typography>

              <NextLink href="/market" passHref>
                <Link>
                  <Typography variant="h2" component="h2">
                    SHOP NOW
                  </Typography>
                </Link>
              </NextLink>
            </div>
          </Grid>

          <Grid item md={6} xs={12}>
            <div className={classes.heroImage}>
              {/*        <Image
                src={heroPagePic}
                alt="Some vegetables in a basket"
              ></Image> */}
            </div>
          </Grid>
        </Grid>
      </section>
    </div>
  );
}
