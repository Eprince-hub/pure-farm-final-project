import React from 'react';
import ContactPageHero from '../components/ContactPageHero';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';

export default function Contact() {
  const classes = useStyles();
  return (
    <Layout title="Contact Us">
      <section>
        <ContactPageHero />
      </section>
    </Layout>
  );
}
