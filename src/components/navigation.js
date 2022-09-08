import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { Bug } from './logo';

// const Moon = () => {
//   return (
//     <svg
//       width="14"
//       height="14"
//       viewBox="0 0 14 14"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path d="M10.9728 0.875252C10.9549 0.875085 10.9369 0.875 10.9189 0.875C7.95013 0.875 5.54345 3.15428 5.54345 5.96591C5.54345 8.77754 7.95013 11.0568 10.9189 11.0568C12.0651 11.0568 13.1275 10.7171 14 10.1381C12.7851 12.4284 10.282 14 7.39127 14C3.30918 14 0 10.866 0 7C0 3.13401 3.30918 0 7.39127 0C8.69071 0 9.91184 0.317578 10.9728 0.875252Z" />
//     </svg>
//   );
// };

// const MoonButton = styled(Button)`
//   margin: 0 auto 0 0;

//   svg {
//     vertical-align: middle;

//     path {
//       fill: ${(props) => props.theme.body};
//     }
//   }
// `;

// const breakpoint = 1100;
// const breakpointSm = 600;
// const breakpointXs = 375;
// const breakpointHomeOffset = 160;

// const Wrapper = styled.header`
//   padding: 72px 64px;
//   width: 100%;

//   div {
//     align-items: center;
//     display: flex;
//     justify-content: space-between;
//     margin: 0 auto;
//     max-width: 1312px;

//     ${(props) =>
//       props.isHome &&
//       css`
//         ${LogoWrapper} {
//           transform: scale(2) rotate(-8deg);
//           margin: 0 0 0 64px;
//         }
//       `}

//     nav {
//       display: flex;
//       gap: 16px;
//       padding: 16px 0;
//       position: relative;

//       ${(props) =>
//         !props.isHome &&
//         css`
//           flex-grow: 1;
//           justify-content: flex-end;
//           margin: 0 0 0 64px;
//         `}

//       // &::after {
//       //   position: absolute;
//       //   bottom: 0;
//       //   display: block;
//       //   content: '';
//       //   height: 1px;
//       //   width: 100%;
//       //   background: linear-gradient(
//       //     90deg,
//       //     ${(props) => props.theme.spark} 0%,
//       //     ${(props) => props.theme.surf} 50%,
//       //     ${(props) => props.theme.psybeam} 100%
//       //   );
//       // }

//       &.condensed {
//         display: none;
//       }

//       @media (max-width: ${(props) =>
//           breakpoint + (props.isHome ? breakpointHomeOffset : 0)}px) {
//         &.expanded {
//           display: none;
//         }

//         &.condensed {
//           display: flex;
//         }
//       }
//     }
//   }

//   .overlay {
//     background: ${(props) => props.theme.body};
//     display: block;
//     height: 100%;
//     left: 0;
//     opacity: 0;
//     padding: 200px 80px;
//     position: fixed;
//     top: 0;
//     transition: 0.5s ease;
//     transition-delay: 0.2s;
//     visibility: hidden;
//     width: 100%;
//     z-index: 100;

//     .btn {
//       margin-bottom: 24px;
//       opacity: 0;

//       &:not(.special) {
//         background: ${(props) => props.theme.text};
//         color: ${(props) => props.theme.body};
//       }
//     }

//     #close {
//       position: absolute;
//       right: 24px;
//       top: 72px;
//       z-index: 101;

//       .btn {
//         margin-bottom: 0;
//       }
//     }

//     &[aria-selected='true'] {
//       opacity: 1;
//       visibility: visible;

//       .btn {
//         opacity: 1;
//       }
//     }

//     @media (min-width: ${(props) =>
//         breakpoint + (props.isHome ? breakpointHomeOffset : 0) + 1}px) {
//       &[aria-selected='true'] {
//         visibility: hidden;
//       }
//     }

//     @media (max-width: ${(props) =>
//         breakpoint + (props.isHome ? breakpointHomeOffset : 0)}px) {
//       .btn {
//         padding: 20px 24px;
//       }

//       #close {
//         right: 64px;
//         top: 104px;

//         .btn {
//           padding: 8px 16px;
//         }
//       }
//     }

//     @media (max-width: ${(props) =>
//         breakpointSm + (props.isHome ? breakpointHomeOffset : 0)}px) {
//       .btn {
//         padding: 8px 16px;
//       }

//       #close {
//         right: 24px;
//         top: 72px;
//       }
//     }
//   }

//   @media (max-width: ${(props) =>
//       breakpointSm + (props.isHome ? breakpointHomeOffset : 0)}px) {
//     padding: 40px 24px;

//     div {
//       ${(props) =>
//         props.isHome &&
//         css`
//           ${LogoWrapper} {
//             transform: scale(1) rotate(0deg);
//             margin: 0;
//           }
//         `}
//     }
//   }

//   @media (max-width: ${breakpointXs}px) {
//     div {
//       ${LogoWrapper} {
//         transform: scale(0.8);
//         transform-origin: center left;
//       }
//     }
//   }
// `;

const Wrapper = styled.header`
  width: 100%;
  padding: 0 64px;

  @media (max-width: 600px) {
    padding: 0 32px;
  }

  .overlay {
    background: ${(props) => props.theme.body};
    display: block;
    height: 100%;
    left: 0;
    opacity: 0;
    padding: 40px 32px;
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

    @media (min-width: 872px) {
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
      gap: 24px;

      a,
      button {
        color: ${(props) => props.theme.text};
        opacity: 0.75;
        transition: 0.1s ease;

        &:hover {
          opacity: 1;
          text-shadow: ${(props) => props.theme.glowLite};
        }
      }

      a {
        @media (max-width: 872px) {
          display: none;
        }
      }

      .menu_toggle {
        display: none;

        @media (max-width: 872px) {
          display: block;
        }
      }
    }

    .logo_wrapper {
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

      .globe_wrapper {
        width: 56px;
        height: 56px;
        display: flex;
        justify-content: center;
        align-items: center;

        #globe {
          transform: rotate(30deg) scale(0.5);
        }
      }

      &:hover {
        #globe {
          opacity: 1;
          transform: rotate(45deg) scale(0.48);
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
  useEffect(() => { setOpen(false); }, [ router.pathname ]);

  // const isHome = useMemo(() => router.pathname === '/', [router.pathname]);

  // const themeToggle = useThemeToggle();

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
            <a href="https://discord.gg/hacktoberfest" target="_blank" rel="noreferrer noopener">Join the Discord</a>
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
          <a href="https://discord.gg/hacktoberfest" target="_blank" rel="noreferrer noopener">Join the Discord</a>
          <button onClick={toggle} className="menu_toggle">
            Menu
          </button>
        </nav>
      </div>
    </Wrapper>
  );
};

export default Navigation;
