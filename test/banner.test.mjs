import assert from 'node:assert/strict';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

import { banner } from '../src/data/content.mjs';
import {
  BANNER_DISMISSED_ATTRIBUTE,
  BANNER_DISMISSED_VALUE,
  BANNER_STORAGE_KEY,
  bannerDismissed,
  bannerPrePaintScript,
  dismissBanner,
} from '../src/lib/banner.mjs';

/* Swaps a fake localStorage in for one test and puts the real (absent)
   one back afterwards. globalThis.localStorage does not exist under Node,
   so this is a plain define-and-delete rather than a save-and-restore. */
const withStorage = (storage, run) => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true,
  });
  try {
    run();
  } finally {
    delete globalThis.localStorage;
  }
};

const fakeStorage = (initial = {}) => {
  const values = { ...initial };
  return {
    values,
    getItem: (key) => (key in values ? values[key] : null),
    setItem: (key, value) => {
      values[key] = String(value);
    },
  };
};

test('the banner carries its message and a labelled close', () => {
  assert.match(banner.message, /Preptember/);
  assert.ok(banner.close.length > 0);
});

test('bannerDismissed is false until the flag is written', () => {
  withStorage(fakeStorage(), () => {
    assert.equal(bannerDismissed(), false);
    dismissBanner();
    assert.equal(bannerDismissed(), true);
  });
});

test('dismissBanner writes the value the pre-paint script looks for', () => {
  const storage = fakeStorage();
  withStorage(storage, () => {
    dismissBanner();
  });
  assert.equal(storage.values[BANNER_STORAGE_KEY], BANNER_DISMISSED_VALUE);
});

/* Safari in private mode throws on storage access rather than refusing
   politely. A banner that cannot remember being closed is a nuisance; one
   that throws on every page load takes the page with it. */
test('a storage that throws leaves the banner showing, not broken', () => {
  const throwing = {
    getItem: () => {
      throw new Error('nope');
    },
    setItem: () => {
      throw new Error('nope');
    },
  };

  withStorage(throwing, () => {
    assert.equal(bannerDismissed(), false);
    assert.doesNotThrow(() => dismissBanner());
  });
});

/* The inline script in _document is a string, so nothing type-checks it
   and no bundler ever parses it. Run it. */
const runPrePaint = (localStorage) => {
  const attributes = {};
  const context = {
    window: { localStorage },
    document: {
      documentElement: {
        setAttribute: (name, value) => {
          attributes[name] = value;
        },
      },
    },
  };
  runInNewContext(bannerPrePaintScript, context);
  return attributes;
};

test('the pre-paint script marks html only once the flag is set', () => {
  assert.deepEqual(runPrePaint(fakeStorage()), {});
  assert.deepEqual(
    runPrePaint(fakeStorage({ [BANNER_STORAGE_KEY]: BANNER_DISMISSED_VALUE })),
    { [BANNER_DISMISSED_ATTRIBUTE]: 'true' },
  );
});

test('the pre-paint script survives a storage that throws', () => {
  assert.doesNotThrow(() =>
    runPrePaint({
      getItem: () => {
        throw new Error('nope');
      },
    }),
  );
});
