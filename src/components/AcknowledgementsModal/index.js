import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { my } from 'data/content.mjs';
import { acknowledgeFest } from 'lib/acknowledgements.mjs';

import styles from './AcknowledgementsModal.module.css';

/* Client-only, same as the /fests directory map: Leaflet touches window
   at import time, which the static export's build pass does not have. */
const VenueMap = dynamic(() => import('./VenueMap'), {
  ssr: false,
  loading: () => <div className={styles.mapSkeleton} aria-hidden="true" />,
});

/* Which slide renders the venue check - the statement that asks the host
   to compare the address and the pin, so that slide has to show both. */
const VENUE_SLIDE = 1;

/* The final acknowledgements - /my's first overlay, in the same brand
   dress as the /fests check-in modal: ink border, maroon hard shadow,
   press-in opening.

   Native <dialog> on purpose, matching that modal's reasoning: showModal()
   gives the top layer (above the grain overlay), focus trapping, Escape,
   and ::backdrop without a hand-rolled trap. The dialog's close event is
   the single exit path - Escape, "Not yet", the backdrop, and a confirmed
   submission all funnel through onClose, which is where the caller hands
   focus back to the card button.

   One statement per slide: each acknowledgement gets the host's full
   attention, and Next refuses to advance until its box is ticked - so
   reaching Confirm IS having agreed to all three. Back re-opens an
   earlier slide with its tick kept; nothing is submitted until the last
   slide's Confirm. The endpoint is idempotent first-write-wins, so a
   double confirm is safe. */
const AcknowledgementsModal = ({ fest, onClose, onAcknowledged }) => {
  const statements = my.acknowledgements.statements;
  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState(() => statements.map(() => false));
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const toggle = () => {
    setChecked((current) =>
      current.map((value, i) => (i === step ? !value : value)),
    );
    setError(null);
  };

  const next = async () => {
    if (!checked[step]) {
      setError(my.acknowledgements.incomplete);
      return;
    }
    if (step < statements.length - 1) {
      setStep(step + 1);
      setError(null);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await acknowledgeFest(fest.id);
      onAcknowledged(fest.id, result.acknowledgedAt);
      dialogRef.current?.close();
    } catch {
      setSubmitting(false);
      setError(my.acknowledgements.failure);
    }
  };

  const back = () => {
    setStep(step - 1);
    setError(null);
  };

  const last = step === statements.length - 1;

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      onClose={onClose}
      /* A click that lands on the dialog element itself landed on the
         backdrop - the padded box catches clicks on the content. */
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      aria-labelledby="acknowledgements-title"
    >
      <h3 id="acknowledgements-title" className={styles.heading}>
        {my.acknowledgements.title}
      </h3>
      <p className={styles.intro}>{my.acknowledgements.intro(fest.name)}</p>
      <p className={styles.progress} aria-live="polite">
        {my.acknowledgements.progress(step + 1, statements.length)}
      </p>
      {step === VENUE_SLIDE && (
        <div className={styles.venue}>
          <p className={styles.venueLede}>
            {my.acknowledgements.venueCheck.intro}{' '}
            {my.acknowledgements.venueCheck.wrongLead}
            <a
              className={styles.venueEmail}
              href={`mailto:${my.acknowledgements.venueCheck.wrongEmail}`}
            >
              {my.acknowledgements.venueCheck.wrongEmail}
            </a>
            {my.acknowledgements.venueCheck.wrongTail}
          </p>
          {fest.venueAddress && (
            <p className={styles.venueAddress}>{fest.venueAddress}</p>
          )}
          {typeof fest.latitude === 'number' &&
          typeof fest.longitude === 'number' ? (
            <div className={styles.mapWrapper}>
              <VenueMap latitude={fest.latitude} longitude={fest.longitude} />
            </div>
          ) : (
            <p className={styles.venueNoPin}>{my.acknowledgements.noPin}</p>
          )}
        </div>
      )}
      {/* Keyed by step so a slide change remounts the label - screen
          readers re-announce the new statement rather than watching text
          mutate inside one node. */}
      <label key={step} className={styles.statement}>
        <input type="checkbox" checked={checked[step]} onChange={toggle} />
        <span>{statements[step]}</span>
      </label>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.confirm}
          onClick={next}
          disabled={submitting}
        >
          {last ? my.acknowledgements.confirm : my.acknowledgements.next}
        </button>
        {step > 0 ? (
          <button type="button" className={styles.cancel} onClick={back}>
            {my.acknowledgements.back}
          </button>
        ) : (
          <button
            type="button"
            className={styles.cancel}
            onClick={() => dialogRef.current?.close()}
          >
            {my.acknowledgements.cancel}
          </button>
        )}
      </div>
    </dialog>
  );
};

export default AcknowledgementsModal;
