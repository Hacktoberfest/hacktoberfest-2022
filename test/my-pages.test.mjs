import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

import { authError, my } from '../src/data/content.mjs';

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');

const readPublic = (path) =>
  readFile(new URL(`../public/${path}`, import.meta.url), 'utf8');

/* The stylesheets one exported page actually links, concatenated. Filenames
   are content-hashed, so they have to come out of the page's own markup.

   This used to read every emitted sheet and, separately, assert the page
   linked *a* sheet — two true statements that together prove much less than
   they look. The rules and the link are only the same file by luck: this
   build emits one sheet for /my and another for /auth/callback/, so a page
   could link the wrong one, or a rule could land only in the other page's
   sheet, and both halves would still pass. Reading only what the page links
   is what makes these guards say what their names say. */
const readLinkedCss = async (html, label) => {
  const hrefs = [
    ...html.matchAll(/href="\/?(_next\/static\/css\/[^"]+\.css)"/g),
  ].map((match) => match[1]);

  assert.ok(hrefs.length > 0, `${label} does not link a stylesheet`);

  const sheets = await Promise.all(hrefs.map((href) => readOutput(href)));
  return sheets.join('\n');
};

test('both signed-in pages are exported and marked noindex', async () => {
  const pages = await Promise.all([
    readOutput('my/index.html'),
    readOutput('login/index.html'),
  ]);

  pages.forEach((html) =>
    assert.match(html, /<meta name="robots" content="noindex"/),
  );
});

/* /progress was deleted without a redirect stub — a deliberate spec
   decision. If its output ever reappears, someone has resurrected the page
   by accident. */
test('the old /progress page is no longer emitted', async () => {
  await assert.rejects(
    () => access(new URL('../out/progress/index.html', import.meta.url)),
    { code: 'ENOENT' },
  );
});

/* The reason this feature uses CSS Modules at all: the client bundle ships
   `[void 0]` in place of every styled-component's CSS, so anything rendered
   only on the client is unstyled. /my renders everything after a
   client-side fetch. No other test would catch a regression back into that
   state — a silently unstyled page still passes every markup assertion. */
