import { useEffect, useState } from 'react';

import Album from 'components/Album';
import FestsBand from 'components/FestsBand';
import HubLinkBand from 'components/HubLinkBand';
import MyHub from 'components/MyHub';
import RewardsBand from 'components/RewardsBand';
import { my } from 'data/content.mjs';
import { connectOutcome } from 'lib/digitalocean.mjs';
import { isOrganizing, organizingFests } from 'lib/fests.mjs';
import { hubToOpen, readLastHub } from 'lib/myView.mjs';

/* The attending hub. Everyone who signs in gets this page; hosts are sent
   on to /my/hosting/ unless the hub they last chose was this one (see
   lib/myView.mjs). Module-level, not inline: MyHub keeps it in its
   effect's dependency list, and a fresh arrow every render would re-run
   the fetch every render. */
const redirectFor = (experience) =>
  hubToOpen({ fests: experience.fests, lastHub: readLastHub() });

const My = () => {
  /* One sentence on the way back from a connect flow, read off the
     address bar once and then taken out of it, so a reload or a share of
     the URL does not say it again. This is the one effect the page keeps
     for itself: the API's DigitalOcean flow lands on /my/ alone, so the
     shell has no business knowing about it. */
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    /* location.search, not the router's query, for the reason MyHub gives.
       This runs after MyHub's own effect (a child's effects run before its
       parent's), so the ?scenario= a mocked build was opened with, and the
       query a hub redirect carries along, are read before this strips
       them. */
    const outcome = connectOutcome(globalThis.location.search);
    if (!outcome) return;
    setNotice(my.connect.digitalocean[outcome]);
    /* history, not the router: the query is consumed, and a router
       navigation here would re-enter MyHub's effect for no reason. */
    globalThis.history.replaceState(null, '', '/my/');
  }, []);

  return (
    <MyHub
      title={my.title}
      accent={my.welcome.accent}
      hub="attending"
      redirectFor={redirectFor}
      notice={notice}
    >
      {(experience) => (
        <>
          {/* Hosts who chose to be here still get the way back. Attendees
             have one hub and see no band. */}
          {isOrganizing(experience.fests) && (
            <HubLinkBand
              to="hosting"
              festCount={organizingFests(experience.fests).length}
            />
          )}
          {/* The hub's progress, as two bands: the two rewards the stickers
             add up to, then the sticker book, every sticker there is to
             earn on a page per type. */}
          <RewardsBand experience={experience} />
          <Album experience={experience} />
          {/* The participant's calendar, hosting cards included, but not
             applications: those live on the hosting hub, the richer view
             of the same Fests. The host resources band lives there now. */}
          <FestsBand experience={experience} />
        </>
      )}
    </MyHub>
  );
};

export default My;
