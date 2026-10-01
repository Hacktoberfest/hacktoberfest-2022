import { useEffect, useRef, useState } from 'react';

import { AlertIcon, CheckIcon, HourglassIcon } from 'components/icons/badges';
import { my } from 'data/content.mjs';
import { giftCardRowProblems, requestGiftCards } from 'lib/giftCards.mjs';
import {
  festDeadlines,
  formatSentDate,
  formatUsd,
  openingStep,
  payeeInvalidFields,
  railSteps,
  submitOutcome,
  submitReimbursement,
  wrapUpChecks,
} from 'lib/reimbursement.mjs';

import styles from './Reimbursement.module.css';
import { copyLabelFor, useCopy } from './useCopy';

/* The ended Fest's wrap-up: a Hack Day's "Get reimbursed" card, and a Meet
   Up's thank-you.

   Direction A of the 2026-09-30 canvas: one card, three steps on a rail,
   the step a host is on open and the rest folded to a line. Step 1 is the
   API's four checks; step 2 the handbook, the limit and the agreement;
   step 3 who gets paid. Once anyone has sent the claim the card is the
   sent state for good, for every host of the Fest.

   A Hack Day with digital gift cards has four steps (direction Z of the
   2026-10-01 canvas): "Award digital gift cards" comes second, the
   winners' emails inline in the step, and folds for good once a request
   is on record. lib/reimbursement.mjs's railSteps orders the rail.

   Steps 2 to 3 are this card's own state: a reload before sending starts
   again at step 2 with both boxes unticked, which is the spec's rule (the
   ticks are agreements, so they are made again rather than remembered).

   The verdict squares and the statement boxes are the final
   acknowledgements' own (AcknowledgementsModal), restated in this
   module's CSS without their entrance animations: there the checks land
   one by one as a reveal, here they are a standing report. */

const copy = my.dashboard.reimbursement;

/* The arrow out of the box, for a link that opens a new tab onto another
   site's page. */
const ExternalIcon = () => (
  <svg
    className={styles.linkIcon}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
    />
  </svg>
);

/* A line with bold runs, the team's inbox or a page elsewhere in it, as a
   list of pieces (see my.dashboard.reimbursement): a string is text,
   { strong } bold, { email } a mailto link, { link, href } a link out in a
   new tab. The pieces never reorder, so position is the identity. */
