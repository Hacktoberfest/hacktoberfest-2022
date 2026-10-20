import { useState } from 'react';

import { CheckIcon } from 'components/icons/badges';
import DigitalOceanLogo from 'components/icons/DigitalOceanLogo';
import { my } from 'data/content.mjs';
import {
  SPONSOR_OPT_INS,
  optInsFrom,
  saveSponsorOptIn,
} from 'lib/sponsorOptIns.mjs';

import styles from './ResourcesBand.module.css';

const copy = my.resourcesBand.optIns;

/* Each sponsor's mark as it ships: DigitalOcean's black logo is the site's
   own icon component, the other two are the sponsor wall's files.
   Decorative: the label beside it names the sponsor. */
const Logo = ({ slug }) =>
  slug === 'digitalocean' ? (
    <DigitalOceanLogo className={styles.optInLogo} />
  ) : (
    <img
      className={
        slug === 'temporal'
          ? `${styles.optInLogo} ${styles.optInLogoTemporal}`
          : styles.optInLogo
      }
      src={`/sponsors/${slug}.svg`}
      alt=""
    />
  );

/* "Hear from Hacktoberfest's sponsors.": the third card in the resources
   band, full width under the other two. One checkbox per sponsor, each
   saved the moment it changes (lib/sponsorOptIns.mjs). Nothing is ticked
   until the participant ticks it.

   `optIns` is the profile's map, and `onSaved(slug, optedIn)` writes a
   saved answer through to the hub's experience and its cache. `mine`
   holds what this visit has sent and wins over `optIns`, so a
   revalidation that left before the tick cannot flip the box back when
   it lands. A box is held (aria-disabled, clicks ignored) while its save
   is in flight, so two quick clicks cannot land out of order; a failed
   save puts the box back as it was. */
const OptIns = ({ optIns, onSaved }) => {
  const [mine, setMine] = useState({});
  const [pending, setPending] = useState({});
  const [status, setStatus] = useState(null);

  const answers = { ...optInsFrom(optIns), ...mine };

  const toggle = async (slug) => {
    if (pending[slug]) return;
    const previous = answers[slug];
    setMine((current) => ({ ...current, [slug]: !previous }));
    setPending((current) => ({ ...current, [slug]: true }));
    setStatus(null);
    try {
      const saved = await saveSponsorOptIn(slug, !previous);
      setMine((current) => ({ ...current, [slug]: saved[slug] }));
      if (onSaved) onSaved(slug, saved[slug]);
      setStatus('saved');
    } catch {
      setMine((current) => ({ ...current, [slug]: previous }));
      setStatus('failed');
    } finally {
      setPending((current) => ({ ...current, [slug]: false }));
    }
  };

  return (
    <div className={`${styles.card} ${styles.optIns}`}>
      <div className={styles.optInsHead}>
        <div className={styles.cardBody}>
          <span className={`${styles.chip} ${styles.chipOptIns}`}>
            {copy.chip}
          </span>
          <h3 className={styles.cardTitle}>{copy.title}</h3>
          <p className={styles.cardText}>{copy.body}</p>
        </div>
        {/* Always in the page, so screen readers hear each change. */}
        <p
          role="status"
          className={
            status === 'failed'
              ? `${styles.optInsStatus} ${styles.optInsFailed}`
              : styles.optInsStatus
          }
        >
          {status === 'saved' && (
            <>
              <CheckIcon className={styles.optInsStatusIcon} />
              {copy.saved}
            </>
          )}
          {status === 'failed' && copy.failed}
        </p>
      </div>
      <ul className={styles.optInList}>
        {SPONSOR_OPT_INS.map(({ slug, name }) => (
          <li key={slug}>
            <label className={styles.optIn}>
              <span className={styles.optInMark}>
                <Logo slug={slug} />
              </span>
              <span className={styles.optInChoice}>
                <input
                  className={styles.optInInput}
                  type="checkbox"
                  checked={answers[slug]}
                  aria-disabled={pending[slug] ? 'true' : undefined}
                  onChange={() => toggle(slug)}
                />
                <span className={styles.optInBox} aria-hidden="true">
                  <CheckIcon className={styles.optInCheck} />
                </span>
                <span>
                  {copy.label} <strong>{name}</strong>
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OptIns;
