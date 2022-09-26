import Head from 'next/head';
import { useRouter } from 'next/router';
import styled, { keyframes } from 'styled-components';

import Section from 'components/section';
import Button from 'components/button';
import Loader from 'components/loader';
import { FauxHero } from 'components/hero';

import useAuth from 'hooks/useAuth';

import { oauth } from 'lib/api';

const loadAnim = (x) => keyframes`
  from {
    transform: translateY(80px) rotate(${x});
    opacity: 0;
  }
  to {
    transform: translateY(0px) rotate(0deg);
    opacity: 1;
  }
`;

const StyledCard = styled.div`
  width: 304px;
  padding: 24px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    ${(props) => props.theme[props.color]} 180%
  );
  border: 1px solid ${(props) => props.theme[props.color]};
  box-shadow: 0px 0px 12px ${(props) => props.theme[props.color]};
  border-radius: 24px;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  gap: 24px;
  text-align: center;
  margin: 40px;
  transition: box-shadow 0.2s ease;
  transform: translateY(80px);
  opacity: 0;
  animation: ${(props) => loadAnim(props.rotate)} 0.8s ${(props) => props.delay}
    ease forwards;

  svg {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  a {
    width: 100%;
    transition: 0.2s ease;
    margin-top: 24px;

    div {
      width: 100%;
    }

    &:hover {
      filter: drop-shadow(0px 0px 8px ${(props) => props.theme[props.color]});
    }
  }

  @media (max-width: 872px) {
    &:first-of-type {
      margin-top: 104px;
    }
    margin: 40px 0px 0px;
    width: 100%;
    flex-flow: column wrap;
  }
`;

const Card = (props) => {
  return (
    <StyledCard color={props.color} delay={props.delay} rotate={props.rotate}>
      {props.children}
    </StyledCard>
  );
};

const typingAnim = () => keyframes`
  from {
    width: 0ch;
  }
`;

const StyledP = styled.p`
  position: absolute;
  top: 40px;
  left: 0;
  display: flex;
  line-height: 40px;

  span {
    white-space: nowrap;
    overflow: hidden;
    width: ${(props) => props.width}ch;
    animation: ${typingAnim} 1.5s steps(${(props) => props.width});
  }
`;

