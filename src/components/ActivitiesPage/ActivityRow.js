import { activitiesPage } from 'data/content.mjs';

import styles from './ActivitiesPage.module.css';

/* One activity, in full. The completion line says when and how — the
   "how" is the API's source in the page's words (content.list.source), so
   a support confirmation reads differently from a check-in. */
const formatDate = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

const ActivityRow = ({ activity, signedIn }) => {
  const external = /^https?:\/\//.test(activity.href || '');
  const date = activity.completedAt ? formatDate(activity.completedAt) : null;
  const how = activity.source
    ? activitiesPage.list.source[activity.source]
    : null;

  return (
    <li className={styles.row}>
      <h3 className={styles.rowTitle}>{activity.label}</h3>
      <p className={styles.rowDetail}>{activity.detail}</p>
      {signedIn && activity.completed && (
        <p className={styles.rowDone}>
          <span aria-hidden="true">✓ </span>
          {date ? activitiesPage.list.doneOn(date) : activitiesPage.list.done}
          {how ? `, ${how}` : ''}
        </p>
      )}
      {/* No destination yet — skip the CTA rather than ship a dead link. */}
      {activity.href && (
        <a
          className={styles.rowCta}
          href={activity.href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {activity.ctaLabel}
        </a>
      )}
    </li>
  );
};

export default ActivityRow;
