import { useState } from 'react';

import { my } from 'data/content.mjs';
import { NAME_TRACKING, greetingNameFits } from 'lib/postcardGreeting.mjs';
import { firstName } from 'lib/profile.mjs';

import styles from './ThankYouBand.module.css';

/* The band that closes /my during Preptember once a host application has
   actually been sent (hasApplied in lib/fests.mjs) — the why-host pitch
   retired in favour of a thank-you: a postcard the user can flip over to
   read a note from the team.

   A CSS Module for the same reason WhyHostBand is one: /my exports in
   its loading state and renders this band only after the client-side
   fetch, so styled-components CSS would never be emitted for it. The
   no-styled-components guard in my-pages.test.mjs covers this directory.

   Both faces are supplied artwork (ty-card front, ty-card-back back,
   2026-08-18) with the words baked into the files. The front is small
   enough to inline; the back's outlined letterforms run to half a
   megabyte, so it ships as a public/ asset that the back face pulls in
   through an SVG <image> — same coordinate space, one extra request,
   none of it in the bundle. The face around that <image> stays an
   inline SVG for the one live line the artwork leaves blank: the
   greeting, which needs the document's webfonts and the user's name. */

const { thankYou } = my;

/* The greeting's font, mirroring styles/tokens fonts.display (same
   hardcoding trade-off as the CSS Module beside this file). The comp's
   greeting is set in the site's own display face — canvas-measured
   against EXAMPLE CARD.png, Barlow Semi Condensed 800 lands within a
   few units of the comp's ink; Inter (the letter body's face) ran 24%
   wide. */
const DISPLAY =
  "'Barlow Semi Condensed', 'Helvetica Neue', Helvetica, Arial, sans-serif";

/* The greeting's geometry, measured off the supplied comp (EXAMPLE
   CARD.png, same 2720×1700 space as the artwork): left-aligned with the
   note's x=250 margin, caps on the y=373 baseline, a 140px em. The
   comp's name carries a little tracking its "Hey," doesn't have, so the
   spacing rides on the name's tspan — NAME_TRACKING comes from
   lib/postcardGreeting.mjs so the width math there charges exactly what
   renders here. INK is the artwork's own bold-line fill; ACCENT the
   site orange. */
const GREETING_X = 250;
const GREETING_BASELINE = 373;
const GREETING_SIZE = 140;
const INK = '#0f201d';
const ACCENT = '#e53927';

/* The supplied front's palette — the site's own tokens, as the export's
   seven fills. Named here so eighty rectangles don't each carry a hex
   comment. */
const ORANGE = '#e53927';
const FOREST = '#3d5f58';
const SKY = '#8bb2de';
const OCHRE = '#f5b726';
const PINK = '#e97b77';
const WHITE = '#f7f7f2';
const MAROON = '#671912';

/* colors.skyDeep — not one of the export's fills. The band's dark sky
   accent, borrowed for the dog-ear below so the fold reads as the
   card's own shadow turning up onto its face. */
const SKY_DEEP = '#1f4e6b';

/* Front: the supplied pixel THANK YOU! artwork on forest (ty-card,
   2026-08-18) — translated element-for-element from the Illustrator
   export, in its paint order. Two mechanical changes only: the export's
   class fills became attributes (an inline SVG <style> is document-wide,
   so .cls-* rules would leak), and its double-painted pixels — a fill
   completely repainted by a later identical rect — collapsed to the one
   visible color. */
