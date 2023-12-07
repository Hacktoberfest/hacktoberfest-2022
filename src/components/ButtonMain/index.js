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
        <StyledButtonMain {...link} $size={size}>
          {children}
        </StyledButtonMain>
      ) : (
        <StyledButtonMain $size={size} onClick={onClick} as={as} {...link}>
          {children}
        </StyledButtonMain>
      )}
    </>
  );
};

export default ButtonMain;
