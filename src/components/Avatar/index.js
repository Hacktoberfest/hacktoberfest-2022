import logo from 'assets/img/logo-hacktoberfest-11--mark.svg';

import {
  StyledAvatar,
  StyledAvatarContainer,
  StyledGlowBox,
} from './Avatar.styles';

const Avatar = (props) => {
  const { src, alt, ...rest } = props;

  return (
    <StyledAvatar {...rest}>
      <StyledGlowBox />
      <StyledGlowBox />
      <StyledGlowBox />
      <StyledGlowBox />
      <StyledAvatarContainer $placeholder={!src}>
        <img src={src || logo.src} alt={alt} />
      </StyledAvatarContainer>
    </StyledAvatar>
  );
};

export default Avatar;
