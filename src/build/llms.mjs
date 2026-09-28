import { writeFile } from 'fs/promises';

import { routeIsClosed } from '../data/closedRoutes.mjs';
import {
  activitiesPage,
  aiContext,
  answerLinks,
  answerText,
  faq,
  fests,
  headingText,
  hero,
  homeAbout,
  homeOnline,
  homeSteps,
  host,
  inPerson,
  mapHero,
  mission,
  missionPage,
  my,
  online,
  siteMeta,
  sponsor,
  schedule,
  subscribed,
  timeline,
} from '../data/content.mjs';
import { ACTIVITIES, REQUIRED_STICKERS } from '../data/eligibility.mjs';
import { sponsors } from '../data/sponsors.mjs';
import { LIVE_EVENTS_URL } from '../lib/apiBase.mjs';

/* Writes the two plain-text files answer engines read, from the same copy the
   page renders (src/data/content.mjs).

   llms.txt is the short orientation file: what this is, what's open, where to
   look. llms-full.txt is the whole site as prose, for a crawler that wants
   the actual wording rather than a summary of it. */

const paragraphs = (...blocks) => blocks.flat().filter(Boolean).join('\n\n');

const bullets = (items) => items.map((item) => `- ${item}`).join('\n');

const SIGNED_IN_HREF = /^\/(?:my|login)\b/;

/* The orientation file's "Start here" list, each on-site entry tagged with
   the route it points at so a closed route drops out of the list instead of
   sending an answer engine to a 404. See data/closedRoutes.mjs. `route:
   null` is an entry that is not a page — llms-full.txt is a file, and the
   pruner never touches it. */
