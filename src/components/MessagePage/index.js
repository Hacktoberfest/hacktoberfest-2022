import { StairsLeft, StairsRight } from 'components/Hero/HeroGeometry';

import styles from './MessagePage.module.css';

/* Full-screen message used by standalone pages (404, form confirmation)
   and /auth/callback/'s failure states. `accent` is the part of the
   heading that takes the sky highlight.

   All CSS Module, no styled-components — see the note atop
   MessagePage.module.css: the callback page's export renders the Loader,
   so a styled-components MessagePage would ship that page unstyled.

   `role` exists for the caller that swaps this in over a live region:
   /auth/callback/'s failure states replace the Loader, whose aria-live
   paragraph unmounts with it, so without role="status" a screen-reader
   user who just heard "we're finishing your sign-in" gets silence. Pages
   that render a MessagePage from the start (404, subscribed) pass
   nothing. Same reasoning, spelled out longer, on MyStatus's surfaces. */
const MessagePage = ({
  eyebrow,
  heading,
  accent,
  children,
  cta,
  ctaHref,
  onCtaClick,
  role,
}) => (
  <section className={styles.root} role={role}>
    <div className={styles.decoLeft} aria-hidden="true">
      <StairsLeft />
    </div>
    <div className={styles.decoRight} aria-hidden="true">
      <StairsRight />
    </div>
    <div className={styles.inner}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 className={styles.heading}>
        {heading} <em>{accent}</em>
      </h1>
      <p className={styles.copy}>{children}</p>
      {/* Callers may omit `cta` for a message-only screen — keep this gated
          so that case doesn't leave a fully-styled, empty, non-navigating
          anchor sitting in the markup. */}
      {cta && (
        <a
          className={styles.cta}
          href={ctaHref}
          onClick={
            onCtaClick
              ? (event) => {
                  event.preventDefault();
                  onCtaClick();
                }
              : undefined
          }
        >
          {cta}
        </a>
      )}
    </div>
  </section>
);

export default MessagePage;
