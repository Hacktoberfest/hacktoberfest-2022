import { DiscordIcon } from 'components/SocialIcons';
import { my } from 'data/content.mjs';
import { MLH_DISCORD_URL } from 'data/links';

import styles from './ResourcesBand.module.css';

const copy = my.resourcesBand;

/* "Your resources.": the last band on /my, for everyone. Heading and lede
   as every band has, then two real cards side by side, each a chip, a
   title, a line and the site's button (hf-button, --small inside a card):
   the sponsors' codes, the page's one way to /my/promos/, and MLH's
   Community Discord, the page's one way in. Neither card reads the
   experience, so the band says the same true thing to everyone. It closes
   the page, so it carries the bottom room the bands above leave to it. */
const ResourcesBand = () => (
  <section className={styles.band} aria-labelledby="resources-heading">
    <h2 id="resources-heading" className={styles.heading}>
      {copy.heading.lead} <em>{copy.heading.accent}</em>
    </h2>
    <p className={styles.lede}>{copy.lede}</p>
    <div className={styles.cards}>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <span className={`${styles.chip} ${styles.chipPromos}`}>
            {copy.promos.chip}
          </span>
          <h3 className={styles.cardTitle}>{copy.promos.title}</h3>
          <p className={styles.cardText}>{copy.promos.body}</p>
        </div>
        <a className="hf-button hf-button--small" href={copy.promos.href}>
          {copy.promos.cta}
        </a>
      </div>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <span className={`${styles.chip} ${styles.chipDiscord}`}>
            {copy.discord.chip}
          </span>
          <h3 className={styles.cardTitle}>{copy.discord.title}</h3>
          <p className={styles.cardText}>{copy.discord.body}</p>
        </div>
        <a
          className="hf-button hf-button--small"
          href={MLH_DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <DiscordIcon className={styles.buttonIcon} />
          {copy.discord.cta}
        </a>
      </div>
    </div>
  </section>
);

export default ResourcesBand;