const Pieces = ({ pieces }) =>
  pieces.map((piece, index) => {
    const key = index;
    if (typeof piece === 'string') return <span key={key}>{piece}</span>;
    if (piece.strong) return <strong key={key}>{piece.strong}</strong>;
    if (piece.email) {
      return (
        <a key={key} className={styles.link} href={`mailto:${piece.email}`}>
          {piece.email}
        </a>
      );
    }
    if (piece.link) {
      return (
        <a
          key={key}
          className={styles.link}
          href={piece.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {piece.link}
          <ExternalIcon />
        </a>
      );
    }
    return null;
  });

const VERDICT_CLASS = {
  pass: styles.verdictPass,
  fail: styles.verdictFail,
  pending: styles.verdictPending,
};

const VERDICT_ICON = {
  pass: CheckIcon,
  fail: AlertIcon,
  pending: HourglassIcon,
};

/* A link out to Organizer HQ inside a sentence, or the same words as
   plain text when MLH sent no manage link. */
const ManageLink = ({ href, children }) =>
  href ? (
    <a
      className={styles.link}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ) : (
    children
  );

/* What a row says under its label: nothing for a plain pass, the album's
   count for photos, the fix for a failure, and "still checking" while
   FestNet has not read it. Winners wait on MLH for days rather than an
   hour (MLH will not let us read them yet), so their pending line points
   at Organizer HQ and promises no time. */
const CheckSub = ({ check, manageUrl, uploadUrl }) => {
  const { fix, winnersPending } = copy.wrapUp;

  if (check.verdict === 'pending') {
    if (check.id === 'winners') {
      return (
        <span className={styles.checkSub}>
          <ManageLink href={manageUrl}>{winnersPending.cta}</ManageLink>
          {winnersPending.tail}
        </span>
      );
    }
    return <span className={styles.checkSub}>{copy.wrapUp.pending}</span>;
  }

  if (check.verdict === 'pass') {
    return check.id === 'photos' ? (
      <span className={styles.checkSub}>
        {copy.wrapUp.photosCount(check.count)}
      </span>
    ) : null;
  }

  if (check.id === 'checkIns') {
    return (
      <span className={styles.checkSub}>
        {fix.checkIns}
        {manageUrl && (
          <>
            {' '}
            <ManageLink href={manageUrl}>{fix.checkInsCta}</ManageLink>
          </>
        )}
      </span>
    );
  }

  if (check.id === 'winners') {
    return (
      <span className={styles.checkSub}>
        {check.missing.length > 0 ? fix.winners(check.missing) : null}
        {manageUrl && (
          <>
            {' '}
            <ManageLink href={manageUrl}>{fix.winnersCta}</ManageLink>
          </>
        )}
      </span>
    );
  }

  if (check.id === 'photos') {
    return (
      <span className={styles.checkSub}>
        {fix.photos}
        {uploadUrl && (
          <a
            className={`${styles.smallButton} ${styles.checkAction}`}
            href={uploadUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {fix.photosCta}
          </a>
        )}
      </span>
    );
  }

  return <span className={styles.checkSub}>{fix.submissions}</span>;
};

/* Step 1's open panel: the four rows, then the hint. */
const WrapUpPanel = ({ checks, manageUrl, uploadUrl }) => (
  <>
    <ul className={styles.checks}>
      {checks.map((check) => {
        const Icon = VERDICT_ICON[check.verdict];
        return (
          <li key={check.id} className={styles.check}>
            <span
              className={`${styles.verdict} ${VERDICT_CLASS[check.verdict]}`}
              aria-hidden="true"
            >
              <Icon className={styles.verdictIcon} />
            </span>
            <span className={styles.checkLabel}>
              <span className={styles.visuallyHidden}>
                {`${copy.wrapUp.verdicts[check.verdict]} `}
              </span>
              {copy.wrapUp.labels[check.id]}
              <CheckSub
                check={check}
                manageUrl={manageUrl}
                uploadUrl={uploadUrl}
              />
            </span>
          </li>
        );
      })}
    </ul>
    <p className={styles.hint}>{copy.wrapUp.hint}</p>
  </>
);

/* The acknowledgements' accept box: a real checkbox for keyboards and
   screen readers, visually hidden, with the painted box beside it. */
const Statement = ({ checked, onChange, children }) => (
  <label className={styles.statement}>
    <input
      className={styles.statementInput}
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
    <span className={styles.statementBox} aria-hidden="true">
      <CheckIcon className={styles.statementCheck} />
    </span>
    <span className={styles.statementText}>{children}</span>
  </label>
);

/* Step 2's open panel: the limit first, since it is what the host came
   for, then one paragraph about it, then both agreements together above
   Continue. The handbook is linked from its own agreement. With no rate
   for the Fest's country the note to email the team stands where all of
   that would: there is no number to agree to.

   Continue is never disabled, as the final acknowledgements' Next is not:
   pressed early it says what is missing instead of sitting there greyed
   out. */
const CLAIM_ERROR_ID = 'claim-error';

const ClaimPanel = ({
  limit,
  country,
  readHandbook,
  setReadHandbook,
  agreed,
  setAgreed,
  onContinue,
}) => {
  const { handbook, noRate } = copy.claim;
  const [incomplete, setIncomplete] = useState(false);
  const capped = Boolean(limit) && limit.checkIns > limit.checkInsCounted;

  const tick = (set) => (value) => {
    set(value);
    setIncomplete(false);
  };

  const tryContinue = () => {
    if (readHandbook && agreed) onContinue();
    else setIncomplete(true);
  };

  return (
    <>
      <div className={styles.figure}>
        <p className={styles.label}>{copy.claim.limit.label}</p>
        {limit ? (
          <>
            <span className={styles.money}>
              {formatUsd(limit.amount)}
              <small className={styles.currency}>
                {copy.claim.limit.currency}
              </small>
            </span>
            <p className={styles.caption}>
              <Pieces
                pieces={copy.claim.limit.calc(
                  limit.checkInsCounted,
                  formatUsd(limit.perCheckIn),
                  limit.country,
                )}
              />
            </p>
            {capped && (
              <p className={styles.caption}>
                {copy.claim.limit.cappedHint(limit.checkInsCounted)}
              </p>
            )}
          </>
        ) : (
          <div className={`${styles.note} ${styles.noteSky}`}>
            <p className={styles.strong}>{noRate.lead(country)}</p>
            <p>
              <Pieces pieces={noRate.body} />
            </p>
          </div>
        )}
      </div>

      {limit ? (
        <>
          <p className={styles.line}>
            {copy.claim.limit.body} <Pieces pieces={copy.claim.spentMore} />
          </p>
          <div className={styles.agree}>
            <Statement checked={readHandbook} onChange={tick(setReadHandbook)}>
              <Pieces pieces={handbook.statement} />
            </Statement>
            <Statement checked={agreed} onChange={tick(setAgreed)}>
              {copy.claim.agreeStatement}
            </Statement>
          </div>
          {incomplete && (
            <p className={styles.error} id={CLAIM_ERROR_ID} role="alert">
              {copy.claim.incomplete}
            </p>
          )}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.button}
              aria-describedby={incomplete ? CLAIM_ERROR_ID : undefined}
              onClick={tryContinue}
            >
              {copy.claim.continueCta}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.actions}>
            <a className={styles.button} href={`mailto:${copy.email}`}>
              {noRate.cta}
            </a>
          </div>
          <p className={styles.line}>
            <Pieces pieces={noRate.handbook} />
          </p>
        </>
      )}
    </>
  );
};

