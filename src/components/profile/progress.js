import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

import { headline3, textBase, textLg, textXl } from 'themes/typography';
import {
  fetchUserOAuth,
  fetchGiftCodes,
  fetchPullRequests,
  triggerUserIngest,
} from 'lib/api';
import { trackingStart, prCount } from 'lib/config';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

import spaceHelmet from 'assets/img/space-helmet.svg';
import trophy from 'assets/img/trophy.svg';
import diamond from 'assets/img/diamond.svg';

import { StyledSectionSpacing } from 'styles/sharedStyles';

import Loader from 'components/loader';
import Section from 'components/Section';
import Divider from 'components/Divider';
import PullRequest from 'components/PullRequest';
import ContentMaster from 'components/ContentMaster';

import EmailWarning from './email-warning';
import Holopin from './rewards/holopin';
import Container from '../Container';
import Layout from '../Layout';
import CardCallout from '../CardCallout';
import LinkedAccounts from './linked-accounts';
import Image from 'next/image';

// Fade in after the 'progress' typing animation
const trackingFade = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 0.75;
  }
`;

const StyledInfoContainer = styled(Container)`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  width: 100%;

  ${mQ(bp.desktop)} {
    max-width: 1200px;
    margin-left: 0;
  }
`;

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;

  ${mQ(bp.desktop)} {
    gap: 80px;

    h2 {
      ${headline3};
    }
  }
`;

const StyledImageContainer = styled.div`
  display: none;

  ${mQ(bp.desktop)} {
    display: block;
    max-width: 302px;

    img {
      height: auto;
      width: 100%;
    }
  }
`;

const StyledProgressSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${mQ(bp.desktop)} {
    gap: 19px;
  }
`;

const StyledCount = styled.div`
  ${textLg};
  font-weight: 700;
  color: ${({ theme }) => theme.colors2025.space.white};

  ${mQ(bp.desktop)} {
    ${textXl};
    font-weight: 700;
  }
`;

const StyledPullRequests = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0;

  ${mQ(bp.desktop)} {
    gap: 40px;
  }
`;

const StyledWarningHeader = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors2025.space.white};

  ${mQ(bp.desktop)} {
    ${textLg};
    font-weight: 700;
  }

  span {
    color: ${({ theme }) => theme.colors2025.error};
  }
`;

const StyledCardCallout = styled(CardCallout)`
  ${textBase};
  color: ${({ theme }) => theme.colors2025.space.dust};

  > div > div {
    gap: 16px;
  }

  ${mQ(bp.desktop)} {
    ${StyledWarningHeader} {
      ${textBase};
      font-weight: 700;
    }
  }
`;

const StyledFullDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
  grid-column: full-start / full-end;
  width: 100%;

  ${mQ(bp.desktop)} {
    display: block;
  }
`;

const StyledDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
`;

const StyledContainer = styled(Container)`
  margin-left: 0;
`;

const StyledFootNote = styled.div`
  ${mQ(bp.desktop)} {
    ${textLg};
  }
`;

const StyledSmallCardCallout = styled(CardCallout)`
  width: fit-content;
  white-space: nowrap;

  > div {
    padding: 24px;
    width: calc(100% - 48px);
  }
`;

const StyledSection = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: 64px;

  ${mQ(bp.desktop)} {
    gap: 48px;
    grid-column: main-start / full-end;
    padding-right: 64px;
  }
`;

const StyledRewardsHeadline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${mQ(bp.desktop)} {
    flex-direction: row;
    gap: 40px;
  }

  > img {
    height: auto;
    max-width: 64px;

    ${mQ(bp.desktop)} {
      max-width: 189px;
    }
  }

  h4 {
    text-shadow: none;
  }
`;

const StyledRewardCardCallout = styled(CardCallout)`
  > div {
    > div {
      gap: 32px;

      ${mQ(bp.tablet)} {
        gap: 64px;
      }
    }

    ${mQ(bp.tablet)} {
      padding: 64px;
      width: calc(100% - 128px);
    }
  }

  ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 32px;

    ${mQ(bp.desktop)} {
      gap: 40px;
    }
  }
