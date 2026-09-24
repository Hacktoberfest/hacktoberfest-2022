import { useEffect, useRef, useState } from 'react';

import HostResourcesBand from 'components/HostResourcesBand';
import { MyLoading } from 'components/MyStatus';
import PageHero from 'components/PageHero';
import { fests, my } from 'data/content.mjs';
import { carrierFor } from 'lib/carrier.mjs';
import { countryCodeFor } from 'lib/countryFlag.mjs';
import { splitFestName } from 'lib/festName.mjs';
import {
  checkInsVisible,
  festEditUrl,
  festTimeRange,
  formatFestDate,
} from 'lib/fests.mjs';

import styles from './FestDashboard.module.css';

/* One host's Fest, in full.

   Every number here comes from MLH's own event record, mirrored by FestNet's
   five-minute sync: this page is a reader of MLH's counters, never a second
   source of truth for them.

   `now` is a prop rather than a Date.now() call inside the component so the
   day-of rule is decided in one place and the render stays pure.

   The page opens on the same PageHero every other interior page uses, so a
   Fest's own page belongs to the site rather than reading as an admin tool
   bolted to the side of it. The hero owns the h1; everything here is h2. */

/* One count, in the countdown's dress: sky ground, ink header bar, skyDeep
   hard shadow. One card per number rather than one card holding both -
   registrations stands alone for the whole of September, and a card built
   to hold a pair looks half-empty until the doors open. */
const CountCard = ({ id, title, value, caption }) => (
  <section className={styles.counter} aria-labelledby={`${id}-heading`}>
    <h2 className={styles.counterHead} id={`${id}-heading`}>
      {title}
    </h2>
    <div className={styles.counterBody}>
      <span className={styles.stat}>{value}</span>
      <span className={styles.statCaption}>{caption}</span>
    </div>
  </section>
);

/* The same padlock the host resources band uses for a locked row: filled,
   because stroked detail turns to mush at this size. */
const LockIcon = () => (
  <svg
    className={styles.lockIcon}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M7 10V8a5 5 0 0 1 10 0v2h1.5v11h-13V10H7zm2.5 0h5V8a2.5 2.5 0 0 0-5 0v2z"
      fill="currentColor"
    />
  </svg>
);

/* The count before there is one. Nobody checks in before the doors open, so
   the card stands there greyed and says when it will fill, rather than
   vanishing - a card that appears from nowhere on the morning of the Fest
   is a worse surprise than one that was always there waiting. It shows no
   number at all: a grey 0 still reads as a count, and as nobody came. */
const LockedCard = ({ id, title, body }) => (
  <section
    className={`${styles.counter} ${styles.counterLocked}`}
    aria-labelledby={`${id}-heading`}
  >
    <h2 className={styles.counterHead} id={`${id}-heading`}>
      {title}
    </h2>
    <p className={styles.counterLockedBody}>
      <LockIcon />
      {body}
    </p>
  </section>
);

/* The event pack's journey, in three steps on one rail. MLH writes one bare
   tracking number per package onto the event and nothing else, so the
   number is the only fact the card has, and the tracker has exactly two
   states: no number, and the pack is being packed at the fulfillment
   centre; any number, and all three steps are done. Nothing past that is
   claimed - MLH sends no delivery status, and the carrier link is where a
   host follows the rest. An ordered list, because the steps are a
   sequence. */
const CheckIcon = () => (
  <svg
    className={styles.stepCheck}
    viewBox="0 0 12 12"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M2 6.5 5 9.5 10 3"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    />
  </svg>
);

const STEP_CLASS = {
  done: styles.stepDone,
  active: styles.stepActive,
  todo: styles.stepTodo,
};

const Step = ({ label, state }) => (
  <li className={`${styles.step} ${STEP_CLASS[state]}`}>
    <span className={styles.stepMarker} aria-hidden="true">
      {state === 'done' && <CheckIcon />}
    </span>
    <p className={styles.stepLabel}>
      {label}
      <span className={styles.stepStatus}>
        {my.dashboard.pack.stepStatus[state]}
      </span>
    </p>
  </li>
);

const PackSteps = ({ shipped }) => {
  const { steps } = my.dashboard.pack;

  return (
    <ol className={styles.steps}>
      <Step label={steps.fulfillment} state="done" />
      <Step label={steps.packed} state={shipped ? 'done' : 'active'} />
      <Step label={steps.shipped} state={shipped ? 'done' : 'todo'} />
    </ol>
  );
};

