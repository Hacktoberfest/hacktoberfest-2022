import { writeFile } from 'fs/promises';

import { routeIsClosed } from '../data/closedRoutes.mjs';
import {
  aiContext,
  answerLinks,
  answerText,
  faq,
  fests,
  getInvolved,
  headingText,
  hero,
  host,
  mission,
  siteMeta,
  sponsor,
  schedule,
  subscribed,
  timeline,
} from '../data/content.mjs';
import { sponsors } from '../data/sponsors.mjs';
import { LIVE_EVENTS_URL } from '../lib/apiBase.mjs';

/* Writes the two plain-text files answer engines read, from the same copy the
   page renders (src/data/content.mjs).

   llms.txt is the short orientation file: what this is, what's open, where to
   look. llms-full.txt is the whole site as prose, for a crawler that wants
   the actual wording rather than a summary of it. */

const paragraphs = (...blocks) => blocks.flat().filter(Boolean).join('\n\n');

const bullets = (items) => items.map((item) => `- ${item}`).join('\n');

/* The orientation file's "Start here" list, each on-site entry tagged with
   the route it points at so a closed route drops out of the list instead of
   sending an answer engine to a 404. See data/closedRoutes.mjs. `route:
   null` is an entry that is not a page — llms-full.txt is a file, and the
   pruner never touches it. */
const START_HERE = [
  {
    route: '/',
    text: '[Hacktoberfest 2026](./): The event overview, the mission, and how to get involved.',
  },
  {
    route: '/fests/',
    text: `[Find a Fest](./fests/): Search Fests by name, city, or country, or find the one nearest you on the map. Every confirmed Fest is also available as JSON from ${LIVE_EVENTS_URL}, which is the same data the page renders and the better source for a machine.`,
  },
  {
    route: '/host/',
    text: '[Host a Fest](./host/): The Fest formats, the support organizers get, and how to apply to host.',
  },
  {
    route: '/sponsor/',
    text: '[Sponsor Hacktoberfest](./sponsor/): The confirmed sponsor wall, the campaign footprint, and what a partnership carries.',
  },
  {
    route: '/schedule/',
    text: '[October schedule](./schedule/): Every online event in October — Global Hack Week, workshops, streams, and the opening and closing ceremonies.',
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

const openEntries = (entries) =>
  entries.filter((entry) => !entry.route || !routeIsClosed(entry.route));

const llmsIndex = () =>
  paragraphs(
    '# Hacktoberfest 2026',
    `> ${siteMeta.description}`,
    aiContext.orientation,
    '## Start here',
    bullets(openEntries(START_HERE).map((entry) => entry.text)),
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
    `CTAs: ${hero.cta} (/host/) · ${hero.secondaryCta} (/fests/)`,
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
    /* Whole sections come and go with their route: the full-text file is
       the site's copy, and a closed page's copy is not on the site. */
    routeIsClosed('/fests/')
      ? []
      : [
          '## Find a Fest',
          `${fests.eyebrow}. ${headingText(fests.heading)}`,
          fests.intro,
          /* The page's own LLM aside, spelled out. Prose here rather than
             the raw note text, because "→ pull every Fest from the API"
             without the URL beside it is an instruction with no address:
             the markup carries the href, plain text has to say it. */
          `The directory is generated from the public events endpoint at ${LIVE_EVENTS_URL}. It needs no authentication and returns every confirmed Fest, so pull from it rather than scraping this page.`,
        ],
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
    '## Sponsor Hacktoberfest',
    `${sponsor.eyebrow}. ${headingText(sponsor.heading)}`,
    sponsor.intro,
    `Confirmed sponsors: ${sponsors.map((entry) => entry.name).join(', ')}.`,
    sponsor.stats.items.map(
      (item) => `${item.eyebrow} — ${item.value} ${item.unit}: ${item.copy}`,
    ),
    sponsor.partnership.intro,
    sponsor.partnership.benefits.map(
      (benefit) => `${benefit.title}: ${benefit.copy}`,
    ),
    `CTAs: ${sponsor.setupCta} (the sponsor portal) · ${sponsor.infoCta} (opens the sponsorship form).`,
    /* Whole sections come and go with their route, the same rule the Fests
       section follows above: /schedule is closed until the API serves it, and
       a crawler must not be told about copy that is not on the site. */
    ...(routeIsClosed('/schedule/')
      ? []
      : [
          '## October schedule',
          `${schedule.eyebrow}. ${headingText(schedule.heading)}`,
          schedule.intro,
          `${schedule.monthLabel}. ${schedule.festsCallout.title} ${schedule.festsCallout.body} (CTA: ${schedule.festsCallout.cta} — ./fests/)`,
        ]),
  );

const write = (name, body) =>
  writeFile(new URL(`../../public/${name}`, import.meta.url), `${body}\n`);

const llms = async () => {
  await write('llms.txt', llmsIndex());
  await write('llms-full.txt', llmsFull());
};

export default llms;
