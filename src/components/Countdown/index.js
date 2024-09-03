import {
  StyledCountdownWrapper,
  StyledCountdownHeader,
  StyledCountdown,
  StyledCountdownItem,
} from './Countdown.styles';
import useCountdown from 'hooks/useCountdown';
import { registrationEnd, registrationStart } from 'lib/config';
import { useMemo } from 'react';

const Countdown = () => {
  const [days, hours, minutes, seconds, progress] = useCountdown(
    new Date(registrationStart).getTime(),
  );

  const hasRegistrationEnded = useMemo(
    () => new Date() >= new Date(registrationEnd),
    [],
  );
  return (
    <StyledCountdownWrapper>
      {!hasRegistrationEnded && (
        <>
          <StyledCountdownHeader>Registration opens in…</StyledCountdownHeader>

          <StyledCountdown>
            <StyledCountdownItem>
              <p>
                <span>{days}</span>
                Days
              </p>
            </StyledCountdownItem>
            <StyledCountdownItem>
              <p>
                <span>{hours}</span>
                Hours
              </p>
            </StyledCountdownItem>
            <StyledCountdownItem>
              <p>
                <span>{minutes}</span>
                Minutes
              </p>
            </StyledCountdownItem>
          </StyledCountdown>
        </>
      )}
    </StyledCountdownWrapper>
  );
};

export default Countdown;
