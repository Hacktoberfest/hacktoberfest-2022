import styled, { useTheme } from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import bgHero from 'assets/img/bg-header.svg';

import Avatar from 'components/Avatar';
import { StyledAvatar } from 'components/Avatar/Avatar.styles';
import ContentMaster from 'components/ContentMaster';
import Container from 'components/Container';
import Divider from '../Divider';
import Section from '../Section';

const StyledHeader = styled(Section)`
  padding: 120px 0 64px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    grid-column: full-start / full-end;
    top: 0;
    left: 50%;
    width: 100dvw;
    transform: translateX(-50%);
    height: 100%;
    background: url(${bgHero.src}) top center / cover no-repeat;
  }

  ${mQ(bp.tablet)} {
    padding: 180px 0 128px;
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
  gap: 30px;
  flex-grow: 1;
`;

const StyledDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
  grid-column: full-start / full-end;
`;

const Header = ({ avatar, name, type, isEdit, children }) => {
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
                eyebrowBold
                eyebrow={`>> ${isEdit ? 'Edit ' : ''}Boot ${type}...`}
              />

              {children}
            </StyledHeaderContent>
          </StyledHeaderContainer>
        </Container>
      </StyledHeader>
      <StyledDivider />
    </>
  );
};

export default Header;
