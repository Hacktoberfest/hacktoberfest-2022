import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import {
  AlertIcon,
  CheckIcon,
  PencilIcon,
  PlaneIcon,
} from 'components/icons/badges';
import { my } from 'data/content.mjs';
import { acknowledgeFest } from 'lib/acknowledgements.mjs';
import { festEditUrl } from 'lib/fests.mjs';

import styles from './AcknowledgementsModal.module.css';

/* Client-only, same as the /fests directory map: MapLibre touches window
   at import time, which the static export's build pass does not have. */
const VenueMap = dynamic(() => import('./VenueMap'), {
  ssr: false,
  loading: () => <div className={styles.mapSkeleton} aria-hidden="true" />,
});

/* The checks a host can clear on their own: both are fields on the
   Organizer HQ event form, so the pane can hand them the form and get
   out of the way. Coordinates is not one of them - a venue MLH has not
   placed on the map is ours to sort, not theirs - and neither is any
   check id we do not recognise, so both keep the email. */
const SELF_FIXABLE_CHECKS = new Set(['name', 'duration']);

/* Checks that nudge rather than block. A missing description costs a Fest
   its own voice on the directory, not its listing - the site falls back to
   standard per-format copy, and Fests were approved before MLH stored
   descriptions at all. So its miss pauses the pane on a Continue button
   instead of stopping the flow. */
const ADVISORY_CHECKS = new Set(['description']);

/* Which slide renders the venue check - the statement that asks the host
   to compare the address and the pin, so that slide has to show both. */
const VENUE_SLIDE = 1;

/* The Code of Conduct slide: the accept box stays locked until the host
   has scrolled the document to its end. */
const COC_SLIDE = 3;

/* The success pane's confetti: brand pixels on fixed lanes with fixed
   timing. Deterministic on purpose - no randomness at render, so every
   host gets the same celebration and hydration has nothing to disagree
   with. */
const CONFETTI_PIECES = [
  { left: '4%', size: 10, color: '#e53927', delay: '0s', duration: '2.6s' },
  { left: '12%', size: 8, color: '#8bb2de', delay: '0.9s', duration: '3.1s' },
  { left: '22%', size: 12, color: '#f5b726', delay: '0.3s', duration: '2.8s' },
  { left: '30%', size: 8, color: '#e97b77', delay: '1.4s', duration: '2.5s' },
  { left: '38%', size: 10, color: '#3d5f58', delay: '0.6s', duration: '3.3s' },
  { left: '48%', size: 12, color: '#e53927', delay: '1.8s', duration: '2.7s' },
  { left: '56%', size: 8, color: '#f5b726', delay: '0.1s', duration: '3s' },
  { left: '64%', size: 10, color: '#8bb2de', delay: '1.1s', duration: '2.4s' },
  { left: '72%', size: 12, color: '#e97b77', delay: '0.5s', duration: '3.2s' },
  { left: '80%', size: 8, color: '#3d5f58', delay: '1.6s', duration: '2.6s' },
  { left: '88%', size: 10, color: '#e53927', delay: '0.8s', duration: '2.9s' },
  { left: '95%', size: 8, color: '#8bb2de', delay: '2s', duration: '2.5s' },
];

/* The final acknowledgements - /my's first overlay, in the same brand
   dress as the /fests check-in modal: ink border, maroon hard shadow,
   press-in opening. The progress row speaks the
   hero's pixel-square vocabulary, because for the host this is the last
   step between their Fest and the public directory.

   Native <dialog> on purpose, matching that modal's reasoning: showModal()
   gives the top layer (above the grain overlay), focus trapping, Escape,
   and ::backdrop without a hand-rolled trap. The dialog's close event is
   the single exit path - Escape, "Not yet", the backdrop, and Done on the
   success pane all funnel through onClose, which is where the caller
   hands focus back to the card button.

   One statement per slide: each acknowledgement gets the host's full
   attention, and Next refuses to advance until its box is ticked - so
   reaching Confirm IS having agreed to all three. Back re-opens an
   earlier slide with its tick kept; nothing is submitted until the last
   slide's Confirm, and a successful submit lands on the "All set" pane
   rather than snapping the dialog shut mid-click. The endpoint is
   idempotent first-write-wins, so a double confirm is safe. */
