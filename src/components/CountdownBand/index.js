import { useEffect, useState } from 'react';

import { my } from 'data/content.mjs';
import { HACKTOBERFEST_START } from 'data/preptember.mjs';
import { countdownParts } from 'lib/countdown.mjs';

import styles from './CountdownBand.module.css';

/* Hours, minutes and seconds hold two digits so the card never changes
   shape mid-tick; days stays unpadded — "045" reads like an error. */
const pad = (value) => String(value).padStart(2, '0');

/* The Preptember band: a live countdown to October 1st, rendered in place
   of the progress and activities bands while data/preptember.mjs keeps the
   flag on. All arithmetic lives in lib/countdown.mjs where it is unit
   tested — this component only owns the clock.

   Ticking is client-only by construction: the page renders this band after
   the experience fetch lands, never during the static export, so there is
   no server markup to mismatch.

   role="timer" and nothing more, deliberately: a timer's implicit
   aria-live is off, so screen readers can find and read the countdown
   without being interrupted by sixty announcements a minute. */
const CountdownBand = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const parts = countdownParts(HACKTOBERFEST_START, now);

  const units = [
    { key: 'days', value: String(parts.days) },
    { key: 'hours', value: pad(parts.hours) },
    { key: 'minutes', value: pad(parts.minutes) },
    { key: 'seconds', value: pad(parts.seconds) },
  ];

  return (
    <section className={styles.band} aria-labelledby="countdown-heading">
      {/* The heading is the card's header bar — a full-width ink strip
         across the top, so the title is part of the card's frame rather
         than a line placed inside it. Still the section's h2, so the
         page outline keeps a landmark for the band. */}
      <div className={styles.card} role="timer">
        <h2 id="countdown-heading" className={styles.header}>
          {my.countdown.title}
        </h2>
        <div className={styles.units}>
          {units.map(({ key, value }) => (
            <div key={key} className={styles.unit}>
              <span className={styles.value}>{value}</span>
              <span className={styles.label}>{my.countdown.labels[key]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountdownBand;
