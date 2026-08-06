import HacktoberfestLogo from 'components/icons/HacktoberfestLogo';
import { NAV_HOST_FORM } from 'data/typeforms.mjs';

import {
  HeaderRoot,
  Logo,
  Nav,
  NavCta,
  NavLink,
  NavLinks,
  SkipLink,
  Wordmark,
} from './Header.styles';

/* `standalone` is for pages that aren't the landing page: the section links
   would point at anchors those pages don't have, so they're dropped and the
   wordmark goes home instead of scrolling to the top of the current page. */
const Header = ({ standalone = false }) => (
  <>
    <SkipLink href="#main">Skip to content</SkipLink>
    <HeaderRoot>
      <Nav as="nav" aria-label="Main navigation">
        <Wordmark
          href={standalone ? '/' : '#top'}
          aria-label="Hacktoberfest 2026 home"
        >
          <Logo as={HacktoberfestLogo} />
        </Wordmark>
        <NavLinks>
          {!standalone && (
            <>
              {/* Temporarily hidden with their sections:
              <NavLink href="#fests">The Fests</NavLink>
              <NavLink href="#take-part">How to take part</NavLink> */}
              <NavLink href="#history">Our story</NavLink>
              <NavLink href="#mission">The mission</NavLink>
              <NavLink href="#get-involved">Get involved</NavLink>
              <NavLink href="#faq">FAQs</NavLink>
            </>
          )}
          <NavCta form={NAV_HOST_FORM}>Host a Fest</NavCta>
        </NavLinks>
      </Nav>
    </HeaderRoot>
  </>
);

export default Header;
