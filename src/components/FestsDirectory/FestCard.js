import { fests } from 'data/content.mjs';
import { countryCodeFor } from 'lib/countryFlag.mjs';
import { festDateParts, festIsPast } from 'lib/festDate.mjs';
import { shortFestName } from 'lib/festName.mjs';

import styles from './FestsDirectory.module.css';

/* One Fest, as a card in the directory grid.

   No links, and that is the point of its current shape: Register used to
   sit in a footer bar here, and it now lives only in the modal. With the
   card's last link gone, the whole card is one target and the stretched
   trigger below has nothing to compete with — the z-index that used to
   keep the action bar clickable above it went with the bar.

   Unlike the personalized version of this card on /my (progress-page's
   FestCard), there's no role badge here — this is a public directory, not
   a signed-in participant's own list.

   `today` rather than a computed `isPast` flag: the parent needs the same
   answer to group the list, and passing the date both halves reason from
   keeps them from ever disagreeing about which side of it a Fest sits. */
const FestCard = ({ fest, distanceKm, today, onOpen }) => {
  const isPast = festIsPast(fest, today);
  const formatLabel = fest.format ? fests.formatBadges[fest.format] : null;
  /* Three pieces for the tile, or nothing. A tile with a day and no month
     is worse than no tile at all, so an unusable date collapses it. */
  const dateParts = festDateParts(fest.date);
  /* The API's online event has no address at all, so the location line
     can vanish entirely — same as /my's card. State is absent for most
     non-US/CA venues and simply drops out of the join. */
  /* The heading, shortened — see lib/festName.mjs. The modal keeps the
     full name. */
  const title = shortFestName(fest.name);

  /* The city drops out of this line when the heading is already saying it,
     which is the usual case ("Brooklyn" over "Brooklyn, New York"). Only
     when it genuinely matches, though: the name is MLH's and the city is
     the address's, and a Fest named for a neighbourhood or a region would
     otherwise lose the city entirely. */
  const cityIsHeading =
    typeof fest.city === 'string' &&
    typeof title === 'string' &&
    fest.city.trim().toLowerCase() === title.trim().toLowerCase();

  const location = [cityIsHeading ? null : fest.city, fest.state, fest.country]
    .filter(Boolean)
    .join(', ');
  /* Unrecognized country name -> no flag, never a wrong one. aria-hidden:
     the country is already read out as part of the location text. */
  const flagCode = countryCodeFor(fest.country);

  return (
    /* Attributes rather than extra class names: each one drives a whole
       block of rules in the stylesheet, so a state's look is defined in one
       place instead of scattered across the card's parts. Together they
       resolve --fest-accent, which is the card's shadow and its badge. */
    <article
      className={styles.card}
      data-past={isPast ? 'true' : undefined}
      data-format={fest.format || undefined}
    >
      <div className={styles.cardBody}>
        {/* No visible "Past" badge. The card already says so three ways —
            it sorts to the bottom, its whole treatment greys out, and its
            date has been and gone — so the badge was a fourth telling.

            Kept for screen readers, which get none of those three: the
            sort order is not announced, grey is not announced, and a date
            with no year does not say whether it has passed. */}
        {isPast && (
          <span className={styles.visuallyHidden}>{fests.pastBadge}</span>
        )}
        {/* The heading holds the trigger, and the trigger's ::after is
            stretched over the whole card body — so the mouse target is the
            card while the semantics stay "a heading containing one
            control". Wrapping the whole card in a <button> would be
            simpler now that nothing else here is interactive, but a button
            may only contain phrasing content and this heading is not. */}
        <div className={styles.cardHeadingRow}>
          <h3 className={styles.cardTitle}>
            <button
              type="button"
              className={styles.cardTrigger}
              onClick={() => onOpen(fest)}
            >
              {title}
            </button>
          </h3>
          {/* Beside the name rather than above it: which format a Fest is
              belongs to the Fest the way the city does. Outside the <h3>
              so the trigger's accessible name stays the place alone. */}
          {formatLabel && (
            <span className={styles.cardFormatBadge} data-format={fest.format}>
              {formatLabel}
            </span>
          )}
        </div>
        {/* The flag sits with the country now rather than in the opposite
            corner from it. They are one fact and were being shown twice,
            diagonally apart. aria-hidden because the country is right
            there in words. */}
        {(location || typeof distanceKm === 'number') && (
          <p className={styles.cardMeta}>
            {flagCode && (
              <span
                className={`fi fis fi-${flagCode} ${styles.cardFlag}`}
                aria-hidden="true"
              />
            )}
            <span>
              {location}
              {typeof distanceKm === 'number' && (
                <span className={styles.cardDistance}>
                  {location && ' · '}
                  {Math.round(distanceKm)} {fests.distanceUnit}
                </span>
              )}
            </span>
          </p>
        )}
        {/* Last and quietest: the least-consulted fact on the card. */}
        {fest.hostedBy && (
          <p className={styles.cardHost}>
            {fests.hostedBy} {fest.hostedBy}
          </p>
        )}
      </div>

      {/* The date, as an object rather than a line of text, in the half of
          the card that was empty. Where and when now sit side by side,
          which is the pair a directory is scanned by — the date used to be
          the third of four stacked lines.

          The tile is one string to a screen reader, not three: "Sat 10
          Oct" read as separate elements is three announcements for one
          fact. */}
      {dateParts && (
        <p
          className={styles.cardDateTile}
          aria-label={`${dateParts.weekday} ${dateParts.day} ${dateParts.month}`}
        >
          <span className={styles.cardTileWeekday} aria-hidden="true">
            {dateParts.weekday}
          </span>
          <span className={styles.cardTileDay} aria-hidden="true">
            {dateParts.day}
          </span>
          <span className={styles.cardTileMonth} aria-hidden="true">
            {dateParts.month}
          </span>
        </p>
      )}
    </article>
  );
};

export default FestCard;
