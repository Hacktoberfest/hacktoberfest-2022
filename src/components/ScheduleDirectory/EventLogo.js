import { useState } from 'react';

import styles from './ScheduleDirectory.module.css';

/* An event's name logo: the event's own name as artwork, standing where the
   name would. Global Hack Week's lockup is the one production has.

   Absent or broken, it falls back to the name as text, because its caller has
   already dropped the wordmark and anything else would leave the event
   unnamed. That is the reason this is a component rather than an <img>
   inline: a broken image renders as the browser's torn-page icon, which looks
   like a bug in the page rather than a missing asset.

   Sponsor logos are not drawn, for now. Every one production sent was the
   event's own generic MLH image, so a "Presented by" credit over it credited
   nobody. lib/schedule.mjs still reads logoKind, so a real credit can return
   without an API change. */

/* Logos are NOT square. Global Hack Week's is a 9.6:1 lockup with the event's
   name set into it, so the slot constrains HEIGHT and lets width follow the
   image, capped so a very wide lockup cannot push the row's own text out. */
const EventLogo = ({ event, size = 'ribbon' }) => {
  const [failed, setFailed] = useState(false);

  if (event.logoKind !== 'name') return null;

  if (!event.logoUrl || failed) {
    return <span className={styles.lockupFallback}>{event.name}</span>;
  }

  /* No width/height attributes: they would declare an aspect ratio this does
     not know, and the CSS caps the height either way. */
  return (
    <img
      className={size === 'card' ? styles.cardLogo : styles.ribbonLogo}
      src={event.logoUrl}
      alt={event.name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

export default EventLogo;