const StyledHeader = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  height: 40px;
`;

const Auth = () => {
  const auth = useAuth();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Auth | Hacktoberfest 2022</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content="Auth | Hacktoberfest 2022"
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content="Auth | Hacktoberfest 2022"
        />
      </Head>

      {auth.loading ? (
        <FauxHero
          h="220"
          s="8"
          b="0.4"
          gradientLeft="#E800FF"
          gradientRight="#0F00FF"
          height="600px"
        >
          <StyledHeader>
            <Loader message=">> Authorization in progress..." />
          </StyledHeader>
        </FauxHero>
      ) : (
        <FauxHero
          h="220"
          s="8"
          b="0.4"
          gradientLeft="#E800FF"
          gradientRight="#0F00FF"
          height="600px"
        >
          {!!(router.query.error_code && router.query.error_message) && (
            <p>
              <strong>ERROR: Authentication process failed.</strong>
              <br />
              <code>
                {router.query.error_code}: {router.query.error_message}
              </code>
            </p>
          )}
          <StyledP width="25">
            {'>>'} Boot dialogue: <span>Initiating Pilot protocol</span>_
          </StyledP>

          <Card color="psybeam" rotate="-6deg">
            <svg
              width="94"
              height="94"
              viewBox="0 0 94 94"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_dd_1975_2971)">
                <path
                  d="M33.6129 71.4211C33.6129 71.0908 33.2903 70.7604 32.8064 70.7604C32.3226 70.7604 32 71.0908 32 71.4211C32 71.7515 32.3226 72.0818 32.8064 71.9167C33.2903 71.9167 33.6129 71.7515 33.6129 71.4211ZM28.6129 70.5952C28.6129 70.9256 28.9355 71.4211 29.4194 71.4211C29.7419 71.5863 30.2258 71.4211 30.3871 71.0908C30.3871 70.7604 30.2258 70.43 29.7419 70.2648C29.2581 70.0997 28.7742 70.2648 28.6129 70.5952ZM35.871 70.43C35.3871 70.43 35.0645 70.7604 35.0645 71.2559C35.0645 71.5863 35.5484 71.7515 36.0323 71.5863C36.5161 71.4211 36.8387 71.2559 36.6774 70.9256C36.6774 70.5952 36.1935 70.2648 35.871 70.43ZM46.3548 7C24.0968 7 7 24.5093 7 47.3045C7 65.6397 18.129 81.3321 34.2581 86.9483C36.3548 87.2786 37 85.9572 37 84.9661C37 83.8098 37 78.1936 37 74.7248C37 74.7248 25.7097 77.2025 23.2903 69.7693C23.2903 69.7693 21.5161 64.979 18.9355 63.8227C18.9355 63.8227 15.2258 61.1798 19.0968 61.1798C19.0968 61.1798 23.129 61.5102 25.3871 65.4746C28.9355 71.9167 34.7419 70.0997 37.1613 68.9434C37.4839 66.3005 38.4516 64.4835 39.7419 63.3272C30.7097 62.3361 21.5161 61.0146 21.5161 45.1571C21.5161 40.532 22.8065 38.3846 25.3871 35.4114C24.9032 34.2551 23.6129 29.9603 25.871 24.179C29.0968 23.1879 37 28.6389 37 28.6389C40.2258 27.6478 43.6129 27.3174 47 27.3174C50.5484 27.3174 53.9355 27.6478 57.1613 28.6389C57.1613 28.6389 64.9032 23.0227 68.2903 24.179C70.5484 29.9603 69.0968 34.2551 68.7742 35.4114C71.3548 38.3846 72.9677 40.532 72.9677 45.1571C72.9677 61.0146 63.4516 62.3361 54.4194 63.3272C55.871 64.6486 57.1613 67.1264 57.1613 71.0908C57.1613 76.5418 57 83.4794 57 84.8009C57 85.9572 57.8064 87.2786 59.9032 86.7831C76.0322 81.3321 87 65.6397 87 47.3045C87 24.5093 68.7742 7 46.3548 7ZM22.6452 63.9879C22.3226 64.1531 22.4839 64.6486 22.6452 64.979C22.9677 65.1442 23.2903 65.3094 23.6129 65.1442C23.7742 64.979 23.7742 64.4835 23.4516 64.1531C23.129 63.9879 22.8065 63.8227 22.6452 63.9879ZM20.871 62.6665C20.7097 62.9968 20.871 63.162 21.1935 63.3272C21.5161 63.4924 21.8387 63.4924 22 63.162C22 62.9968 21.8387 62.8316 21.5161 62.6665C21.1935 62.5013 21.0323 62.5013 20.871 62.6665ZM26.0323 68.613C25.871 68.7782 25.871 69.2737 26.3548 69.6041C26.6774 69.9345 27.1613 70.0997 27.3226 69.7693C27.4839 69.6041 27.4839 69.1086 27.1613 68.7782C26.8387 68.4478 26.3548 68.2827 26.0323 68.613ZM24.2581 66.1353C23.9355 66.3005 23.9355 66.796 24.2581 67.1264C24.5806 67.4567 24.9032 67.6219 25.2258 67.4567C25.3871 67.2916 25.3871 66.796 25.2258 66.4656C24.9032 66.1353 24.5806 65.9701 24.2581 66.1353Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <filter
                  id="filter0_dd_1975_2971"
                  x="0"
                  y="0"
                  width="94"
                  height="94"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dx="1" dy="1" />
                  <feGaussianBlur stdDeviation="3" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.564706 0 0 0 0 0.580392 0 0 0 0 1 0 0 0 0.5 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_1975_2971"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dx="-1" dy="-1" />
                  <feGaussianBlur stdDeviation="3" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 0.890196 0 0 0 0 0.494118 0 0 0 0.5 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="effect1_dropShadow_1975_2971"
                    result="effect2_dropShadow_1975_2971"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect2_dropShadow_1975_2971"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
            <h5>Authorize with Github</h5>
            <Button as="a" href={oauth('github')}>
              Initiate
            </Button>
          </Card>
          <Card color="spark" rotate="6deg" delay="0.3s">
            <svg
              width="98"
              height="94"
              viewBox="0 0 98 94"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_dd_1975_2973)">
                <path
                  d="M89.1562 38.6689L89.0395 38.3704L77.7323 8.86119C77.5023 8.28283 77.0949 7.7922 76.5687 7.4597C76.0422 7.13285 75.4281 6.97543 74.8093 7.00869C74.1904 7.04195 73.5967 7.2643 73.1083 7.6457C72.6252 8.03806 72.2748 8.56971 72.1047 9.16831L64.47 32.5266H33.555L25.9203 9.16831C25.7547 8.56645 25.4035 8.03213 24.9168 7.64137C24.4283 7.25997 23.8346 7.03763 23.2158 7.00437C22.5969 6.9711 21.9828 7.12852 21.4563 7.45537C20.9313 7.78921 20.5243 8.27942 20.2927 8.85687L8.96394 38.3531L8.85147 38.6516C7.22376 42.9046 7.02285 47.5714 8.27902 51.9485C9.5352 56.3256 12.1804 60.1757 15.8157 62.9182L15.8546 62.9485L15.9584 63.022L33.183 75.921L41.7044 82.3705L46.8951 86.2894C47.5023 86.7504 48.2437 87 49.006 87C49.7684 87 50.5098 86.7504 51.1169 86.2894L56.3076 82.3705L64.8291 75.921L82.1574 62.9442L82.2007 62.9096C85.8279 60.1665 88.4669 56.3204 89.7211 51.9492C90.9754 47.578 90.7772 42.9178 89.1562 38.6689Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <filter
                  id="filter0_dd_1975_2973"
                  x="0.464355"
                  y="0"
                  width="97.0713"
                  height="94"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dx="1" dy="1" />
                  <feGaussianBlur stdDeviation="3" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.564706 0 0 0 0 0.580392 0 0 0 0 1 0 0 0 0.5 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_1975_2973"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dx="-1" dy="-1" />
                  <feGaussianBlur stdDeviation="3" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 0.890196 0 0 0 0 0.494118 0 0 0 0.5 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="effect1_dropShadow_1975_2973"
                    result="effect2_dropShadow_1975_2973"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect2_dropShadow_1975_2973"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>

            <h5>Authorize with GitLab</h5>
            <Button as="a" href={oauth('gitlab')}>
              Initiate
            </Button>
          </Card>
        </FauxHero>
      )}
    </>
  );
};

export default Auth;
