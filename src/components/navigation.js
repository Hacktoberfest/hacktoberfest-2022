import Link from 'next/link';
import styled from 'styled-components';
import { useState } from 'react';
import Button from './button';
import Logo, { LogoWrapper } from './logo';

const Wrapper = styled.header`
  padding: 72px 64px;
  width: 100%;

  div {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 1312px;

    ${LogoWrapper} {
      transform: scale(2) rotate(-8deg);
    }

    nav {
      display: flex;
      gap: 16px;

      &.condensed {
        display: none;
      }

      @media (max-width: 1180px) {
        &.expanded {
          display: none;
        }
        &.condensed {
          display: flex;
        }
      }
    }
  }

  .overlay {
    background: ${(props) => props.theme.body};
    display: block;
    height: 100vh;
    left: 0;
    opacity: 0;
    padding: 200px 80px;
    position: fixed;
    top: 0;
    transition: 0.5s ease;
    transition-delay: 0.2s;
    visibility: hidden;
    width: 100vw;
    z-index: 100;

    .btn {
      margin-bottom: 24px;
      opacity: 0;

      &:not(.special) {
        background: ${(props) => props.theme.text};
        color: ${(props) => props.theme.body};
      }
    }

    #close {
      position: absolute;
      right: 24px;
      top: 72px;
      z-index: 101;

      .btn {
        margin-bottom: 0;
      }
    }

    &[aria-selected='true'] {
      opacity: 1;
      visibility: visible;

      .btn {
        opacity: 1;
      }
    }

    @media (min-width: 1181px) {
      &[aria-selected='true'] {
        visibility: hidden;
      }
    }

    @media (max-width: 1180px) {
      .btn {
        padding: 20px 24px;
      }

      #close {
        right: 64px;
        top: 104px;

        .btn {
          padding: 8px 16px;
        }
      }
    }

    @media (max-width: 600px) {
      .btn {
        padding: 8px 16px;
      }

      #close {
        right: 24px;
        top: 72px;
      }
    }
  }

  @media (max-width: 600px) {
    padding: 40px 24px;
    div {
      ${LogoWrapper} {
        transform: scale(1) rotate(0deg);
      }
    }
  }
  @media (max-width: 375px) {
    div {
      ${LogoWrapper} {
        transform: scale(0.8);
        transform-origin: center left;
      }
    }
  }
`;

const Navigation = () => {
  const [toggle, setToggle] = useState(false);

  if (toggle) {
  }

  const handleChange = () => setToggle(!toggle);

  return (
    <Wrapper>
      <div className="overlay" id="modal" aria-selected={toggle}>
        <Button id="close" onClick={handleChange}>
          X
        </Button>
        <Link href="/participation" passHref>
          <Button as="a">
            Participation
          </Button>
        </Link>
        <Link href="/events" passHref>
          <Button as="a">
            Events
          </Button>
        </Link>
        <Link href="/donate" passHref>
          <Button as="a">
            Donate
          </Button>
        </Link>
        <Link href="/about" passHref>
          <Button as="a">
            About
          </Button>
        </Link>
        <Button special as="a" href="https://discord.gg/hacktoberfest">
          Join the Discord
        </Button>
      </div>
      <div>
        <Link href="/" passHref>
          <Logo as="a" />
        </Link>
        <nav className="expanded">
          <Link href="/participation" passHref>
            <Button as="a">
              Participation
            </Button>
          </Link>
          <Link href="/events" passHref>
            <Button as="a">
              Events
            </Button>
          </Link>
          <Link href="/donate" passHref>
            <Button as="a">
              Donate
            </Button>
          </Link>
          <Link href="/about" passHref>
            <Button as="a">
              About
            </Button>
          </Link>
          <Button special as="a" href="https://discord.gg/hacktoberfest">
            Join the Discord
          </Button>
        </nav>
        <nav className="condensed">
          <Button onClick={handleChange}>Menu</Button>
        </nav>
      </div>
    </Wrapper>
  );
};

export default Navigation;
