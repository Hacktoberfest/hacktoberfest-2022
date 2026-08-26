import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';

import Close from 'components/icons/Close';
import { fests } from 'data/content.mjs';
import { basemapIsAvailable } from 'lib/basemapSource.mjs';
import { countryCodeFor } from 'lib/countryFlag.mjs';
import { festIsPast, festWeekday, formatFestDate } from 'lib/festDate.mjs';

import styles from './FestsDirectory.module.css';

const FestLocationMap = dynamic(() => import('./FestLocationMap'), {
  ssr: false,
  loading: () => <div className={styles.modalMapSkeleton} aria-hidden="true" />,
});

const copy = fests.modal;

/* One Fest, opened from its card or its map marker.

   Native <dialog> with showModal(), the same choice CheckInModal makes on
   /my and for the same reasons: the top layer (above the grain overlay's
   z-index 1000), focus trapping, Escape, and ::backdrop, none of it
   hand-rolled.

   It is mounted for the whole life of the directory and opened by effect,
   rather than mounted when a Fest is picked. That is what makes the exit
   animation possible: React removing the element on close would take it
   away before a single frame of the transition could run. `displayed` keeps
   the last Fest so the content does not blank out halfway through the
   fade — the dialog is still on screen for those milliseconds.

   The animation itself is entirely in the stylesheet (@starting-style and
   allow-discrete), so nothing here waits on it or knows how long it takes.
   That also permanently retires the problem the previous shape had: in
   Chrome 148 a <dialog> closed with .close() fires no `close` event, and
   an exit that had to wait for one would simply never finish.

   Four routes out still call onClose, any one of them enough:

     - the close button, calling it directly rather than via close();
     - `cancel`, which is Escape, prevented so the state change drives the
       close rather than trailing it;
     - a click on the backdrop, see isOutside below;
     - `close`, the backstop for a browser that closes the dialog without
       going through any of the above.

   onClose must therefore be idempotent, and the guard for that lives in
   the parent's closeFest. */
