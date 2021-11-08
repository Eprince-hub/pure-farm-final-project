import { Grid, Link, Typography } from '@material-ui/core';
import NextLink from 'next/link';
import React from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';

export default function RegisterType() {
  const classes = useStyles();
  return (
    <Layout title="Registration Type">
      <section className={classes.chooseRegistration}>
        <Grid container spacing={6} variant="grid">
          <Grid item md={6} xs={12}>
            <NextLink href="/register" passHref>
              <Link>
                <Typography variant="h2" component="h2">
                  Register As Customer
                </Typography>
              </Link>
            </NextLink>
          </Grid>

          <Grid item md={6} xs={12}>
            <NextLink href="/farmer-register" passHref>
              <Link>
                <Typography variant="h2" component="h2">
                  Register As Farmer
                </Typography>
              </Link>
            </NextLink>
          </Grid>
        </Grid>
      </section>
    </Layout>
  );
}

// className={classes.brand}
