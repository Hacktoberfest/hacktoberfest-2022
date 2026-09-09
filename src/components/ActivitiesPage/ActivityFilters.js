import { activitiesPage } from 'data/content.mjs';

import styles from './ActivitiesPage.module.css';

/* The chips above the cards. Buttons with aria-pressed, one group: they
   filter what is on screen and nothing else — no URL, no reorder. The
   words come from content (list.types, list.filters); the keys and counts
   from lib/activityFilters.mjs. */
const labelFor = (key) => {
  const { filters, types } = activitiesPage.list;
  if (key === 'all') return filters.all;
  if (key === 'todo') return filters.todo;
  return types[key];
};

const ActivityFilters = ({ chips, active, onChange }) => (
  <div
    className={styles.chips}
    role="group"
    aria-label={activitiesPage.list.filters.label}
  >
    {chips.map((chip) => (
      <button
        key={chip.key}
        type="button"
        className={styles.chip}
        aria-pressed={chip.key === active}
        onClick={() => onChange(chip.key)}
      >
        {activitiesPage.list.filters.chip(labelFor(chip.key), chip.count)}
      </button>
    ))}
  </div>
);

export default ActivityFilters;
