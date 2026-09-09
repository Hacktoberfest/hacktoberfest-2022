import Milestones from 'components/Milestones';
import { activitiesPage } from 'data/content.mjs';

import ActivityRow from './ActivityRow';
import styles from './ActivitiesPage.module.css';

/* The three bands under the hero. `progress` is getProgress's result;
   `experience` is what the milestone card reads and is only built when
   signed in — it is the progress plus the address flag the hub already
   knows how to fetch. Signed out, the milestone card is replaced by the
   sign-in link. */
const ActivitiesPage = ({ progress, experience }) => {
  const { thresholds, activities, signedIn } = progress;

  return (
    <>
      <section className={styles.band} aria-labelledby="how-heading">
        <h2 id="how-heading" className={styles.heading}>
          {activitiesPage.how.heading.lead}{' '}
          <em>{activitiesPage.how.heading.accent}</em>
        </h2>
        <ol className={styles.steps}>
          {activitiesPage.how.steps(thresholds.complete).map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {signedIn && experience ? (
          <Milestones experience={experience} />
        ) : (
          <a className={styles.signIn} href="/login/">
            {activitiesPage.how.signIn}
          </a>
        )}
      </section>

      <section className={styles.band} aria-labelledby="list-heading">
        <h2 id="list-heading" className={styles.heading}>
          {activitiesPage.list.heading.lead}{' '}
          <em>{activitiesPage.list.heading.accent}</em>
        </h2>
        <ul className={styles.rows}>
          {activities.map((activity) => (
            <ActivityRow
              key={activity.id}
              activity={activity}
              signedIn={signedIn}
            />
          ))}
        </ul>
      </section>

      <section className={styles.band} aria-labelledby="get-heading">
        <h2 id="get-heading" className={styles.heading}>
          {activitiesPage.get.heading.lead}{' '}
          <em>{activitiesPage.get.heading.accent}</em>
        </h2>
        <p className={styles.intro}>{activitiesPage.get.body}</p>
        <a className={styles.signIn} href="/questions/">
          {activitiesPage.get.faqCta}
        </a>
      </section>
    </>
  );
};

export default ActivitiesPage;
