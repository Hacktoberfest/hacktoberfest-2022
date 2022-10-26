import Link from 'next/link';
import { useRouter } from 'next/router';
import styled, { keyframes } from 'styled-components';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { profileEnd, registrationEnd, registrationStart } from 'lib/config';

import Button from './button';
import { Bug } from './logo';

const textAnimation = () => keyframes`
  25% {
    content:
      "01100110 01101111 01110010 00100000 01100001 00100000 01110011 01110101 01110010 01110000 01110010 01101001 01110011 01100101 00100001 00100001 01100110 01101111 01110010 00100000 01100001 00100000 01110011 01110101 01110010 01110000 01110010 01101001 01110011 01100101 00100001 00100001 01100110 01101111 01110010 00100000 01100001 00100000 01110011 01110101 01110010 01110000 01110010 01101001 01110011 01100101 00100001 00100001" // for a surprise!!
  }
  50% {
    content:
      "01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100 01100101 01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100 01100101 01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100" // open the console
  }
  75% {
    content:
      "01100110 01101111 01110010 00100000 01100001 00100000 01110011 01110101 01110010 01110000 01110010 01101001 01110011 01100101 00100001 00100001 01100110 01101111 01110010 00100000 01100001 00100000 01110011 01110101 01110010 01110000 01110010 01101001 01110011 01100101 00100001 00100001 01100110 01101111 01110010 00100000 01100001 00100000 01110011 01110101 01110010 01110000 01110010 01101001 01110011 01100101 00100001 00100001" // for a surprise!!
  }
  }
  100% {
    content:
      "01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100 01100101 01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100 01100101 01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100" // open the console
  }
`;