/* Stroked at the weight the Button's type sits at, so the icon reads as
   part of the label rather than a badge beside it. */
const EyeIcon = () => (
  <svg
    className={styles.buttonIcon}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
    />
  </svg>
);

const CopyIcon = () => (
  <svg
    className={styles.buttonIcon}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M9 9h12v12H9zM5 15H3V3h12v2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
    />
  </svg>
);

/* How long "Copied" stays up: long enough to be seen, short enough that
   the button is ready again before anyone wonders. */
const COPIED_FOR_MS = 1600;

/* One package: the carrier read from the number's shape, the number in the
   mono face so it can be read aloud, and two actions. The carrier's own
   tracking page is the primary one; Copy is the quiet second, for hosts
   who want it in the carrier's app. A shape we do not recognise keeps the
   number and the Copy, drops to a generic look-up, and never names a
   carrier it is guessing at. Copy state is per row, so two packages do not
   share one "Copied". */
const Parcel = ({ number }) => {
  const { carrier, url } = carrierFor(number);
  const [copyState, setCopyState] = useState('idle');
  const revert = useRef(null);
  const copy = my.dashboard.pack;

  useEffect(() => () => clearTimeout(revert.current), []);

  const onCopy = async () => {
    try {
      /* Throws on an http origin or a browser without the API; either way
         the number is on screen and selectable, and the label says so. */
      await navigator.clipboard.writeText(number);
      setCopyState('copied');
      clearTimeout(revert.current);
      revert.current = setTimeout(() => setCopyState('idle'), COPIED_FOR_MS);
    } catch {
      setCopyState('failed');
    }
  };

  const copyLabel =
    copyState === 'copied'
      ? copy.copiedCta
      : copyState === 'failed'
        ? copy.copyFailedCta
        : copy.copyCta;

  return (
    <li className={styles.parcel}>
      <span
        className={
          carrier
            ? styles.carrier
            : `${styles.carrier} ${styles.carrierUnknown}`
        }
      >
        {carrier || copy.unknownCarrier}
      </span>
      <span className={styles.number}>{number}</span>
      <span className={styles.parcelActions}>
        <a
          className={
            carrier
              ? styles.parcelButton
              : `${styles.parcelButton} ${styles.parcelButtonGhost}`
          }
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {carrier ? copy.trackCta(carrier) : copy.lookUpCta}
        </a>
        <button
          type="button"
          className={`${styles.parcelButton} ${styles.parcelButtonGhost}${
            copyState === 'copied' ? ` ${styles.parcelButtonDone}` : ''
          }`}
          onClick={onCopy}
        >
          {copyLabel}
        </button>
      </span>
    </li>
  );
};

/* The Fest's self check-in code, which the API sends only to its hosts.

   Hidden until asked for: hosts put this page on a projector, and a code on
   screen is a check-in anyone in the room can claim for a friend who is not
   there. Copy works while it is hidden, so a host can paste it into a slide
   without ever showing it. The code reads out character by character, since
   attendees type it and a screen reader saying "K7RQ2W" as one word helps
   nobody.

   A Fest MLH has no code for (self check-in not code_required) keeps the
   card, saying so and pointing at Organizer HQ, rather than dropping it: a
   host told about codes by MLH would otherwise wonder where theirs went. */
const MASK = '•';

