import Frame from 'components/Frame';
import {
  StyledAvatar,
  StyledAvatarContainer
} from './Avatar.styles';

const Avatar = props => {
  const { src, alt, color = "blue" } = props;

  return (
    <StyledAvatar>
      <Frame color={color} />
      <StyledAvatarContainer>
        <img src={src} alt={alt} />
      </StyledAvatarContainer>
    </StyledAvatar>
  );
};

export default Avatar;