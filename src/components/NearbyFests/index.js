import { useEffect, useState } from 'react';

import FestCard from 'components/FestsDirectory/FestCard';
import directoryStyles from 'components/FestsDirectory/FestsDirectory.module.css';
import { inPerson } from 'data/content.mjs';
import { partitionPast, sortByDateAsc, todayIso } from 'lib/festDate.mjs';
import { getFestsDirectoryOnce } from 'lib/festsDirectory.mjs';
import { homepageFirst } from 'lib/festsFeatured.mjs';
import { festsDirectoryUrl } from 'lib/festsUrl.mjs';

import styles from './NearbyFests.module.css';

/* The in-person landing page's proof: the soonest Fests, read from the
   same endpoint and rendered with the same card as the directory, so the
   two never disagree about a Fest. Six, sorted by date, two rows of
   three on desktop; the directory handles search, the map and "nearest
   to me", and the button leads there, counting what it will find: every
   Fest the directory lists, past ones included, the number its own
   results line shows before a search.

   Client-rendered after a fetch, so CSS Modules throughout (the rule
   FestsDirectory follows). The band's frame, heading and intro are static
   and in the export; the cards arrive with the first paint after
   hydration. A card opens the Fest in the directory's modal, by the same
   URL the directory itself writes for a deep link.

   `homepagePins`: lead with the Fests an admin has pinned to the
   homepage in FestNet (its own pin, not /fests' Featured), then fill the
   six with the soonest of the rest. The homepage asks for this; /in-person
   keeps the plain soonest six. Either way no card here wears the Featured
   chip: the band is a glimpse of the directory, and the directory is
   where a pin is labelled. */
const COUNT = 6;

const NearbyFests = ({ homepagePins = false }) => {
  const [state, setState] = useState({ status: 'loading', fests: [] });

  useEffect(() => {
    let cancelled = false;
    getFestsDirectoryOnce().then(
      (fests) => {
        if (!cancelled) setState({ status: 'ready', fests });
      },
      () => {
        if (!cancelled) setState({ status: 'error', fests: [] });
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const today = todayIso();
  const { upcoming } = partitionPast(state.fests, today);
  const soonest = homepagePins
    ? homepageFirst(upcoming, COUNT)
    : sortByDateAsc(upcoming).slice(0, COUNT);

  const open = (fest) => {
    window.location.assign(
      festsDirectoryUrl({
        pathname: '/fests/',
        search: '',
        query: '',
        view: 'list',
        fest: fest.id,
        format: 'all',
      }),
    );
  };

  return (
    <section className={styles.band} aria-labelledby="nearby-fests-title">
      <div className={styles.shell}>
        <div className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>{inPerson.nearby.eyebrow}</p>
            <h2 id="nearby-fests-title" className={styles.heading}>
              {inPerson.nearby.heading.lead}{' '}
              <em>{inPerson.nearby.heading.accent}</em>
            </h2>
          </div>
          <p className={styles.introCopy}>{inPerson.nearby.intro}</p>
        </div>

        {state.status === 'loading' && (
          <p className={styles.note} role="status">
            {inPerson.nearby.loading}
          </p>
        )}
        {state.status !== 'loading' && soonest.length === 0 && (
          <p className={styles.note} role="status">
            {inPerson.nearby.empty}
          </p>
        )}
        {soonest.length > 0 && (
          <div className={`${directoryStyles.list} ${styles.list}`}>
            {soonest.map((fest) => (
              <FestCard
                key={fest.id}
                fest={fest}
                distanceKm={null}
                today={today}
                onOpen={open}
                featuredBadge={false}
              />
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <a className="hf-button" href="/fests/">
            {inPerson.nearby.cta(state.fests.length)}
          </a>
        </div>
      </div>
    </section>
  );
};

export default NearbyFests;