test('the /my stylesheet is emitted and linked from the page', async () => {
  const html = await readOutput('my/index.html');
  const css = await readLinkedCss(html, '/my');

  // The band card treatments: ink border plus the accent-deep shadows.
  assert.match(css, /#671912/, 'maroon shadow missing');
  assert.match(css, /#1f4e6b/, 'skyDeep shadow missing');
});

/* The export renders /my in its loading state, which makes the loading
   surface the one piece of this page's UI the build can assert directly.
   Two things have to hold: the four-box animation is present (all four
   brand colours, plus the keyframes that move them, in the linked CSS),
   and nothing else from the hub is — the loading state's contract is that
   no partial content renders, so the welcome hero's fallback greeting must
   not appear alongside it. */
test('the exported /my page is the whole-page loading surface', async () => {
  const html = await readOutput('my/index.html');
  const css = await readLinkedCss(html, '/my');

  assert.match(html, new RegExp(my.loading.replace('…', '')));

  const boxes = ['Orange', 'Sky', 'Ochre', 'Pink'];
  boxes.forEach((box) =>
    assert.match(
      html,
      new RegExp(`Loader_box${box}__`),
      `the ${box.toLowerCase()} loading box is missing from the export`,
    ),
  );

  // colors.orange, colors.sky, colors.ochre, colors.pink
  ['#e53927', '#8bb2de', '#f5b726', '#e97b77'].forEach((color) =>
    assert.match(css, new RegExp(color), `loading box colour ${color} missing`),
  );
  assert.match(css, /@keyframes/, 'the loading animation keyframes missing');

  assert.doesNotMatch(
    html,
    /Hi there,/,
    'the welcome band should not render in the loading state',
  );
});

/* The transit screen shares the loader: /auth/callback/ exports in its
   working state, so the same four boxes must be in its markup and its own
   linked stylesheet — the callback links a different sheet than /my, so
   /my's test proving the rules exist there proves nothing here. */
test('the exported /auth/callback page shows the shared loader', async () => {
  const html = await readOutput('auth/callback/index.html');
  const css = await readLinkedCss(html, '/auth/callback/');

  ['Orange', 'Sky', 'Ochre', 'Pink'].forEach((box) =>
    assert.match(
      html,
      new RegExp(`Loader_box${box}__`),
      `the ${box.toLowerCase()} loading box is missing from the export`,
    ),
  );

  ['#e53927', '#8bb2de', '#f5b726', '#e97b77'].forEach((color) =>
    assert.match(css, new RegExp(color), `loading box colour ${color} missing`),
  );
  assert.match(css, /@keyframes/, 'the loading animation keyframes missing');
});

/* The callback page has no unit test -- there is no component-test harness in
   this repo -- so the build is what stands in for one. The path matters
   exactly: the backend redirects to {FRONTEND_URL}/auth/callback, and with
   trailingSlash the export has to land at auth/callback/index.html or every
   sign-in ends on the 404 page. And it is a transit screen holding a
   one-time code, so it must never be indexed. */
test('the callback page is exported at /auth/callback/ and marked noindex', async () => {
  const html = await readOutput('auth/callback/index.html');

  assert.match(html, /<meta name="robots" content="noindex"/);
});

/* The API's failure redirect target. A state mismatch, a denied consent
   and a rejected code all 302 to {FRONTEND_URL}/auth/error (the API's
   oauth.routes.ts and oauthState.ts), so the path has to exist in the
   export or every failed sign-in dies on the 404 page. It renders
   MessagePage in its only state, so the copy, the /login/ CTA and the
   styled ground can all be asserted straight off the export. */
test('the /auth/error page is exported with its copy and a way back in', async () => {
  const html = await readOutput('auth/error/index.html');

  assert.match(html, /<meta name="robots" content="noindex"/);
  assert.ok(html.includes(authError.body), 'the failure copy is missing');
  assert.match(
    html,
    /<a[^>]*href="\/login\/"/,
    'the CTA back into sign-in is missing',
  );

  const css = await readLinkedCss(html, '/auth/error/');
  assert.match(
    css,
    /\.MessagePage_root__[A-Za-z0-9_]+\{[^}]*#3d5f58/,
    "MessagePage's forest ground rule is missing from the CSS the page links",
  );
});

/* The OAuth hop page. MyMLH's registered redirect URI is
   hacktoberfest.com/oauth/mlh/callback, and no platform rule forwards
   /oauth/* to the API — the page IS the forward. The path matters exactly,
   same as /auth/callback/ above: with trailingSlash the export has to land
   at oauth/mlh/callback/index.html, or every production sign-in dies on
   the 404 page with the one-time code still in the URL. It carries that
   code, so it must never be indexed, and it shows the shared loader so
   the hop reads as one continuous sign-in. */
test('the OAuth hop page is exported at /oauth/mlh/callback/ and marked noindex', async () => {
  const html = await readOutput('oauth/mlh/callback/index.html');

  assert.match(html, /<meta name="robots" content="noindex"/);
  ['Orange', 'Sky', 'Ochre', 'Pink'].forEach((box) =>
    assert.match(
      html,
      new RegExp(`Loader_box${box}__`),
      `the ${box.toLowerCase()} loading box is missing from the export`,
    ),
  );
});

/* Same trap, caught the hard way — twice. MessagePage's CTA only renders in
   the *failed* state of /auth/callback/, which never happens during the
   static export — so while it was a styled-component its CSS was extracted
   into pages that rendered it (404, login, subscribed) and existed nowhere
   at all on this one. The error screen's only control was bare underlined
   text with no focus-visible ring.

   Then the whole component followed: when the callback's working state
   became the shared Loader, MessagePage stopped rendering during this
   page's export entirely, and every failure state — the only screens a
   participant can end up stuck on — lost ALL its styles, not just the
   CTA's. MessagePage is all CSS Module now precisely so its styling does
   not depend on whether it rendered at export time; this guard pins both
   the CTA and the root ground rule, and fails if either goes back. */
test('the /auth/callback failure surface is styled from an emitted stylesheet', async () => {
  const html = await readOutput('auth/callback/index.html');
  const css = await readLinkedCss(html, '/auth/callback/');

  assert.match(
    css,
    /\.MessagePage_cta__[^{]*\{[^}]*padding:12px 22px/,
    "the CTA's padding rule is missing from the emitted CSS",
  );

  // colors.forest — the failure screens' full-bleed ground.
  assert.match(
    css,
    /\.MessagePage_root__[^{]*\{[^}]*#3d5f58/,
    "MessagePage's root ground rule is missing from the emitted CSS",
  );
});

/* styled-components in this feature would be invisible in production, for
   the reason above. This guard stops someone reintroducing one. */
test('the /my feature contains no styled-components', async () => {
  const dirs = [
    'Loader',
    'PageHero',
    'WelcomeBand',
    'CountdownBand',
    'ApplicationsBand',
    'HostResourcesBand',
    'WhyHostBand',
    'ThankYouBand',
    'MyStatus',
  ];
  const offenders = [];

  for (const dir of dirs) {
    const base = new URL(`../src/components/${dir}/`, import.meta.url);
    const files = await readdir(base);
    for (const name of files.filter((file) => file.endsWith('.js'))) {
      const source = await readFile(new URL(name, base), 'utf8');
      if (/from 'styled-components'/.test(source)) {
        offenders.push(`${dir}/${name}`);
      }
    }
  }

  assert.deepEqual(offenders, []);
});

/* devConnectHref graduated the same way the address CTA did: DEV's own
   account settings page is where a participant connects (and later
   manages) the MyMLH link. Pinned so it cannot silently regress to a
   placeholder. Both button states use it — connect and manage land on
   the same page. */
test('devConnectHref points at DEV account settings', () => {
  assert.equal(
    my.identity.devConnectHref,
    'https://dev.to/settings/account',
    'devConnectHref should point at DEV account settings',
  );
});

/* Narrow on purpose, and worth stating what it does and does not prove.

   It proves the outage surface's rules reach an emitted stylesheet that the
   /my page actually links. That is the failure mode that already bit
   /auth/callback/'s CTA: this build extracts styled-components CSS at export
   time, /my is exported in its loading state, so a styled-components version
   of this surface would reach production with no styles at all.

   The outage surface IS MessagePage now — MyMlhDown renders it rather than
   duplicating its layout in MyStatus.module.css — so the rules to pin are
   MessagePage's, and they only reach /my's stylesheet through MyStatus's
   import. That makes this guard double as the one wiring check the WIRING
   list below cannot express: if MyMlhDown stops rendering MessagePage,
   these rules leave /my's linked CSS and this fails.

   It proves nothing about the page rendering the surface. Next emits every
   rule in an imported .module.css whether or not any class is referenced,
   so deleting <MyMlhDown /> from the page leaves this test — and the
   emitted filename — untouched. An earlier version of this test asserted
   the outage *copy* reached a client chunk and was withdrawn for the same
   reason: `my` is one object literal that every other /my component already
   imports. The decision itself is covered by
   test/progress-page-state.test.mjs. */
test('the MLH outage surface ships with its styles', async () => {
  const html = await readOutput('my/index.html');
  const css = await readLinkedCss(html, '/my');

  /* The same two rules the /auth/callback/ guard pins, because they are the
     same component: the full-bleed forest ground, and the inner column that
     caps the copy at Shell's widths instead of the viewport's. */
  assert.match(
    css,
    /\.MessagePage_root__[A-Za-z0-9_]+\{[^}]*#3d5f58/,
    'the outage surface has no forest background in the CSS /my links',
  );
  assert.match(
    css,
    /\.MessagePage_inner__[A-Za-z0-9_]+\{[^}]*1280px/,
    'the outage surface has no width-capped inner column in the CSS /my links',
  );
});

/* Same failure mode as the outage surface above: the export renders /my in
   its loading state, so the countdown never renders at export time and a
   styled-components version of it would ship with no styles at all. The
   digit rule is the one to pin — it is what makes the band the big, bold
   thing it is for. Proves the styles ship, not that the band renders; the
   render gate is source-guarded in WIRING below. */
test('the Preptember countdown ships with its styles', async () => {
  const html = await readOutput('my/index.html');
  const css = await readLinkedCss(html, '/my');

  assert.match(
    css,
    /\.CountdownBand_value__[A-Za-z0-9_]+\{[^}]*font-size:clamp\(/,
    "the countdown's display-size digit rule is missing from the CSS /my links",
  );
});

/* Same reasoning as the countdown guard above: the band renders only
   after the client-side fetch, so nothing else would notice its styles
   going missing from the emitted CSS. The card and ghost rules are the
   two the band cannot read without. */
test('the applications band ships with its styles', async () => {
  const html = await readOutput('my/index.html');
  const css = await readLinkedCss(html, '/my');

  assert.match(
    css,
    /\.ApplicationsBand_card__[A-Za-z0-9_]+\{[^}]*#671912/,
    "the application card's maroon shadow rule is missing from the CSS /my links",
  );
  assert.match(
    css,
    /\.ApplicationsBand_ghostCard__[A-Za-z0-9_]+\{[^}]*dashed/,
    "the applications ghost card's dashed rule is missing from the CSS /my links",
  );

  /* The locked-resource badge: without its dashed treatment a gated row
     reads as a broken link rather than "not yet". */
  assert.match(
    css,
    /\.HostResourcesBand_lockedBadge__[A-Za-z0-9_]+\{[^}]*dashed/,
    "the host resources locked badge's dashed rule is missing from the CSS /my links",
  );

  /* The why-host callout's two load-bearing rules: the full-bleed sky
     ground, and the white box with the skyDeep shadow that marks it as
     the same kind of thing as /fests' "That's your cue." band. */
  assert.match(
    css,
    /\.WhyHostBand_root__[A-Za-z0-9_]+\{[^}]*#8bb2de/,
    "the why-host band's sky ground rule is missing from the CSS /my links",
  );
  assert.match(
    css,
    /\.WhyHostBand_box__[A-Za-z0-9_]+\{[^}]*#1f4e6b/,
    "the why-host box's skyDeep shadow rule is missing from the CSS /my links",
  );
});

/* Same reasoning again: the thank-you band renders only after the
   client-side fetch, and only for users with a sent application, so
   nothing else would notice its styles missing from the emitted CSS.
   The sky ground, the skyDeep face shadow (on the faces so it flips
   with the card), and the negative pull that breaks the band's top
   edge are the rules the band cannot read without. */
test('the thank-you postcard band ships with its styles', async () => {
  const html = await readOutput('my/index.html');
  const css = await readLinkedCss(html, '/my');

  assert.match(
    css,
    /\.ThankYouBand_root__[A-Za-z0-9_]+\{[^}]*#8bb2de/,
    "the thank-you band's sky ground rule is missing from the CSS /my links",
  );
  assert.match(
    css,
    /\.ThankYouBand_face__[A-Za-z0-9_]+\{[^}]*#1f4e6b/,
    "the postcard face's skyDeep shadow rule is missing from the CSS /my links",
  );
  assert.match(
    css,
    /\.ThankYouBand_card__[A-Za-z0-9_]+\{[^}]*margin-top:calc\(/,
    "the postcard's top-edge overlap pull is missing from the CSS /my links",
  );
});

/* A crude stand-in for a component harness, and worth naming as one.

   No test in this repo imports `src/pages/my.js` or
   `src/pages/auth/callback.js`. They are JSX pages whose logic lives in
   effects, node:test cannot render them, and every decision that could be
   lifted out of them already has been — into `lib/pageState.mjs`, which is
   properly unit tested. What is left in the pages is the wiring: the calls,
   the early return, the props, the attributes that connect those tested
   decisions to what a participant actually sees.

   That wiring was invisible to the suite. Deleting the `state === 'mlhDown'`
   early return, or replacing `setState(next)` with `setState('error')`, or
   dropping `requireRefreshToken`, or removing either `role="status"`, left
   the whole suite green while switching off a fix that shipped deliberately.

   Matching source text proves only that a string is present — not that it is
   reached, not that it works. What it buys is the difference between
   "silently deletable" and "deliberately deletable": whoever removes one of
   these has to remove its guard too, and the message tells them what they
   are turning off. Nothing more than that. It should be replaced the day a
   component harness lands.

   The list follows the code rather than the other way round: when a decision
   moves into a lib module with real tests, its token here moves with it (as
   `isMissingEmailOnly` did — `callbackStateForSession` is the wiring that
   stands in its place). */
const WIRING = [
  {
    file: 'src/pages/my.js',
    token: 'pageStateForError(error)',
    why: '/my must ask lib/pageState.mjs which state a failure lands on; without it the 401 sign-out and the 502 outage branches are unreachable from the page.',
  },
  {
    file: 'src/pages/my.js',
    token: 'setState(next)',
    why: "the page must set the state the decision returned. Hardcoding one (setState('error')) silently discards mlhDown, and the outage surface never renders.",
  },
  {
    file: 'src/pages/my.js',
    token: "state === 'mlhDown'",
    why: 'the early return is the whole point of the outage state: without it the hub renders around the warning, half-populated, which reads as "my data is wrong" rather than "MLH is down".',
  },
  {
    file: 'src/pages/my.js',
    token: '<MyMlhDown />',
    why: 'the outage surface itself. Its CSS ships either way (Next emits every rule in an imported CSS Module), so no style guard can notice this going missing.',
  },
  /* The Preptember tokens are one feature: the flag swaps the whole
     October hub (progress, activities, fests) for the September one
     (countdown, applications). Each gate is guarded separately because
     each can break separately — dropping one brings an October band back
     mid-Preptember, dropping a September band leaves the flag only
     removing content. */
  {
    file: 'src/pages/my.js',
    token: '{PREPTEMBER && <CountdownBand />}',
    why: 'the countdown is what Preptember mode shows in place of the hidden bands; without it the flag only removes content.',
  },
  {
    file: 'src/pages/my.js',
    token: '{PREPTEMBER && <ApplicationsBand experience={experience} />}',
    why: "Preptember's second band: the user's own applications, and — via its ghost — the page's one apply CTA. Without it September's hub is a countdown over nothing.",
  },
  {
    file: 'src/pages/my.js',
    token: '<HostResourcesBand approved={isHost(experience.fests)} />',
    why: '`approved` must come from isHost, not isOrganizing (or true) — passing either unlocks funding and swag for draft applications, promising what MLH has not granted.',
  },
  {
    file: 'src/pages/my.js',
    token: 'hasApplied(experience.fests) ?',
    why: "Preptember's closing band forks on the application gate: the why-host pitch (WhyHostBand) for people who haven't applied, the thank-you postcard (ThankYouBand) once an application is actually sent. Hardcoding either side pitches hosts on what they already did — or thanks people who never applied.",
  },
  {
    file: 'src/pages/my.js',
    token: '<ThankYouBand user={experience.user} />',
    why: 'the thank-you side of the fork. The gate token above cannot see which branch each band sits on (prettier wraps the ternary across lines), so this pins the postcard\'s presence — deleting it, or swapping the branches and "simplifying" one away, has to come through here. `user` because the card\'s back greets the host by name.',
  },
  {
    file: 'src/components/WelcomeBand/index.js',
    token: 'accent={my.welcome.accent}',
    why: 'the hero greets "your Hacktoberfest" on both sides of the Preptember flag — the month-naming preptemberAccent swap retired 2026-08-18, and its return would rename the hub for one side of the flag.',
  },
  {
    file: 'src/pages/my.js',
    token: 'endSession()',
    why: 'the sign-out control must revoke the refresh token server-side, not just clear localStorage. Reverting to clearSession() leaves a thirty-day credential live after someone signs out on a shared machine, and nothing on screen differs.',
  },
  {
    file: 'src/pages/my.js',
    token: 'signOutDestination()',
    why: "sign-out must end the MyMLH session, not just ours. Reverting to /login/ restarts OAuth on mount, MLH's cookie completes it silently, and the participant lands back on /my still signed in — the button visibly does nothing.",
  },
  {
    file: 'src/pages/my.js',
    token: 'event.persisted',
    why: "the bfcache guard from FIX 2. Without it, Back from mlh.com/signin repaints the previous participant's name, email and applications from restored React state on a shared machine.",
  },
  {
    file: 'src/pages/oauth/mlh/callback.js',
    token: 'oauthCallbackForwardDestination(globalThis.location.search)',
    why: 'the hop must hand the untouched query string to the destination lib/session.mjs builds; without it the code and state never reach the API and every production sign-in dies at this page.',
  },
  {
    file: 'src/pages/oauth/mlh/callback.js',
    token: 'globalThis.location.replace(',
    why: 'replace, not assign: the hop carries a one-time code and must stay out of history, or Back re-submits a spent code to the API for a guaranteed failure screen.',
  },
  {
    file: 'src/pages/auth/callback.js',
    token: 'requireRefreshToken: true',
    why: 'a session stored without a refresh token works until the access token expires and then signs the participant out with nothing to explain it.',
  },
  {
    file: 'src/pages/auth/callback.js',
    token: 'callbackStateForSession(session)',
    why: 'without it every unstorable 200 collapses onto "that sign-in link has expired", whose CTA restarts a sign-in that returns the same response — an unbounded loop, and a false statement.',
  },
  {
    file: 'src/pages/auth/callback.js',
    token: 'authCallback.working',
    why: 'the fallback for an unrecognised state. Without it `copy` is undefined and the render throws on copy.heading.lead: a white screen on the one page a participant cannot skip.',
  },
  {
    file: 'src/pages/auth/callback.js',
    token: 'CTA_HREFS',
    why: "the noEmail CTA has to point at MyMLH; the default '/login/' sends that participant back through MyMLH to arrive here again with the same profile.",
  },
  {
    file: 'src/components/MyStatus/index.js',
    token: 'role="status"',
    count: 2,
    why: "MyLoading's aria-live paragraph is unmounted the moment the error or outage surface renders, so without role=status on both (MyError's own div, and the prop MyMlhDown passes through MessagePage) a screen-reader user hears nothing at all about what replaced it.",
  },
  /* The outage surface's inner column used to be guarded here as
     `.mlhDownInner` in MyStatus.module.css. That column is MessagePage's
     `.inner` now, and whether its rules reach /my at all is asserted from
     the emitted CSS by "the MLH outage surface ships with its styles"
     above — a stronger check than source text, so no entry stands in for
     it here. */
];

test('the wiring on both /my pages is still there', async () => {
  const sources = new Map();
  const missing = [];

  for (const { file, token, count = 1, why } of WIRING) {
    if (!sources.has(file)) {
      sources.set(
        file,
        await readFile(new URL(`../${file}`, import.meta.url), 'utf8'),
      );
    }

    const found = sources.get(file).split(token).length - 1;
    if (found < count) {
      missing.push(
        `${file} no longer contains ${count > 1 ? `${count}x ` : ''}\`${token}\` (found ${found}): ${why}`,
      );
    }
  }

  assert.deepEqual(
    missing,
    [],
    `page wiring has gone missing:\n\n- ${missing.join('\n\n- ')}\n`,
  );
});

test('the signed-in pages stay out of the sitemap and the llms files', async () => {
  const [sitemap, llmsFull, llms] = await Promise.all([
    readPublic('sitemap.xml'),
    readPublic('llms-full.txt'),
    readPublic('llms.txt'),
  ]);

  [sitemap, llmsFull, llms].forEach((file) => {
    assert.doesNotMatch(file, /\/my\b/);
    assert.doesNotMatch(file, /\/login/);
    // The OAuth hop is transit, not content — and it handles one-time codes.
    assert.doesNotMatch(file, /\/oauth/);
  });
});
