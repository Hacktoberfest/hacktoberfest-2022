import LockedPanel from 'components/LockedBand/LockedPanel';
import { schedule } from 'data/content.mjs';

import styles from './ScheduleDirectory.module.css';

/* /schedule while the schedule is locked (data/scheduleLock.mjs): the
   directory's own band and header, the month, the heading and the note on
   what a check-in counts for, over the padlocked panel /my closes its
   bands with, badged "Coming soon". Nothing is fetched: the directory is
   not mounted, so /api/schedule is not asked for a month nobody can see
   yet. Static, so it is in the export as it is on screen. */
const ScheduleComingSoon = () => (
  <section className={styles.root} aria-labelledby="schedule-coming-soon">
    <div className={styles.inner}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>{schedule.monthLabel}</p>
        <h2 id="schedule-coming-soon" className={styles.heading}>
          {schedule.sectionHeading.lead}{' '}
          <em>{schedule.sectionHeading.accent}</em>
        </h2>
        <p className={styles.countsNote}>
          {schedule.countsNote.text}{' '}
          <a href="/activities/">{schedule.countsNote.cta}</a>
        </p>
      </div>
      <LockedPanel
        title={schedule.locked.title}
        copy={schedule.locked.copy}
        badge={schedule.locked.badge}
      />
    </div>
  </section>
);

export default ScheduleComingSoon;
