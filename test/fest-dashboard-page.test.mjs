import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { my } from '../src/data/content.mjs';

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');

test('the Fest dashboard is exported and marked noindex', async () => {
  const html = await readOutput('my/fest/index.html');

  assert.match(html, /<meta name="robots" content="noindex"/);
});

/* The whole point of the export being the loading surface: a static host
   serves this file to anyone who asks, so anything personal baked into it
   would be readable without a session. The page's own fetch is what puts a
   Fest on screen, and the API is what decides whether the reader may see it. */
test('the exported page carries no Fest data of its own', async () => {
  const html = await readOutput('my/fest/index.html');

  assert.ok(
    !html.includes(my.dashboard.registrations.label),
    'the exported HTML should not contain the dashboard cards',
  );
  assert.ok(
    !html.includes(my.dashboard.pack.notShipped),
    'the exported HTML should not contain the event pack copy',
  );
  assert.ok(
    !html.includes(my.dashboard.checkInCode.intro),
    'the exported HTML should not contain the check-in code card',
  );
  assert.ok(
    !html.includes(my.dashboard.photos.intro),
    'the exported HTML should not contain the Photo gallery card',
  );
  for (const deck of Object.values(my.dashboard.usefulInfo.decks)) {
    assert.ok(
      !html.includes(deck.url),
      'the exported HTML should not contain the Useful info card',
    );
  }
  assert.ok(
    !html.includes(my.dashboard.usefulInfo.slides.cta),
    'the exported HTML should not contain the Useful info card',
  );
  assert.ok(
    !html.includes(my.dashboard.usefulInfo.title),
    'the exported HTML should not contain the Useful info card',
  );
  assert.ok(
    !html.includes(my.dashboard.usefulInfo.prizesLabel),
    'the exported HTML should not contain the Useful info card',
  );
  /* The ended page: the claim, its sent state, and the Meet Up's thanks
     are all a host's own, and render only from the fetch. */
  for (const text of [
    my.dashboard.reimbursement.title,
    my.dashboard.reimbursement.intro,
    my.dashboard.reimbursement.claim.limit.label,
    my.dashboard.reimbursement.payee.intro,
    my.dashboard.reimbursement.sent.title,
    my.dashboard.thanks.title,
  ]) {
    assert.ok(
      !html.includes(text),
      `the exported HTML should not contain the ended page: ${text}`,
    );
  }
  /* Digital gift cards: the pack chip's hint, the prize lines' alternative
     and step 2 are a host's own too. */
  for (const text of [
    my.dashboard.pack.box.giftCards.hint,
    my.dashboard.usefulInfo.giftCards.alternative,
    my.dashboard.reimbursement.giftCards.title,
    my.dashboard.reimbursement.giftCards.onceLead,
  ]) {
    assert.ok(
      !html.includes(text),
      `the exported HTML should not contain gift cards: ${text}`,
    );
  }
  assert.ok(
    html.includes(my.loading),
    'the exported HTML should be the loading surface',
  );
});

test('the refusal surfaces ship with the page', async () => {
  /* They render client-side, so their copy has to be in the page's own
     JavaScript rather than its HTML. Nothing else proves a host who is not a
     host of this Fest sees words rather than a blank page. */
  const html = await readOutput('my/fest/index.html');
  const scripts = [
    ...html.matchAll(/src="\/?(_next\/static\/[^"]+\.js)"/g),
  ].map((match) => match[1]);

  assert.ok(scripts.length > 0, 'the page links no scripts');

  const bundles = await Promise.all(scripts.map((src) => readOutput(src)));
  const source = bundles.join('\n');

  assert.ok(
    source.includes(my.dashboard.forbidden.body),
    'the forbidden surface is missing from the page bundle',
  );
  assert.ok(
    source.includes(my.dashboard.notFound.body),
    'the not-found surface is missing from the page bundle',
  );
  /* Both refusals offer a way back. It goes to the hosting hub: anyone
     who reached a Fest dashboard was hosting, and /my/ would only send
     them on again. */
  assert.ok(
    source.includes('/my/hosting/'),
    'the refusal surfaces should link back to the hosting hub',
  );
});

/* Same proof for the ended page: it renders only in the browser, so its
   words have to be in the page's JavaScript or a host whose Fest has
   ended sees nothing where the claim should be. */
test('the ended page ships with the page', async () => {
  const html = await readOutput('my/fest/index.html');
  const scripts = [
    ...html.matchAll(/src="\/?(_next\/static\/[^"]+\.js)"/g),
  ].map((match) => match[1]);
  const source = (
    await Promise.all(scripts.map((src) => readOutput(src)))
  ).join('\n');

  for (const text of [
    my.dashboard.reimbursement.claim.handbook.href,
    my.dashboard.reimbursement.claim.agreeStatement,
    my.dashboard.reimbursement.payee.onceLead,
    my.dashboard.reimbursement.wrapUp.winnersPending.cta,
    my.dashboard.thanks.gallery.hint,
    my.dashboard.reimbursement.giftCards.onceLead,
    my.dashboard.reimbursement.giftCards.errors.rows,
    my.dashboard.pack.box.giftCards.hint,
    my.dashboard.usefulInfo.giftCards.alternative,
  ]) {
    assert.ok(source.includes(text), `missing from the page bundle: ${text}`);
  }
});