const CheckInCodeCard = ({ code, manageUrl }) => {
  const copy = my.dashboard.checkInCode;
  const [shown, setShown] = useState(false);
  const [copyState, setCopyState] = useState('idle');
  const revert = useRef(null);

  useEffect(() => () => clearTimeout(revert.current), []);

  if (code === null) {
    return (
      <section className={styles.pack} aria-labelledby="check-in-code-heading">
        <h2 className={styles.packTitle} id="check-in-code-heading">
          {copy.title}
        </h2>
        <div className={styles.packBody}>
          <p className={styles.packLine}>{copy.none}</p>
          <p className={styles.packHint}>{copy.noneHint}</p>
          {manageUrl && (
            <p className={styles.codeNoneAction}>
              <a
                className={`${styles.action} ${styles.actionLight}`}
                href={manageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.noneCta}
              </a>
            </p>
          )}
        </div>
      </section>
    );
  }

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState('copied');
      clearTimeout(revert.current);
      revert.current = setTimeout(() => setCopyState('idle'), COPIED_FOR_MS);
    } catch {
      /* No clipboard (an http origin, or a browser without the API): show
         the code so it can be selected by hand, and say so. */
      setShown(true);
      setCopyState('failed');
    }
  };

  const copyLabel =
    copyState === 'copied'
      ? copy.copiedCta
      : copyState === 'failed'
        ? copy.copyFailedCta
        : copy.copyCta;
  const characters = [...code];
  const masked = MASK.repeat(characters.length);

  return (
    <section className={styles.pack} aria-labelledby="check-in-code-heading">
      <h2 className={styles.packTitle} id="check-in-code-heading">
        {copy.title}
      </h2>
      <div className={styles.packBody}>
        <p className={styles.packLine}>{copy.intro}</p>

        <div className={styles.codePanel}>
          <p className={styles.codeCells}>
            <span className={styles.visuallyHidden} aria-live="polite">
              {shown ? copy.codeLabel(code) : copy.hiddenLabel}
            </span>
            {characters.map((character, index) => (
              <span
                // Position is the identity: a code can repeat a character.
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={styles.codeCell}
                aria-hidden="true"
              >
                {shown ? character : MASK}
              </span>
            ))}
          </p>
          <div className={styles.codeActions}>
            <button
              type="button"
              className={`${styles.action} ${styles.actionButton}`}
              onClick={() => setShown((value) => !value)}
            >
              <EyeIcon />
              {shown ? copy.hideCta : copy.showCta}
            </button>
            <button
              type="button"
              className={`${styles.action} ${styles.actionButton} ${
                styles.actionLight
              }${copyState === 'copied' ? ` ${styles.actionDone}` : ''}`}
              onClick={onCopy}
            >
              <CopyIcon />
              {copyLabel}
            </button>
          </div>
        </div>

        <p className={styles.trackingLabel}>{copy.stepsLabel}</p>
        <ol className={styles.codeSteps}>
          <li className={styles.codeStep}>
            <span className={styles.codeStepNumber} aria-hidden="true">
              1
            </span>
            <p className={styles.codeStepText}>
              <span className={styles.codeStepLead}>{copy.steps.visit}</span>
              <a
                className={styles.codeUrl}
                href={copy.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.url}
              </a>
            </p>
          </li>
          <li className={styles.codeStep}>
            <span className={styles.codeStepNumber} aria-hidden="true">
              2
            </span>
            <p className={styles.codeStepText}>
              {copy.steps.enter}
              {/* The live region above already announces a reveal; this
                  copy of the code is for the eye. */}
              <span className={styles.codeStepCode} aria-hidden="true">
                {shown ? code : masked}
              </span>
            </p>
          </li>
          <li className={styles.codeStep}>
            <span className={styles.codeStepNumber} aria-hidden="true">
              3
            </span>
            <p className={styles.codeStepText}>{copy.steps.done}</p>
          </li>
        </ol>

        <p className={styles.codeHint}>
          <LockIcon />
          {copy.hint}
        </p>
      </div>
    </section>
  );
};

