import Link from 'next/link';
import {
  StyledButtonMain
} from './ButtonMain.styles';

const ButtonMain = props => {
  const {
    children,
    as = "a",
    size = 'sm',
    onClick,
    ...link
  } = props;

  return (
    <>
      {as === 'a' ? (
        <Link {...link} passHref>
          <StyledButtonMain {...link} $size={size}>
            {children}
          </StyledButtonMain>
        </Link>
      ) : (
        <StyledButtonMain $size={size} onClick={onClick} as={as} {...link}>
          {children}
        </StyledButtonMain>
      )}
    </>
  );
};

export default ButtonMain;