/* The error line under the form, which every field marked invalid points
   at as well as its own hint. */
const ERROR_ID = 'payee-error';

const FIELDS = [
  { id: 'firstName', autoComplete: 'given-name', type: 'text' },
  { id: 'lastName', autoComplete: 'family-name', type: 'text' },
  { id: 'email', autoComplete: 'email', type: 'email', wide: true },
];

/* Step 3's open panel: who gets paid, sent once. Checked against the
   API's own rules before the request, so a typo is caught here; the
   API's answer decides the rest (see submitOutcome). A claim someone
   already sent, or a session or Fest that has gone, reloads the page,
   which then shows what is true. */
const PayeePanel = ({
  fest,
  readHandbook,
  agreed,
  giftCardsOn,
  onSent,
  onRefresh,
}) => {
  const { payee } = copy;
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [invalid, setInvalid] = useState([]);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const firstField = useRef(null);
  const formRef = useRef(null);
  const sendButton = useRef(null);
  /* Where focus goes once a failed send has re-enabled the form. */
  const refocus = useRef(null);

  /* Continue opened this step, so the first field takes the focus the
     button had: the step the host was on has just folded away. */
  useEffect(() => {
    firstField.current?.focus();
  }, []);

  /* The fields and Send are disabled while sending, which drops the
     focus. Once a failed send re-enables them, it goes back where the
     host acts next: the email field when the API refused the body (the
     only field its rules can still disagree on), Send otherwise. After
     the render that re-enables them, since a disabled control cannot
     take focus. */
  useEffect(() => {
    if (sending || !refocus.current) return;
    const target =
      refocus.current === 'email'
        ? formRef.current?.elements.namedItem('email')
        : sendButton.current;
    refocus.current = null;
    target?.focus();
  }, [sending, error]);

  const send = async (event) => {
    event.preventDefault();
    if (sending) return;

    const bad = payeeInvalidFields(values);
    setInvalid(bad);
    if (bad.length > 0) {
      setError('invalid');
      /* The first field that needs fixing takes the focus, in the order
         the form shows them, so the host lands on the problem rather
         than wherever they last typed. */
      const first = FIELDS.find((field) => bad.includes(field.id));
      event.currentTarget.elements.namedItem(first.id)?.focus();
      return;
    }

    setError(null);
    setSending(true);
    try {
      const submission = await submitReimbursement(fest.id, {
        ...values,
        readHandbook,
        agreedToPolicy: agreed,
      });
      if (submission) onSent(submission);
      else onRefresh();
    } catch (failure) {
      const outcome = submitOutcome(failure, { giftCardsOn });
      if (outcome === 'refetch') {
        onRefresh();
        return;
      }
      /* The form already holds the API's rules, so a 400 that gets past
         them is the email, the one value whose check is a pattern. */
      if (outcome === 'invalid') setInvalid(['email']);
      refocus.current = outcome === 'invalid' ? 'email' : 'send';
      setError(outcome);
      setSending(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={send} noValidate ref={formRef}>
      <p className={styles.line}>{payee.intro}</p>
      <div className={styles.fields}>
        {FIELDS.map((field) => {
          const id = `payee-${field.id}`;
          const hinted = field.id === 'email';
          const marked = invalid.includes(field.id);
          const describedBy = [
            hinted ? `${id}-hint` : null,
            marked && error ? ERROR_ID : null,
          ].filter(Boolean);
          return (
            <div
              key={field.id}
              className={
                field.wide
                  ? `${styles.field} ${styles.fieldWide}`
                  : styles.field
              }
            >
              <label className={styles.fieldLabel} htmlFor={id}>
                {payee.fields[field.id]}
              </label>
              <input
                ref={field.id === 'firstName' ? firstField : undefined}
                className={styles.input}
                id={id}
                name={field.id}
                type={field.type}
                autoComplete={field.autoComplete}
                maxLength={field.id === 'email' ? 254 : 100}
                required
                value={values[field.id]}
                aria-invalid={marked || undefined}
                aria-describedby={describedBy.join(' ') || undefined}
                disabled={sending}
                onChange={(event) => {
                  const { value } = event.target;
                  setValues((current) => ({ ...current, [field.id]: value }));
                  /* An edit is a fix attempt, so the field stops reading
                     as wrong until the next send says otherwise. */
                  setInvalid((current) =>
                    current.includes(field.id)
                      ? current.filter((entry) => entry !== field.id)
                      : current,
                  );
                }}
              />
              {hinted && (
                <span className={styles.fieldHint} id={`${id}-hint`}>
                  {payee.emailHint}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.note}>
        <p className={styles.strong}>{payee.onceLead}</p>
        <p>
          <Pieces pieces={payee.onceBody} />
        </p>
      </div>
      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.button}
          disabled={sending}
          ref={sendButton}
        >
          {sending ? payee.sendingCta : payee.sendCta}
        </button>
      </div>
      {error && (
        <p className={styles.error} id={ERROR_ID} role="alert">
          {payee.errors[error]}
        </p>
      )}
    </form>
  );
};

/* The gift card rows' two small icons, in the stroke of the remove and
   add buttons' type. */
const CrossIcon = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path d="M2 2l8 8M10 2 2 10" stroke="currentColor" strokeWidth="2.2" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2.2" />
  </svg>
);

/* The two lines a failed request can leave: about the rows, under them,
   and about the send, under the button, as the payee form's is. */
const CARDS_ERROR_ID = 'gift-cards-error';
const REQUEST_ERROR_ID = 'gift-cards-request-error';

const ROW_ERRORS = new Set(['rows', 'empty']);

const inputName = (key) => `gift-card-${key}`;

/* Step 2's open panel: the winners' emails, one row per card, sent once.
   The rows live in the card (they are counted in the step's head), as
   { key, value } so a removed row takes its own value with it. Checked
   against the API's rules before the request (giftCardRowProblems), so a
   typo or a repeat is caught here; the API's answer decides the rest, read
   as the payee's is (submitOutcome). A request someone already made, or a
   session or Fest that has gone, reloads the page, which then shows what
   is true. */
const GiftCardsPanel = ({
  fest,
  limit,
  rows,
  setRows,
  newKey,
  onRequested,
  onRefresh,
}) => {
  const step = copy.giftCards;
  /* Row key -> 'invalid' | 'duplicate' | 'empty' ('empty' marks the first
     row when every row is empty, with no line of its own). */
  const [problems, setProblems] = useState({});
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const formRef = useRef(null);
  const requestButton = useRef(null);
  /* Where focus goes after the next render: a row's key, or 'request'.
     After the render, since a new row is not there yet and a disabled
     control cannot take focus. */
  const pendingFocus = useRef(null);

  useEffect(() => {
    const target = pendingFocus.current;
    if (target === null || sending) return;
    pendingFocus.current = null;
    if (target === 'request') requestButton.current?.focus();
    else formRef.current?.elements.namedItem(inputName(target))?.focus();
  });

  const filled = rows.filter((row) => row.value.trim()).length;

  const unmark = (key) =>
    setProblems((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });

  const edit = (key, value) => {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, value } : row)),
    );
    /* An edit is a fix attempt, so the row stops reading as wrong until
       the next request says otherwise. */
    unmark(key);
    /* "Add at least one" marked card 1 for the whole list, so any edit
       that answers it clears that mark too, not just the line. */
    if (error === 'empty') {
      setError(null);
      setProblems({});
    }
  };

  const add = () => {
    const key = newKey();
    setRows((current) => [...current, { key, value: '' }]);
    pendingFocus.current = key;
  };

  /* Focus stays in the list: the row that moves up into this one's place,
     or the one above when it was the last. */
  const remove = (index) => {
    const next = rows.filter((_, position) => position !== index);
    pendingFocus.current = next[Math.min(index, next.length - 1)].key;
    unmark(rows[index].key);
    setRows(next);
  };

  const request = async (event) => {
    event.preventDefault();
    if (sending) return;

    const check = giftCardRowProblems(rows.map((row) => row.value));
    const bad = {};
    check.problems.forEach((problem, index) => {
      if (problem) bad[rows[index].key] = problem;
    });
    if (check.empty) bad[rows[0].key] = 'empty';

    const firstBad = rows.find((row) => bad[row.key]);
    if (firstBad) {
      setProblems(bad);
      setError(check.empty ? 'empty' : 'rows');
      /* The first row that needs fixing takes the focus, so the host lands
         on the problem rather than wherever they last typed. */
      event.currentTarget.elements.namedItem(inputName(firstBad.key))?.focus();
      return;
    }

    setProblems({});
    setError(null);
    setSending(true);
    try {
      const result = await requestGiftCards(fest.id, check.emails);
      if (result) onRequested(result);
      else onRefresh();
    } catch (failure) {
      const outcome = submitOutcome(failure);
      if (outcome === 'refetch') {
        onRefresh();
        return;
      }
      pendingFocus.current = 'request';
      setError(outcome);
      setSending(false);
    }
  };

  /* The rows line shows while a row is still marked: once every marked
     row has been edited, there is nothing left to point at. */
  const rowsLine =
    ROW_ERRORS.has(error) && Object.keys(problems).length > 0
      ? step.errors[error]
      : null;
  const requestLine =
    error && !ROW_ERRORS.has(error) ? step.errors[error] : null;

  return (
    <form className={styles.form} onSubmit={request} noValidate ref={formRef}>
      <p className={styles.line}>{step.intro(limit)}</p>
      <p className={styles.line}>{step.instructions}</p>
      <div className={styles.cards}>
        <ol className={styles.cardRows}>
          {rows.map((row, index) => {
            const id = inputName(row.key);
            const problem = problems[row.key];
            const rowError = problem && problem !== 'empty';
            const describedBy = [
              rowError ? `${id}-error` : null,
              problem && rowsLine ? CARDS_ERROR_ID : null,
            ].filter(Boolean);
            return (
              <li key={row.key} className={styles.cardRow}>
                <label className={styles.cardLabel} htmlFor={id}>
                  {step.rowLabel(index + 1)}
                </label>
                <input
                  className={`${styles.input} ${styles.cardInput}`}
                  id={id}
                  name={id}
                  type="email"
                  /* Someone else's address: the host's own would be the
                     wrong thing for the browser to offer. */
                  autoComplete="off"
                  maxLength={254}
                  value={row.value}
                  aria-invalid={problem ? true : undefined}
                  aria-describedby={describedBy.join(' ') || undefined}
                  disabled={sending}
                  onChange={(event) => edit(row.key, event.target.value)}
                />
                {rows.length > 1 && (
                  <button
                    type="button"
                    className={styles.cardRemove}
                    aria-label={step.removeLabel(index + 1)}
                    disabled={sending}
                    onClick={() => remove(index)}
                  >
                    <CrossIcon />
                  </button>
                )}
                {rowError && (
                  <p className={styles.cardError} id={`${id}-error`}>
                    {step.rowErrors[problem]}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
        {rows.length < limit && (
          <button
            type="button"
            className={styles.cardAdd}
            disabled={sending}
            onClick={add}
          >
            <PlusIcon />
            {step.addCta}
          </button>
        )}
      </div>
      {rowsLine && (
        <p className={styles.error} id={CARDS_ERROR_ID} role="alert">
          {rowsLine}
        </p>
      )}
      <div className={styles.note}>
        <p className={styles.strong}>{step.onceLead}</p>
        <p>
          <Pieces pieces={step.onceBody} />
        </p>
      </div>
      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.button}
          disabled={sending}
          ref={requestButton}
          aria-describedby={requestLine ? REQUEST_ERROR_ID : undefined}
        >
          {/* The addresses it would send; never "Request 0", since with
              every row empty the request only says to add one. */}
          {sending ? step.requestingCta : step.requestCta(Math.max(filled, 1))}
        </button>
      </div>
      {requestLine && (
        <p className={styles.error} id={REQUEST_ERROR_ID} role="alert">
          {requestLine}
        </p>
      )}
    </form>
  );
};

const STEP_CLASS = {
  done: styles.stepDone,
  here: styles.stepHere,
  todo: styles.stepTodo,
};

/* One step on the rail: the square marker (a tick once done, the number
   otherwise), the title with its mono status (or the gift cards' meter,
   in the muted voice, announced as it changes), then a folded summary or
   the open panel. focusSummary moves focus to the summary once it is
   there: the confirmation of what the host just sent. */
const RailStep = ({
  number,
  state,
  title,
  status,
  meter,
  summary,
  focusSummary,
  children,
}) => {
  const summaryRef = useRef(null);
  const folded = Boolean(summary);

  useEffect(() => {
    if (focusSummary && folded) summaryRef.current?.focus();
  }, [focusSummary, folded]);

  return (
    <li
      className={`${styles.railStep} ${STEP_CLASS[state]}`}
      aria-current={state === 'here' ? 'step' : undefined}
    >
      <span className={styles.mark} aria-hidden="true">
        {state === 'done' ? <CheckIcon className={styles.markCheck} /> : number}
      </span>
      <div className={styles.stepBody}>
        <div className={styles.stepHead}>
          <h3 className={styles.stepTitle}>{title}</h3>
          {meter ? (
            <span
              className={`${styles.stepStatus} ${styles.meter}`}
              aria-live="polite"
            >
              {meter}
            </span>
          ) : (
            status && <span className={styles.stepStatus}>{status}</span>
          )}
        </div>
        {summary && (
          <p
            className={styles.summary}
            ref={summaryRef}
            tabIndex={focusSummary ? -1 : undefined}
          >
            {summary}
          </p>
        )}
        {children && <div className={styles.panel}>{children}</div>}
      </div>
    </li>
  );
};

/* One of the three values Ramp asks for, with its own Copy. */
const RampValue = ({ label, value }) => {
  const [state, onCopy] = useCopy(value);

  return (
    <div className={styles.kvRow}>
      <dt className={styles.kvLabel}>{label}</dt>
      <dd className={styles.kvValue}>{value}</dd>
      <dd className={styles.kvAction}>
        <button
          type="button"
          className={`${styles.smallButton} ${styles.smallButtonGhost}${
            state === 'copied' ? ` ${styles.smallButtonDone}` : ''
          }`}
          onClick={onCopy}
        >
          {copyLabelFor(state, copy.sent)}
        </button>
      </dd>
    </div>
  );
};

/* The sent state, from the API's submission: what was sent, by whom, and
   MLH's onboarding steps. When this host has just sent it, the heading
   takes the focus the Send button had. */
const SentCard = ({ fest, limit, submission, justSent }) => {
  const { sent } = copy;
  const heading = useRef(null);
  const { firstName, lastName, email } = submission.payee;
  const name = [firstName, lastName].filter(Boolean).join(' ');
  const deadlines = festDeadlines(fest.date);

  useEffect(() => {
    if (justSent) heading.current?.focus();
  }, [justSent]);

  return (
    <section className={styles.card} aria-labelledby="reimbursement-heading">
      <div className={styles.sentHead}>
        <span className={styles.successMark} aria-hidden="true">
          <CheckIcon className={styles.successCheck} />
        </span>
        <div>
          <h2
            className={styles.title}
            id="reimbursement-heading"
            ref={heading}
            tabIndex={-1}
          >
            {sent.title}
          </h2>
          <p className={`${styles.hint} ${styles.sentMeta}`}>
            {sent.meta({
              byYou: submission.byYou,
              date: formatSentDate(submission.submittedAt, fest.timeZone),
              amount: limit ? formatUsd(limit.amount) : null,
            })}
          </p>
        </div>
      </div>
      <p className={styles.lead}>
        <Pieces
          pieces={name && email ? sent.ramp(name, email) : sent.rampNoPayee}
        />
      </p>
      <p className={styles.label}>{sent.nextLabel}</p>
      <ol className={styles.nextSteps}>
        {[sent.next.accept, sent.next.details, sent.next.id].map(
          (line, index) => (
            <li key={line} className={styles.nextStep}>
              <span className={styles.num} aria-hidden="true">
                {index + 1}
              </span>
              <p className={styles.nextText}>{line}</p>
            </li>
          ),
        )}
        <li className={styles.nextStep}>
          <span className={styles.num} aria-hidden="true">
            4
          </span>
          <div>
            <p className={styles.nextText}>{sent.next.receipts}</p>
            <dl className={styles.kv}>
              <RampValue
                label={sent.rampFields.class.label}
                value={sent.rampFields.class.value}
              />
              <RampValue
                label={sent.rampFields.category.label}
                value={sent.rampFields.category.value}
              />
              <RampValue label={sent.rampFields.memo.label} value={fest.name} />
            </dl>
          </div>
        </li>
        <li className={styles.nextStep}>
          <span className={styles.num} aria-hidden="true">
            5
          </span>
          <p className={styles.nextText}>{sent.next.paid}</p>
        </li>
        <li className={styles.nextStep}>
          <span className={styles.num} aria-hidden="true">
            6
          </span>
          <p className={styles.nextText}>
            <Pieces
              pieces={
                deadlines
                  ? sent.next.deadline(deadlines.receipts, deadlines.rampCloses)
                  : sent.next.deadlineUndated
              }
            />
          </p>
        </li>
      </ol>
      <p className={styles.hint}>
        <Pieces pieces={sent.questions} />
      </p>
    </section>
  );
};

/* Organizer HQ's page for the event, where hosts check people in and
   pick winners: MLH's manage link as sent, not the /edit form the hero's
   button opens. Only an https link reaches an href. */
const organizerHqUrl = (fest) =>
  typeof fest.manageUrl === 'string' && /^https:\/\//i.test(fest.manageUrl)
    ? fest.manageUrl
    : null;

/* `giftCards` is lib/giftCards.mjs's giftCardsFor: the Fest's limit and
   request, or null for a Fest without gift cards, which keeps the three
   steps it always had. */
export const ReimbursementCard = ({
  fest,
  reimbursement,
  giftCards,
  photos,
  onSubmitted,
  onGiftCardsRequested,
  onRefresh,
}) => {
  const [advanced, setAdvanced] = useState(false);
  const [readHandbook, setReadHandbook] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const [justRequested, setJustRequested] = useState(false);
  /* Step 2's rows, here rather than in the panel because the step's head
     counts them. One empty row to start. */
  const [cardRows, setCardRows] = useState([{ key: 0, value: '' }]);
  const nextRowKey = useRef(1);

  const opening = openingStep(reimbursement);
  const { limit, forceApproved } = reimbursement;

  if (opening === 'sent') {
    return (
      <SentCard
        fest={fest}
        limit={limit}
        submission={reimbursement.submission}
        justSent={justSent}
      />
    );
  }

  const steps = railSteps(reimbursement, giftCards, { advanced });
  const current = steps.find((step) => step.state === 'here');
  const checks = wrapUpChecks(reimbursement.checks);
  const passing = checks.filter((check) => check.verdict === 'pass').length;
  const manageUrl = organizerHqUrl(fest);
  const uploadUrl = photos ? photos.uploadUrl : null;

  const onSent = (submission) => {
    setJustSent(true);
    onSubmitted(submission);
  };

  const onRequested = (request) => {
    setJustRequested(true);
    onGiftCardsRequested(request);
  };

  const newRowKey = () => {
    const key = nextRowKey.current;
    nextRowKey.current += 1;
    return key;
  };

  /* Each step by its id, numbered by its place on this Fest's rail. */
  const renderStep = ({ id, number, state }) => {
    const here = state === 'here';
    const done = state === 'done';

    if (id === 'wrapUp') {
      return (
        <RailStep
          key={id}
          number={number}
          state={state}
          title={copy.wrapUp.title}
          status={
            here
              ? copy.wrapUp.progress(passing, checks.length)
              : forceApproved
                ? copy.status.approved
                : copy.status.done
          }
          summary={
            here
              ? null
              : forceApproved
                ? copy.wrapUp.approvedSummary
                : copy.wrapUp.summary
          }
        >
          {here && (
            <WrapUpPanel
              checks={checks}
              manageUrl={manageUrl}
              uploadUrl={uploadUrl}
            />
          )}
        </RailStep>
      );
    }

    if (id === 'giftCards') {
      const { request } = giftCards;
      return (
        <RailStep
          key={id}
          number={number}
          state={state}
          title={copy.giftCards.title}
          status={done ? copy.status.requested : copy.status.locked}
          meter={
            here ? copy.giftCards.meter(cardRows.length, giftCards.limit) : null
          }
          summary={
            done ? (
              <Pieces
                pieces={copy.giftCards.summary(
                  request.emails.length,
                  giftCards.limit,
                  formatSentDate(request.submittedAt, fest.timeZone),
                  request.byYou,
                )}
              />
            ) : null
          }
          focusSummary={justRequested}
        >
          {here && (
            <GiftCardsPanel
              fest={fest}
              limit={giftCards.limit}
              rows={cardRows}
              setRows={setCardRows}
              newKey={newRowKey}
              onRequested={onRequested}
              onRefresh={onRefresh}
            />
          )}
        </RailStep>
      );
    }

    if (id === 'claim') {
      return (
        <RailStep
          key={id}
          number={number}
          state={state}
          title={copy.claim.title}
          status={here ? null : done ? copy.status.agreed : copy.status.locked}
          summary={
            done ? (
              <Pieces
                pieces={copy.claim.summary(
                  formatUsd(limit.amount),
                  limit.checkInsCounted,
                )}
              />
            ) : null
          }
        >
          {here && (
            <ClaimPanel
              limit={limit}
              country={
                typeof fest.country === 'string' && fest.country.trim()
                  ? fest.country.trim()
                  : null
              }
              readHandbook={readHandbook}
              setReadHandbook={setReadHandbook}
              agreed={agreed}
              setAgreed={setAgreed}
              onContinue={() => setAdvanced(true)}
            />
          )}
        </RailStep>
      );
    }

    return (
      <RailStep
        key={id}
        number={number}
        state={state}
        title={copy.payee.title}
        status={here ? null : copy.status.locked}
      >
        {here && (
          <PayeePanel
            fest={fest}
            readHandbook={readHandbook}
            agreed={agreed}
            giftCardsOn={Boolean(giftCards)}
            onSent={onSent}
            onRefresh={onRefresh}
          />
        )}
      </RailStep>
    );
  };

  return (
    <section className={styles.card} aria-labelledby="reimbursement-heading">
      <div className={styles.head}>
        <h2 className={styles.title} id="reimbursement-heading">
          {copy.title}
        </h2>
        <span className={styles.counter}>
          {copy.stepCounter(current.number, steps.length)}
        </span>
      </div>
      {current.id === 'wrapUp' && <p className={styles.line}>{copy.intro}</p>}

      <ol className={styles.rail}>{steps.map(renderStep)}</ol>
    </section>
  );
};

/* An ended Meet Up: no claim, since Meet Ups are not funded, and the
   album's two links, upload first. An API from before the Photo gallery
   sends no photos at all and the card is the thanks alone; links MLH has
   not sent yet get the Photo gallery card's "coming" line. */
export const ThanksCard = ({ photos }) => {
  const { thanks } = my.dashboard;
  const uploadUrl = photos ? photos.uploadUrl : null;
  const galleryUrl = photos ? photos.galleryUrl : null;

  return (
    <section className={styles.card} aria-labelledby="thanks-heading">
      <h2 className={styles.title} id="thanks-heading">
        {thanks.title}
      </h2>
      <p className={styles.line}>{thanks.body}</p>
      {uploadUrl || galleryUrl ? (
        <ul className={styles.rows}>
          {uploadUrl && (
            <li className={styles.row}>
              <span className={styles.chip}>{thanks.upload.label}</span>
              <span className={styles.rowText}>{thanks.upload.hint}</span>
              <a
                className={styles.smallButton}
                href={uploadUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {thanks.upload.cta}
              </a>
            </li>
          )}
          {galleryUrl && (
            <li className={styles.row}>
              <span className={styles.chip}>{thanks.gallery.label}</span>
              <span className={styles.rowText}>{thanks.gallery.hint}</span>
              <a
                className={`${styles.smallButton} ${styles.smallButtonGhost}`}
                href={galleryUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {thanks.gallery.cta}
              </a>
            </li>
          )}
        </ul>
      ) : (
        photos && <p className={styles.hint}>{my.dashboard.photos.pending}</p>
      )}
    </section>
  );
};
