import { useEffect, useRef } from 'react';

import { AlertIcon } from 'components/icons/badges';
import { my } from 'data/content.mjs';
import {
  SELF_FIXABLE_CHECKS,
  blockingCheckFailures,
  festEditUrl,
} from 'lib/fests.mjs';

import styles from './PublicationChecksModal.module.css';

/* Why a Fest that has been through the final publish flow is still not on
   the website.

   FestNet re-runs the publication checks on every sync, so a Fest can fail
   one long after it was acknowledged - a host renaming their event in
   Organizer HQ is the case this exists for. The card badge says a move is
   needed; this names which one, and hands over the form that makes it.

   The verdicts are the API's own, recomputed on every read, so this reads
   the payload rather than re-deriving anything. Every sentence about a
   specific check is the acknowledgements pane's, imported rather than
   rewritten: the same failure must not be described two ways.

   Native <dialog> and its dress follow AcknowledgementsModal exactly -
   showModal() for the top layer, focus trapping, Escape and ::backdrop
   without a hand-rolled trap, and the close event as the single exit path
   so the caller can hand focus back to the card button. */
const PublicationChecksModal = ({ fest, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const failures = blockingCheckFailures(fest);
  const editUrl = festEditUrl(fest);
  /* Whether this failure is the host's to fix: every failed check has to
     be one of theirs, and there has to be a form to send them to. Anything
     else falls back to the email, which covers every case. The same test
     the acknowledgements pane makes, over the same shared set. */
  const hostCanFix =
    failures.length > 0 &&
    Boolean(editUrl) &&
    failures.every((check) => SELF_FIXABLE_CHECKS.has(check.id));

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
      aria-labelledby="publication-checks-title"
    >
      <h3 id="publication-checks-title" className={styles.heading}>
        {my.fests.checksFailed.title}
      </h3>
      <p className={styles.intro}>{my.fests.checksFailed.intro}</p>

      <p className={styles.listLead}>{my.fests.checksFailed.listLead}</p>
      {/* role=alert on the list rather than the dialog: the heading and
          the intro are context, and these are the sentences a host opened
          this to read. */}
      <ul className={styles.failures} role="alert">
        {failures.map((check) => (
          <li key={check.id} className={styles.failure}>
            <span className={styles.failureIcon}>
              <AlertIcon className={styles.failureIconGlyph} />
            </span>
            <span>
              <span className={styles.failureLabel}>
                {my.acknowledgements.checks.labels[check.id] ?? check.id}
              </span>
              <span className={styles.failureBody}>
                {my.acknowledgements.checks.failures[check.id] ??
                  my.acknowledgements.checks.failures.generic}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {/* The wait is real, and it is the difference between a host who
          thinks their fix failed and one who knows to come back. */}
      <p className={styles.outro}>
        {hostCanFix
          ? my.acknowledgements.checks.updateBody
          : my.acknowledgements.checks.warningBody}
      </p>

      <div className={styles.actions}>
        {/* The fix leads: this modal exists to hand the host the form, or
            the email when the failure is not theirs to fix. */}
        {hostCanFix ? (
          <a
            className={styles.confirm}
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {my.acknowledgements.checks.updateCta}
          </a>
        ) : (
          <a
            className={styles.confirm}
            href={`mailto:${my.acknowledgements.checks.email}`}
          >
            {my.acknowledgements.checks.emailCta}
          </a>
        )}
        <button
          type="button"
          className={styles.cancel}
          onClick={() => dialogRef.current?.close()}
        >
          {my.acknowledgements.checks.close}
        </button>
      </div>
    </dialog>
  );
};

export default PublicationChecksModal;
