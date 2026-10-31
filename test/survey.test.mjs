import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NEXT_PUBLIC_API_BASE_URL = 'mocked';

const { openPostSurvey, openPreSurvey, postSurveyUrl, preSurveyUrl } =
  await import('../src/lib/survey.mjs');

const jwt = (claims) =>
  `h.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.s`;

const FORMS = [
  [
    'pre',
    preSurveyUrl,
    'https://mlh.pdx1.qualtrics.com/jfe/form/SV_bjcurJG0ZNS7Lvw',
  ],
  [
    'post',
    postSurveyUrl,
    'https://mlh.pdx1.qualtrics.com/jfe/form/SV_9BIhzywjnrY42xw',
  ],
];

for (const [name, surveyUrl, form] of FORMS) {
  test(`the ${name} survey link carries the MyMLH id from the token, cohort and source`, () => {
    const url = new URL(
      surveyUrl({ accessToken: jwt({ sub: 'api-id', mlhId: 'a b&c' }) }),
    );
    assert.equal(url.origin + url.pathname, form);
    assert.equal(url.searchParams.get('mymlh_id'), 'a b&c');
    assert.equal(url.searchParams.get('cohort'), 'hacktoberfest_2026');
    assert.equal(url.searchParams.get('link_source'), 'sticker');
  });

  test(`no readable id still opens the ${name} survey, without mymlh_id`, () => {
    for (const session of [null, { accessToken: 'opaque' }]) {
      const url = new URL(surveyUrl(session));
      assert.equal(url.origin + url.pathname, form);
      assert.equal(url.searchParams.has('mymlh_id'), false);
      assert.equal(url.searchParams.get('cohort'), 'hacktoberfest_2026');
    }
  });
}

test('each button opens its own survey with the session’s link', () => {
  const session = { accessToken: jwt({ mlhId: 'u1' }) };
  let opened;
  const open = (url) => (opened = url);

  openPreSurvey({ session, open });
  assert.match(opened, /\/SV_bjcurJG0ZNS7Lvw\?mymlh_id=u1&/);
  openPostSurvey({ session, open });
  assert.match(opened, /\/SV_9BIhzywjnrY42xw\?mymlh_id=u1&/);
});
