import styles from './Milestones.module.css';

/* One milestone section inside the single shared card, as a native
   <details>/<summary> disclosure — same technique as the homepage FAQ
   (FaqSection.styles.js): browser-native toggle and keyboard handling for
   free, animated via the ::details-content pseudo-element rather than any
   click-driven height calculation.

   `open` is owned by the parent (StickersBand): the default is computed
   from progress, but the user can toggle either section regardless of
   that default via the native disclosure behaviour — the two are
   independent, not an accordion where opening one closes the other.
   `onToggle` receives the native toggle event and reads `.open` off it,
   so React's state can never disagree with what the browser actually
   did. */
const MilestoneGroup = ({
  tag,
  description,
  reached,
  badge,
  accent,
  open,
  onToggle,
  rows,
}) => (
  <details className={styles.section} open={open} onToggle={onToggle}>
    <summary className={styles.sectionHeader}>
      <span className={styles.headerText}>
        <span className={styles.groupTag}>{tag}</span>
        <h3 className={styles.groupTitle}>{description}</h3>
      </span>
      <span
        className={`${styles.groupBadge} ${reached ? `${styles.badgeReached} ${styles[accent]}` : ''}`}
      >
        {badge}
      </span>
      <span className={styles.chevron} aria-hidden="true" />
    </summary>
    <ul className={styles.steps}>
      {rows.map((row) => (
        <li key={row.key} className={styles.step}>
          <span
            className={`${styles.tick} ${row.done ? '' : styles.pending}`}
            aria-hidden="true"
          >
            {row.done ? '✓' : ''}
          </span>
          <span className={styles.stepText}>
            <span className={styles.stepTitle}>{row.title}</span>
            {row.detail && (
              <span className={styles.stepDetail}>{row.detail}</span>
            )}
          </span>
          {row.cta && (
            <a
              className={`hf-button hf-button--small ${styles.stepCta}`}
              href={row.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {row.cta}
            </a>
          )}
        </li>
      ))}
    </ul>
  </details>
);

export default MilestoneGroup;