const FestModal = ({ fest, distanceKm, today, onClose }) => {
  const ref = useRef(null);
  /* The Fest on screen, which outlives the one selected: on close `fest`
     goes null immediately and this does not, so the dialog still has
     something to render while it fades. */
  /* The last Fest this modal showed, kept only so the content survives the
     exit. Not state, and not a mirror of `fest`: see the note on
     `displayed` below. */
  const lastFest = useRef(fest || null);
  /* Whether the press that began this click landed on the backdrop. A
     click whose mousedown was inside the modal is a drag that finished
     outside it — selecting the address and pulling the cursor past the
     edge is the everyday way to do that — and closing on it would throw
     away what someone was in the middle of reading. */
  const pressedOutside = useRef(false);
  /* Set while this component is the one closing the dialog, so the `close`
     event that follows can be told apart from one the browser originated.
     Load-bearing, and the bug it fixes was invisible in development:

       Close → onClose → closeFest → history.back() → popstate clears the
       selected Fest → the effect below calls dialog.close() → the browser
       fires `close` → onClose runs a SECOND time → and popstate has
       already reset closeFest's own guard, so the second call goes back
       again and leaves the site entirely.

     Chrome 148, which this was built against, fires no `close` event at
     all, so the second call never happened there and the whole path looked
     correct. Every browser that implements `close` properly hit it. */
  const selfClosing = useRef(false);

  useEffect(() => {
    if (fest) lastFest.current = fest;
  }, [fest]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (fest) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      selfClosing.current = true;
      dialog.close();
    }
  }, [fest]);

  /* What is on screen. Derived rather than held in state, and that is the
     whole of a bug worth remembering.

     It used to be a `displayed` state that an effect copied `fest` into. On the
     second open that copy lagged by a render: the click set `fest` to the
     new Fest, but `displayed` was still the previous one for that commit, and
     the effect that calls showModal() ran in the same commit — so the
     dialog opened on the old Fest's content and swapped a frame later.
     Only ever visible from the second open onwards, since the first has
     nothing stale to show.

     Reading `fest` directly cannot lag. The ref supplies a value only
     while `fest` is null, which is the exit, where holding the last one is
     the point. */
  const displayed = fest || lastFest.current;

  /* Light dismiss, hand-rolled rather than the platform's `closedby="any"`.
     That attribute closes the dialog itself and tells us only through the
     `close` event, which Chrome 148 does not fire — the modal would vanish
     while React and the URL still believed it was open.

     Two conditions, and both are load-bearing:

     `target === dialog` rules out anything that came from the content. On
     its own it is not enough, because `.modal` has no padding of its own
     while its children carry margins: the band above the address, and the
     gutters either side of the map, are the dialog's own box. Clicking the
     whitespace beside the map is not clicking outside the modal, but it
     does target the dialog element.

     So the geometry decides. A press whose coordinates fall outside the
     dialog's rect is the backdrop and nothing else, and a keyboard-driven
     click — which reports 0,0 and would otherwise read as "outside" — has
     already failed the target test by coming from a button. */
  const isOutside = (event) => {
    const dialog = ref.current;
    if (!dialog || event.target !== dialog) return false;

    const rect = dialog.getBoundingClientRect();
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );
  };

  const isPast = displayed ? festIsPast(displayed, today) : false;
  /* "Saturday, October 10". The weekday is the modal's to carry and not
     the card's: a grid of cards is scanned for where and roughly when,
     while someone reading one Fest is working out whether they are free
     that day — and a weekday answers that faster than a date does. */
  const date = displayed ? formatFestDate(displayed.date) : null;
  const weekday = displayed ? festWeekday(displayed.date) : null;
  const flagCode = displayed ? countryCodeFor(displayed.country) : null;
  const formatBlurb =
    displayed && displayed.format ? fests.formatBlurbs[displayed.format] : null;
  const canRegister = Boolean(
    displayed && displayed.registrationUrl && !festIsPast(displayed, today),
  );
  /* Coordinates AND a key to draw them with. Gating on the key here rather
     than inside the map is deliberate: hasCoords also decides whether the
     modal splits into two columns, so a build without a key would otherwise
     open a second column and leave it empty. Both halves of "can we show a
     map" have to be answered in the same place. */
  const hasCoords = Boolean(
    displayed &&
      typeof displayed.lat === 'number' &&
      typeof displayed.lng === 'number' &&
      basemapIsAvailable(),
  );

  /* Street lines first, then the line that carries city, state and postal
     code together, then the country. Each drops out when absent, which is
     most of them for most Fests: the live payload has events with no
     address at all. */
  /* Set apart only when line1 actually names a place — "Ministry of
     Startups", "iHub" — which is the part of an address someone
     recognises, searches for, or says out loud to a driver. When it is
     simply the street it stays in the run below with the rest of the
     address, because bolding "130 St George St" over a repeat of the city
     reads as a mistake. The seam decides; see lib/venueName.mjs. */
  const venue = displayed ? displayed.venue : null;

  const streetLines = displayed
    ? [
        venue ? null : displayed.addressLine1,
        displayed.addressLine2,
        displayed.addressLine3,
      ].filter(Boolean)
    : [];

  const cityLine = displayed
    ? [
        [displayed.city, displayed.state].filter(Boolean).join(', '),
        displayed.postalCode,
      ]
        .filter(Boolean)
        .join(' ')
    : '';

  /* One line, comma-joined. The stacked version was a postal address, and
     a postal address is for writing on an envelope — nobody is posting
     anything to a Fest. On screen it is one answer to "where", and it
     wraps on its own if it needs to. */
  const address = displayed
    ? [...streetLines, cityLine, displayed.country].filter(Boolean).join(', ')
    : '';

  return (
    <dialog
      ref={ref}
      className={styles.modal}
      /* Only a close this component did not ask for reaches onClose. One it
         did ask for is the tail of a close already in progress, and running
         it again would go back through history twice. */
      onClose={() => {
        if (selfClosing.current) {
          selfClosing.current = false;
          return;
        }
        onClose();
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onMouseDown={(event) => {
        pressedOutside.current = isOutside(event);
      }}
      onClick={(event) => {
        if (pressedOutside.current && isOutside(event)) onClose();
        pressedOutside.current = false;
      }}
      data-past={isPast ? 'true' : undefined}
      data-format={(displayed && displayed.format) || undefined}
      aria-labelledby="fest-modal-heading"
    >
      {/* Empty until a Fest has been picked. The <dialog> itself must be in
          the DOM from the start, because the effect above needs a ref to it
          in order to open it at all. */}
      {displayed && (
        <>
          <div className={styles.modalHeader}>
            {/* The flag takes the slot the Fest's logo used to hold. Two
                reasons it is the better tenant: the logo is decorative and
                often absent, and an <img> whose src never resolves paints
                the browser's broken-image glyph even with alt="" — which
                is what this slot was actually showing for every Fest whose
                logo 404s. The flag is the same identity signal the card
                carries, and it either resolves or renders nothing. */}
            {/* Flag and text together in their own row, so the flag can
                stretch to the height of the words beside it and nothing
                else. Stretching it against the whole header would measure
                it against the close button too. */}
            <div className={styles.modalIdentity}>
              {flagCode && (
                <span
                  className={`fi fis fi-${flagCode} ${styles.modalFlag}`}
                  aria-hidden="true"
                />
              )}
              <div className={styles.modalHeaderText}>
                {/* No badges here at all. The format is already spelled out
                    in the full name this modal shows, and "Past" is
                    carried by the whole modal greying out and by a date
                    that has been and gone. A screen reader gets neither of
                    those, so the word survives for it alone. */}
                {isPast && (
                  <span className={styles.visuallyHidden}>
                    {fests.pastBadge}
                  </span>
                )}
                <h2 id="fest-modal-heading" className={styles.modalHeading}>
                  {displayed.name}
                </h2>
                {displayed.hostedBy && (
                  <p className={styles.modalHost}>
                    {fests.hostedBy} {displayed.hostedBy}
                  </p>
                )}
              </div>
            </div>
            {/* The glyph is the nav's own Close icon and is aria-hidden, so
                the button carries the word as its accessible name. */}
            <button
              type="button"
              className={styles.modalClose}
              aria-label={copy.close}
              onClick={onClose}
            >
              <Close />
            </button>
          </div>

          {/* Two columns once there is a map to put beside the words, and
              one when there is not: half a modal of text with an empty
              half beside it is worse than a narrow modal. The attribute
              rather than a class so the stylesheet decides at which width
              width the split is worth having; below that it stacks. */}
          <div
            className={styles.modalBody}
            data-columns={hasCoords ? 'two' : undefined}
          >
            {/* Left: what and when, and the one thing to do about it. The
                action lives at the foot of this column rather than
                spanning both, because a row that spans sits under the
                TALLER column — which was the map — and that left the
                button stranded in an empty quadrant. */}
            <div className={styles.modalDetails}>
              {(date || displayed.time) && (
                <p className={styles.modalDate}>
                  {weekday && date ? `${weekday}, ${date}` : date}
                  {displayed.time && (
                    <span>
                      {date && ' \u00b7 '}
                      {displayed.time}
                    </span>
                  )}
                </p>
              )}

              {/* What this kind of Fest is, for someone deciding whether to
                  go. Absent when the name claims neither format — better
                  nothing than a description of the wrong thing. */}
              {formatBlurb && (
                <p className={styles.modalBlurb}>{formatBlurb}</p>
              )}

              {typeof distanceKm === 'number' && (
                <p className={styles.modalMeta}>
                  {Math.round(distanceKm)} {fests.distanceUnit}
                </p>
              )}
            </div>

            {/* Right: where. Runs to the modal's own edges with a single
                rule dividing it from the body, the way every band on this
                site separates itself. */}
            <div className={styles.modalPlace}>
              {/* Only when there are coordinates to place. The live API
                  sends none today, so in production this is absent, the
                  modal is a single column, and the address below is the
                  whole answer to "where" — no empty box, no "map
                  unavailable" apologising for data we never had. */}
              {hasCoords && (
                <FestLocationMap
                  /* Deliberately NOT keyed. A key here would tear the map
                     down and stand a new one up for every Fest opened,
                     refetching every tile it draws — and tiles are what
                     the basemap is metered on. It moves itself instead. */
                  lat={displayed.lat}
                  lng={displayed.lng}
                  /* The tint moved out of the stylesheet and into the
                     map's own styling when the provider changed, so the
                     format has to travel with it now. */
                  format={displayed.format}
                  isPast={isPast}
                />
              )}

              {(venue || address) && (
                <div className={styles.modalAddressBlock}>
                  {/* line1 promoted out of the comma run: it is usually a
                      venue someone can recognise or search for, and it was
                      the most useful token in the string. */}
                  {venue && <p className={styles.modalVenue}>{venue}</p>}
                  {address && <p className={styles.modalAddress}>{address}</p>}
                </div>
              )}
            </div>

            {/* Its own band, but only as wide as the column it closes. The
                where-panel beside it spans both rows, so the rule runs from
                the modal's edge to the panel's and stops — the action
                belongs to the reading column, not to the map.

                Register, and only Register. There is no Fest website to
                send anyone to: every Fest lives on MLH's own event page and
                the registration link is that page's front door. A past Fest
                has nothing to register for, so the band is absent rather
                than empty. */}
            {canRegister && (
              <div className={styles.modalActions}>
                <a
                  className={styles.modalPrimaryAction}
                  href={displayed.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {fests.registerCta}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </dialog>
  );
};

export default FestModal;
