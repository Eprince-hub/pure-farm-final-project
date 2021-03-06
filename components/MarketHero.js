import { Grid, Typography } from '@material-ui/core';
import Image from 'next/image';
import farmMarket from '../public/images/farm-market.webp';
import styles from '../styles/InfoPage.module.css';
import useStyles from '../utils/styles';

export default function MarketHero() {
  const classes = useStyles();

  return (
    <section className={styles.contactSection}>
      <div className={styles.contactHero}>
        <div>
          <div>
            <Typography component="p" variant="p">
              PURE FARM
            </Typography>
            <Typography component="h1" variant="h1">
              MARKET PLACE
            </Typography>
          </div>
        </div>
      </div>
    </section>
    // <section className={styles.marketHeroImage /*  : classes.heroPage */}>
    //   <div className={styles.heroImage}>
    //     <Image
    //       src={farmMarket}
    //       alt="illustration of a farmers selling their produce"
    //     ></Image>
    //     HELLO WORLD
    //   </div>
    // </section>
  );
}
