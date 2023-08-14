import Link from 'next/link';
import {
  StyledTextLink,
  StyledTextLinkArrow
} from './TextLink.styles';

const TextLink = props => {
  const {
    children,
    size = 'sm',
    ...link
  } = props;

  return (
    <Link {...link} passHref>
      <StyledTextLink $size={size}>
        <span>{children}</span>
        <StyledTextLinkArrow aria-hidden>
          <span>›</span>
          <span>›</span>
          <span>›</span>
        </StyledTextLinkArrow>
      </StyledTextLink>
    </Link>
  );
};

export default TextLink;