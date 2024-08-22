import logo from 'assets/img/logo-hacktoberfest--mark.svg';

import { StyledAvatar, StyledAvatarContainer } from './Avatar.styles';

const Avatar = (props) => {
  const { src, alt } = props;

  return (
    <StyledAvatar>
      <StyledAvatarContainer $placeholder={!src}>
        <img src={src || logo.src} alt={alt} />
      </StyledAvatarContainer>
    </StyledAvatar>
  );
};

export default Avatar;
