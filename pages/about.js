import React from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';

export default function About() {
  const classes = useStyles();
  return (
    <Layout title="About Us">
      <section className={classes.allPagesPadding}>
        <h1>About me page here</h1>
      </section>
    </Layout>
  );
}
