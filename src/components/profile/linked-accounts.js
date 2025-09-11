import ContentMaster from '../ContentMaster';
import { providerMap, trackingEndExtended } from '../../lib/config';
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { StyledSectionSpacing } from '../../styles/sharedStyles';
import { textLg, textXl } from '../../themes/typography';
import { useRouter } from 'next/router';
import { fetchUserOAuth, removeUserOAuth } from '../../lib/api';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import CustomLink from '../CustomLink';
import TextLink from '../TextLink';

const StyledStyledSectionSpacing = styled(StyledSectionSpacing)`
  gap: 24px;
`;

const StyledLinkContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const StyledLink = styled.button`
  ${textLg};
  color: ${({ theme }) => theme.colors2025.lavendar};
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors2025.space.dust};
    text-decoration: underline;
  }
  ${mQ(bp.desktop)} {
    ${textXl};
  }
`;

const StyledFakeButtonLink = styled.div`
  ${textLg};
  color: ${({ theme }) => theme.colors2025.space.white};
  font-weight: 700;

  ${mQ(bp.desktop)} {
    ${textXl};
    font-weight: 700;
  }

  span {
    color: ${({ theme }) => theme.colors2025.space.dust};
    font-weight: 400;
  }
`;

const StyledAccountButtonGroup = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 32px;

  ${mQ(bp.desktop)} {
    flex-direction: row;
  }
`;

const LinkedAccounts = ({ auth, setError, isEdit }) => {
  const router = useRouter();

  const [oauth, setOauth] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const loading = useRef(false);

  const hasTrackingEnded = useMemo(
    () => new Date() >= new Date(trackingEndExtended),
    [],
  );

  // Handle fetching OAuth accounts
  const fetchOAuth = useCallback(async () => {
    setOauth(
      await fetchUserOAuth(auth.user.id, auth.token).then((data) =>
        data.reduce(
          (obj, item) => ({
            ...obj,
            [item.provider]: item,
          }),
          {},
        ),
      ),
    );
  }, [auth.user?.id, auth.token]);

  // Handle unlinking OAuth accounts
  const unlinkOAuth = useCallback(
    async (e, provider) => {
      e.preventDefault();
      if (hasTrackingEnded) return;

      if (
        !confirm(
          `Are you sure you want to unlink your ${providerMap[provider].name} account from your Hacktoberfest registration?`,
        )
      )
        return;

      await removeUserOAuth(auth.user.id, auth.token, provider).catch(
        async (err) => {
          const data = await err.response.json().catch(() => null);
          console.error(err, data);
          setError(
            `An unknown error occurred while unlinking your ${providerMap[provider].name} account. Please try again later.`,
          );
        },
      );
      await fetchOAuth();
    },
    [auth.user?.id, auth.token],
  );

  // Check if we have multiple OAuth accounts linked (unlinking is disabled if not)
  const hasMultipleOAuth = useMemo(
    () => Object.keys(oauth).length > 1,
    [oauth],
  );

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

      // Show the page
      setLoaded(true);
    })();
  }, [loaded, auth.user?.id, auth.token]);

  return (
    <StyledStyledSectionSpacing>
      <ContentMaster title="Linked accounts" size="md" />
      <StyledAccountButtonGroup>
        {Object.keys(providerMap).map((provider) => (
          <Fragment key={provider}>
            {oauth[provider] &&
              (isEdit ? (
                <StyledLinkContainer>
                  <StyledFakeButtonLink
                    onClick={(e) => unlinkOAuth(e, provider)}
                    type="button"
                    disabled={hasTrackingEnded}
                  >
                    Unlink {providerMap[provider].name} account:{' '}
                    <span>{oauth[provider].providerUsername}</span>
                  </StyledFakeButtonLink>
                  {hasMultipleOAuth && (
                    <StyledLink
                      href="#"
                      onClick={(e) => unlinkOAuth(e, provider)}
                      as="a"
                      disabled={hasTrackingEnded}
                    >
                      Unlink
                    </StyledLink>
                  )}
                </StyledLinkContainer>
              ) : (
                <StyledFakeButtonLink
                  onClick={(e) => e.preventDefault()}
                  type="button"
                  disabled
                >
                  {providerMap[provider].name} linked:{' '}
                  <span>{oauth[provider].providerUsername}</span>
                </StyledFakeButtonLink>
              ))}
          </Fragment>
        ))}
      </StyledAccountButtonGroup>
    </StyledStyledSectionSpacing>
  );
};

export default LinkedAccounts;
