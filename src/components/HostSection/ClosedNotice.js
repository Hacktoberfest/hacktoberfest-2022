import { host } from 'data/content.mjs';
import { HACK_DAYS_URLS } from 'data/links';

import {
  ClosedBadge,
  ClosedButton,
  ClosedMessage,
  ClosedRoot,
  ClosedRow,
  ClosedText,
} from './HostSection.styles';

/* The notice at the top of /host's main: Fest applications are closed,
   and MLH Hack Days are where to go instead. First inside <main> rather
   than above the header, so the skip link lands on it and it stays
   /host's own rather than a site-wide strip. */
const ClosedNotice = () => (
  <ClosedRoot aria-label={host.closed.badge}>
    <ClosedRow>
      <ClosedMessage>
        <ClosedBadge>{host.closed.badge}</ClosedBadge>
        <ClosedText>
          <strong>{host.closed.lead}</strong> {host.closed.body}
        </ClosedText>
      </ClosedMessage>
      <ClosedButton
        href={HACK_DAYS_URLS.hostNotice}
        target="_blank"
        rel="noopener noreferrer"
      >
        {host.closed.cta}
      </ClosedButton>
    </ClosedRow>
  </ClosedRoot>
);

export default ClosedNotice;
