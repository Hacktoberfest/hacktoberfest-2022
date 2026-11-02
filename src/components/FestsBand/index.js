import { my } from 'data/content.mjs';
import { calendarFests, festDidNotAttend, festIsPast } from 'lib/fests.mjs';

import FestCard from './FestCard';
import styles from './FestsBand.module.css';

/* My Fests: the one place a Fest appears on this page.

   One flat grid in plain date order — no role grouping and no group
   headings: every card's own badge (FestCard's badgeFor) already says
   "Registered" / "Checked in" / "Hosting", so the list reads as a
   chronology. Events only (lib/fests.mjs calendarFests): a hosted Fest
   sits beside the ones to attend, but an application is not a Fest yet
   and lives on the hosting hub. `past` exists only to past-tense the
   organizing badge; participation badges come from status alone.

   "today" is computed here, at the presentation edge, and handed to the
   pure date check — new Date() appears nowhere in lib/.

   After October the band looks back: the Fests this person went to,
   registered for or hosted, and nothing to sign up for. With none, it is
   not drawn at all, rather than a heading over an empty grid. */
const FestsBand = ({ experience }) => {
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const fests = calendarFests(experience.fests).map((fest) => ({
    fest,
    past: festIsPast(fest, todayIso),
    didNotAttend: festDidNotAttend(fest, now.getTime()),
  }));
  if (fests.length === 0) return null;

  return (
    <section className={styles.band} aria-labelledby="fests-heading">
      <h2 id="fests-heading" className={styles.heading}>
        {my.fests.heading.lead} <em>{my.fests.heading.accent}</em>
      </h2>
      <p className={styles.lede}>{my.fests.lede}</p>

      <div className={styles.grid}>
        {fests.map(({ fest, past, didNotAttend }) => (
          <FestCard
            key={fest.id}
            fest={fest}
            past={past}
            didNotAttend={didNotAttend}
          />
        ))}
      </div>
    </section>
  );
};

export default FestsBand;
