import styled, { useTheme } from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

import Avatar from 'components/Avatar';
import { StyledAvatar } from 'components/Avatar/Avatar.styles';
import ContentMaster from 'components/ContentMaster';
import Container from 'components/Container';
import SectionDivider from 'components/SectionDivider';

const StyledHeader = styled.div`
  padding: 128px 0 80px;
  background-color: ${({ theme }) => theme.colors.darkGreen};
  color: ${({ theme }) => theme.colors.typography};

  ${mQ(bp.tablet)} {
    padding: 250px 0 110px;
  }

  ${StyledAvatar} {
    width: 53.82262997%;

    ${mQ(bp.tablet)} {
      width: 26.484375%;
    }
  }
`;

const StyledHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;

  ${mQ(bp.tablet)} {
    align-items: center;
    flex-direction: row;
  }
`;

const StyledHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  flex-grow: 1;
`;

const Header = ({ avatar, name, type, children }) => {
  const theme = useTheme();

  return (
    <>
      <StyledHeader>
        <Container>
          <StyledHeaderContainer>
            <Avatar src={avatar} alt="" />
            <StyledHeaderContent>
              <ContentMaster
                size="xl"
                title={`Hello, ${name}`}
                eyebrow={`>> Boot ${type}...`}
                hasCaret={false}
              />

              {children}
            </StyledHeaderContent>
          </StyledHeaderContainer>
        </Container>
      </StyledHeader>
      <SectionDivider
        bgColor={theme.colors.darkGreen}
        fgColor={theme.colors.typography}
      />
    </>
  );
};

export default Header;
