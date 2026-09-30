import { useState } from 'react';

import { my } from 'data/content.mjs';
import { MLH_GITHUB_URL, MLH_PHONE_URL } from 'data/links';
import { claimAndGo, offersWithCodes, promoLocked } from 'lib/offers.mjs';
import { clearSession, stashReturnTo } from 'lib/session.mjs';

import styles from './SponsorOffers.module.css';

const copy = my.promos;

/* The body of /my/promos/: the participant's codes, one card per code, with
   the count above and the way back to /my/ below. A sponsor with only a
   challenge has no card (lib/offers.mjs's offersWithCodes). The cards carry
   no logo: the only one MLH sends is the challenge's
   sponsor_activation.logo_url, a wide wordmark or nothing, and a card only
   has room for a square mark. CSS Module and global hf-button classes only:
   this page renders entirely in the browser, where styled-components ship
   no CSS. See PageHero's note. */

const REQUIREMENT_HREFS = {
  verified_phone: MLH_PHONE_URL,
  github_oauth: MLH_GITHUB_URL,
};

const BackArrow = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const AlertIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5" />
    <path d="M12 16.5v.5" />
  </svg>
);

const ForwardArrow = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

/* The site's padlock (LockedBand's LockedPanel), for a code that unlocks
   at check-in. */
const LockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M7 10V8a5 5 0 0 1 10 0v2h1.5v11h-13V10H7zm2.5 0h5V8a2.5 2.5 0 0 0-5 0v2z"
      fill="currentColor"
    />
  </svg>
);

const TrophyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
    <path d="M17 5h3v2a3 3 0 0 1-3 3" />
    <path d="M7 5H4v2a3 3 0 0 0 3 3" />
  </svg>
);

/* Only a missing step gets a line. `false` is MLH saying it is not done,
   so the line asks; `null` is MLH not telling us, so it only points at
   where to check. A done step shows nothing. A check-in happens at the
   Fest, so there is nothing to do about it here: an unmet one reads as
   locked, muted with the padlock, not as an alert, and has no link. */
const RequirementLine = ({ requirement }) => {
  if (requirement.met === true) return null;
  const words = copy.requirements[requirement.kind];
  if (requirement.kind === 'checked_in') {
    return (
      <p className={styles.locked}>
        <LockIcon />
        <span>{words.needs}</span>
      </p>
    );
  }
  const href = REQUIREMENT_HREFS[requirement.kind];
  const unmet = requirement.met === false;

  return (
    <p className={unmet ? styles.need : styles.check}>
      {unmet && <AlertIcon />}
      <span>
        {words.needs}
        {href && (
          <>
            {' '}
            <a href={href} target="_blank" rel="noopener noreferrer">
              {unmet ? words.act : copy.checkRequirement}
            </a>
          </>
        )}
      </span>
    </p>
  );
};

/* The sponsor's challenge, small, under its code. */
const ChallengeLine = ({ challenge }) => (
  <p className={styles.challenge}>
    <TrophyIcon />
    <span>
      {challenge.external ? copy.challenge.dev : copy.challenge.other}{' '}
      {challenge.url ? (
        <a href={challenge.url} target="_blank" rel="noopener noreferrer">
          {challenge.name}
        </a>
      ) : (
        challenge.name
      )}
    </span>
  </p>
);

/* One code. The link is fetched on click (lib/offers.mjs says why), and a
   busy button is what keeps a double click to one request. A locked code
   (a step MLH says is not done, named in the lines above it) greys its
   button out the same way and never asks for a link MLH would refuse. Both
   are aria-disabled rather than disabled so keyboard focus stays on the
   button. A session that died while the page sat open goes back through
   sign-in to this page, the same exit the page's own fetch takes. */
const CodeRow = ({ offer }) => {
  const { company, promo, challenges } = offer;
  const [state, setState] = useState('idle');
  const locked = promoLocked(promo);

  const claim = async () => {
    if (locked || state === 'claiming') return;
    setState('claiming');
    const outcome = await claimAndGo({
      promo,
      go: (url) => globalThis.location.assign(url),
    });

    if (outcome === 'signedOut') {
      clearSession();
      stashReturnTo('/my/promos/');
      globalThis.location.assign('/login/');
      return;
    }
    setState(outcome === 'navigated' ? 'idle' : outcome);
  };

  const claiming = state === 'claiming';
  const finePrint = [promo.description, promo.restrictions]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={styles.code}>
      <h3 className={styles.title}>{promo.label || company.name}</h3>
      <div className={styles.body}>
        {finePrint && <p className={styles.text}>{finePrint}</p>}
        {promo.requirements.map((requirement) => (
          <RequirementLine key={requirement.kind} requirement={requirement} />
        ))}
        {challenges.map((challenge) => (
          <ChallengeLine key={challenge.id} challenge={challenge} />
        ))}
        {state === 'failed' && (
          <p className={styles.failed} role="alert">
            {copy.claimFailed}
          </p>
        )}
        {state === 'unavailable' && (
          <p className={styles.failed} role="alert">
            {copy.claimUnavailable}
          </p>
        )}
      </div>
      <div className={styles.action}>
        <button
          type="button"
          className="hf-button hf-button--small"
          onClick={claim}
          aria-disabled={claiming || locked}
        >
          {claiming ? copy.claiming : copy.claimCta}
        </button>
      </div>
    </li>
  );
};

const countLabel = (count) => {
  if (count === 0) return copy.count.none;
  if (count === 1) return copy.count.one;
  return copy.count.many(count);
};

const SponsorOffers = ({ offers }) => {
  const codes = offersWithCodes(offers);

  return (
    <div className={styles.root}>
      {/* h2: the hero carries the page's h1; each code's title is an h3. */}
      <h2 className={styles.caption}>
        <span>{countLabel(codes.length)}</span>
        <span className={styles.captionRule} aria-hidden="true" />
      </h2>
      {codes.length === 0 ? (
        <section
          className={styles.empty}
          aria-labelledby="promos-empty-heading"
        >
          <h3 className={styles.emptyTitle} id="promos-empty-heading">
            {copy.empty.title}
          </h3>
          <p>{copy.empty.body}</p>
          <a className="hf-button hf-button--small" href={copy.empty.href}>
            {copy.empty.cta}
            <ForwardArrow />
          </a>
        </section>
      ) : (
        <>
          <ul className={styles.codes}>
            {codes.map((offer) => (
              <CodeRow key={offer.company.id} offer={offer} />
            ))}
          </ul>
          {/* The next slot in the list, left open: dashed like the empty
              state, since both say codes are still to come. */}
          <div className={styles.more}>
            <PlusIcon />
            <p>
              <strong>{copy.more.title}</strong> {copy.more.body}
            </p>
          </div>
        </>
      )}
      <a className={styles.backBottom} href={copy.backHref}>
        <BackArrow />
        {copy.back}
      </a>
    </div>
  );
};

export default SponsorOffers;
