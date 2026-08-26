import { useEffect, useRef, useState } from 'react';

import { my } from 'data/content.mjs';
import { acknowledgeFest } from 'lib/acknowledgements.mjs';

import styles from './AcknowledgementsModal.module.css';

/* The final acknowledgements - /my's first overlay, in the same brand
   dress as the /fests check-in modal: ink border, maroon hard shadow,
   press-in opening.

   Native <dialog> on purpose, matching that modal's reasoning: showModal()
   gives the top layer (above the grain overlay), focus trapping, Escape,
   and ::backdrop without a hand-rolled trap. The dialog's close event is
   the single exit path - Escape, "Not yet", the backdrop, and a confirmed
   submission all funnel through onClose, which is where the caller hands
   focus back to the card button.

   The three statements all have to be ticked before Confirm does
   anything. The endpoint is idempotent first-write-wins, so a double
   confirm is safe. */
const AcknowledgementsModal = ({ fest, onClose, onAcknowledged }) => {
  const [checked, setChecked] = useState(() =>
    my.acknowledgements.statements.map(() => false),
  );
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const toggle = (index) => {
    setChecked((current) =>
      current.map((value, i) => (i === index ? !value : value)),
    );
    setError(null);
  };

  const confirm = async () => {
    if (checked.some((value) => !value)) {
      setError(my.acknowledgements.incomplete);
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
      {my.acknowledgements.statements.map((statement, index) => (
        <label key={statement} className={styles.statement}>
          <input
            type="checkbox"
            checked={checked[index]}
            onChange={() => toggle(index)}
          />
          <span>{statement}</span>
        </label>
      ))}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.confirm}
          onClick={confirm}
          disabled={submitting}
        >
          {my.acknowledgements.confirm}
        </button>
        <button
          type="button"
          className={styles.cancel}
          onClick={() => dialogRef.current?.close()}
        >
          {my.acknowledgements.cancel}
        </button>
      </div>
    </dialog>
  );
};

export default AcknowledgementsModal;