const Wrapper = styled.header`
  width: 100%;
  padding: 0 64px;

  &:after {
    animation: ${textAnimation} 1s linear infinite;
    content: '01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100 01100101 01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100 01100101 01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100'; //open the console
    position: absolute;
    top: 0;
    left: 0;
    color: ${(props) => props.theme.text};
    font-size: 12px;
    pointer-events: none;
    position: fixed;
    text-align: center;
    width: 100%;
    opacity: 0.3;
    -webkit-mask-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 5%,
      rgba(0, 0, 0, 1) 20%,
      rgba(0, 0, 0, 1) 80%,
      rgba(0, 0, 0, 0) 95%
    );
    mask-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 5%,
      rgba(0, 0, 0, 1) 20%,
      rgba(0, 0, 0, 1) 80%,
      rgba(0, 0, 0, 0) 95%
    );
    white-space: nowrap;
    overflow: hidden;
    z-index: 200;

    @media (prefers-reduced-motion) {
      animation-play-state: paused;
    }
  }

  @media (max-width: 600px) {
    padding: 0 24px;
  }

  .overlay {
    background: ${(props) => props.theme.body};
    display: block;
    height: 100%;
    left: 0;
    opacity: 0;
    padding: 40px 24px;
    position: fixed;
    top: 0;
    transition: 0.5s ease;
    visibility: hidden;
    width: 100%;
    z-index: 100;

    &[aria-selected='true'] {
      opacity: 1;
      visibility: visible;
    }

    header {
      display: flex;
      justify-content: space-between;
    }

    .menu_items {
      margin-top: 64px;
      display: flex;
      flex-wrap: wrap;
      gap: 32px;

      a {
        width: 100%;
        opacity: 0.75;
        transition: 0.1s ease;
        padding-bottom: 4px;
        box-shadow: 0px 1px 0px rgba(229, 225, 230, 0.25);

        &:last-of-type {
          opacity: 1;
          box-shadow: none;

          &:hover {
            text-shadow: none;
          }

          div {
            width: 100%;
            text-align: center;
          }
        }

        &:hover {
          opacity: 1;
          text-shadow: ${(props) => props.theme.glowLite};
        }
      }
    }

    h6 {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 40px 32px;
    }

    @media (min-width: 964px) {
      &[aria-selected='true'] {
        visibility: hidden;
      }
    }
  }

  .container {
    margin: 40px auto 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1312px;

    nav {
      display: flex;
      align-items: center;
      gap: 24px;

      a,
      button {
        color: ${(props) => props.theme.text};
        opacity: 0.75;
        transition: 0.1s ease;

        &[href='/auth/'] {
          opacity: 1;

          &:hover {
            text-shadow: none;
          }
        }

        &:hover {
          opacity: 1;
          text-shadow: ${(props) => props.theme.glowLite};
        }
      }

      a {
        @media (max-width: 964px) {
          display: none;
        }
      }

      .menu_toggle {
        display: none;

        @media (max-width: 964px) {
          display: block;
        }
      }
    }

    .logo_wrapper {
      color: ${(props) => props.theme.text};
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 16px;

      p {
        opacity: 0.75;
        transition: 0.1s ease;
        text-shadow: none;
      }

      .h-mark {
        filter: ${(props) => props.theme.glowLiteDS};
      }

      .globe_wrapper {
        width: 56px;
        height: 56px;
        display: flex;
        justify-content: center;
        align-items: center;

        #globe {
          opacity: 0.5;
          transform: rotate(30deg) scale(0.5);
        }
      }

      &:hover {
        #globe {
          opacity: 1;
          transform: rotate(40deg) scale(0.47);
        }

        .h-mark {
          filter: drop-shadow(0px 0px 4px ${(props) => props.theme.holoShadow})
            drop-shadow(0px 0px 6px #000);
        }

        p {
          opacity: 1;
          text-shadow: ${(props) => props.theme.glowLite};
        }
      }
    }
  }
`;

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((state) => !state), []);

  const router = useRouter();
  useEffect(() => {
    setOpen(false);
  }, [router.pathname]);

  const hasProfile = useMemo(
    () =>
      new Date() >= new Date(registrationStart) &&
      new Date() < new Date(profileEnd),
    []
  );

  const hasRegistrationEnded = useMemo(() => new Date() >= new Date(registrationEnd), []);

  return (
    <Wrapper>
      <div className="container">
        {/* mobile menu */}
        <div className="overlay" aria-selected={open}>
          <header>
            <Link href="/" passHref>
              <a className="logo_wrapper">
                <div className="globe_wrapper">
                  <Bug />
                </div>
                <p>Hacktoberfest</p>
              </a>
            </Link>
            <nav>
              <button id="close" onClick={toggle}>
                Close
              </button>
            </nav>
          </header>
          <div className="menu_items">
            <Link href="/participation" passHref>
              <a>Participation</a>
            </Link>
            <Link href="/events" passHref>
              <a>Events</a>
            </Link>
            <Link href="/donate" passHref>
              <a>Donate</a>
            </Link>
            <Link href="/about" passHref>
              <a>About</a>
            </Link>
            <a
              href="https://discord.gg/hacktoberfest"
              target="_blank"
              rel="noreferrer noopener"
            >
              Discord
            </a>
            {hasProfile && (
              <Link href="/auth" passHref>
                <Button special as="a">
                  {hasRegistrationEnded ? 'View Profile' : 'Start Hacking'}
                </Button>
              </Link>
            )}
          </div>
          <h6>&copy; 2022 DigitalOcean, LLC. All Rights Reserved.</h6>
        </div>
        {/* mobile menu */}

        <Link href="/" passHref>
          <a className="logo_wrapper">
            <div className="globe_wrapper">
              <Bug />
            </div>
            <p>Hacktoberfest</p>
          </a>
        </Link>
        <nav className="expanded">
          <Link href="/participation" passHref>
            <a>Participation</a>
          </Link>
          <Link href="/events" passHref>
            <a>Events</a>
          </Link>
          <Link href="/donate" passHref>
            <a>Donate</a>
          </Link>
          <Link href="/about" passHref>
            <a>About</a>
          </Link>
          <a
            href="https://discord.gg/hacktoberfest"
            target="_blank"
            rel="noreferrer noopener"
          >
            Discord
          </a>
          {hasProfile && (
            <Link href="/auth" passHref>
              <Button special as="a">
                Start Hacking
              </Button>
            </Link>
          )}
          <button onClick={toggle} className="menu_toggle">
            Menu
          </button>
        </nav>
      </div>
    </Wrapper>
  );
};

export default Navigation;
