/* The one subtraction behind the Preptember countdown. All four numbers
   come from the same remaining-milliseconds value so they can never
   disagree, floor together, and clamp together: a target in the past reads
   0d 0h 0m 0s, never negative. */
export const countdownParts = (target, now) => {
  const remaining = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(remaining / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
};