const FrontFace = () => (
  <svg
    className={styles.face}
    viewBox="0 0 2720 1700"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <rect fill={FOREST} width="2720" height="1700" />
    <rect fill={PINK} x="672.47" y="426.85" width="87.73" height="73.39" />
    <polygon
      fill={SKY}
      points="591.91 426.85 591.91 573.62 591.91 647.01 591.91 720.4 591.91 793.79 665.3 793.79 665.3 720.4 665.3 647.01 665.3 573.62 665.3 426.85 591.91 426.85"
    />
    <polygon
      fill={ORANGE}
      points="807.35 426.85 807.35 573.62 807.35 647.01 807.35 720.4 807.35 793.79 880.73 793.79 880.73 720.4 880.73 647.01 880.73 573.62 880.73 426.85 807.35 426.85"
    />
    <polygon
      fill={MAROON}
      points="1026.95 426.85 1026.95 573.62 1026.95 647.01 1026.95 720.4 1026.95 793.79 1100.05 793.79 1100.05 720.4 1100.05 647.01 1100.05 573.62 1100.05 426.85 1026.95 426.85"
    />
    <rect fill={PINK} x="497.01" y="426.85" width="175.46" height="73.39" />
    <rect
      fill={ORANGE}
      x="1310.85"
      y="591.97"
      width="36.69"
      height="146.78"
      transform="translate(1994.55 -663.84) rotate(90)"
    />
    <rect
      fill={PINK}
      x="880.8"
      y="500.73"
      width="72.83"
      height="219.74"
      transform="translate(1527.81 -306.62) rotate(90)"
    />
    <rect
      fill={OCHRE}
      x="2003.53"
      y="574.11"
      width="72.83"
      height="72.97"
      transform="translate(2650.54 -1429.35) rotate(90)"
    />
    <rect
      fill={OCHRE}
      x="2076.5"
      y="501.29"
      width="72.83"
      height="72.97"
      transform="translate(2650.68 -1575.14) rotate(90)"
    />
    <rect
      fill={OCHRE}
      x="2150.1"
      y="427.69"
      width="72.83"
      height="72.97"
      transform="translate(2650.68 -1722.33) rotate(90)"
    />
    <rect
      fill={OCHRE}
      x="2150.1"
      y="647.5"
      width="72.83"
      height="72.97"
      transform="translate(2870.49 -1502.52) rotate(90)"
    />
    <rect
      fill={OCHRE}
      x="2146.71"
      y="717.5"
      width="79.6"
      height="72.97"
      transform="translate(2940.5 -1432.52) rotate(90)"
    />
    <polygon
      fill={ORANGE}
      points="1555.67 426.85 1555.67 573.62 1555.67 647.01 1555.67 720.4 1555.67 793.79 1629.06 793.79 1629.06 720.4 1629.06 647.01 1629.06 573.62 1629.06 426.85 1555.67 426.85"
    />
    <polygon
      fill={SKY}
      points="1930.07 426.85 1930.07 573.62 1930.07 647.01 1930.07 720.4 1930.07 793.79 2003.46 793.79 2003.46 720.4 2003.46 647.01 2003.46 573.62 2003.46 426.85 1930.07 426.85"
    />
    <polygon
      fill={MAROON}
      points="1775.27 426.85 1775.27 573.62 1775.27 647.01 1775.27 720.4 1775.27 793.79 1848.38 793.79 1848.38 720.4 1848.38 647.01 1848.38 573.62 1848.38 426.85 1775.27 426.85"
    />
    <rect fill={OCHRE} x="1255.81" y="426.85" width="73.39" height="73.39" />
    <rect fill={OCHRE} x="1329.19" y="426.85" width="73.39" height="73.39" />
    <rect
      fill={SKY}
      x="1182.42"
      y="573.62"
      width="73.39"
      height="73.39"
      transform="translate(1829.43 -608.8) rotate(90)"
    />
    <rect
      fill={OCHRE}
      x="1182.42"
      y="500.23"
      width="73.39"
      height="73.39"
      transform="translate(1756.04 -682.18) rotate(90)"
    />
    <rect
      fill={SKY}
      x="1402.58"
      y="573.62"
      width="73.39"
      height="73.39"
      transform="translate(2049.59 -828.96) rotate(90)"
    />
    <rect
      fill={SKY}
      x="1164.07"
      y="702.05"
      width="110.08"
      height="73.39"
      transform="translate(1957.86 -480.37) rotate(90)"
    />
    <rect
      fill={SKY}
      x="1384.23"
      y="702.05"
      width="110.08"
      height="73.39"
      transform="translate(2178.02 -700.53) rotate(90)"
    />
    <rect
      fill={OCHRE}
      x="1402.58"
      y="500.23"
      width="73.39"
      height="73.39"
      transform="translate(1976.2 -902.35) rotate(90)"
    />
    <rect fill={MAROON} x="1255.81" y="903.87" width="73.39" height="73.39" />
    <rect fill={MAROON} x="1329.19" y="903.87" width="73.39" height="73.39" />
    <rect
      fill={SKY}
      x="1182.42"
      y="1050.64"
      width="73.39"
      height="73.39"
      transform="translate(2306.45 -131.77) rotate(90)"
    />
    <rect
      fill={MAROON}
      x="1182.42"
      y="977.26"
      width="73.39"
      height="73.39"
      transform="translate(2233.06 -205.16) rotate(90)"
    />
    <rect
      fill={SKY}
      x="1402.58"
      y="1050.64"
      width="73.39"
      height="73.39"
      transform="translate(2526.61 -351.94) rotate(90)"
    />
    <rect
      fill={PINK}
      x="1164.07"
      y="1142.38"
      width="110.08"
      height="73.39"
      transform="translate(2398.18 -40.04) rotate(90)"
    />
    <rect
      fill={PINK}
      x="1384.23"
      y="1142.38"
      width="110.08"
      height="73.39"
      transform="translate(2618.35 -260.2) rotate(90)"
    />
    <rect
      fill={MAROON}
      x="1402.58"
      y="977.26"
      width="73.39"
      height="73.39"
      transform="translate(2453.23 -425.33) rotate(90)"
    />
    <rect
      fill={SKY}
      x="1555.67"
      y="1050.64"
      width="73.39"
      height="73.39"
      transform="translate(2679.7 -505.03) rotate(90)"
    />
    <rect
      fill={MAROON}
      x="1555.67"
      y="977.26"
      width="73.39"
      height="73.39"
      transform="translate(2606.31 -578.41) rotate(90)"
    />
    <rect
      fill={ORANGE}
      x="1775.83"
      y="1050.64"
      width="73.39"
      height="73.39"
      transform="translate(2899.87 -725.19) rotate(90)"
    />
    <rect
      fill={OCHRE}
      x="1537.32"
      y="1142.38"
      width="110.08"
      height="73.39"
      transform="translate(2771.44 -413.29) rotate(90)"
    />
    <rect
      fill={ORANGE}
      x="1757.49"
      y="1142.38"
      width="110.08"
      height="73.39"
      transform="translate(2991.6 -633.45) rotate(90)"
    />
    <rect
      fill={ORANGE}
      x="1775.83"
      y="977.26"
      width="73.39"
      height="73.39"
      transform="translate(2826.48 -798.58) rotate(90)"
    />
    <rect fill={OCHRE} x="1629.06" y="1233.55" width="73.39" height="73.39" />
    <rect fill={ORANGE} x="1702.45" y="1233.55" width="73.39" height="73.39" />
    <rect
      fill={MAROON}
      x="1555.67"
      y="903.87"
      width="73.39"
      height="73.39"
      transform="translate(2532.93 -651.8) rotate(90)"
    />
    <rect
      fill={ORANGE}
      x="1775.83"
      y="903.87"
      width="73.39"
      height="73.39"
      transform="translate(2753.09 -871.97) rotate(90)"
    />
    <rect
      fill={OCHRE}
      x="954.12"
      y="1050.64"
      width="73.39"
      height="73.39"
      transform="translate(1981.63 2174.68) rotate(180)"
    />
    <rect
      fill={OCHRE}
      x="880.73"
      y="1050.64"
      width="73.39"
      height="73.39"
      transform="translate(1834.86 2174.68) rotate(180)"
    />
    <rect
      fill={MAROON}
      x="917.43"
      y="1050.64"
      width="36.69"
      height="219.6"
      transform="translate(1871.55 2320.89) rotate(180)"
    />
    <rect
      fill={PINK}
      x="953.91"
      y="1050.64"
      width="36.69"
      height="219.6"
      transform="translate(1944.52 2320.89) rotate(180)"
    />
    <rect
      fill={SKY}
      x="1027.51"
      y="903.87"
      width="73.39"
      height="73.39"
      transform="translate(123.64 2004.77) rotate(-90)"
    />
    <rect
      fill={OCHRE}
      x="1027.51"
      y="977.26"
      width="73.39"
      height="73.39"
      transform="translate(50.25 2078.15) rotate(-90)"
    />
    <rect
      fill={SKY}
      x="807.35"
      y="903.87"
      width="73.39"
      height="73.39"
      transform="translate(-96.52 1784.6) rotate(-90)"
    />
    <rect
      fill={OCHRE}
      x="807.35"
      y="977.26"
      width="73.39"
      height="73.39"
      transform="translate(-169.91 1857.99) rotate(-90)"
    />
    <polygon
      fill={OCHRE}
      points="1555.67 426.85 1775.27 793.79 1775.27 426.85 1555.67 426.85"
    />
    <polygon
      fill={PINK}
      points="1629.06 426.85 1555.67 426.85 1629.06 549.47 1629.06 426.85"
    />
    <rect
      fill={ORANGE}
      x="2058.08"
      y="555.56"
      width="36.69"
      height="146.78"
      transform="translate(2705.37 -1447.48) rotate(90)"
    />
    <rect fill={ORANGE} x="866.39" y="1270.24" width="175.46" height="36.69" />
    <rect fill={ORANGE} x="1255.81" y="1233.55" width="73.39" height="73.39" />
    <rect fill={ORANGE} x="1329.19" y="1233.55" width="73.39" height="73.39" />
    <rect
      fill={OCHRE}
      x="1930.07"
      y="904.15"
      width="36.69"
      height="266.64"
      transform="translate(3896.84 2074.94) rotate(180)"
    />
    <rect
      fill={OCHRE}
      x="1912.13"
      y="1251.49"
      width="73.39"
      height="37.5"
      transform="translate(3219.07 -678.58) rotate(90)"
    />
    <rect
      fill={WHITE}
      x="215.12"
      y="1312.04"
      width="72.83"
      height="72.97"
      transform="translate(1600.06 1097) rotate(90)"
    />
    <rect
      fill={OCHRE}
      x="2589.53"
      y="1384.87"
      width="72.83"
      height="72.97"
      transform="translate(4047.29 -1204.59) rotate(90)"
    />
    <rect
      fill={WHITE}
      x="2516.63"
      y="1457.76"
      width="72.83"
      height="72.97"
      transform="translate(4047.29 -1058.8) rotate(90)"
    />
    <rect
      fill={OCHRE}
      x="142.15"
      y="1239.22"
      width="72.83"
      height="72.97"
      transform="translate(1454.27 1097.14) rotate(90)"
    />
    <rect
      fill={OCHRE}
      x="0.07"
      y="37.42"
      width="72.83"
      height="72.97"
      transform="translate(110.39 37.42) rotate(90)"
    />
    <rect
      fill={WHITE}
      x="2553.11"
      y="146.66"
      width="72.83"
      height="72.97"
      transform="translate(2772.67 -2406.38) rotate(90)"
    />
    {/* Not part of the export: the bottom-right corner dog-eared in
       skyDeep — the shadow's colour turning up onto the card's face —
       carrying a turn arrow so the fold reads as "flip me", not as a
       torn corner. The arrow is drawn, not typed: ↻ is missing from
       plenty of font stacks and a tofu box in the corner is worse than
       no icon at all. It sits on the fold's incentre — 53 units off
       both edges — sized well inside the inscribed circle so the fold
       reads as a fold first and a button second. */}
    <polygon fill={SKY_DEEP} points="2720 1520 2720 1700 2540 1700" />
    <path
      d="M2685.4 1631.6 A24 24 0 1 1 2656.9 1625.2"
      fill="none"
      stroke={WHITE}
      strokeWidth="9"
      strokeLinecap="round"
    />
    <polygon fill={WHITE} points="2671.4 1618.4 2661.1 1634.3 2652.7 1616.1" />
  </svg>
);

