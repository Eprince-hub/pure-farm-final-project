import { Grid, Link, Typography } from '@material-ui/core';
import Image from 'next/image';
import NextLink from 'next/link';
import React from 'react';
import diaryPic from '../public/images/utilityImages/diary-service.webp';
import farmMarket from '../public/images/utilityImages/farm-market.webp';
import farmTour from '../public/images/utilityImages/farm-tours.webp';
import fruits from '../public/images/utilityImages/fruits.webp';
import liveStock from '../public/images/utilityImages/live-stock.webp';
import vegetables from '../public/images/utilityImages/vegetables.webp';
import styles from '../styles/InfoPage.module.css';
import useStyles from '../utils/styles';

export default function LandingPageInfoDisplay() {
  const classes = useStyles();
  return (
    <section className={classes.infoPageStyles}>
      <div className={classes.infoPageGrids}>
        <div>
          <Typography component="p" variant="p">
            OUR FEATURES
          </Typography>
          <Typography component="h2" variant="h2">
            What We Do
          </Typography>
        </div>

        <Grid container spacing={9}>
          <Grid item md={4} xs={12}>
            <div>
              <NextLink href="market" passHref>
                <Link>
                  <Image src={vegetables} alt="Pure Farm Logo"></Image>
                </Link>
              </NextLink>
              <NextLink href="market" passHref>
                <Link>
                  <Typography component="h3" variant="h3">
                    Vegetables
                  </Typography>
                </Link>
              </NextLink>

              <Typography component="p" variant="p">
                Vegetable farming is the growing of vegetables for human
                consumption. The practice probably started in several parts of
                the world over 100 centuries ago. We take pride in making sure
                that any vegetables that comes up on Pure Farm have been
                certified to be cultivated with the climate friendly best
                practices in mind.
              </Typography>
            </div>
          </Grid>

          <Grid item md={4} xs={12}>
            <div>
              <NextLink href="market" passHref>
                <Link>
                  <Image src={fruits} alt="Pure Farm Logo"></Image>
                </Link>
              </NextLink>
              <NextLink href="market" passHref>
                <Link>
                  <Typography component="h3" variant="h3">
                    Fruits
                  </Typography>
                </Link>
              </NextLink>

              <Typography component="p" variant="p">
                There is a great difference between the crops grown as starter
                plants and the greenhouse vegetables. Masses tend to grow
                vegetables and fruits in their greenhouses but the ones that
                comes from our farmers have been produced with outermost
                consideration for the consumers and have been certified with the
                relevant authorities in this regards.
              </Typography>
            </div>
          </Grid>

          <Grid item md={4} xs={12}>
            <div>
              <NextLink href="market" passHref>
                <Link>
                  <Image src={liveStock} alt="Pure Farm Logo"></Image>
                </Link>
              </NextLink>
              <NextLink href="market" passHref>
                <Link>
                  <Typography component="h3" variant="h3">
                    Livestock
                  </Typography>
                </Link>
              </NextLink>

              <Typography component="p" variant="p">
                Our farmers additionally produce a lot of dairy and meat
                products, with a range of our food commodities from ground beef
                to live yoghurts are produced with the aim of providing the
                consumers with a pure, lean and healthy and organic source of
                protein which is essential for human healthy growth. The
                livestock farmers follows all the best practices.
              </Typography>
            </div>
          </Grid>

          <Grid item md={4} xs={12}>
            <div>
              <NextLink href="market" passHref>
                <Link>
                  <Image src={farmTour} alt="Pure Farm Logo"></Image>
                </Link>
              </NextLink>
              <NextLink href="market" passHref>
                <Link>
                  <Typography component="h3" variant="h3">
                    Farm Tours
                  </Typography>
                </Link>
              </NextLink>

              <Typography component="p" variant="p">
                Did you ever grown or collect fresh strawberries off the farm
                fields? If the answer is yes, than you surely remember how
                exquisite the taste is. because we know that some people enjoys
                the bliss of getting the veggies directly themselves, Our
                farmers are open for a farm tour where you can take the
                vegetables out of the fields yourself.
              </Typography>
            </div>
          </Grid>

          <Grid item md={4} xs={12}>
            <div>
              <NextLink href="market" passHref>
                <Link>
                  <Image src={diaryPic} alt="Pure Farm Logo"></Image>
                </Link>
              </NextLink>
              <NextLink href="market" passHref>
                <Link>
                  <Typography component="h3" variant="h3">
                    Dairy
                  </Typography>
                </Link>
              </NextLink>

              <Typography component="p" variant="p">
                Our farmers produces a wide range of organic dairy products that
                are locally produced and freshly delivered - starting with milk,
                cottage cheese, miscellaneous kinds of regular & blue cheese and
                all. It can not be over emphasized that ever farmer that comes
                on Pure Farm have been vetted by the team of our researchers and
                must meat our minimum requirements.
              </Typography>
            </div>
          </Grid>

          <Grid item md={4} xs={12}>
            <div>
              <NextLink href="contact" passHref>
                <Link>
                  <Image src={farmMarket} alt="Pure Farm Logo"></Image>
                </Link>
              </NextLink>
              <NextLink href="contact" passHref>
                <Link>
                  <Typography component="h3" variant="h3">
                    Farmers Markets
                  </Typography>
                </Link>
              </NextLink>

              <Typography component="p" variant="p">
                Pure Farm is a mid-sized agribusiness and land management
                company built for today’s world, known for our legacy of
                achievement and innovation in providing in season farm products
                for the healthy living of our local communities. Food produced
                from your region being made available to you with just a click
                of a button...
              </Typography>
            </div>
          </Grid>
        </Grid>
      </div>

      <div className={styles.infoPageParallax}>
        <div>
          <Grid container>
            <Grid item>
              <Typography component="h2" variant="h2">
                Fresh From the Farm
              </Typography>

              <Typography component="p" variant="p">
                WE DELIVER ORGANIC FRUITS AND VEGETABLES FRESH FROM FARMERS TO
                YOUR DOORSTEP
              </Typography>

              <NextLink href="market" passHref>
                <Link>
                  <Typography component="h3" variant="h3">
                    Explore Markets
                  </Typography>
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </div>
      </div>
    </section>
  );
}
