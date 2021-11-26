import React from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';

export default function Blog() {
  const classes = useStyles();
  return (
    <Layout title="Blog">
      <section className={classes.allPagesPadding}>
        <h1>News Portal here</h1>
      </section>
    </Layout>
  );
}
