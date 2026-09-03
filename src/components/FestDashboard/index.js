import HostResourcesBand from 'components/HostResourcesBand';
import { MyLoading } from 'components/MyStatus';
import PageHero from 'components/PageHero';
import { fests, my } from 'data/content.mjs';
import { countryCodeFor } from 'lib/countryFlag.mjs';
import { splitFestName } from 'lib/festName.mjs';
import {
  checkInsVisible,
  festEditUrl,
  festTimeRange,
  formatFestDate,
} from 'lib/fests.mjs';

import styles from './FestDashboard.module.css';

/* One host's Fest, in full.

   Every number here comes from MLH's own event record, mirrored by FestNet's
   five-minute sync: this page is a reader of MLH's counters, never a second
   source of truth for them.

   `now` is a prop rather than a Date.now() call inside the component so the
   day-of rule is decided in one place and the render stays pure.

   The page opens on the same PageHero every other interior page uses, so a
   Fest's own page belongs to the site rather than reading as an admin tool
   bolted to the side of it. The hero owns the h1; everything here is h2. */

/* One count, in the countdown's dress: sky ground, ink header bar, skyDeep
   hard shadow. One card per number rather than one card holding both -
   registrations stands alone for the whole of September, and a card built
   to hold a pair looks half-empty until the doors open. */
const CountCard = ({ id, title, value, caption }) => (
  <section className={styles.counter} aria-labelledby={`${id}-heading`}>
    <h2 className={styles.counterHead} id={`${id}-heading`}>
      {title}
    </h2>
    <div className={styles.counterBody}>
      <span className={styles.stat}>{value}</span>
      <span className={styles.statCaption}>{caption}</span>
    </div>
  </section>
);

/* The same padlock the host resources band uses for a locked row: filled,
   because stroked detail turns to mush at this size. */
const LockIcon = () => (
  <svg
    className={styles.lockIcon}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M7 10V8a5 5 0 0 1 10 0v2h1.5v11h-13V10H7zm2.5 0h5V8a2.5 2.5 0 0 0-5 0v2z"
      fill="currentColor"
    />
  </svg>
);

/* The count before there is one. Nobody checks in before the doors open, so
   the card stands there greyed and says when it will fill, rather than
   vanishing - a card that appears from nowhere on the morning of the Fest
   is a worse surprise than one that was always there waiting. It shows no
   number at all: a grey 0 still reads as a count, and as nobody came. */
const LockedCard = ({ id, title, body }) => (
  <section
    className={`${styles.counter} ${styles.counterLocked}`}
    aria-labelledby={`${id}-heading`}
  >
    <h2 className={styles.counterHead} id={`${id}-heading`}>
      {title}
    </h2>
    <p className={styles.counterLockedBody}>
      <LockIcon />
      {body}
    </p>
  </section>
);

const FestDashboard = ({ fest, dashboard, now }) => {
  const location = [fest.city, fest.country].filter(Boolean).join(', ');
  const date = formatFestDate(fest.date);
  const time = festTimeRange(fest);
  const flagCode = countryCodeFor(fest.country);
  const manageUrl = festEditUrl(fest);
  const viewUrl = fest.websiteUrl || fest.registrationUrl;
  const showCheckIns = checkInsVisible(fest, now);
  /* Null while the numbers are still in flight: the hero paints from the
     card /my already had, and only the counts below wait. Every read of
     `dashboard` past this point is guarded by it. */
  const shipped = Boolean(dashboard) && dashboard.trackingNumbers.length > 0;
  /* MLH welds the partner onto the event name - "… Toronto x SharkHacks3" -
     so the heading takes the Fest and the partner gets its own line, exactly
     as the public directory's cards and modal do. Putting the partner in the
     hero's accent instead would drop the "x" that joins them and read as a
     name in two halves. */
  const { title, hostedBy } = splitFestName(fest.name);

  return (
    <>
      <PageHero
        eyebrow={
          <>
            {flagCode && (
              <span
                className={`fi fis fi-${flagCode} ${styles.flag}`}
                aria-hidden="true"
              />
            )}
            {[location, date, time].filter(Boolean).join(' · ')}
          </>
        }
        lead={title || fest.name}
        actions={
          <>
            {/* Plain anchors in the Button dress rather than
                components/Button itself: that one is styled-components, and
                this page renders entirely in the browser, where
                styled-components ship no CSS - the same reason PageHero and
                MyStatus are CSS Modules. */}
            {/* Managing leads. A host opening their own Fest's page has come
                to run it, not to look at how it advertises - the public
                listing is the thing they check second. */}
            {manageUrl && (
              <a
                className={styles.action}
                href={manageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {my.dashboard.manageCta}
              </a>
            )}
            {viewUrl && (
              <a
                className={`${styles.action} ${styles.actionGhost}`}
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {my.dashboard.viewCta}
              </a>
            )}
          </>
        }
      >
        {hostedBy && <p>{`${fests.hostedBy} ${hostedBy}`}</p>}
      </PageHero>

      <div className={styles.root}>
        {/* The counts are the only part that needs the fetch. Standing the
            loader in for them - rather than for the whole page - is what
            makes arriving from /my feel like opening this Fest rather than
            loading a page. */}
        {!dashboard && <MyLoading inline />}

        {dashboard && (
          <div className={styles.cards}>
            <CountCard
              id="registrations"
              title={my.dashboard.registrations.title}
              value={dashboard.registrationsCount}
              caption={my.dashboard.registrations.label}
            />
            {/* The count arrives on the day of the Fest, in its own time
                zone, and stays afterwards so a past Fest keeps its final
                total. Before then the card is locked rather than absent. */}
            {showCheckIns ? (
              <CountCard
                id="check-ins"
                title={my.dashboard.checkIns.title}
                value={dashboard.checkInsCount}
                caption={my.dashboard.checkIns.label}
              />
            ) : (
              <LockedCard
                id="check-ins"
                title={my.dashboard.checkIns.title}
                body={my.dashboard.checkIns.locked}
              />
            )}
          </div>
        )}

        {dashboard && (
          <section className={styles.pack} aria-labelledby="pack-heading">
            <h2 className={styles.packTitle} id="pack-heading">
              {my.dashboard.pack.title}
            </h2>
            <div className={styles.packBody}>
              {/* Nothing has shipped for any Fest yet, so the not-shipped
                  state is the one that got designed. The shipped branch is
                  deliberately plain: it exists so that the day MLH's field
                  goes live and a real tracking number lands, this card cannot
                  go on telling a host that nothing has shipped while their
                  box is in transit. */}
              <p className={styles.packLine}>
                {shipped
                  ? my.dashboard.pack.shipped
                  : my.dashboard.pack.notShipped}
              </p>
              {shipped && (
                <>
                  <p className={styles.trackingLabel}>
                    {my.dashboard.pack.trackingLabel}
                  </p>
                  <ul className={styles.trackingList}>
                    {dashboard.trackingNumbers.map((number) => (
                      <li key={number} className={styles.trackingNumber}>
                        {number}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>
        )}
      </div>

      {/* The same band /my closes on. A Fest only has a page here once MLH
          has approved it, so the resources are never locked on this one. */}
      <HostResourcesBand approved closing />
    </>
  );
};

export default FestDashboard;
