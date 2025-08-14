import Corners from 'components/Corners';
import { StyledButtonMain } from './ButtonMain.styles';

const ButtonMain = (props) => {
  const {
    children,
    as = 'a',
    variant = 'primary',
    size = 'sm',
    onClick,
    ...link
  } = props;

  return (
    <>
      {as === 'a' ? (
        <StyledButtonMain
          {...link}
          $variant={variant}
          $size={size}
          $isExternal={link.target === '_blank'}
        >
          {children}
          {variant === 'primary' && <Corners />}
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
          {variant === 'primary' && <Corners />}
        </StyledButtonMain>
      )}
    </>
  );
};

export default ButtonMain;
