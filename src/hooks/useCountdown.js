import { useCallback, useEffect, useState } from 'react';

const useCountdown = target => {
  const [days, setDays] = useState(null);
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [seconds, setSeconds] = useState(null);

  const setCountdown = useCallback(val => {
    const diff = Math.max(val - Date.now(), 0);
    setDays(
      Math.floor(diff / 1000 / 60 / 60 / 24)
        .toString()
        .padStart(2, '0')
    );
    setHours(
      Math.floor((diff / 1000 / 60 / 60) % 24)
        .toString()
        .padStart(2, '0')
    );
    setMinutes(
      Math.floor((diff / 1000 / 60) % 60)
        .toString()
        .padStart(2, '0')
    );
    setSeconds(
      Math.floor((diff / 1000) % 60)
        .toString()
        .padStart(2, '0')
    );
  }, []);

  useEffect(() => {
    setCountdown(target);
    if (target < Date.now()) return () => {};

    const interval = setInterval(() => {
      setCountdown(target);
    }, 1000);
    return () => clearInterval(interval);
  }, [ setCountdown, target ]);

  return [ days, hours, minutes, seconds ];
};

export default useCountdown;
