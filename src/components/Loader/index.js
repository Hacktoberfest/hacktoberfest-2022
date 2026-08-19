import styles from './Loader.module.css';

/* The whole-page loading surface: the brand mark reduced to its four
   colours, a row of touching squares on the forest ground, animated as a
   wave. Shared by /my (waiting on getExperience) and /auth/callback/'s
   working state (spending the sign-in code), so arriving through sign-in
   is one continuous loader until the hub's data lands.

   `inline` is the same wave without the screen: /my keeps rendering once
   the profile half of its split fetch lands, so the loader stops being
   the page and becomes the stand-in for the bands below the welcome
   hero. There it sits in the page's own paper column — the full-bleed
   forest and the viewport-tall column belong to the whole-page state,
   and mid-page they read as a green slab bolted under the hero.

   The squares are decorative; `label` is the state for screen readers,
   aria-live and visually hidden. A CSS Module for the same reason as the
   rest of the /my feature: both callers render this after client-side
   work, where extracted styled-components CSS may not exist. */
const Loader = ({ label, inline = false }) => (
  <section
    className={inline ? `${styles.loading} ${styles.inline}` : styles.loading}
  >
    <div
      className={
        inline
          ? `${styles.loadingInner} ${styles.inlineInner}`
          : styles.loadingInner
      }
    >
      <p className={styles.visuallyHidden} aria-live="polite">
        {label}
      </p>
      <div className={styles.boxes} aria-hidden="true">
        <span className={`${styles.box} ${styles.boxOrange}`} />
        <span className={`${styles.box} ${styles.boxSky}`} />
        <span className={`${styles.box} ${styles.boxOchre}`} />
        <span className={`${styles.box} ${styles.boxPink}`} />
      </div>
    </div>
  </section>
);

export default Loader;
