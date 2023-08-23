import Link from 'next/link';
import {
  StyledButtonMain
} from './ButtonMain.styles';

const ButtonMain = props => {
  const {
    children,
    type= "a",
    size = 'sm',
    onClick,
    ...link
  } = props;

  return (
    <>
      {type === 'a' ? (
        <Link {...link} passHref>
          <StyledButtonMain $size={size}>
            {children}
          </StyledButtonMain>
        </Link>
      ) : (
        <StyledButtonMain $size={size} onClick={onClick} as="button">
          {children}
        </StyledButtonMain>
      )}
    </>
  );
};

export default ButtonMain;