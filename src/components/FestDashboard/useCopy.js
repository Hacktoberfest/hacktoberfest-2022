import { useEffect, useRef, useState } from 'react';

/* How long "Copied" stays up: long enough to be seen, short enough that
   the button is ready again before anyone wonders. */
const COPIED_FOR_MS = 1600;

/* The dashboard's one clipboard state machine: idle, then "copied" for
   COPIED_FOR_MS, or "failed" when the browser refuses (an http origin, or
   no clipboard API). Resolves true on success so a caller can do more on
   failure, as the check-in code card does by revealing its code. Per
   instance, so two rows never share one "Copied". */
export const useCopy = (text) => {
  const [state, setState] = useState('idle');
  const revert = useRef(null);

  useEffect(() => () => clearTimeout(revert.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
      clearTimeout(revert.current);
      revert.current = setTimeout(() => setState('idle'), COPIED_FOR_MS);
      return true;
    } catch {
      setState('failed');
      return false;
    }
  };

  return [state, copy];
};

export const copyLabelFor = (state, strings) =>
  state === 'copied'
    ? strings.copiedCta
    : state === 'failed'
      ? strings.copyFailedCta
      : strings.copyCta;
