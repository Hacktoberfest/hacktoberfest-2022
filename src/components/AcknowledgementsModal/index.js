import { useEffect, useRef, useState } from 'react';

import { my } from 'data/content.mjs';
import { acknowledgeFest } from 'lib/acknowledgements.mjs';

import styles from './AcknowledgementsModal.module.css';

/* The final acknowledgements - /my's first overlay. Deliberately small:
   focus moves in on open and back to the opener on close (the caller owns
   that half), Escape and the backdrop both close, and the three
   statements all have to be ticked before Confirm does anything. The
   endpoint is idempotent first-write-wins, so a double confirm is safe. */
const AcknowledgementsModal = ({ fest, onClose, onAcknowledged }) => {
  const [checked, setChecked] = useState(() =>
    my.acknowledgements.statements.map(() => false),
  );
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    globalThis.addEventListener('keydown', onKeyDown);
    return () => globalThis.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

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
      onClose();
    } catch {
      setSubmitting(false);
      setError(my.acknowledgements.failure);
    }
  };

  return (
    <div
      className={styles.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="acknowledgements-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <h3 id="acknowledgements-title" className={styles.title}>
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
          <button type="button" className={styles.cancel} onClick={onClose}>
            {my.acknowledgements.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcknowledgementsModal;
