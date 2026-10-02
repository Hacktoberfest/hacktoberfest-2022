import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NEXT_PUBLIC_API_BASE_URL = 'mocked';

const { openPreSurvey, preSurveyUrl } = await import('../src/lib/survey.mjs');

const jwt = (claims) =>
  `h.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.s`;

test('the survey link carries the MyMLH id from the token, cohort and source', () => {
  const url = new URL(
    preSurveyUrl({ accessToken: jwt({ sub: 'api-id', mlhId: 'a b&c' }) }),
  );
  assert.equal(
    url.origin + url.pathname,
    'https://mlh.pdx1.qualtrics.com/jfe/form/SV_bjcurJG0ZNS7Lvw',
  );
  assert.equal(url.searchParams.get('mymlh_id'), 'a b&c');
  assert.equal(url.searchParams.get('cohort'), 'hacktoberfest_2026');
  assert.equal(url.searchParams.get('link_source'), 'sticker');
});

test('no readable id still opens the survey, without mymlh_id', () => {
  for (const session of [null, { accessToken: 'opaque' }]) {
    const url = new URL(preSurveyUrl(session));
    assert.equal(url.searchParams.has('mymlh_id'), false);
    assert.equal(url.searchParams.get('cohort'), 'hacktoberfest_2026');
  }
});

test('the button opens the session’s link', () => {
  let opened;
  openPreSurvey({
    session: { accessToken: jwt({ mlhId: 'u1' }) },
    open: (url) => (opened = url),
  });
  assert.match(opened, /mymlh_id=u1&/);
});
