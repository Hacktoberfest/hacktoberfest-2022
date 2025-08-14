import {
  StyledCountdownWrapper,
  StyledCountdownHeader,
  StyledCountdown,
  StyledCountdownItem,
  StyledCountdownItemDivider,
  StyledLoader,
  StyledLoaderContent,
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
                <span>{days}</span>
                DAYS
              </p>
            </StyledCountdownItem>
            <StyledCountdownItemDivider>:</StyledCountdownItemDivider>
            <StyledCountdownItem $isActive={hasHoursLeft}>
              <p>
                <span>{hours}</span>
                HOURS
              </p>
            </StyledCountdownItem>
            <StyledCountdownItemDivider>:</StyledCountdownItemDivider>
            <StyledCountdownItem $isActive={hasMinutesLeft}>
              <p>
                <span>{minutes}</span>
                MINUTES
              </p>
            </StyledCountdownItem>
            <StyledCountdownItemDivider>:</StyledCountdownItemDivider>
            <StyledCountdownItem $isActive={hasSecondsLeft}>
              <p>
                <span>{seconds}</span>
                SECONDS
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
