import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.test.invalid';

const { submitReimbursement } = await import('../src/lib/reimbursement.mjs');
const { resetRefreshState } = await import('../src/lib/apiClient.mjs');
const { SESSION_STORAGE_KEY } = await import('../src/lib/session.mjs');

/* The modules read process.env at import time, so the base URL must be set
   before this file's first import of them. node:test runs files in isolated
   processes, so setting it here is safe. */

const SESSION = {
  accessToken: 'access-1',
  refreshToken: 'refresh-1',
  user: {
    id: 'u1',
    email: 'ada@example.invalid',
    firstName: 'Ada',
    lastName: 'Lovelace',
  },
};

const installStorage = (initial) => {
  const map = new Map(Object.entries(initial || {}));
  globalThis.localStorage = {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  };
};

const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const setup = () => {
  resetRefreshState();
  installStorage({ [SESSION_STORAGE_KEY]: JSON.stringify(SESSION) });
};

const FORM = {
  firstName: ' Jamie ',
  lastName: 'Rivera ',
  email: ' jamie@sharkhacks.ca',
  readHandbook: true,
  agreedToPolicy: true,
};

const SUBMISSION = {
  submittedAt: '2026-10-25T15:12:00.000Z',
  byYou: true,
  payee: {
    firstName: 'Jamie',
    lastName: 'Rivera',
    email: 'jamie@sharkhacks.ca',
  },
};

test('submitReimbursement POSTs the payee and both agreements as JSON', async () => {
  setup();
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return jsonResponse({ submission: SUBMISSION }, 201);
  };

  await submitReimbursement('evt 1', FORM);

  assert.equal(calls.length, 1);
  assert.equal(
    calls[0].url,
    'https://api.test.invalid/api/me/fests/evt%201/reimbursement',
  );
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer access-1');
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    firstName: 'Jamie',
    lastName: 'Rivera',
    email: 'jamie@sharkhacks.ca',
    readHandbook: true,
    agreedToPolicy: true,
  });
});

test('the agreements are sent as the literal true or not at all true', async () => {
  setup();
  let sent = null;
  globalThis.fetch = async (url, init) => {
    sent = JSON.parse(init.body);
    return jsonResponse({}, 400);
  };

  await assert.rejects(() =>
    submitReimbursement('evt-1', {
      ...FORM,
      readHandbook: 'yes',
      agreedToPolicy: 1,
    }),
  );
  assert.equal(sent.readHandbook, false);
  assert.equal(sent.agreedToPolicy, false);
});

test('a 201 resolves to the submission, read like the dashboard’s', async () => {
  setup();
  globalThis.fetch = async () =>
    jsonResponse(
      {
        submission: {
          ...SUBMISSION,
          payee: { ...SUBMISSION.payee, firstName: ' Jamie ' },
        },
      },
      201,
    );

  assert.deepEqual(await submitReimbursement('evt-1', FORM), SUBMISSION);
});

test('a 201 the page cannot read resolves to null, so the page refetches', async () => {
  setup();
  globalThis.fetch = async () => jsonResponse({ ok: true }, 201);

  assert.equal(await submitReimbursement('evt-1', FORM), null);
});

/* The API's error bodies are flat: the code, and a message beside it. */
const ALREADY_SUBMITTED = {
  error: 'ALREADY_SUBMITTED',
  message: 'This Fest’s reimbursement has already been submitted.',
};

test('a refusal surfaces its status and the API’s reason', async () => {
  setup();
  globalThis.fetch = async () => jsonResponse(ALREADY_SUBMITTED, 409);

  await assert.rejects(
    () => submitReimbursement('evt-1', FORM),
    (error) => {
      assert.equal(error.status, 409);
      assert.deepEqual(error.body, ALREADY_SUBMITTED);
      return true;
    },
  );
});