const FestDashboard = ({ fest, dashboard, now }) => {
  const location = [fest.city, fest.country].filter(Boolean).join(', ');
  const date = formatFestDate(fest.date);
  const time = festTimeRange(fest);
  const flagCode = countryCodeFor(fest.country);
  const manageUrl = festEditUrl(fest);
  const viewUrl = fest.websiteUrl || fest.registrationUrl;
  const showCheckIns = checkInsVisible(fest, now);
  /* Null while the numbers are still in flight: the hero paints from the
     card /my already had, and only the counts below wait. Every read of
     `dashboard` past this point is guarded by it. */
  const shipped = Boolean(dashboard) && dashboard.trackingNumbers.length > 0;
  const packageCount = shipped ? dashboard.trackingNumbers.length : 0;
  const packLine = !shipped
    ? my.dashboard.pack.notShipped
    : packageCount > 1
      ? my.dashboard.pack.shippedMany(packageCount)
      : my.dashboard.pack.shipped;
  /* One hint under the list, however many rows could not name a carrier:
     the rows themselves already show which. */
  const hasUnknownCarrier =
    shipped &&
    dashboard.trackingNumbers.some((number) => !carrierFor(number).carrier);
  /* MLH welds the partner onto the event name - "… Toronto x SharkHacks3" -
     so the heading takes the Fest and the partner gets its own line, exactly
     as the public directory's cards and modal do. Putting the partner in the
     hero's accent instead would drop the "x" that joins them and read as a
     name in two halves. */
  const { title, hostedBy } = splitFestName(fest.name);

  return (
    <>
      <PageHero
        eyebrow={
          <>
            {flagCode && (
              <span
                className={`fi fis fi-${flagCode} ${styles.flag}`}
                aria-hidden="true"
              />
            )}
            {[location, date, time].filter(Boolean).join(' · ')}
          </>
        }
        lead={title || fest.name}
        actions={
          <>
            {/* Plain anchors in the Button dress rather than
                components/Button itself: that one is styled-components, and
                this page renders entirely in the browser, where
                styled-components ship no CSS - the same reason PageHero and
                MyStatus are CSS Modules. */}
            {/* Managing leads. A host opening their own Fest's page has come
                to run it, not to look at how it advertises - the public
                listing is the thing they check second. */}
            {manageUrl && (
              <a
                className={styles.action}
                href={manageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {my.dashboard.manageCta}
              </a>
            )}
            {viewUrl && (
              <a
                className={`${styles.action} ${styles.actionGhost}`}
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {my.dashboard.viewCta}
              </a>
            )}
          </>
        }
      >
        {hostedBy && <p>{`${fests.hostedBy} ${hostedBy}`}</p>}
      </PageHero>

      <div className={styles.root}>
        {/* The counts are the only part that needs the fetch. Standing the
            loader in for them - rather than for the whole page - is what
            makes arriving from /my feel like opening this Fest rather than
            loading a page. */}
        {!dashboard && <MyLoading inline />}

        {dashboard && (
          <div className={styles.cards}>
            <CountCard
              id="registrations"
              title={my.dashboard.registrations.title}
              value={dashboard.registrationsCount}
              caption={my.dashboard.registrations.label}
            />
            {/* The count arrives on the day of the Fest, in its own time
                zone, and stays afterwards so a past Fest keeps its final
                total. Before then the card is locked rather than absent. */}
            {showCheckIns ? (
              <CountCard
                id="check-ins"
                title={my.dashboard.checkIns.title}
                value={dashboard.checkInsCount}
                caption={my.dashboard.checkIns.label}
              />
            ) : (
              <LockedCard
                id="check-ins"
                title={my.dashboard.checkIns.title}
                body={my.dashboard.checkIns.locked}
              />
            )}
          </div>
        )}

        {/* Undefined only when the API predates the code, which sends no
            key at all; null is a Fest with no code and still gets the
            card. See normalizeDashboard. */}
        {dashboard && dashboard.checkInCode !== undefined && (
          <CheckInCodeCard code={dashboard.checkInCode} manageUrl={manageUrl} />
        )}

        {dashboard && (
          <section className={styles.pack} aria-labelledby="pack-heading">
            <h2 className={styles.packTitle} id="pack-heading">
              {my.dashboard.pack.title}
            </h2>
            <div className={styles.packBody}>
              <p className={styles.packLine}>{packLine}</p>
              <PackSteps shipped={shipped} />
              {!shipped && (
                <p className={styles.packHint}>
                  {my.dashboard.pack.notShippedHint}
                </p>
              )}
              {shipped && (
                <>
                  <p className={styles.trackingLabel}>
                    {my.dashboard.pack.trackingLabel}
                  </p>
                  <ul className={styles.parcels}>
                    {dashboard.trackingNumbers.map((number) => (
                      <Parcel key={number} number={number} />
                    ))}
                  </ul>
                  {hasUnknownCarrier && (
                    <p className={styles.packHint}>
                      {my.dashboard.pack.unknownCarrierHint}
                    </p>
                  )}
                </>
              )}
            </div>
          </section>
        )}
      </div>

      {/* The same band /my closes on. A Fest only has a page here once MLH
          has approved it, so the resources are never locked on this one. */}
      <HostResourcesBand approved closing />
    </>
  );
};

export default FestDashboard;
