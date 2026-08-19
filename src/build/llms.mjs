import { writeFile } from 'fs/promises';

import {
  aiContext,
  answerLinks,
  answerText,
  faq,
  getInvolved,
  headingText,
  hero,
  host,
  mission,
  siteMeta,
  subscribed,
  timeline,
} from '../data/content.mjs';

/* Writes the two plain-text files answer engines read, from the same copy the
   page renders (src/data/content.mjs).

   llms.txt is the short orientation file: what this is, what's open, where to
   look. llms-full.txt is the whole site as prose, for a crawler that wants
   the actual wording rather than a summary of it. */

const paragraphs = (...blocks) => blocks.flat().filter(Boolean).join('\n\n');

const bullets = (items) => items.map((item) => `- ${item}`).join('\n');

/* The orientation file's "Start here" list, each on-site entry tagged with
   the route it points at. `route: null` is an entry that is not a page —
   llms-full.txt is a file. */
const START_HERE = [
  {
    route: '/',
    text: '[Hacktoberfest 2026](./): The event overview, the mission, and how to get involved.',
  },
  {
    route: '/host/',
    text: '[Host a Fest](./host/): The Fest formats, the support organizers get, and how to apply to host.',
  },
  {
    route: '/questions/',
    text: '[FAQs](./questions/): The full set of questions on the mission change, Preptember, Fest formats, hosting, swag, and sponsorship.',
  },
  {
    route: null,
    text: '[Complete event context](./llms-full.txt): The full public copy of the site as one plain-text file.',
  },
];

const llmsIndex = () =>
  paragraphs(
    '# Hacktoberfest 2026',
    `> ${siteMeta.description}`,
    aiContext.orientation,
    '## Start here',
    bullets(START_HERE.map((entry) => entry.text)),
    '## Taking part',
    bullets(aiContext.participation),
    `## ${timeline.eyebrow}`,
    bullets(
      timeline.eras.map(
        (era) => `[${era.year}](./#history): ${era.title} ${era.copy}`,
      ),
    ),
    `## ${mission.eyebrow}`,
    // The closing paragraph is the thesis; the rest is the argument for it.
    answerText(mission.paragraphs[mission.paragraphs.length - 1]),
    `## ${faq.eyebrow}`,
    bullets(faq.items.map((item) => item.question)),
    'Answers to all of these are in [llms-full.txt](./llms-full.txt).',
    '## Key facts',
    bullets(aiContext.facts),
  );

const llmsFull = () =>
  paragraphs(
    '# Hacktoberfest 2026 — Complete site copy',
    '## Hero',
    hero.eyebrow.join(' · '),
    headingText(hero.heading),
    hero.deck,
    `CTAs: ${hero.cta} · ${hero.secondaryCta} (both open the interest form)`,
    `${hero.poweredByLabel} MLH x DEV. ${hero.presentingLabel}: DigitalOcean.`,
    `## ${timeline.eyebrow}`,
    headingText(timeline.heading),
    timeline.intro,
    timeline.eras.map((era) => `${era.year} — ${era.title} ${era.copy}`),
    `## ${mission.eyebrow}`,
    headingText(mission.heading),
    mission.paragraphs.map(answerText),
    `## ${getInvolved.eyebrow}`,
    headingText(getInvolved.heading),
    getInvolved.intro,
    getInvolved.cards.map(
      (card) =>
        `${card.tag} — ${card.title} ${card.copy.join(' ')} (CTA: ${card.cta})`,
    ),
    `## ${faq.eyebrow}`,
    headingText(faq.heading),
    faq.intro,
    faq.items.map((item) => {
      // Links are named in the prose but their URLs only exist in the markup,
      // so append them — a plain-text reader has no other way to follow one.
      // The organize answer is the one that carries an href today, and its
      // destination is site-relative, same as the links in llms.txt above.
      const links = answerLinks(item.answer);
      const suffix = links.length ? ` (${links.join(' ')})` : '';
      return `${item.question} — ${answerText(item.answer)}${suffix}`;
    }),
    '## After signing up',
    `${subscribed.eyebrow}. ${headingText(subscribed.heading)}`,
    subscribed.body,
    '## Host a Fest',
    `${host.eyebrow}. ${headingText(host.heading)}`,
    host.intro,
    host.formats.cards.map(
      (card) => `${card.tag} — ${card.title} ${card.copy.join(' ')}`,
    ),
    `${host.formats.comparison.label}: ${host.formats.comparison.rows
      .map(
        (row) =>
          `${row.label} — Hack Day: ${row.hackDay}; Meet Up: ${row.meetUp}`,
      )
      .join('. ')}.`,
    host.support.items.map((item) => `${item.title}: ${item.copy}`),
    host.apply.steps.map(
      (step, index) => `Step ${index + 1} — ${step.title}: ${step.copy}`,
    ),
    // The hosting guide has no published URL yet, so the copy is named
    // without a link — same honesty rule aiContext follows.
    `${host.apply.body} (CTA: ${host.apply.cta} — opens the interest form.)`,
  );

const write = (name, body) =>
  writeFile(new URL(`../../public/${name}`, import.meta.url), `${body}\n`);

const llms = async () => {
  await write('llms.txt', llmsIndex());
  await write('llms-full.txt', llmsFull());
};

export default llms;
