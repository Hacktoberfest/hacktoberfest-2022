import { my } from 'data/content.mjs';
import { FIND_A_FEST_URL } from 'data/links';
import { festDidNotAttend, festIsPast, sortFestsByDate } from 'lib/fests.mjs';

import FestCard from './FestCard';
import styles from './FestsBand.module.css';

/* My Fests: the one place a Fest appears on this page.

   One flat grid in plain date order — no role grouping and no group
   headings: every card's own badge (FestCard's badgeFor) already says
   "Registered" / "Checked in" / "Hosting", so the list reads as a
   chronology. `past` exists only to past-tense the organizing badge;
   participation badges come from status alone.

   "today" is computed here, at the presentation edge, and handed to the
   pure date check — new Date() appears nowhere in lib/. */
const FestsBand = ({ experience }) => {
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const fests = sortFestsByDate(experience.fests).map((fest) => ({
    fest,
    past: festIsPast(fest, todayIso),
    didNotAttend: festDidNotAttend(fest, now.getTime()),
  }));
  const hasFests = fests.length > 0;
  /* An organizer needs no host pitch at all, so the ghost card goes away;
     anyone else with a Fest on their list found one, so it drops its "No
     Fest near you" opener. */
  const organizing = fests.some(({ fest }) => fest.role === 'organizing');
  const hostGhostBody = hasFests
    ? my.fests.hostGhost.bodyRegistered
    : my.fests.hostGhost.body;
  const findGhost = hasFests ? my.fests.findGhostMore : my.fests.findGhost;

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
        {/* The find ghost always closes the grid — one Fest was never
           the ceiling. First-Fest voice for an empty list, another-Fest
           voice under real cards. It carries the grid's one find CTA;
           the pink button that used to sit under the grid retired with
           its arrival. */}
        <div className={styles.ghostCard}>
          <div className={styles.ghostContent}>
            <h3 className={styles.ghostTitle}>{findGhost.title}</h3>
            <p className={styles.ghostBody}>{findGhost.body}</p>
          </div>
          <a className={styles.ghostAction} href={FIND_A_FEST_URL}>
            {findGhost.cta}
            <span aria-hidden="true">→</span>
          </a>
        </div>
        {!organizing && (
          <div className={styles.ghostCard}>
            <div className={styles.ghostContent}>
              <h3 className={styles.ghostTitle}>{my.fests.hostGhost.title}</h3>
              <p className={styles.ghostBody}>{hostGhostBody}</p>
            </div>
            <a className={styles.ghostAction} href="/host/">
              {my.fests.hostGhost.cta}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default FestsBand;
