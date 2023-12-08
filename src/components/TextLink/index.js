import { StyledTextLink, StyledTextLinkArrow } from './TextLink.styles';

const TextLink = (props) => {
  const { children, size = 'sm', ...link } = props;

  return (
    <StyledTextLink {...link} $size={size}>
      <span>{children}</span>
      <StyledTextLinkArrow aria-hidden>
        <span>›</span>
        <span>›</span>
        <span>›</span>
      </StyledTextLinkArrow>
    </StyledTextLink>
  );
};

export default TextLink;
