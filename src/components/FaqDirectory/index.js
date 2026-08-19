import FaqList from 'components/FaqSection/FaqList';
import { faq } from 'data/content.mjs';

import styles from './FaqDirectory.module.css';

/* The /faq page body: the six sections data/content.mjs declares, each a
   heading followed by a FaqList of that section's items — the same
   accordion the homepage band renders, so the two surfaces never grow two
   different ideas of what a question looks like.

   CSS Module, not styled-components: this renders under PageHero, which
   already made that switch (see its own note) for the site-wide bug where
   client-side navigation ships no styled-components CSS. FaqList still
   uses FaqSection's styled-components internally, which is fine here — the
   /faq page is server-rendered on first load same as every other route,
   and the accordion look is meant to be identical between the two
   surfaces regardless of what style system built it. */
const FaqDirectory = () => (
  <div className={styles.root}>
    {faq.sections.map((section) => {
      const items = faq.items.filter((item) => item.section === section.id);
      const headingId = `faq-${section.id}-title`;

      return (
        <section
          key={section.id}
          className={styles.section}
          aria-labelledby={headingId}
        >
          <h2 id={headingId} className={styles.heading}>
            {section.title}
          </h2>
          <FaqList items={items} />
        </section>
      );
    })}
  </div>
);

export default FaqDirectory;
