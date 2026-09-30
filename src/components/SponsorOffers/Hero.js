import PageHero from 'components/PageHero';
import { my } from 'data/content.mjs';

import styles from './SponsorOffers.module.css';

const copy = my.promos;

/* /my/promos/'s hero: the site's interior hero, as /my/fest/ uses it. The
   eyebrow is a plain label; the way back to /my/ is under the list. */
const PromosHero = () => (
  <PageHero
    eyebrow={copy.eyebrow}
    lead={copy.heading.lead}
    accent={copy.heading.accent}
  >
    <p className={styles.intro}>{copy.intro}</p>
  </PageHero>
);

export default PromosHero;
