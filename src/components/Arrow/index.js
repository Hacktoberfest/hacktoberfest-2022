import { useTheme } from 'styled-components';
import {
  StyledArrow
} from './Arrow.styles';

const Arrow = props => {
  const theme = useTheme();
  const {
    direction = 'down',
    color = theme.colors.neutral.manga200
  } = props;

  return (
    <StyledArrow $color={color} aria-hidden>
      {direction === 'down' && (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" viewBox="0 0 50 30" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M50 0V10H40V0L50 0ZM30 20V10L40 10V20H30ZM20 20L30 20L30 30L20 30L20 20ZM10 10V20H20V10H10ZM10 10L0 10V0L10 0V10Z" fill="currentColor"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" viewBox="0 0 50 30" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M50 0V10H40V0L50 0ZM30 20V10L40 10V20H30ZM20 20L30 20L30 30L20 30L20 20ZM10 10V20H20V10H10ZM10 10L0 10V0L10 0V10Z" fill="currentColor"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" viewBox="0 0 50 30" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M50 0V10H40V0L50 0ZM30 20V10L40 10V20H30ZM20 20L30 20L30 30L20 30L20 20ZM10 10V20H20V10H10ZM10 10L0 10V0L10 0V10Z" fill="currentColor"/></svg>
        </>
      )}

      {direction === 'right' && (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="50" viewBox="0 0 30 50" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M0 0H10V10H0V0ZM20 20H10V10H20V20ZM20 30V20H30V30H20ZM10 40H20V30H10V40ZM10 40V50H0V40H10Z" fill="currentColor"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="50" viewBox="0 0 30 50" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M0 0H10V10H0V0ZM20 20H10V10H20V20ZM20 30V20H30V30H20ZM10 40H20V30H10V40ZM10 40V50H0V40H10Z" fill="currentColor"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="50" viewBox="0 0 30 50" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M0 0H10V10H0V0ZM20 20H10V10H20V20ZM20 30V20H30V30H20ZM10 40H20V30H10V40ZM10 40V50H0V40H10Z" fill="currentColor"/></svg>
        </>
      )}
    </StyledArrow>
  );
};

export default Arrow;