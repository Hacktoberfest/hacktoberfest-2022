import Frame from 'components/Frame';

import logo from 'assets/img/logo-hacktoberfest--mark.svg';

import {
  StyledAvatar,
  StyledAvatarContainer
} from './Avatar.styles';

const Avatar = props => {
  const { src, alt, color = "blue" } = props;

  return (
    <StyledAvatar>
      <Frame color={color} />
      <StyledAvatarContainer $placeholder={!src}>
        <img src={src || logo.src} alt={alt} />
      </StyledAvatarContainer>
    </StyledAvatar>
  );
};

export default Avatar;
