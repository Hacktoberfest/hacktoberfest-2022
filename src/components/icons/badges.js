/* The badge silhouettes the application ladder wears, shared so every
   surface that names a rung draws the same mark: the fests band's cards
   and the acknowledgements modal's intro ladder. Filled silhouettes on
   purpose (stroked detail turns to mush at 11px); the check is the one
   stroked shape, square-capped to stay in the pixel voice. Callers pass
   the className that sizes them. */

export const PencilIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4 20l1.2-4.4L16 4.8 19.2 8 8.4 18.8 4 20z" fill="currentColor" />
  </svg>
);

export const CheckIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M4 12.5 9.5 18 20 6.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="square"
    />
  </svg>
);

/* A paper plane — the application is sent, out of the host's hands. */
export const PlaneIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M22 3 2 10.6l6.6 2.3.8 6.5 3.2-4.5 5.2 4.1L22 3z"
      fill="currentColor"
    />
  </svg>
);

/* A warning triangle — the next move is the host's. The exclamation is
   knocked out with evenodd so the badge ground shows through. */
export const AlertIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M12 2.5 23 21.5H1L12 2.5z M10.7 9h2.6l-.5 6.2h-1.6L10.7 9z M10.8 16.8h2.4v2.4h-2.4v-2.4z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

/* An hourglass — the Fest is with FestNet's automated checks. */
export const HourglassIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M5 3h14v4.5L13.5 12 19 16.5V21H5v-4.5L10.5 12 5 7.5V3z"
      fill="currentColor"
    />
  </svg>
);

/* The star, drawn about (12,13) for optical centering. */
export const StarIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M12 3 L14.65 9.36 L21.51 9.91 L16.28 14.39 L17.88 21.09 L12 17.5 L6.12 21.09 L7.72 14.39 L2.49 9.91 L9.35 9.36 Z"
      fill="currentColor"
    />
  </svg>
);
