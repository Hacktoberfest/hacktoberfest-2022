import { useEffect, useState } from 'react';

import Album from 'components/Album';
import FestsBand from 'components/FestsBand';
import HubLinkBand from 'components/HubLinkBand';
import Inventory from 'components/Inventory';
import MyHub from 'components/MyHub';
import RewardsBand from 'components/RewardsBand';
import { my } from 'data/content.mjs';
import { MLH_ADDRESS_URL } from 'data/links';
import { connectOutcome } from 'lib/digitalocean.mjs';
import { calendarFests, isOrganizing, organizingFests } from 'lib/fests.mjs';
import { inventoryItems, itemIds } from 'lib/inventory.mjs';
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
   which stickers, milestones and things in the inventory were earned
   since this participant last looked (lib/justEarned.mjs). Read against the record every time the
   experience changes, so the sticker DigitalOcean just granted is new on
   the way back, and a check-in scanned while this page is open is new
   when the next fetch lands. Once new, always new for this mount: the
   record is brought up to date at once, but the set only grows, so a
   revalidation does not cut a moment short. */
const Bands = ({ experience }) => {
  const [justEarned, setJustEarned] = useState(() => new Set());
  const hasFests = calendarFests(experience.fests).length > 0;

  useEffect(() => {
    const stickers = bookStickers(experience, { addressHref: MLH_ADDRESS_URL });
    const fresh = noteEarned(getSession(), [
      ...earnedIds(stickers),
      ...milestoneIds(rewardsState(experience, stickers)),
      ...itemIds(inventoryItems(experience)),
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
      {/* The story in order: what is coming up, what you do, what it gets
         you, what you have. The Fests band is the participant's calendar
         (hosting cards included, applications on the hosting hub), and it
         leads only when there is a Fest on it; with none it is two
         invitations, and they close the page instead. */}
      {hasFests && <FestsBand experience={experience} />}
      <Album experience={experience} justEarned={justEarned} />
      <RewardsBand experience={experience} justEarned={justEarned} />
      {/* The rewards: what the stickers earned, as a locker, the API's
         items (lib/inventory.mjs). */}
      <Inventory experience={experience} justEarned={justEarned} />
      {!hasFests && <FestsBand experience={experience} />}
    </>
  );
};

/* The hero's one line: the milestone intro for the level reached, the
   sentence the rewards band used to open with. */
const heroStatus = (experience) => {
  const stickers = bookStickers(experience, { addressHref: MLH_ADDRESS_URL });
  const rewards = rewardsState(experience, stickers);
  return [
    my.rewards.intro.pending(rewards.complete),
    my.rewards.intro.stickersEarned(rewards.complete),
    my.rewards.intro.complete,
    my.rewards.intro.completionist,
  ][rewards.level];
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
      status={heroStatus}
    >
      {(experience) => <Bands experience={experience} />}
    </MyHub>
  );
};

export default My;
