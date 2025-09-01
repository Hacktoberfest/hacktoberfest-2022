import {
  StyledCountdownWrapper,
  StyledCountdownHeader,
  StyledCountdown,
  StyledCountdownItem,
  StyledCountdownItemDivider,
  StyledLoader,
  StyledLoaderContent,
  StyledSpan,
  StyledCounter,
} from './Countdown.styles';
import useCountdown from 'hooks/useCountdown';
import { registrationEnd, registrationStart } from 'lib/config';
import { useMemo } from 'react';
import Corners from '../Corners';

const Countdown = () => {
  const [days, hours, minutes, seconds, progress] = useCountdown(
    new Date(registrationStart).getTime(),
  );

  const hasRegistrationEnded = useMemo(
    () => new Date() >= new Date(registrationEnd),
    [],
  );

  const hasDaysLeft = useMemo(() => days > 0, [days]);
  const hasHoursLeft = useMemo(
    () => hasDaysLeft || hours > 0,
    [hasDaysLeft, hours],
  );
  const hasMinutesLeft = useMemo(
    () => hasDaysLeft || hasHoursLeft || minutes > 0,
    [hasDaysLeft, hasHoursLeft, minutes],
  );
  const hasSecondsLeft = useMemo(
    () => hasDaysLeft || hasHoursLeft || hasMinutesLeft || seconds > 0,
    [hasDaysLeft, hasHoursLeft, hasMinutesLeft, seconds],
  );

  return (
    <StyledCountdownWrapper>
      {!hasRegistrationEnded && (
        <>
          <StyledCountdownHeader>Registration opens in…</StyledCountdownHeader>

          <StyledLoader>
            <StyledLoaderContent $progress={progress} />
          </StyledLoader>

          <StyledCountdown>
            <StyledCountdownItem $isActive={hasDaysLeft}>
              <p>
                <StyledCounter>{days}</StyledCounter>
                <StyledSpan>DAYS</StyledSpan>
              </p>
            </StyledCountdownItem>
            <StyledCountdownItemDivider>:</StyledCountdownItemDivider>
            <StyledCountdownItem $isActive={hasHoursLeft}>
              <p>
                <StyledCounter>{hours}</StyledCounter>
                <StyledSpan>HOURS</StyledSpan>
              </p>
            </StyledCountdownItem>
            <StyledCountdownItemDivider>:</StyledCountdownItemDivider>
            <StyledCountdownItem $isActive={hasMinutesLeft}>
              <p>
                <StyledCounter>{minutes}</StyledCounter>
                <StyledSpan>MINUTES</StyledSpan>
              </p>
            </StyledCountdownItem>
            <StyledCountdownItemDivider>:</StyledCountdownItemDivider>
            <StyledCountdownItem $isActive={hasSecondsLeft}>
              <p>
                <StyledCounter>{seconds}</StyledCounter>
                <StyledSpan>SECONDS</StyledSpan>
              </p>
            </StyledCountdownItem>
            <Corners props={{ size: 10, width: 3 }} />
          </StyledCountdown>
        </>
      )}
    </StyledCountdownWrapper>
  );
};

export default Countdown;
