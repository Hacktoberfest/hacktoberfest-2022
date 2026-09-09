/* The five ways to qualify for a sticker pack.

   The API supplies ids and completion only. Every word and every destination a
   participant sees lives here, so a backend change can never alter the page's
   copy, and an activity the backend has not heard of still renders correctly.

   The hrefs are placeholders: the real destinations are open questions for the
   backend team (see the design spec). They use the reserved `.invalid` TLD so
   they can never resolve — a missed one fails review rather than shipping as a
   plausible-looking dead link. */
export const ACTIVITIES = Object.freeze([
  /* DEV-sourced: without the account link there is nothing to poll, so this
     can never auto-tick. `requiresDevLink` drives the ActivityCard hint — never
     hardcode these two ids in a component instead. */
  Object.freeze({
    id: 'dev-challenge',
    label: 'Complete a Dev Challenge',
    detail: 'Build something small against a prompt from DEV.',
    href: 'https://example.invalid/hacktoberfest/dev-challenge',
    ctaLabel: 'Start',
    requiresDevLink: true,
    /* Where this activity renders on /my: 'card' in the activities band,
       'fests' inside the My Fests band. Presentation only — eligibility math
       never reads it, so reworking the qualify display is a UI-only change. */
    surface: 'card',
  }),
  Object.freeze({
    id: 'livestream',
    label: 'Attend a Hacktoberfest livestream',
    detail: 'Turn up to any of the October sessions.',
    href: 'https://example.invalid/hacktoberfest/livestreams',
    ctaLabel: 'Watch',
    surface: 'card',
  }),
  /* surface: 'fests' no longer hides this from the activities carousel —
     every activity renders there. It marks which band owns the COMPLETION
     attribution: the "counts toward your stickers" note for a fest renders
     in the My Fests band, next to the fests themselves. */
  Object.freeze({
    id: 'fest',
    label: 'Attend a Fest in person',
    detail: 'A one-day, in-person event in your city.',
    href: 'https://example.invalid/hacktoberfest/fests',
    ctaLabel: 'Find one',
    surface: 'fests',
  }),
  /* DEV-sourced, same reasoning as dev-challenge above. */
  Object.freeze({
    id: 'dev-post',
    label: 'Write a DEV post about Hacktoberfest',
    detail: 'Tell people what you built or what you learned.',
    href: 'https://example.invalid/hacktoberfest/write',
    ctaLabel: 'Write',
    requiresDevLink: true,
    surface: 'card',
  }),
  Object.freeze({
    id: 'dev-relay',
    label: 'Install Dev Relay',
    detail: 'Connect your editor and it counts automatically.',
    href: 'https://example.invalid/hacktoberfest/dev-relay',
    ctaLabel: 'Install',
    surface: 'card',
  }),
]);