`;

const Progress = ({ auth }) => {
  // Track the data we need to render
  const [loaded, setLoaded] = useState(false);
  const loading = useRef(false);
  const [oauth, setOauth] = useState([]);
  const [pullRequests, setPullRequests] = useState([]);
  const [giftCodes, setGiftCodes] = useState();

  // Load the data we need to render
  useEffect(() => {
    if (loaded) return;
    if (loading.current) return;
    loading.current = true;

    (async () => {
      // Fetch the user's OAuth providers
      const rawOauth = await fetchUserOAuth(auth.user.id, auth.token);
      setOauth(
        rawOauth.reduce(
          (obj, item) => ({
            ...obj,
            [item.provider]: item,
          }),
          {},
        ),
      );

      // Fetch the user's pull requests
      const rawPullRequests = await fetchPullRequests(
        auth.user.id,
        auth.token,
        ['out-of-bounds'],
      );
      setPullRequests(
        rawPullRequests.rows
          ?.filter(
            (pr) => pr.state?.state && pr.state.state !== 'out-of-bounds',
          )
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) ||
          [],
      );

      // Fetch the user's gift codes
      const rawGiftCodes = await fetchGiftCodes(auth.user.id, auth.token);
      setGiftCodes(
        rawGiftCodes.reduce(
          (obj, code) => ({
            ...obj,
            [code.type]: code,
          }),
          {},
        ),
      );

      // Trigger a PR ingest in the background, ignoring the result and any errors
      triggerUserIngest(auth.user.id, auth.token).catch(() => {});

      // Show the page
      setLoaded(true);
    })();
  }, [loaded, auth.user?.id, auth.token]);

  // Determine the user's progress
  const hasStarted = useMemo(() => new Date() >= new Date(trackingStart), []);
  const acceptedCount = useMemo(
    () => pullRequests.filter((pr) => pr.state.state === 'accepted').length,
    [pullRequests],
  );
  const waitingCount = useMemo(
    () => pullRequests.filter((pr) => pr.state.state === 'waiting').length,
    [pullRequests],
  );

  // Don't render anything until we have the data we need
  if (!loaded)
    return (
      <Section>
        <Loader message=">> Loading /usr/lib/progress..." />
      </Section>
    );

  // Render the user's progress
  return (
    <Layout>
      <StyledSection>
        {(auth.registration.state.state.includes('disqualified') ||
          auth.registration.state.state.includes('warning') ||
          auth.user.email.endsWith('@users.noreply.github.com')) && (
          <StyledContainer>
            <StyledSectionSpacing $isSmall>
              {/* Handle a user that has been disqualified */}
              {auth.registration.state.state.includes('disqualified') && (
                <StyledCardCallout>
                  <StyledWarningHeader>
                    <span>
                      You have been disqualified from Hacktoberfest for
                      submitting two or more PR/MRs that have been identified as
                      spam.
                    </span>
                  </StyledWarningHeader>
                  Due to being disqualified, you will be ineligible to receive
                  any further rewards for your participation in Hacktoberfest.
                </StyledCardCallout>
              )}

              {/* Handle a user that has been disqualified */}
              {auth.registration.state.state.includes('warning') && (
                <StyledCardCallout>
                  <StyledWarningHeader>
                    <span>[Warning]</span> You have had a PR/MR identified as
                    spam.
                  </StyledWarningHeader>
                  If you submit another PR/MR that is identified as spam, you
                  will be disqualified permanently from Hacktoberfest.
                </StyledCardCallout>
              )}

              {/* Handle a user that has a no-reply email selected */}
              <EmailWarning
                title={
                  <StyledWarningHeader>
                    <span>[Warning]</span> No-reply email
                  </StyledWarningHeader>
                }
                email={auth.user.email}
              />
            </StyledSectionSpacing>
          </StyledContainer>
        )}
        <StyledInfoContainer>
          <StyledInfo>
            <StyledProgressSummary $isSmall>
              <ContentMaster title="Progress" titleAs="h3" size="lg" />
              <StyledSmallCardCallout>
                <StyledCount>
                  {Math.min(acceptedCount, prCount).toLocaleString()}
                  {acceptedCount > prCount
                    ? ` + ${(acceptedCount - prCount).toLocaleString()}`
                    : ''}
                  {waitingCount > 0 ? (
                    <>
                      {' '}
                      <span>+ {waitingCount.toLocaleString()} (in review)</span>
                    </>
                  ) : (
                    ''
                  )}{' '}
                  <span>/</span> {prCount}
                </StyledCount>
              </StyledSmallCardCallout>
            </StyledProgressSummary>

            <LinkedAccounts auth={auth} setError={() => {}} />
          </StyledInfo>
          <StyledImageContainer>
            <Image src={spaceHelmet} alt="" />
          </StyledImageContainer>
        </StyledInfoContainer>
      </StyledSection>

      {Object.keys(giftCodes).some(
        (type) =>
          type.startsWith('holopin-level-') ||
          type === 'holopin-registered-badge' ||
          type === 'tshirt' ||
          type === 'tree-nation-tree' ||
          type === 'tree',
      ) && (
        <>
          <StyledFullDivider />
          <Section size="sm">
            <Container>
              <StyledSectionSpacing $isSmall>
                <ContentMaster title="Rewards" titleTag="h3" size="lg" />
                <StyledRewardCardCallout>
                  <StyledRewardsHeadline>
                    <Image src={trophy} alt="" />
                    <ContentMaster
                      title="Holopin Badges"
                      titleTag="h4"
                      size="md"
                    >
                      {
                        'Get started with Hacktoberfest by unlocking your customisable Holopin badge. Each PR/MR that you have accepted during Hacktoberfest (up to six) will allow you to customise your badge further.\n\nCheck your email for more information on how to claim each badge.'
                      }
                    </ContentMaster>
                  </StyledRewardsHeadline>
                  <StyledDivider type="solid" />
                  {Object.keys(giftCodes).some(
                    (type) =>
                      type.startsWith('holopin-level-') ||
                      type === 'holopin-registered-badge' ||
                      type === 'tree',
                  ) && (
                    <ul>
                      {giftCodes['tree'] && (
                        <Holopin
                          code={giftCodes['tree']}
                          item="sticker"
                          reason="Completing six accepted PR/MRs"
                          claim="https://www.holopin.io/claim"
                        />
                      )}
                      {giftCodes['holopin-level-5-badge'] && (
                        <Holopin
                          code={giftCodes['holopin-level-5-badge']}
                          reason="Completing six accepted PR/MRs"
                          claim="https://www.holopin.io/claim"
                        />
                      )}
                      {giftCodes['holopin-level-4-badge'] && (
                        <Holopin
                          code={giftCodes['holopin-level-4-badge']}
                          reason="Completing four accepted PR/MRs"
                          claim="https://www.holopin.io/claim"
                        />
                      )}
                      {giftCodes['holopin-level-3-badge'] && (
                        <Holopin
                          code={giftCodes['holopin-level-3-badge']}
                          reason="Completing three accepted PR/MRs"
                          claim="https://www.holopin.io/claim"
                        />
                      )}
                      {giftCodes['holopin-level-2-badge'] && (
                        <Holopin
                          code={giftCodes['holopin-level-2-badge']}
                          reason="Completing two accepted PR/MRs"
                          claim="https://www.holopin.io/claim"
                        />
                      )}
                      {giftCodes['holopin-level-1-badge'] && (
                        <Holopin
                          code={giftCodes['holopin-level-1-badge']}
                          reason="Completing your first accepted PR/MR"
                          claim="https://www.holopin.io/claim"
                        />
                      )}
                      {giftCodes['holopin-registered-badge'] && (
                        <Holopin
                          code={giftCodes['holopin-registered-badge']}
                          reason="Registering for Hacktoberfest"
                          item="base avatar"
                          claim="https://www.holopin.io/claim"
                        />
                      )}
                    </ul>
                  )}
                </StyledRewardCardCallout>
                <StyledRewardCardCallout>
                  <StyledRewardsHeadline>
                    <Image src={trophy} alt="" />
                    <ContentMaster title="Treenation" titleTag="h4" size="md">
                      {
                        'Every 6th PR/MR t-shirt reward will come with a treenation contribution making the world a greener place! Your Treenation rewards will also be reflected as you win this final level.'
                      }
                    </ContentMaster>
                  </StyledRewardsHeadline>
                  <StyledDivider type="solid" />
                  {giftCodes['tree-nation-tree'] &&
                    giftCodes['tree-nation-tree'].code &&
                    JSON.parse(giftCodes['tree-nation-tree'].code) && (
                      <ul>
                        <Holopin
                          code={{
                            code: JSON.stringify({
                              data: {
                                id:
                                  JSON.parse(giftCodes['tree-nation-tree'].code)
                                    .trees?.[0]?.token || '',
                              },
                            }),
                          }}
                          item="tree"
                          reason="Completing six accepted PR/MRs"
                          claim="https://tree-nation.com/collect/"
                        />
                      </ul>
                    )}
                </StyledRewardCardCallout>
                <StyledRewardCardCallout>
                  <StyledRewardsHeadline>
                    <Image src={diamond} alt="" />
                    <ContentMaster title="Swag" titleTag="h4" size="md">
                      {
                        'Get an exclusive Hacktoberfest T-Shirt, but its only for ‘Super Contributors’ who contribute 6 accepted PR/MRs to a worthy repository. (T&Cs Apply | Valid only for the first 10,000 contributors completing 6 PR/MR)'
                      }
                    </ContentMaster>
                  </StyledRewardsHeadline>
                  <StyledDivider type="solid" />
                  {giftCodes['tshirt'] && (
                    <ul>
                      <Holopin
                        code={
                          giftCodes['holopin-level-5-badge'] || {
                            code: JSON.stringify({
                              data: { id: giftCodes['tshirt'].code },
                            }),
                          }
                        }
                        item="shirt"
                        reason="Completing six accepted PR/MRs"
                        claim={
                          giftCodes['holopin-level-5-badge']
                            ? 'Redeem the Supercontributor badge to reveal your T-shirt code. Use the link above or look for the email.'
                            : 'https://stores.kotisdesign.com/dohacktoberfest2025/redemption_code?redemption_code='
                        }
                        skipTrailingSlash
                      />
                    </ul>
                  )}
                </StyledRewardCardCallout>
              </StyledSectionSpacing>
            </Container>
          </Section>
        </>
      )}

      <StyledFullDivider />

      <Section size="sm">
        <Container>
          <StyledSectionSpacing $isSmall>
            <ContentMaster title="Pull/Merge Requests" titleAs="h3" size="lg" />

            {pullRequests.length ? (
              <StyledPullRequests>
                {pullRequests.map((pr, index) => (
                  <Fragment key={pr.id}>
                    <PullRequest data={pr} as="li" />
                    <li aria-hidden>
                      <StyledDivider type="solid" />
                    </li>
                  </Fragment>
                ))}
              </StyledPullRequests>
            ) : hasStarted ? (
              <div>
                Uh oh! You haven't made any pull/merge requests yet. Submit your
                first contribution to a participating project to get started
                with Hacktoberfest!
              </div>
            ) : (
              <div>
                Hacktoberfest has not yet begun, hold off on those pull/merge
                requests until October so they can count!
              </div>
            )}
            <StyledContainer inner>
              <StyledFootNote>
                Not seeing what you expect here? Hacktoberfest profiles only
                show contributor activity, not maintainer activity (we calculate
                this after Hacktoberfest ends). Profiles update once every 15
                minutes if you're loading the page often, or once every 6 hours
                in the background.
              </StyledFootNote>
            </StyledContainer>
          </StyledSectionSpacing>
        </Container>
      </Section>
    </Layout>
  );
};

export default Progress;