/* Back: the supplied letter artwork (ty-card-back), plus the greeting
   the artwork leaves blank — "Hey," in the letter's own bold ink, the
   host's name in the site orange. The name rides in the same <text> so
   the font's own comma-and-space metrics set the gap, exactly as the
   comp was typeset. */
const BackFace = ({ name }) => (
  <svg
    className={`${styles.face} ${styles.faceBack}`}
    viewBox="0 0 2720 1700"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <image href="/ty-card-back.svg" width="2720" height="1700" />
    <text
      x={GREETING_X}
      y={GREETING_BASELINE}
      fontFamily={DISPLAY}
      fontSize={GREETING_SIZE}
      fontWeight="800"
      fill={INK}
    >
      {thankYou.note.greeting}
      {' '}
      <tspan fill={ACCENT} letterSpacing={NAME_TRACKING}>
        {name.toUpperCase()}
      </tspan>
    </text>
  </svg>
);

const ThankYouBand = ({ user }) => {
  const [flipped, setFlipped] = useState(false);
  /* WelcomeBand's greeting-name rule — first word of the MyMLH name —
     plus one of the card's own: a name too long for the greeting line
     would run under the artwork's logo mark, so past that point
     (lib/postcardGreeting.mjs) the card greets a future host instead.
     Same fallback for junk profile data. */
  /* Until the first flip, the card peeks — a periodic few-degree tilt
     (styles.peek) showing it can turn, instead of only the caption
     saying so. One-way state: once flipped, the nudge never returns. */
  const [hasFlipped, setHasFlipped] = useState(false);
  const first = firstName((user && user.name) || '');
  const name =
    first && greetingNameFits(first.toUpperCase())
      ? first
      : thankYou.note.fallbackName;

  const innerClasses = [
    styles.inner,
    flipped && styles.flipped,
    !hasFlipped && styles.peek,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={styles.root} aria-labelledby="thank-you-title">
      {/* Visually hidden, not gone: the card breaking the band's top
         edge replaced the visible title, but the section keeps its
         accessible name and its place in the heading outline. */}
      <h2 id="thank-you-title" className={styles.srOnly}>
        {thankYou.title}
      </h2>
      {/* The whole note, visually hidden but always in the tree: the
         SVGs are aria-hidden decoration, so this is what a screen
         reader hears — no flipping required. */}
      <div className={styles.srOnly}>
        <p>
          {thankYou.note.greeting} {name}
        </p>
        {thankYou.note.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p>{thankYou.note.ps}</p>
        <p>{thankYou.note.signature}</p>
      </div>
      <button
        type="button"
        className={styles.card}
        aria-pressed={flipped}
        aria-label={thankYou.cardLabel}
        onClick={() => {
          setFlipped((value) => !value);
          setHasFlipped(true);
        }}
      >
        <span className={styles.scene}>
          <span className={innerClasses}>
            <FrontFace />
            <BackFace name={name} />
          </span>
        </span>
        <span className={styles.hint} aria-hidden="true">
          {flipped ? thankYou.flipBackHint : thankYou.flipHint}
        </span>
      </button>
    </section>
  );
};

export default ThankYouBand;
