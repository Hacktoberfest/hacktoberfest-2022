import {
  answerText,
  homeAbout,
  homeOnline,
  homeSteps,
  online,
} from 'data/content.mjs';
import { stickerImageSrc } from 'lib/stickerImage.mjs';

import styles from './HomeBands.module.css';

/* The bands the October homepage adds round its map hero and the upcoming
   Fests: what Hacktoberfest is, the way in for anyone with no Fest
   nearby, and how the sticker book works for everyone. All static, but
   CSS Modules like the hero and NearbyFests they sit between, so the
   page's new sections share one styling approach. */

const external = (href) => /^https?:\/\//.test(href);

/* What is Hacktoberfest? Under the hero, for the visitor who does not
   know yet, in the mission page's own band (MissionSection): the heading
   on the left, the answer on the right with the line that matters in
   each paragraph in bold, then the ways on to the whole story: the first
   the site's button, any after it the secondary one on the dark ground. */
export const HomeAboutBand = () => (
  <section className={styles.about} aria-labelledby="home-about-title">
    <div className={`${styles.shell} ${styles.aboutInner}`}>
      <div>
        <p className={styles.aboutEyebrow}>{homeAbout.eyebrow}</p>
        <h2 id="home-about-title" className={styles.aboutHeading}>
          {homeAbout.heading.lead} <em>{homeAbout.heading.accent}</em>
        </h2>
      </div>
      <div className={styles.aboutCopy}>
        {homeAbout.paragraphs.map((paragraph) => (
          <p key={answerText(paragraph)}>
            {paragraph.map((segment, index) =>
              segment.bold ? (
                // eslint-disable-next-line react/no-array-index-key
                <strong key={index}>{segment.text}</strong>
              ) : (
                segment.text
              ),
            )}
          </p>
        ))}
        <div className={styles.aboutActions}>
          {homeAbout.actions.map((action, index) => (
            <a
              key={action.href}
              className={
                index === 0 ? 'hf-button' : `hf-button ${styles.buttonOnDark}`
              }
              href={action.href}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* Can't get to a Fest? The three online activities, each drawn as a
   plain badge of its page of the book (scripts/stickers/design
   ILLUSTRATIONS) in the frame /my puts an earned sticker in, then the
   button to /online. */
export const HomeOnlineBand = () => (
  <section className={styles.online} aria-labelledby="home-online-title">
    <div className={styles.shell}>
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>{homeOnline.eyebrow}</p>
          <h2 id="home-online-title" className={styles.heading}>
            {homeOnline.heading.lead} <em>{homeOnline.heading.accent}</em>
          </h2>
        </div>
        <p className={styles.introCopy}>{homeOnline.intro}</p>
      </div>
      <ul className={styles.cards}>
        {homeOnline.cards.map((card) => (
          <li key={card.id} className={styles.card}>
            <span className={styles.badge}>
              <img
                className={styles.badgeImage}
                src={stickerImageSrc(card.sticker)}
                alt=""
                width="72"
                height="72"
              />
            </span>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardCopy}>{card.copy}</p>
            <a
              className={styles.cardLink}
              href={card.href}
              {...(external(card.href)
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {card.cta}
            </a>
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <a className="hf-button" href={homeOnline.cta.href}>
          {homeOnline.cta.label}
        </a>
      </div>
    </div>
  </section>
);

/* The stickers a step earns, as a little overlapping pile above it: each
   in the frame /my puts an earned sticker in, tipped a few degrees either
   way. Decorative: the step's own words say what it earns. */
const PILE_TILTS = [-8, 6, -4, 9];

const StepPile = ({ slugs }) => (
  <div className={styles.pile} aria-hidden="true">
    {slugs.map((slug, index) => (
      <span
        key={slug}
        className={styles.pileBadge}
        style={{
          '--i': index,
          '--tilt': `${PILE_TILTS[index % PILE_TILTS.length]}deg`,
        }}
      >
        <img
          className={styles.badgeImage}
          src={stickerImageSrc(slug)}
          alt=""
          width="88"
          height="88"
        />
      </span>
    ))}
  </div>
);

/* How it works, in the steps band grammar of /in-person: phases under a
   ruled label, the steps numbered across them in the ochre square, each
   under a pile of the stickers it earns, and the note on when the post
   arrives beside the button. */
export const HomeStepsBand = () => {
  let number = 0;
  return (
    <section className={styles.steps} aria-labelledby="home-steps-title">
      <div className={styles.shell}>
        <div className={styles.stepsIntro}>
          <p className={styles.stepsEyebrow}>{homeSteps.eyebrow}</p>
          <h2 id="home-steps-title" className={styles.stepsHeading}>
            {homeSteps.heading.lead} <em>{homeSteps.heading.accent}</em>
          </h2>
        </div>
        <div className={styles.phases}>
          {homeSteps.phases.map((phase, index) => (
            <div
              key={phase.label}
              className={styles.phase}
              style={{ '--steps': phase.steps.length }}
            >
              <p
                className={styles.phaseLabel}
                data-later={index > 0 ? 'true' : 'false'}
              >
                {phase.label}
              </p>
              <ol className={styles.phaseSteps} start={number + 1}>
                {phase.steps.map((step) => {
                  number += 1;
                  return (
                    <li key={step.title} className={styles.step}>
                      {step.stickers && <StepPile slugs={step.stickers} />}
                      <span className={styles.stepNumber} aria-hidden="true">
                        {String(number).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className={styles.stepTitle}>{step.title}</h3>
                        <p className={styles.stepCopy}>{step.copy}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
        <div className={styles.stepsActions}>
          <a className="hf-button" href={homeSteps.cta.href}>
            {homeSteps.cta.label}
          </a>
          <p className={styles.stepsNote}>{online.milestones.disclaimer}</p>
        </div>
      </div>
    </section>
  );
};
