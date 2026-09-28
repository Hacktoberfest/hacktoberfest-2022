import ApplicationsBand from 'components/ApplicationsBand';
import CountdownBand from 'components/CountdownBand';
import HostResourcesBand from 'components/HostResourcesBand';
import HubLinkBand from 'components/HubLinkBand';
import MyHub from 'components/MyHub';
import ThankYouBand from 'components/ThankYouBand';
import WhyHostBand from 'components/WhyHostBand';
import { my } from 'data/content.mjs';
import { PREPTEMBER } from 'data/preptember.mjs';
import { hasApplied, isHost, isOrganizing } from 'lib/fests.mjs';

/* The hosting hub. Open to anyone signed in — the apply path from /host/
   ends on the applications band's "Start your first application", so a
   would-be host has to be able to get here — but only hosts are sent
   here by default (see /my/ and lib/myView.mjs). No redirect of its own:
   an attendee who lands here sees the why-host pitch, which is the right
   page for someone looking at hosting.

   `returnTo`: unlike /my/, this is not the address /login/ falls back to,
   so a signed-out visit stashes it, the way /my/fest/ does. */
const Hosting = () => (
  <MyHub
    title={my.hosting.title}
    accent={my.hosting.welcomeAccent}
    hub="hosting"
    returnTo="/my/hosting/"
  >
    {(experience, { onFestAcknowledged }) => (
      <>
        {/* The way back to stickers and rewards, for people who have two
           hubs. An attendee looking at hosting has nothing to go back to
           that the header does not already offer. */}
        {isOrganizing(experience.fests) && <HubLinkBand to="attending" />}
        {/* Preptember (data/preptember.mjs): the countdown to October 1st
           tops the hub. It clamps at zero in the gap before the flag
           flips off (lib/countdown.mjs). */}
        {PREPTEMBER && <CountdownBand />}
        <ApplicationsBand
          experience={experience}
          onFestAcknowledged={onFestAcknowledged}
        />
        {/* `approved` is isHost, not isOrganizing: a draft or submitted
           application keeps the operational resources locked — funding,
           swag, and a listing only become real once MLH approves. */}
        <HostResourcesBand approved={isHost(experience.fests)} />
        {/* The closing band forks on the application gate — the pitch
           until an application is actually sent (hasApplied: submitted
           or beyond, not drafts), a thank-you postcard after. */}
        {hasApplied(experience.fests) ? (
          <ThankYouBand user={experience.user} />
        ) : (
          <WhyHostBand />
        )}
      </>
    )}
  </MyHub>
);

export default Hosting;
