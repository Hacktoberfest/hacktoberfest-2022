import { useEffect, useRef } from 'react';

import Close from 'components/icons/Close';
import { schedule } from 'data/content.mjs';
import {
  formatClock,
  formatDay,
  formatTimeRange,
  isOnAir,
} from 'lib/schedule.mjs';
import { scheduleType } from 'lib/scheduleTypes.mjs';

import EventLogo from './EventLogo';
import styles from './ScheduleDirectory.module.css';

const copy = schedule.modal;

/* One event in full, opened from a calendar bar or a list card.

   Native <dialog> with showModal(), the same choice FestModal and /my's
   CheckInModal make, and for the same reasons: the top layer, focus
   trapping, Escape and ::backdrop all come for free and none of it has to be
   hand-rolled.

   Deliberately simpler than FestModal. That one carries history entries and
   an exit animation because a Fest is a shareable destination with a URL; an
   event here is a detail popover, so it mounts with the directory and closes
   without ceremony.

   Three routes out, any one enough — the close button, `cancel` (Escape), and
   a backdrop click — so onClose has to be idempotent. The parent's guard is
   what makes it so. */
const EventModal = ({ event, timeZone, onClose, now }) => {
  const ref = useRef(null);
  /* The last event shown, so the dialog still has something to render on the
     frame where `event` has gone null but the element has not yet closed. */
  const shown = useRef(event || null);
  if (event) shown.current = event;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (event && !dialog.open) dialog.showModal();
    if (!event && dialog.open) dialog.close();
  }, [event]);

  const current = event || shown.current;
  if (!current) return null;

  const type = scheduleType(current.type);
  const time = formatTimeRange(current, timeZone);
  /* The same judgement the row made, on the same clock, so a row reading
     ON AIR can never open into a modal that shrugs. No resting STREAM chip
     here — the type badge above already says Livestream, and saying it twice
     in one dialog is the noise the stream's rows were spared. */
  const onAir = current.type === 'livestream' && isOnAir(current, now);
  /* A lockup is white-on-transparent as often as not, so it needs a ground of
     its own — on the modal's paper it would simply be invisible. It gets a band
     in the event's own type colour, which is the same ground the feature header
     already gives it. */
  const hasNameLogo = current.logoKind === 'name';

  return (
    <dialog
      ref={ref}
      className={styles.modal}
      /* The opened event's own accent, so the modal and the row it came out of
         cast the same shadow. */
      style={{
        '--accent': type.shadow,
        '--type-color': type.color,
        '--type-tint': type.tint,
      }}
      onCancel={(e) => {
        /* Prevented so the state change drives the close rather than
           trailing it, which keeps the two from fighting. */
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className={styles.modalInner}>
        <button
          type="button"
          className={styles.modalClose}
          onClick={onClose}
          aria-label={copy.close}
        >
          <Close />
        </button>

        <div
          className={styles.modalHead}
          data-lockup={hasNameLogo ? 'true' : undefined}
        >
          {/* A name logo is the event's own name as artwork; a sponsor mark
              goes through EventLogo, which is where the credit grammar lives:
              the "Presented by" label appears with a mark that actually
              loaded, or the whole credit renders nothing. A bare sponsor
              logo at the head of the dialog read as "runs this" — the exact
              misattribution the rows' label exists to prevent, with Hosted by
              naming someone else two lines down. */}
          {hasNameLogo ? (
            current.logoUrl && (
              <img
                className={styles.modalLockup}
                src={current.logoUrl}
                alt=""
              />
            )
          ) : (
            <EventLogo event={current} size="card" />
          )}
          <div>
            {/* Suppressed when the name already contains the label — a
                CHALLENGE chip beside "The DEV Challenge" says it twice. Unlike
                the stream, the default kind keeps its badge here: the modal is
                the detail view, and detail is its job. */}
            {!current.name.toLowerCase().includes(type.label.toLowerCase()) && (
              <span className={styles.typeBadge}>{type.label}</span>
            )}
            {/* The heading stays whatever the lockup does: a dialog needs one,
                and hiding it visually is not the same as removing it. The
                lockup takes alt="" here precisely because this is still
                present — unlike the feature header, where it replaces the
                wordmark and has to carry the name itself. */}
            <h2
              className={
                hasNameLogo
                  ? `${styles.modalTitle} ${styles.srOnly}`
                  : styles.modalTitle
              }
            >
              {current.name}
              {current.roundNumber
                ? ` · ${schedule.roundLabel} ${current.roundNumber}`
                : ''}
            </h2>
          </div>
        </div>

        <dl className={styles.modalFacts}>
          {/* A round's WHEN is a window, so it gets the same two-line ledger
              its ticket carries — both cards open this dialog, and it has to
              answer for both ends. "All day" was the old answer, and for a
              week-long window it answered nothing. */}
          {current.kind === 'round' ? (
            <>
              <div>
                <dt>{schedule.roundLedger.opens}</dt>
                <dd>
                  {formatDay(current.startDate)}
                  {!current.allDay && formatClock(current.startsAt, timeZone)
                    ? `, ${formatClock(current.startsAt, timeZone)}`
                    : ''}
                </dd>
              </div>
              <div>
                <dt>{schedule.roundLedger.closes}</dt>
                <dd>
                  {formatDay(current.endDate)}
                  {!current.allDay && formatClock(current.endsAt, timeZone)
                    ? `, ${formatClock(current.endsAt, timeZone)}`
                    : ''}
                </dd>
              </div>
            </>
          ) : (
            <div>
              <dt>{current.multiDay ? schedule.multiDayLabel : 'When'}</dt>
              <dd className={styles.modalWhen}>
                {onAir && (
                  <span className={styles.streamChip} data-onair="true">
                    {schedule.onAirChip}
                  </span>
                )}
                {current.allDay ? schedule.allDayLabel : time}
              </dd>
            </div>
          )}
          {current.host && (
            <div>
              <dt>{copy.hostedBy}</dt>
              <dd>{current.host}</dd>
            </div>
          )}
        </dl>

        {/* Host-authored free text, rendered as text and never as HTML —
            the same stance FestModal takes with a Fest's description. */}
        {current.description && (
          <p className={styles.modalCopy}>{current.description}</p>
        )}

        {/* Absent on some events. A dead button is worse than none, so the
            link simply does not render rather than pointing nowhere. */}
        {current.url && (
          <a
            className={styles.modalCta}
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.cta}
          </a>
        )}
      </div>
    </dialog>
  );
};

export default EventModal;
