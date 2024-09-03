import { StyledButtonMain } from './ButtonMain.styles';

const ButtonMain = (props) => {
  const {
    children,
    as = 'a',
    variant = 'primary-black',
    size = 'sm',
    onClick,
    ...link
  } = props;

  return (
    <>
      {as === 'a' ? (
        <StyledButtonMain {...link} $variant={variant} $size={size}>
          {children}
        </StyledButtonMain>
      ) : (
        <StyledButtonMain
          $variant={variant}
          $size={size}
          onClick={onClick}
          as={as}
          {...link}
        >
          {children}
        </StyledButtonMain>
      )}
    </>
  );
};

export default ButtonMain;
