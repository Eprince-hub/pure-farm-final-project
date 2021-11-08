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
import useStyles from '../utils/styles';

export default function HeroPage() {
  const classes = useStyles();

  return (
    <section className={classes.heroPage}>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <div className={classes.heroPageHeader}>
            <Typography variant="h1" component="h1">
              SEASONAL FARM PRODUCE FOR HEALTHY LIVING
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
            <Image src={heroPagePic} alt="Some vegetables in a basket"></Image>
          </div>
        </Grid>
      </Grid>
    </section>
  );
}