const AcknowledgementsModal = ({ fest, onClose, onAcknowledged }) => {
  const statements = my.acknowledgements.statements;
  /* Most statements are plain strings; the Code of Conduct one speaks on
     the Fest's behalf by name, so it arrives as a function of it. */
  const statementText = (entry) =>
    typeof entry === 'function' ? entry(fest.name) : entry;
  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState(() => statements.map(() => false));
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  /* Flips once the Code of Conduct has been scrolled to the bottom, and
     stays flipped - re-reading is welcome but never re-required. */
  const [cocRead, setCocRead] = useState(false);
  /* Flips when the automated-checks pane has finished its run - only ever
     true when every verdict passed, because a failure has no way forward. */
  const [checksCleared, setChecksCleared] = useState(false);

  /* The card's pre-flight verdicts. A payload without them (a stale cache,
     an API from before they shipped) skips the pane rather than blocking
     the host on data we do not have. */
  const failedChecks = (fest.publicationChecks ?? []).filter(
    (check) => !check.passed && !ADVISORY_CHECKS.has(check.id),
  );
  /* Advisory misses ride the same pane but never block: they pause the
     walk-on so the nudge gets read, and Continue is always offered. */
  const advisoryMisses = (fest.publicationChecks ?? []).filter(
    (check) => !check.passed && ADVISORY_CHECKS.has(check.id),
  );
  /* Whether this failure is the host's to fix: every failed check has to
     be one of theirs, and there has to be a form to send them to. Anything
     else falls back to the email, which covers every case. */
  const editUrl = festEditUrl(fest);
  const hostCanFix =
    failedChecks.length > 0 &&
    Boolean(editUrl) &&
    failedChecks.every((check) => SELF_FIXABLE_CHECKS.has(check.id));
  /* The opening pane plays first: the stamped headline and the badge
     ladder replay. "Let's go" is the only way forward from it. */
  const [started, setStarted] = useState(false);
  /* Which way the last step moved: the slide animation enters from the
     side the host is heading toward. */
  const [direction, setDirection] = useState(1);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  /* All checks passing: hold the pane just long enough for the verdicts
     to land, then walk on. A failure never schedules this - the pane is
     the end of the road until the team fixes the data. */
  useEffect(() => {
    if (!started || checksCleared || done) return undefined;
    if (!fest.publicationChecks || failedChecks.length > 0) return undefined;
    /* An advisory miss holds the pane too - not because the host cannot
       proceed, but because a pane that walks itself away mid-read is a
       nudge nobody receives. Continue is theirs to press. */
    if (advisoryMisses.length > 0) return undefined;
    const reduced =
      typeof globalThis.matchMedia === 'function' &&
      globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(
      () => setChecksCleared(true),
      reduced ? 600 : 3100,
    );
    return () => clearTimeout(timer);
  }, [
    started,
    checksCleared,
    done,
    fest.publicationChecks,
    failedChecks.length,
    advisoryMisses.length,
  ]);

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
      setDirection(1);
      setStep(step + 1);
      setError(null);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await acknowledgeFest(fest.id);
      onAcknowledged(fest.id, result.acknowledgedAt);
      setDone(true);
    } catch {
      setSubmitting(false);
      setError(my.acknowledgements.failure);
    }
  };

  /* Within 24px of the bottom counts as the bottom - trackpads and
     momentum scrolling rarely land on the exact last pixel. */
  const cocScrolled = (el) =>
    el.scrollTop + el.clientHeight >= el.scrollHeight - 24;

  /* Ref callback rather than an effect: the slide wrapper remounts this
     box on every visit to the slide, and a box that never needs to
     scroll (a tall viewport) must unlock immediately. */
  const cocBoxRef = (el) => {
    if (el && !cocRead && cocScrolled(el)) setCocRead(true);
  };

  const back = () => {
    setDirection(-1);
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
      {done ? (
        <div className={styles.slide}>
          <div className={styles.confetti} aria-hidden="true">
            {CONFETTI_PIECES.map((piece) => (
              <span
                key={`${piece.left}-${piece.delay}`}
                className={styles.confettiPiece}
                style={{
                  left: piece.left,
                  width: piece.size,
                  height: piece.size,
                  background: piece.color,
                  animationDelay: piece.delay,
                  animationDuration: piece.duration,
                }}
              />
            ))}
          </div>
          <div className={styles.successMark} aria-hidden="true">
            <CheckIcon className={styles.successCheck} />
          </div>
          <h3 id="acknowledgements-title" className={styles.heading}>
            {my.acknowledgements.success.title}
          </h3>
          <p className={styles.intro}>
            {my.acknowledgements.success.body(fest.name)}
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.confirm}
              onClick={() => dialogRef.current?.close()}
            >
              {my.acknowledgements.success.done}
            </button>
          </div>
        </div>
      ) : !started ? (
        <div className={styles.opening}>
          <h3 id="acknowledgements-title" className={styles.openingTitle}>
            {my.acknowledgements.opening.title}
          </h3>
          {/* The host's own rungs, replayed in order. Labels come from
              the badge copy itself, so this can never drift from the
              cards. */}
          <div className={styles.openingLadder} aria-hidden="true">
            <span className={`${styles.openingBadge} ${styles.openingDraft}`}>
              <PencilIcon className={styles.openingBadgeIcon} />
              {my.fests.applicationBadges.draft}
            </span>
            <span
              className={`${styles.openingBadge} ${styles.openingSubmitted}`}
            >
              <PlaneIcon className={styles.openingBadgeIcon} />
              {my.fests.applicationBadges.submitted}
            </span>
            <span
              className={`${styles.openingBadge} ${styles.openingApproved}`}
            >
              <CheckIcon className={styles.openingBadgeIcon} />
              {my.fests.applicationBadges.approved}
            </span>
            <span className={`${styles.openingBadge} ${styles.openingFinal}`}>
              <AlertIcon className={styles.openingBadgeIcon} />
              {my.fests.eventBadges.needsAcknowledgements}
            </span>
          </div>
          <p className={styles.openingBody}>
            {my.acknowledgements.opening.body(fest.name)}
          </p>
          <div className={`${styles.actions} ${styles.openingActions}`}>
            <button
              type="button"
              className={styles.confirm}
              onClick={() => {
                setStarted(true);
                if (!fest.publicationChecks) setChecksCleared(true);
              }}
            >
              {my.acknowledgements.opening.cta}
            </button>
            <button
              type="button"
              className={styles.cancel}
              onClick={() => dialogRef.current?.close()}
            >
              {my.acknowledgements.cancel}
            </button>
          </div>
        </div>
      ) : !checksCleared ? (
        <div className={styles.checksPane}>
          <h3 id="acknowledgements-title" className={styles.heading}>
            {my.acknowledgements.checks.title}
          </h3>
          <div className={styles.checkRows}>
            {(fest.publicationChecks ?? []).map((check, index) => (
              <div
                key={check.id}
                className={styles.checkRow}
                style={{ animationDelay: `${0.2 + index * 0.25}s` }}
              >
                <span
                  className={
                    check.passed
                      ? `${styles.checkVerdict} ${styles.checkPass}`
                      : ADVISORY_CHECKS.has(check.id)
                        ? `${styles.checkVerdict} ${styles.checkAdvisory}`
                        : `${styles.checkVerdict} ${styles.checkFail}`
                  }
                  style={{ animationDelay: `${0.9 + index * 0.7}s` }}
                >
                  {check.passed ? (
                    <CheckIcon className={styles.checkVerdictIcon} />
                  ) : (
                    <AlertIcon className={styles.checkVerdictIcon} />
                  )}
                </span>
                <span className={styles.checkLabel}>
                  {my.acknowledgements.checks.labels[check.id] ?? check.id}
                </span>
              </div>
            ))}
          </div>
          {failedChecks.length > 0 && (
            <div
              className={styles.checksWarning}
              role="alert"
              style={{
                animationDelay: `${1.3 + (fest.publicationChecks?.length ?? 0) * 0.7}s`,
              }}
            >
              <p className={styles.checksWarningLead}>
                {hostCanFix
                  ? my.acknowledgements.checks.updateLead
                  : my.acknowledgements.checks.warningLead}
              </p>
              {failedChecks.map((check) => (
                <p key={check.id} className={styles.checksWarningItem}>
                  {my.acknowledgements.checks.failures[check.id] ??
                    my.acknowledgements.checks.failures.generic}
                </p>
              ))}
              <p className={styles.checksWarningItem}>
                {hostCanFix
                  ? my.acknowledgements.checks.updateBody
                  : my.acknowledgements.checks.warningBody}
              </p>
            </div>
          )}
          {/* The nudge, only when nothing is actually broken: a failure
              outranks it, and the host will pass this way again. Not a
              role=alert - nothing is wrong. */}
          {failedChecks.length === 0 && advisoryMisses.length > 0 && (
            <div
              className={styles.checksNote}
              style={{
                animationDelay: `${1.3 + (fest.publicationChecks?.length ?? 0) * 0.7}s`,
              }}
            >
              <p className={styles.checksWarningLead}>
                {my.acknowledgements.checks.advisory.lead}
              </p>
              {advisoryMisses.map((check) => (
                <p key={check.id} className={styles.checksWarningItem}>
                  {my.acknowledgements.checks.advisory[check.id] ?? ''}
                </p>
              ))}
            </div>
          )}
          {failedChecks.length === 0 && advisoryMisses.length > 0 && (
            <div
              className={styles.actions}
              style={{
                animationDelay: `${1.5 + (fest.publicationChecks?.length ?? 0) * 0.7}s`,
              }}
            >
              {/* The fix leads and the walk-on follows: the nudge exists to
                  hand the host the form, so the form is the primary action.
                  Continue only dresses as primary when there is no form to
                  offer - a lone secondary button would look disabled. */}
              {editUrl && (
                <a
                  className={styles.confirm}
                  href={editUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {my.acknowledgements.checks.updateCta}
                </a>
              )}
              <button
                type="button"
                className={editUrl ? styles.cancel : styles.confirm}
                onClick={() => setChecksCleared(true)}
              >
                {my.acknowledgements.checks.advisory.continueCta}
              </button>
            </div>
          )}
          {/* No buttons while the verdicts land - the pane walks itself
              into the statements in a moment, and Escape still bails out.
              Only a failure or a nudge needs actions. */}
          {failedChecks.length > 0 && (
            <div className={styles.actions}>
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
          )}
        </div>
      ) : (
        <>
          {/* The progress squares share the heading's line, top right:
              forest for done ground, orange for where the host stands.
              The text counter beside them is the accessible narration. */}
          <div className={styles.headerRow}>
            <h3 id="acknowledgements-title" className={styles.heading}>
              {my.acknowledgements.title}
            </h3>
            <div className={styles.progress}>
              <div className={styles.progressSquares} aria-hidden="true">
                {statements.map((statement, index) => (
                  <span
                    key={statement}
                    className={
                      index < step
                        ? `${styles.progressSquare} ${styles.progressDone}`
                        : index === step
                          ? `${styles.progressSquare} ${styles.progressHere}`
                          : styles.progressSquare
                    }
                  />
                ))}
              </div>
              <p className={styles.progressLabel} aria-live="polite">
                {my.acknowledgements.progress(step + 1, statements.length)}
              </p>
            </div>
          </div>
          <div
            key={step}
            className={
              direction < 0
                ? `${styles.slide} ${styles.slideBack}`
                : styles.slide
            }
          >
            {step === 0 && (
              <p className={styles.intro}>
                {my.acknowledgements.intro(fest.name)}
              </p>
            )}
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
                {/* One bordered unit: the address is the map's own
                    caption, not a floating line. */}
                <div className={styles.venueUnit}>
                  {fest.venueAddress && (
                    <p className={styles.venueBar}>{fest.venueAddress}</p>
                  )}
                  {typeof fest.latitude === 'number' &&
                  typeof fest.longitude === 'number' ? (
                    <div className={styles.mapWrapper}>
                      <VenueMap
                        latitude={fest.latitude}
                        longitude={fest.longitude}
                      />
                    </div>
                  ) : (
                    <p className={styles.venueNoPin}>
                      {my.acknowledgements.noPin}
                    </p>
                  )}
                </div>
              </div>
            )}
            {step === COC_SLIDE && (
              <div className={styles.coc}>
                <div
                  className={styles.cocBox}
                  ref={cocBoxRef}
                  onScroll={(event) => {
                    if (!cocRead && cocScrolled(event.currentTarget))
                      setCocRead(true);
                  }}
                  tabIndex={0}
                  role="region"
                  aria-label="MLH Code of Conduct"
                >
                  {my.acknowledgements.codeOfConduct.blocks.map(
                    (block, index) => {
                      if (block.heading) {
                        return (
                          <p key={index} className={styles.cocHeading}>
                            {block.heading}
                          </p>
                        );
                      }
                      if (block.list) {
                        return (
                          <ul key={index} className={styles.cocList}>
                            {block.list.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p
                          key={index}
                          className={
                            block.lead
                              ? `${styles.cocText} ${styles.cocLead}`
                              : styles.cocText
                          }
                        >
                          {block.text}
                        </p>
                      );
                    },
                  )}
                </div>
                {!cocRead && (
                  <p className={styles.cocHint}>
                    {my.acknowledgements.codeOfConduct.hint}
                  </p>
                )}
              </div>
            )}
            <label
              className={
                step === COC_SLIDE && !cocRead
                  ? `${styles.statement} ${styles.statementLocked}`
                  : styles.statement
              }
            >
              <input
                className={styles.statementInput}
                type="checkbox"
                checked={checked[step]}
                disabled={step === COC_SLIDE && !cocRead}
                onChange={toggle}
              />
              <span className={styles.statementBox} aria-hidden="true">
                <CheckIcon className={styles.statementCheck} />
              </span>
              <span className={styles.statementText}>
                {statementText(statements[step])}
              </span>
            </label>
          </div>
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
        </>
      )}
    </dialog>
  );
};

export default AcknowledgementsModal;
