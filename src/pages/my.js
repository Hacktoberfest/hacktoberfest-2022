import { useEffect, useState } from 'react';

import Album from 'components/Album';
import FestsBand from 'components/FestsBand';
import HubLinkBand from 'components/HubLinkBand';
import MyHub from 'components/MyHub';
import RewardsBand from 'components/RewardsBand';
import { my } from 'data/content.mjs';
import { MLH_ADDRESS_URL } from 'data/links';
import { connectOutcome } from 'lib/digitalocean.mjs';
import { isOrganizing, organizingFests } from 'lib/fests.mjs';
import { earnedIds, milestoneIds, noteEarned } from 'lib/justEarned.mjs';
import { hubToOpen, readLastHub } from 'lib/myView.mjs';
import { getSession } from 'lib/session.mjs';
import { bookStickers, rewardsState } from 'lib/stickerBook.mjs';

/* The attending hub. Everyone who signs in gets this page; hosts are sent
   on to /my/hosting/ unless the hub they last chose was this one (see
   lib/myView.mjs). Module-level, not inline: MyHub keeps it in its
   effect's dependency list, and a fresh arrow every render would re-run
   the fetch every render. */
const redirectFor = (experience) =>
  hubToOpen({ fests: experience.fests, lastHub: readLastHub() });

/* The attending hub's bands, with the one piece of state they share:
   which stickers and milestones were earned since this participant last
   looked (lib/justEarned.mjs). Read against the record every time the
   experience changes, so the sticker DigitalOcean just granted is new on
   the way back, and a check-in scanned while this page is open is new
   when the next fetch lands. Once new, always new for this mount: the
   record is brought up to date at once, but the set only grows, so a
   revalidation does not cut a moment short. */
const Bands = ({ experience }) => {
  const [justEarned, setJustEarned] = useState(() => new Set());

  useEffect(() => {
    const stickers = bookStickers(experience, { addressHref: MLH_ADDRESS_URL });
    const fresh = noteEarned(getSession(), [
      ...earnedIds(stickers),
      ...milestoneIds(rewardsState(experience, stickers)),
    ]);
    if (fresh.length === 0) return;
    setJustEarned((current) => new Set([...current, ...fresh]));
  }, [experience]);

  return (
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
      <RewardsBand experience={experience} justEarned={justEarned} />
      <Album experience={experience} justEarned={justEarned} />
      {/* The participant's calendar, hosting cards included, but not
         applications: those live on the hosting hub, the richer view
         of the same Fests. The host resources band lives there now. */}
      <FestsBand experience={experience} />
    </>
  );
};

const My = () => {
  /* The API's DigitalOcean flow lands back here with ?connected= on the
     address bar. The book itself says how it went (the sticker is earned
     or it is not), so nothing is announced; the query is only taken off
     the URL, so a reload or a share does not carry it. This is the one
     effect the page keeps for itself, and it runs after MyHub's own (a
     child's effects run before its parent's), so the ?scenario= a mocked
     build was opened with, and the query a hub redirect carries along,
     are read before this strips them. */
  useEffect(() => {
    if (!connectOutcome(globalThis.location.search)) return;
    /* history, not the router: a router navigation here would re-enter
       MyHub's effect for no reason. */
    globalThis.history.replaceState(null, '', '/my/');
  }, []);

  return (
    <MyHub
      title={my.title}
      accent={my.welcome.accent}
      hub="attending"
      redirectFor={redirectFor}
    >
      {(experience) => <Bands experience={experience} />}
    </MyHub>
  );
};

export default My;
