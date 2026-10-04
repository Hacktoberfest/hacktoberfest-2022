import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';

import FestMap from 'components/FestMap';
import FestSearch from 'components/FestSearch';
import DevLogo from 'components/icons/DevLogo';
import DigitalOceanLogo from 'components/icons/DigitalOceanLogo';
import MlhLogo from 'components/icons/MlhLogo';
import { hero, mapHero } from 'data/content.mjs';
import { DEV_URL, DIGITALOCEAN_URL, MLH_URL } from 'data/links';
import { countRoll } from 'lib/countRoll.mjs';
import { getFestsDirectoryOnce } from 'lib/festsDirectory.mjs';

import styles from './FestMapHero.module.css';

/* The October homepage's hero: every Fest on a map of the world, and the
   way to find the nearest one above it. It replaces components/Hero for
   October, keeping that hero's forest ground, eyebrow, display type and
   partner credit so the homepage still reads as the same site.

   One centred axis, in the order a visitor needs it (the research round
   of 2026-09-28): the task first, as one group (what this is, the
   headline, the search); then the map as the proof, with one line under
   it for anyone with no Fest nearby; then a light sign-off rail with the
   campaign line and the partners, labelled, in their own colours, the
   way every Hacktoberfest hero since 2020 has credited them. Only the
   search is boxed.

   The hero fetches the Fests once (the same request NearbyFests shares)
   and hands them to the search and the map, and the search tells the map
   what it is showing, so the two answer each other. */
const FestMapHero = () => {
  const [state, setState] = useState({ status: 'loading', fests: null });
  const [highlight, setHighlight] = useState(null);
  const heroRef = useRef(null);

  /* How far down the page the hero starts, which is what it subtracts
     from the screen's height to fill the rest of it (see the stylesheet):
     the nav, and the Today strip when there is one. Measured before paint
     and again whenever the page above it changes size, as when the strip
     leaves on a day outside October or wraps onto two lines on a phone. */
  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;
    let last = null;
    const measure = () => {
      const top = Math.round(hero.getBoundingClientRect().top + window.scrollY);
      if (top !== last) {
        last = top;
        hero.style.setProperty('--hero-top', `${top}px`);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getFestsDirectoryOnce().then(
      (list) => {
        if (!cancelled) setState({ status: 'ready', fests: list });
      },
      () => {
        /* The search still submits to the directory, and the map is
           still a map of the world. */
        if (!cancelled) setState({ status: 'error', fests: [] });
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      aria-labelledby="home-hero-title"
    >
      {/* The task and the map as one block, centred in whatever height
          the screen gives the hero, above the rail. */}
      <div className={styles.stage}>
        <div className={styles.task}>
          <p className={styles.eyebrow}>
            {mapHero.eyebrow.map((line) => (
              <span key={line} className={styles.eyebrowLine}>
                {line}
              </span>
            ))}
          </p>
          {/* The count's changed digits roll up on load, one after the
              other, the old digit drawn by the stylesheet so the text is
              the new count all along. */}
          <h1 id="home-hero-title" className={styles.heading}>
            {countRoll(mapHero.heading.lead, mapHero.heading.rollFrom).map(
              (part, i) => (
                <Fragment key={i}>
                  {part.from ? (
                    <span
                      className={styles.roll}
                      data-from={part.from}
                      style={{ '--roll-turn': part.turn }}
                    >
                      <span className={styles.rollTo}>{part.text}</span>
                    </span>
                  ) : (
                    part.text
                  )}
                </Fragment>
              ),
            )}{' '}
            <em>{mapHero.heading.accent}</em>
          </h1>
          <div className={styles.search}>
            <FestSearch fests={state.fests} onHighlight={setHighlight} />
          </div>
        </div>

        <div className={styles.map}>
          <FestMap
            fests={state.fests}
            status={state.status}
            highlight={highlight}
          />
        </div>

        {/* The other way in, for anyone the map shows no Fest near: one
            quiet line under it, so the search stands alone above. */}
        <p className={styles.online}>
          <span className={styles.onlineAsk}>{mapHero.online.prompt}</span>{' '}
          <a href={mapHero.online.href}>{mapHero.online.cta}</a>
        </p>
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

export default FestMapHero;
