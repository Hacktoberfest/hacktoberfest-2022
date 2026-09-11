import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ATTENDING,
  HOSTING,
  HOSTING_HUB_PATH,
  hubToOpen,
  readLastHub,
  writeLastHub,
} from '../src/lib/myView.mjs';
import { LAST_HUB_STORAGE_KEY } from '../src/lib/session.mjs';

/* A localStorage stand-in installed on globalThis for one test. The real
   one is absent under node; Safari private mode throws on access, which
   withThrowingStorage below reproduces. */
const withMockStorage = (initial, run) => {
  const backing = { ...initial };
  const mock = {
    getItem: (key) =>
      Object.prototype.hasOwnProperty.call(backing, key) ? backing[key] : null,
    setItem: (key, value) => {
      backing[key] = String(value);
    },
    removeItem: (key) => {
      delete backing[key];
    },
  };
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: mock,
  });
  try {
    return run(mock);
  } finally {
    delete globalThis.localStorage;
  }
};

const withThrowingStorage = (run) => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new DOMException('The operation is insecure.', 'SecurityError');
    },
  });
  try {
    return run();
  } finally {
    delete globalThis.localStorage;
  }
};

const ATTENDEE = [
  { id: 'a', role: 'attending', date: '2026-10-10', status: 'registered' },
];
const HOST = [
  {
    id: 'h',
    role: 'organizing',
    date: '2026-10-12',
    applicationStatus: 'approved',
  },
];
const DRAFT = [
  {
    id: 'd',
    role: 'organizing',
    date: '2026-10-12',
    applicationStatus: 'draft',
  },
];

test('the storage key is stable', () => {
  assert.equal(LAST_HUB_STORAGE_KEY, 'hacktoberfest.lastHub');
});

test('readLastHub round-trips what writeLastHub stored', () => {
  withMockStorage({}, () => {
    assert.equal(readLastHub(), null);
    writeLastHub(HOSTING);
    assert.equal(readLastHub(), 'hosting');
    writeLastHub(ATTENDING);
    assert.equal(readLastHub(), 'attending');
  });
});

test('readLastHub treats an unknown stored value as nothing', () => {
  withMockStorage({ [LAST_HUB_STORAGE_KEY]: 'sponsoring' }, () => {
    assert.equal(readLastHub(), null);
  });
});

test('writeLastHub refuses a value that is not a hub', () => {
  withMockStorage({}, (store) => {
    writeLastHub('sponsoring');
    assert.equal(store.getItem(LAST_HUB_STORAGE_KEY), null);
  });
});

test('a hostile storage reads as nothing and swallows writes', () => {
  withThrowingStorage(() => {
    assert.equal(readLastHub(), null);
    assert.doesNotThrow(() => writeLastHub(HOSTING));
  });
});

test('an attendee stays on /my/ whatever the memory says', () => {
  assert.equal(hubToOpen({ fests: ATTENDEE, lastHub: null }), null);
  assert.equal(hubToOpen({ fests: ATTENDEE, lastHub: 'hosting' }), null);
  assert.equal(hubToOpen({ fests: [], lastHub: null }), null);
});

test('a host with no memory is sent to the hosting hub', () => {
  assert.equal(hubToOpen({ fests: HOST, lastHub: null }), HOSTING_HUB_PATH);
  assert.equal(HOSTING_HUB_PATH, '/my/hosting/');
});

test('a host who last chose attending stays on /my/', () => {
  assert.equal(hubToOpen({ fests: HOST, lastHub: 'attending' }), null);
});

test('a host who last visited hosting is sent there again', () => {
  assert.equal(
    hubToOpen({ fests: HOST, lastHub: 'hosting' }),
    HOSTING_HUB_PATH,
  );
});

test('a draft application counts: the hosting hub is where it gets finished', () => {
  assert.equal(hubToOpen({ fests: DRAFT, lastHub: null }), HOSTING_HUB_PATH);
});
