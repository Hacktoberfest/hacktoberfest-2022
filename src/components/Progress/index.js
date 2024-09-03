import { StyledProgress } from './Progress.styles';
import useCountdown from 'hooks/useCountdown';
import { registrationStart } from 'lib/config';

const Progress = () => {
  const [days, hours, minutes, seconds, progress] = useCountdown(
    new Date(registrationStart).getTime(),
  );

  return <StyledProgress $percentage={progress} />;
};

export default Progress;
