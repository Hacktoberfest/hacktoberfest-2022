import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';
import {
  NAME_TRACKING,
  greetingNameFits,
} from '../src/lib/postcardGreeting.mjs';

/* The gate the postcard back applies before greeting a host by name:
   would the name's ink reach the HF logo mark in the card's top-right?
   The widths are font metrics, so these cases pin behaviour at the
   scale that matters — ordinary names pass, outlandish ones don't —
   rather than exact pixel sums. */

test('ordinary first names fit the greeting line', () => {
  ['ROSA', 'ADA', 'ALEXANDRIA', 'WOLFGANG', 'MARIA-GUADALUPE'].forEach(
    (name) => {
      assert.ok(greetingNameFits(name), `${name} should fit`);
    },
  );
});

test('names long enough to reach the logo mark do not fit', () => {
  assert.ok(!greetingNameFits('A'.repeat(25)));
  /* Width, not length: W is the widest cap, so far fewer of them fit. */
  assert.ok(!greetingNameFits('W'.repeat(16)));
});

test('characters outside the advance table still count their width', () => {
  assert.ok(greetingNameFits('JOSÉ'));
  assert.ok(!greetingNameFits('É'.repeat(25)));
});

test('the fallback name itself fits, tracking included', () => {
  assert.ok(greetingNameFits(my.thankYou.note.fallbackName.toUpperCase()));
  assert.ok(NAME_TRACKING > 0);
});
