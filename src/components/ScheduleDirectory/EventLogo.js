import { useState } from 'react';

import { schedule } from 'data/content.mjs';

import styles from './ScheduleDirectory.module.css';

/* An event's logo, with somewhere to land when there isn't one.

   Three cases, and only the first is the happy one: the event has no logoUrl
   at all; it has one that 404s; or it loads. The middle case is the reason
   this is a component rather than an <img> inline — a broken image renders as
   the browser's torn-page icon, which looks like a bug in the page rather
   than a missing asset. The fixtures make it permanent (every logoUrl is on
   the reserved example.invalid domain, so none of them can ever resolve) and
   production will hit it too the first time a host's CDN moves a file.

   What a logo IS decides where it goes and what happens when it is absent:

     sponsor  a credit, to the right of the row. Absent or broken, it renders
              nothing — a credit slot filled with the host's initials would
              attribute a sponsorship to somebody who did not give one.
     name     the event's name as artwork, standing where the name would.
              Absent or broken, it falls back to the name as text, because its
              caller has already dropped the wordmark.

   Alt follows the same split. A sponsor is credited visually beside a name
   that is already printed, so in the row it takes an empty alt; a name logo
   has to carry the name itself. */

/* Logos are NOT square. Global Hack Week's is a 9.6:1 lockup with the event's
   name set into it; another event might supply a round mark, or a wordmark, or
   anything else a host has. So the slot constrains HEIGHT and lets width follow
   the image, capped so a very wide lockup cannot push the row's own text out.

   Height-capped rather than square, so a wide lockup and a round mark both
   render as themselves. */
const EventLogo = ({ event, size = 'ribbon' }) => {
  const [failed, setFailed] = useState(false);
  /* The credit's label waits for this. Printed synchronously, it stood over
     an empty slot for every sponsor image that was slow — and for every one
     that never resolved, until onError got around to firing (with a lazy
     image below the fold, possibly never). A credit is one unit: the label
     appears on the image's load event, with the mark it is crediting, or not
     at all. */
  const [loaded, setLoaded] = useState(false);

  const imgClass = size === 'card' ? styles.cardLogo : styles.ribbonLogo;

  if (!event.logoUrl || failed) {
    /* A name logo is rendered INSTEAD of the event's name, so its caller has
       already dropped the wordmark by the time this runs. It falls back to the
       name itself — the thing the image was carrying — because anything else
       would leave the event unnamed. */
    if (event.logoKind === 'name') {
      return <span className={styles.lockupFallback}>{event.name}</span>;
    }

    /* A sponsor slot with no sponsor is empty. It used to fall back to the
       host's initials, which was fine when this was a generic logo chip and is
       wrong now: a credit slot showing MLH for an event MLH did not sponsor
       misattributes it. Nothing is the honest answer. */
    return null;
  }

  /* No width/height attributes: they would declare an aspect ratio this does
     not know, and the CSS caps the height either way. */
  const image = (
    <img
      className={imgClass}
      src={event.logoUrl}
      alt={event.logoKind === 'name' ? event.name : ''}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
    />
  );

  if (event.logoKind === 'name') return image;

  /* A sponsor mark is a credit, and an unlabelled logo beside an event reads
     as "runs this" in most people's grammar — a misattribution the sponsor
     would not want either. A few characters of ink buy the attribution. */
  return (
    <span className={styles.credit}>
      {loaded && (
        <span className={styles.creditLabel}>{schedule.presentedByLabel}</span>
      )}
      {image}
    </span>
  );
};

export default EventLogo;
