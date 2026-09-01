import styled from 'styled-components';

import Shell from 'components/Shell';
import { colors, fonts } from 'styles/tokens';

/* The wink tucked into a section's bottom-right corner: small, muted, mono,
   addressed to a reader that isn't human. The homepage FAQ was the first
   one and pointed at /llms.txt; /fests carries a second that points at the
   API's public events endpoint, because a crawler that has found the
   directory wants the JSON behind it rather than a summary of the page.

   One component for both, so the two never drift into looking like
   different kinds of thing. `external` is what tells them apart: the API
   lives on another origin and opens in its own tab, while /llms.txt is on
   this site and stays in place.

   Spacing splits on :last-child, which is the difference between the two
   placements and saves either page having to pass a prop to say which it
   is.

   Closing out a section (the homepage FAQ, where it is FaqRoot's last
   child) the section's own bottom padding is the clearance, and 40px above
   holds it off the panel — an offset shadow eats the first 7px, and this
   is an aside rather than the last row of the list.

   Standing between two bands (/fests, between the directory and the host
   callout) there is no padding below to inherit and far too much above:
   the directory closes itself with `padding-block: 40px clamp(48px, 7vw,
   90px)` (FestsDirectory.module.css, .page), so a note that then added its
   own 40px sat ~130px adrift of the cards it annotates. Subtracting that
   same clamp puts it a flat 40px under them at every width, and 40px below
   keeps it off the callout's ink border. The clamp is duplicated from the
   module rather than shared — styled-components cannot read it — so the
   two move together by hand; a second standalone placement, after a band
   that ends differently, would need its own answer rather than this one. */
const NoteRow = styled(Shell)`
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;

  &:not(:last-child) {
    margin-top: calc(40px - clamp(48px, 7vw, 90px));
    margin-bottom: 40px;
  }
`;

const NoteLink = styled.a`
  color: ${colors.muted};
  font-family: ${fonts.mono};
  font-size: 0.72rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;

  &:hover {
    color: ${colors.ink};
  }
`;

const LlmsNote = ({ href, external = false, children, ...props }) => (
  <NoteRow {...props}>
    <NoteLink
      href={href}
      {...(external
        ? { target: '_blank', rel: 'noreferrer noopener' }
        : undefined)}
    >
      {children}
    </NoteLink>
  </NoteRow>
);

export default LlmsNote;
