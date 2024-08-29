import logo from 'assets/img/logo-hacktoberfest-11--mark.svg';

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
