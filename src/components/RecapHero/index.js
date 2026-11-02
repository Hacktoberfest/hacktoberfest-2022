import { Fragment, useEffect, useState } from 'react';

import FestMap from 'components/FestMap';
import DevLogo from 'components/icons/DevLogo';
import DigitalOceanLogo from 'components/icons/DigitalOceanLogo';
import MlhLogo from 'components/icons/MlhLogo';
import { hero, mapHero, recapHero } from 'data/content.mjs';
import { DEV_URL, DIGITALOCEAN_URL, MLH_URL } from 'data/links';
import { getFestsDirectoryOnce } from 'lib/festsDirectory.mjs';

import styles from './RecapHero.module.css';

/* The post-season homepage's hero (direction B of the 2026-10-30 canvas,
   with direction C's headline): the thank-you, every Fest on the map and
   the season in numbers, over the campaign line and the partners. It
   asks nothing of the visitor; the header's My Hacktoberfest chip is the
   way to the sticker book. It replaces components/FestMapHero
   after October and keeps its map, type and sign-off rail, so the
   homepage still reads as the same site. The search and the line to
   /online/ went with the pages they led to (data/retiredRoutes.mjs).

   The numbers are copy (data/content.mjs recapHero), not counts. The map
   still draws from the events endpoint and fills in after hydration, as
   it did in October. */
/* "Countries/territories" is one long word to a browser, wider than a
   phone's stat cell; a break opportunity after each slash lets a label
   wrap there instead of spilling out of its cell. */
const slashBreaks = (text) => {
  const parts = text.split('/');
  /* Each slash rides with the text before it, one text node, so the
     server render puts no <!-- --> marker between them. */
  return parts.map((part, index) =>
    index < parts.length - 1 ? (
      // eslint-disable-next-line react/no-array-index-key
      <Fragment key={index}>
        {`${part}/`}
        <wbr />
      </Fragment>
    ) : (
      part
    ),
  );
};

const RecapHero = () => {
  const [state, setState] = useState({ status: 'loading', fests: null });

  useEffect(() => {
    let cancelled = false;
    getFestsDirectoryOnce().then(
      (list) => {
        if (!cancelled) setState({ status: 'ready', fests: list });
      },
      () => {
        // The map is still a map of the world.
        if (!cancelled) setState({ status: 'error', fests: [] });
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <div className={styles.stage}>
        <p className={styles.eyebrow}>
          {recapHero.eyebrow.map((line) => (
            <span key={line} className={styles.eyebrowLine}>
              {line}
            </span>
          ))}
        </p>
        <h1 id="home-hero-title" className={styles.heading}>
          {recapHero.heading.lead} <em>{recapHero.heading.accent}</em>
        </h1>

        <div className={styles.map}>
          <FestMap fests={state.fests} status={state.status} />
        </div>

        {/* The first number leads, in ochre: the Fests, now that the
            participants are the headline. */}
        <ul className={styles.stats}>
          {recapHero.stats.map((stat) => (
            <li key={stat.label} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>{' '}
              <span className={styles.statLabel}>
                {slashBreaks(stat.label)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.rail}>
        <p className={styles.tagline}>
          {mapHero.tagline.lead} <em>{mapHero.tagline.accent}</em>
        </p>
        <span
          className={styles.rule}
          data-between="tagline"
          aria-hidden="true"
        />
        <div className={styles.lockups}>
          <div className={styles.lockup}>
            <span className={styles.lockupLabel}>{hero.poweredByLabel}</span>
            <span className={styles.lockupMarks}>
              <a
                href={MLH_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Major League Hacking"
              >
                <MlhLogo className={styles.mlh} />
              </a>
              <span className={styles.times} aria-hidden="true">
                &times;
              </span>
              <a
                href={DEV_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DEV"
              >
                <DevLogo className={styles.dev} />
              </a>
            </span>
          </div>
          <span
            className={styles.rule}
            data-between="lockups"
            aria-hidden="true"
          />
          <div className={styles.lockup}>
            <span className={styles.lockupLabel}>{hero.presentingLabel}</span>
            <span className={styles.lockupMarks}>
              <a
                href={DIGITALOCEAN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DigitalOcean"
              >
                <DigitalOceanLogo className={styles.digitalocean} />
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecapHero;
