import { Grid } from '@material-ui/core';
import Image from 'next/image';
import farmMarket from '../public/images/farm-market.webp';
import useStyles from '../utils/styles';

export default function MarketHero() {
  const classes = useStyles();

  return (
    <section className={classes.heroPage}>
      <Grid container spacing={3}>
        <Grid item md={12} xs={12}>
          <div className={classes.heroImage}>
            <Image
              src={farmMarket}
              alt="illustration of a farmers selling their produce"
            ></Image>
          </div>
        </Grid>
      </Grid>
    </section>
  );
}