const START_HERE = [
  {
    route: '/',
    text: '[Hacktoberfest 2026](./): What Hacktoberfest is, every Fest on a map with a search for the nearest, the ways to join online, and how the sticker book works.',
  },
  {
    route: '/mission/',
    text: '[Mission](./mission/): How Hacktoberfest grew from four pull requests to 300+ events, and why this year is about building with open source AI.',
  },
  {
    route: '/online/',
    text: '[Attend online](./online/): What has changed this year, how to earn the sticker pack from anywhere, and what completing Hacktoberfest means.',
  },
  {
    route: '/in-person/',
    text: '[Attend in person](./in-person/): What a Fest is, what has changed this year, and how a day in a room earns the sticker pack.',
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
    route: '/activities/',
    text: '[Activities](./activities/): The activities that earn a sticker pack and complete Hacktoberfest, and how completion is tracked.',
  },
  {
    route: '/questions/',
    text: '[FAQs](./questions/): The full set of questions on taking part, pull requests, Fests and Hack Days, DEV Challenges, rewards, and where to get help.',
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
        (era) => `[${era.year}](./mission/#history): ${era.title} ${era.copy}`,
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

/* The stickers on one page of the book, the way components/WorldLanding
   lists them. */
const pageStickers = (type) =>
  type === 'required'
    ? REQUIRED_STICKERS
    : ACTIVITIES.filter((activity) => activity.type === type);

/* One world landing page as prose (components/WorldLanding renders the
   same object), or nothing while its route is closed. */
const worldSection = (route, title, world) =>
  routeIsClosed(route)
    ? []
    : [
        `## ${title}`,
        `${world.eyebrow}. ${headingText(world.heading)}`,
        world.intro,
        world.facts ? world.facts.join(' · ') : [],
        world.happens
          ? [
              `${world.happens.eyebrow}. ${headingText(world.happens.heading)}`,
              world.happens.intro,
              world.happens.items.map(
                (item) =>
                  `${item.title} — ${item.copy} (${item.time}; ${item.earns}.)`,
              ),
            ]
          : [],
        world.formats
          ? [
              `${world.formats.eyebrow}. ${headingText(world.formats.heading)}`,
              world.formats.intro,
              world.formats.cards.map(
                (card) => `${card.tag} — ${card.title} ${card.lines.join(' ')}`,
              ),
            ]
          : [],
        world.thenNow
          ? [
              `${world.thenNow.eyebrow}. ${headingText(world.thenNow.heading)}`,
              world.thenNow.intro,
              world.thenNow.cards.map(
                (card) =>
                  `${card.tag} — ${card.title} ${card.points.join(' ')}`,
              ),
              `${world.thenNow.quote.lead} ${world.thenNow.quote.accent}`,
            ]
          : [],
        world.rewards
          ? [
              `${world.rewards.eyebrow}. ${headingText(world.rewards.heading)}`,
              world.rewards.intro,
              world.rewards.items.map(
                (item) => `${item.title} (${item.where}) — ${item.copy}`,
              ),
              world.rewards.ghost
                ? `${world.rewards.ghost.title} (${world.rewards.ghost.where}) — ${world.rewards.ghost.copy} (CTA: ${world.rewards.ghost.cta} — ${world.rewards.ghost.href})`
                : [],
            ]
          : [],
        world.earn
          ? [
              `${world.earn.eyebrow}. ${headingText(world.earn.heading)}`,
              world.earn.intro || [],
              world.earn.steps.map(
                (step, index) =>
                  `Step ${index + 1}${step.phase ? ` (${step.phase})` : ''} — ${step.title}: ${step.copy}`,
              ),
            ]
          : [],
        world.complete ? world.complete.body : [],
        world.onTheDay
          ? [
              `${world.onTheDay.eyebrow}. ${headingText(world.onTheDay.heading)}`,
              world.onTheDay.intro,
              world.onTheDay.cards.map(
                (card) => `${card.title} (${card.at}) — ${card.copy}`,
              ),
              world.onTheDay.disclaimer,
            ]
          : [],
        /* The online page's milestones and the book, page by page: the
           names and lines the album uses, and every sticker's name. */
        world.milestones
          ? [
              `${world.milestones.eyebrow}. ${headingText(world.milestones.heading)}`,
              world.milestones.intro,
              world.milestones.cards.map(
                (card) => `${card.title} (${card.at}) — ${card.copy}`,
              ),
              world.milestones.disclaimer,
            ]
          : [],
        world.collection
          ? [
              `${world.collection.eyebrow}. ${headingText(world.collection.heading)}`,
              world.collection.intro,
              world.collection.pages.map(
                (type) =>
                  `${activitiesPage.list.types[type]} — ${my.album.pages[type]} Stickers: ${pageStickers(
                    type,
                  )
                    .map((sticker) => sticker.label)
                    .join(', ')}.`,
              ),
              `${world.collection.inPerson.title} — ${world.collection.inPerson.copy} Stickers: ${pageStickers(
                'inperson',
              )
                .map((sticker) => sticker.label)
                .join(', ')}.`,
            ]
          : [],
        `${world.faq.eyebrow}. ${headingText(world.faq.heading)}${world.faq.intro ? ` ${world.faq.intro}` : ''} (The answers are under Common questions above.)`,
        world.closing
          ? /* No sign-in path here: the llms files carry no /login or /my,
               which test/my-pages.test.mjs holds them to. */
            `${world.closing.eyebrow}. ${headingText(world.closing.heading)} ${world.closing.body} (CTAs: ${world.closing.cta.label} — signs in · ${world.closing.reminder} — opens the interest form.)`
          : [],
      ];

const llmsFull = () =>
  paragraphs(
    '# Hacktoberfest 2026 — Complete site copy',
    /* The October homepage: the Fest map hero, the soonest Fests, the
       online band and the steps. The map and the Fests themselves come
       from the events endpoint, so the prose names what the page does
       with them rather than listing them. */
    '## Hero',
    mapHero.eyebrow.join(' · '),
    headingText(mapHero.heading),
    `A map of the world with a square for every place a Fest is happening, and a search box (${mapHero.search.label}) that lists matching cities, countries and Fests as you type and submits to the Fests directory (/fests/?q=).`,
    `${mapHero.online.prompt} ${mapHero.online.cta} (${mapHero.online.href})`,
    headingText(mapHero.tagline),
    `${hero.poweredByLabel} MLH x DEV. ${hero.presentingLabel}: DigitalOcean.`,
    `## ${headingText(homeAbout.heading)}`,
    homeAbout.paragraphs.map(answerText),
    `## ${inPerson.nearby.eyebrow}`,
    headingText(inPerson.nearby.heading),
    inPerson.nearby.intro,
    `## ${homeOnline.eyebrow}`,
    headingText(homeOnline.heading),
    homeOnline.intro,
    homeOnline.cards.map(
      (card) => `${card.title}: ${card.copy} (CTA: ${card.cta})`,
    ),
    `CTA: ${homeOnline.cta.label} (${homeOnline.cta.href})`,
    `## ${homeSteps.eyebrow}`,
    headingText(homeSteps.heading),
    homeSteps.phases.map(
      (phase) =>
        `${phase.label}: ${phase.steps
          .map((step) => `${step.title}. ${step.copy}`)
          .join(' ')}`,
    ),
    /* No sign-in path here: the llms files carry no /login or /my,
       which test/my-pages.test.mjs holds them to. */
    `CTA: ${homeSteps.cta.label} (signs in with MyMLH)`,
    `## ${faq.eyebrow}`,
    headingText(faq.heading),
    faq.intro,
    faq.items.map((item) => {
      // Links are named in the prose but their URLs only exist in the markup,
      // so append them — a plain-text reader has no other way to follow one.
      // Site-relative ones stay relative, same as the links in llms.txt
      // above. A link into the signed-in pages is left out: the prose already
      // names My Hacktoberfest, and the llms files carry no /my or /login,
      // which test/my-pages.test.mjs holds them to.
      const links = answerLinks(item.answer).filter(
        (href) => !SIGNED_IN_HREF.test(href),
      );
      const suffix = links.length ? ` (${links.join(' ')})` : '';
      return `${item.question} — ${answerText(item.answer)}${suffix}`;
    }),
    /* The /mission/ page: the story so far, then the mission. */
    '## Mission',
    `${missionPage.eyebrow}. ${headingText(missionPage.heading)}`,
    missionPage.intro,
    `${timeline.eyebrow}. ${headingText(timeline.heading)}`,
    timeline.intro,
    timeline.eras.map((era) => `${era.year} — ${era.title} ${era.copy}`),
    `${mission.eyebrow}. ${headingText(mission.heading)}`,
    mission.paragraphs.map(answerText),
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
    /* The two world landing pages, each gated on its route the way the
       Fests section is: a closed page's copy is not on the site. */
    ...worldSection('/online/', 'Attend online', online),
    ...worldSection('/in-person/', 'Attend in person', inPerson),
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
    ...(routeIsClosed('/activities/')
      ? []
      : [
          '## Activities',
          `${activitiesPage.eyebrow}. ${headingText(activitiesPage.heading)}`,
          activitiesPage.intro,
          `${activitiesPage.how.eyebrow}. ${headingText(activitiesPage.how.heading)}`,
          activitiesPage.how.steps.map(
            (step) => `${step.tag} — ${step.title}: ${step.copy}`,
          ),
        ]),
  );

const write = (name, body) =>
  writeFile(new URL(`../../public/${name}`, import.meta.url), `${body}\n`);

const llms = async () => {
  await write('llms.txt', llmsIndex());
  await write('llms-full.txt', llmsFull());
};

export default llms;
