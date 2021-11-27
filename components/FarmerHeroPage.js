import { Typography } from '@material-ui/core';
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
              MEET OUR FARMERS
            </Typography>
            <Typography component="h1" variant="h1">
              Know Where Your Food Comes From
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}
