import { ColumnsSkyline, StairsLeft } from 'components/Hero/HeroGeometry';

import styles from './PageHero.module.css';

/* A short, reusable version of the homepage hero for interior pages:
   forest band, the four-square accent row, a centered display heading, and
   the hero's corner geometry at reduced scale. Deliberately NOT full
   height — this tops a page of content rather than being the page.

   Reusable by design: pages supply `lead` and `accent` (the two heading
   lines), an optional `eyebrow`, optional `children` rendered under the
   heading, and optional `actions` rendered as a centered row under the
   children. CSS Modules, not styled-components, because interior pages
   render client-side where styled-components ship no CSS (the known
   site-wide bug this feature works around throughout).

   The h1 lives here, so a page using PageHero must not render another. */
const PageHero = ({ lead, accent, eyebrow, actions, children }) => (
  <section className={styles.hero}>
    <div className={styles.decoTopLeft} aria-hidden="true">
      <StairsLeft />
    </div>
    <div className={styles.decoBottomRight} aria-hidden="true">
      <ColumnsSkyline />
    </div>
    <div className={styles.inner}>
      <div className={styles.squares} aria-hidden="true">
        <span className={styles.squareOrange} />
        <span className={styles.squareSky} />
        <span className={styles.squareOchre} />
        <span className={styles.squarePink} />
      </div>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h1 className={styles.heading}>
        {lead} <em>{accent}</em>
      </h1>
      {children}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  </section>
);

export default PageHero;
