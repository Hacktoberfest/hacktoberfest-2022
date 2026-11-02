import assert from 'node:assert/strict';
import test from 'node:test';

import { ACTIVITIES, REQUIRED_STICKERS } from '../src/data/eligibility.mjs';
import { LINKED_STICKERS, stickerHasLink } from '../src/data/stickerLinks.mjs';
import { REWARD_STICKERS } from '../src/lib/stickerImage.mjs';

/* After Hacktoberfest only the post-event survey keeps a button in the
   sticker book (src/data/stickerLinks.mjs); every other sticker shows its
   status and nothing to press. */
test('only the post-event survey keeps a way to earn it', () => {
  assert.deepEqual([...LINKED_STICKERS], ['survey-post']);
  [...ACTIVITIES, ...REQUIRED_STICKERS, ...REWARD_STICKERS]
    .filter((sticker) => sticker.id !== 'survey-post')
    .forEach((sticker) =>
      assert.equal(stickerHasLink(sticker), false, `${sticker.id} links`),
    );
});

test('the post-event survey still has its button to show', () => {
  const survey = ACTIVITIES.find((activity) => activity.id === 'survey-post');
  assert.ok(stickerHasLink(survey));
  assert.equal(survey.action, 'survey-post');
  assert.ok(survey.ctaLabel);
});
