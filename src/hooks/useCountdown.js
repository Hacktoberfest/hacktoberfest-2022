import { launchDate } from 'lib/config';
import { useCallback, useEffect, useState } from 'react';

const useCountdown = (target) => {
  const [days, setDays] = useState(null);
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [seconds, setSeconds] = useState(null);
  const [progress, setProgress] = useState(null);

  const setCountdown = useCallback((val) => {
    const currentDate = new Date();

    const progressStart = new Date(launchDate);
    const progressCurrent = Math.abs(currentDate - progressStart);
    const progressTotal = Math.abs(target - progressStart);

    const diff = Math.max(val - currentDate, 0);
    setDays(
      Math.floor(diff / 1000 / 60 / 60 / 24)
        .toString()
        .padStart(2, '0'),
    );
    setHours(
      Math.floor((diff / 1000 / 60 / 60) % 24)
        .toString()
        .padStart(2, '0'),
    );
    setMinutes(
      Math.floor((diff / 1000 / 60) % 60)
        .toString()
        .padStart(2, '0'),
    );
    setSeconds(
      Math.floor((diff / 1000) % 60)
        .toString()
        .padStart(2, '0'),
    );
    setProgress(Math.round((progressCurrent / progressTotal) * 100));
  }, []);

  useEffect(() => {
    setCountdown(target);
    if (target < Date.now()) return () => {};

    const interval = setInterval(() => {
      setCountdown(target);
    }, 1000);
    return () => clearInterval(interval);
  }, [setCountdown, target]);

  return [days, hours, minutes, seconds, progress];
};

export default useCountdown;
