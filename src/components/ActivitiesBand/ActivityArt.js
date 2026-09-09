import styles from './ActivitiesBand.module.css';

/* Full-width decorative panels for the activity cards, one per accent,
   following the HeroGeometry pattern: flat geometric SVG in the site
   palette, never image assets (a spec rule — the static export ships no
   pictures). `preserveAspectRatio: slice` lets each panel crop like a
   photo would as the card resizes.

   Purely decorative, so the whole panel is aria-hidden. */

const OrangeSquares = () => (
  <svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice">
    <rect width="320" height="120" fill="#f2f2eb" />
    <rect x="24" y="34" width="52" height="52" fill="#e53927" />
    <rect x="60" y="18" width="52" height="52" fill="#f9c9c2" />
    <rect x="96" y="50" width="52" height="52" fill="#b8301f" />
    <rect x="188" y="10" width="30" height="30" fill="#e53927" />
    <rect x="238" y="64" width="70" height="70" fill="#f9c9c2" />
    <rect x="272" y="22" width="22" height="22" fill="#b8301f" />
  </svg>
);

const SkySteps = () => (
  <svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice">
    <rect width="320" height="120" fill="#d7e5f4" />
    <rect x="16" y="84" width="44" height="36" fill="#8bb2de" />
    <rect x="60" y="62" width="44" height="58" fill="#1f4e6b" />
    <rect x="104" y="40" width="44" height="80" fill="#8bb2de" />
    <rect x="148" y="18" width="44" height="102" fill="#1f4e6b" />
    <rect x="228" y="16" width="34" height="34" fill="#8bb2de" />
    <circle cx="286" cy="78" r="26" fill="#1f4e6b" />
  </svg>
);

const OchreCircles = () => (
  <svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice">
    <rect width="320" height="120" fill="#f2f2eb" />
    <circle cx="70" cy="60" r="44" fill="#f5b726" />
    <circle cx="70" cy="60" r="20" fill="#8a5d13" />
    <path d="M180 120 A52 52 0 0 1 284 120 Z" fill="#f5b726" />
    <circle cx="232" cy="34" r="16" fill="#8a5d13" />
    <rect x="296" y="12" width="16" height="96" fill="#f5b726" />
  </svg>
);

const PinkStripes = () => (
  <svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice">
    <rect width="320" height="120" fill="#f6c4c1" />
    <path d="M-20 120 L60 0 H96 L16 120 Z" fill="#e97b77" />
    <path d="M40 120 L120 0 H156 L76 120 Z" fill="#671912" />
    <path d="M100 120 L180 0 H216 L136 120 Z" fill="#e97b77" />
    <circle cx="264" cy="42" r="30" fill="#671912" />
    <rect x="238" y="92" width="52" height="16" fill="#e97b77" />
  </svg>
);

const VARIANTS = [OrangeSquares, SkySteps, OchreCircles, PinkStripes];

const ActivityArt = ({ variant }) => {
  const Art = VARIANTS[variant % VARIANTS.length];
  return (
    <span className={styles.cardArt} aria-hidden="true">
      <Art />
    </span>
  );
};

export default ActivityArt;
