import Album from 'components/Album';
import FestsBand from 'components/FestsBand';
import HubLinkBand from 'components/HubLinkBand';
import MyHub from 'components/MyHub';
import RewardsBand from 'components/RewardsBand';
import { my } from 'data/content.mjs';
import { isOrganizing, organizingFests } from 'lib/fests.mjs';
import { hubToOpen, readLastHub } from 'lib/myView.mjs';

/* The attending hub. Everyone who signs in gets this page; hosts are sent
   on to /my/hosting/ unless the hub they last chose was this one (see
   lib/myView.mjs). Module-level, not inline: MyHub keeps it in its
   effect's dependency list, and a fresh arrow every render would re-run
   the fetch every render. */
const redirectFor = (experience) =>
  hubToOpen({ fests: experience.fests, lastHub: readLastHub() });

const My = () => (
  <MyHub
    title={my.title}
    accent={my.welcome.accent}
    hub="attending"
    redirectFor={redirectFor}
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
        {/* Complete, hosting cards included: this is the participant's
           calendar, and the hosting hub is the richer view of the same
           Fests. The host resources band lives there now. */}
        <FestsBand experience={experience} />
      </>
    )}
  </MyHub>
);

export default My;
