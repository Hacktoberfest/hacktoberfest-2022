import styled from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

import Avatar from 'components/Avatar';
import { StyledAvatar } from 'components/Avatar/Avatar.styles';
import ContentMaster from 'components/ContentMaster';

const StyledHeader = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 128px 0 80px;
  gap: 64px;


  ${mQ(bp.tablet)} {
    align-items: center;
    flex-direction: row;
    padding: 224px 0 80px;
    background-size: 100% auto;
  }

  ${StyledAvatar} {
    width: 53.82262997%;

    ${mQ(bp.tablet)} {
      width: 26.484375%;
    }
  }
`;

const StyledHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  flex-grow: 1;
`;

const Header = ({ avatar, name, type, children }) => (
  <StyledHeader>
    <Avatar src={avatar} alt="" />
    <StyledHeaderContent>
      <ContentMaster
        size="xl"
        title={`Hello, ${name}`}
        eyebrow={`>> Boot ${type}...`}
      />

      {children}
    </StyledHeaderContent>
  </StyledHeader>
);

export default Header;
