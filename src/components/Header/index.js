import { useEffect, useState } from 'react';

import Close from 'components/icons/Close';
import HacktoberfestLogo from 'components/icons/HacktoberfestLogo';
import Hamburger from 'components/icons/Hamburger';

import {
  HeaderRoot,
  Logo,
  MenuToggle,
  Nav,
  NavCta,
  NavLinks,
  PageNavLink,
  SkipLink,
  Wordmark,
} from './Header.styles';

/* The same three destinations on every page — the homepage's section
   anchor links are gone, so the nav no longer changes shape between
   pages. `standalone` only decides where the wordmark goes: home from
   other pages, back to the top on the landing page itself.

   "Home" leads, spelled out rather than left to the wordmark: on the
   landing page the wordmark scrolls to the top rather than navigating,
   so without this link the way home is a logo that doesn't look like
   one. "Find a Fest" is gone with the directory it pointed at — /fests
   is not part of this release, and a nav link is the loudest way to
   advertise a route that isn't there.

   "Apply to Host" wears the CTA chip: during Preptember the nav's one
   ask is the signed-in hub, where the countdown and the application
   live. Hosting info and the FAQs sit between the two, in that order:
   someone weighing whether to host reads the pitch before the detail.

   Below the tablet breakpoint the links collapse behind a hamburger
   toggle — there's no room for four items plus the wordmark at phone
   widths. */
const Header = ({ standalone = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  /* Enabled a tick after mount so the open/close transition never plays
     across styled-components' SSR-to-client style handoff — see the
     comment on NavLinks in Header.styles.js. */
  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
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
          <MenuToggle
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-links"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <Close /> : <Hamburger />}
          </MenuToggle>
          <NavLinks
            id="mobile-nav-links"
            data-open={menuOpen ? 'true' : 'false'}
            data-animate={animate ? 'true' : 'false'}
          >
            <PageNavLink href="/" onClick={() => setMenuOpen(false)}>
              Home
            </PageNavLink>
            <PageNavLink href="/host/" onClick={() => setMenuOpen(false)}>
              Learn about Hosting
            </PageNavLink>
            <PageNavLink href="/questions/" onClick={() => setMenuOpen(false)}>
              FAQs
            </PageNavLink>
            <NavCta href="/my/" onClick={() => setMenuOpen(false)}>
              Apply to Host
            </NavCta>
          </NavLinks>
        </Nav>
      </HeaderRoot>
    </>
  );
};

export default Header;
