import Link from 'next/link';
import {
  StyledButtonMain
} from './ButtonMain.styles';

const ButtonMain = props => {
  const {
    children,
    size = 'sm',
    ...link
  } = props;

  return (
    <Link {...link} passHref>
      <StyledButtonMain $size={size}>
        {children}
      </StyledButtonMain>
    </Link>
  );
};

export default ButtonMain;