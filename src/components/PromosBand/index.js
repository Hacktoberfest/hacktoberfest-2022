import { my } from 'data/content.mjs';

import styles from './PromosBand.module.css';

const copy = my.promosBand;

/* "Your codes and offers.": the last band on /my, for everyone, and the
   page's one way to /my/promos/. Heading and lede as every band has, then
   one real card across the band's width, as the panels above it are, with
   the site's button in it (hf-button, --small inside a card, as the
   milestones panel's "Add address" is). It closes the page, so it carries
   the bottom room the bands above leave to it. */
const PromosBand = () => (
  <section className={styles.band} aria-labelledby="promos-heading">
    <h2 id="promos-heading" className={styles.heading}>
      {copy.heading.lead} <em>{copy.heading.accent}</em>
    </h2>
    <p className={styles.lede}>{copy.lede}</p>
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{copy.card.title}</h3>
        <p className={styles.cardText}>{copy.card.body}</p>
      </div>
      <a className="hf-button hf-button--small" href={copy.card.href}>
        {copy.card.cta}
      </a>
    </div>
  </section>
);

export default PromosBand;
