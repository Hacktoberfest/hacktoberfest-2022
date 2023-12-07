import { useEffect, useMemo, useRef, useState } from 'react';

const interval = 100;
const idle = 1000;

const srOnly = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
};

const Type = ({ text }) => {
  const ref = useRef(null);

  const [progress, setProgress] = useState(0);
  const progressTimer = useRef(null);

  const done = useMemo(() => progress === text.length, [progress, text.length]);

  const [cursor, setCursor] = useState(true);
  const cursorTimer = useRef(null);

  // Start incrementing the progress when the element is in view
  useEffect(() => {
    if (done) return;

    const elm = ref.current;
    if (!elm) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !progressTimer.current) {
          progressTimer.current = setInterval(() => {
            setProgress((current) => current + 1);
          }, interval);
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(elm);

    return () => observer.unobserve(elm);
  }, [done]);

  // When we finish typing, start the idle timer
  useEffect(() => {
    if (done && cursor && !cursorTimer.current) {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
        progressTimer.current = null;
      }

      cursorTimer.current = setTimeout(() => {
        setCursor(false);
        cursorTimer.current = null;
      }, idle);
    }
  }, [done, cursor]);

  // Clean up any timers when the component unmounts
  useEffect(() => {
    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
        progressTimer.current = null;
      }

      if (cursorTimer.current) {
        clearTimeout(cursorTimer.current);
        cursorTimer.current = null;
      }
    };
  }, []);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {text.slice(0, progress)}
        {cursor && '_'}
        {!done && <span style={{ opacity: 0 }}>{text.slice(progress)}</span>}
      </span>

      {/* Screen readers should read the full text */}
      <span style={srOnly}>{text}</span>
    </>
  );
};

export default Type;
