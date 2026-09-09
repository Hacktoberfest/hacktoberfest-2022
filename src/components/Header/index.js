import { useEffect, useState } from 'react';

import Banner from 'components/Banner';
import Close from 'components/icons/Close';
import HacktoberfestLogo from 'components/icons/HacktoberfestLogo';
import Hamburger from 'components/icons/Hamburger';
import { NAV } from 'data/nav.mjs';
import { PREPTEMBER } from 'data/preptember.mjs';

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
import NavGroup from './NavGroup';

/* The nav is data/nav.mjs: Home, a verb per world with its two
   destinations, FAQs. Header owns only the chip, whose label follows the
   Preptember flag, and the open/closed state of the two dropdowns.

   `standalone` only decides where the wordmark goes: home from other
   pages, back to the top on the landing page itself.

   Below the tablet breakpoint everything collapses behind the hamburger,
   where each dropdown becomes a labelled section of the list. */
const Header = ({ standalone = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  /* Enabled a tick after mount so the open/close transition never plays
     across styled-components' SSR-to-client style handoff — see the
     comment on NavLinks in Header.styles.js. */
  useEffect(() => {
    setAnimate(true);
  }, []);

  /* Which dropdown is open, by label; null for none; 'escaped' is a
     transient value the group reads to return focus to its button. One
     open at a time — opening one closes the other. */
  const [openGroup, setOpenGroup] = useState(null);
  const [escapedGroup, setEscapedGroup] = useState(null);

  useEffect(() => {
    if (!menuOpen && !openGroup) return undefined;

    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return;
      if (openGroup) {
        /* Return focus to the button only if focus was in the nav; an
           Escape pressed elsewhere while a hover-opened panel is live
           should close it, not yank focus into the header. */
        const active = document.activeElement;
        if (active && active.closest && active.closest('[data-nav-group]')) {
          setEscapedGroup(openGroup);
        }
        setOpenGroup(null);
      }
      setMenuOpen(false);
    };

    const closeOnOutsideClick = (event) => {
      if (!openGroup) return;
      if (event.target.closest && event.target.closest('[data-nav-group]'))
        return;
      setOpenGroup(null);
    };

    window.addEventListener('keydown', closeOnEscape);
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('mousedown', closeOnOutsideClick);
    };
  }, [menuOpen, openGroup]);

  useEffect(() => {
    if (escapedGroup === null) return undefined;
    const clear = setTimeout(() => setEscapedGroup(null), 0);
    return () => clearTimeout(clear);
  }, [escapedGroup]);

  const closeAll = () => {
    setOpenGroup(null);
    setMenuOpen(false);
  };

  return (
    <>
      <SkipLink href="#main">Skip to content</SkipLink>
      {/* Above the nav rather than in it: the banner scrolls away with the
          page while the nav stays put, and it sits after the skip link so
          the first thing on the keyboard's path is still the way past all
          of this. Every page renders Header, so this is what makes the
          strip site-wide. */}
      {PREPTEMBER && <Banner />}
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
            {NAV.map((entry) =>
              Array.isArray(entry.items) ? (
                <div key={entry.label} data-nav-group>
                  <NavGroup
                    id={`nav-group-${entry.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    label={entry.label}
                    items={entry.items}
                    open={
                      openGroup === entry.label
                        ? true
                        : escapedGroup === entry.label
                          ? 'escaped'
                          : false
                    }
                    animate={animate}
                    onOpen={() => setOpenGroup(entry.label)}
                    onClose={() =>
                      setOpenGroup((current) =>
                        current === entry.label ? null : current,
                      )
                    }
                    onToggle={() => {
                      setEscapedGroup(null);
                      setOpenGroup((current) =>
                        current === entry.label ? null : entry.label,
                      );
                    }}
                    onPick={closeAll}
                  />
                </div>
              ) : (
                <PageNavLink
                  key={entry.href}
                  href={entry.href}
                  onClick={closeAll}
                >
                  {entry.label}
                </PageNavLink>
              ),
            )}
            <NavCta href="/my/" onClick={closeAll}>
              {PREPTEMBER ? 'Apply to Host' : 'My Hacktoberfest'}
            </NavCta>
          </NavLinks>
        </Nav>
      </HeaderRoot>
    </>
  );
};

export default Header;
