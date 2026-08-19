import { my } from 'data/content.mjs';

import styles from './WhyHostBand.module.css';

/* The band that closes /my during Preptember, right above the footer,
   making the case for hosting a Fest. Full-bleed sky chapter with a white
   callout box on it, photo on desktop, one CTA to /host/.

   Built as a CSS Module rather than styled-components: on /my, which
   exports in its loading state and renders this band only after the
   client-side fetch, styled-components CSS is never emitted, so the band
   would reach production unstyled. The no-styled-components guard in
   my-pages.test.mjs is what keeps this from regressing. */
const WhyHostBand = () => (
  <section className={styles.root} aria-labelledby="why-host-title">
    <div className={styles.box}>
      <div>
        <h2 id="why-host-title" className={styles.title}>
          {my.whyHost.title}
        </h2>
        {/* An ol, because the numbers are visible — but they're rendered
           as text (01–05, aria-hidden) rather than list markers, so the
           mono-orange treatment doesn't depend on ::marker support and
           screen readers aren't told "1" twice. */}
        <ol className={styles.perks}>
          {my.whyHost.perks.map((perk, index) => (
            <li key={perk} className={styles.perk}>
              <span className={styles.perkNumber} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              {perk}
            </li>
          ))}
        </ol>
        <a className={styles.cta} href="/host/">
          {my.whyHost.cta}
        </a>
      </div>
      <img
        className={styles.photo}
        src="/fests-why-host.jpg"
        alt={my.whyHost.photoAlt}
        loading="lazy"
        width="640"
        height="427"
      />
    </div>
  </section>
);

export default WhyHostBand;
