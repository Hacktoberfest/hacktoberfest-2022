import assert from 'node:assert/strict';
import test from 'node:test';

import { fests } from '../src/data/content.mjs';

test('fests page copy has every required field, non-empty', () => {
  assert.ok(fests.title.length > 0);
  assert.ok(fests.description.length > 0);
  assert.ok(fests.eyebrow.length > 0);
  assert.ok(fests.heading.lead.length > 0);
  assert.ok(fests.heading.accent.length > 0);
  assert.ok(fests.intro.length > 0);
  assert.ok(fests.searchPlaceholder.length > 0);
  assert.ok(fests.searchLabel.length > 0);
  assert.ok(fests.locationCta.length > 0);
  assert.ok(fests.locationPending.length > 0);
  assert.ok(fests.locationClearCta.length > 0);
  assert.ok(fests.locationUnavailable.length > 0);
  assert.ok(fests.resultsCountSingular.length > 0);
  assert.ok(fests.resultsCountPlural.length > 0);
  assert.ok(fests.emptyTitle.length > 0);
  assert.ok(fests.emptyBody.length > 0);
  assert.ok(fests.loading.length > 0);
  assert.ok(fests.error.title.length > 0);
  assert.ok(fests.error.body.length > 0);
  assert.ok(fests.error.retryCta.length > 0);
  assert.ok(fests.registerCta.length > 0);
  assert.ok(fests.pastBadge.length > 0);
  assert.ok(fests.hostedBy.length > 0);
  assert.ok(fests.formatBadges.hackDay.length > 0);
  assert.ok(fests.formatBadges.meetUp.length > 0);
  assert.ok(fests.formatBlurbs.hackDay.length > 0);
  assert.ok(fests.formatBlurbs.meetUp.length > 0);
  assert.ok(fests.modal.close.length > 0);
  assert.ok(fests.modal.detailsCta.length > 0);
  assert.ok(fests.distanceUnit.length > 0);
  assert.ok(fests.viewToggle.label.length > 0);
  assert.ok(fests.viewToggle.list.length > 0);
  assert.ok(fests.viewToggle.map.length > 0);
  assert.ok(fests.hostCallout.title.length > 0);
  assert.ok(fests.hostCallout.body.length > 0);
  assert.ok(fests.hostCallout.cta.length > 0);
  assert.ok(fests.hostCallout.photoAlt.length > 0);
});

/* The modal's format copy and /host's format cards describe the same two
   things to different audiences. They are allowed to differ in wording;
   they are not allowed to differ on which format has prizes. This pins the
   one fact most likely to drift, because a Meet Up promising prizes is a
   promise a host never made. */
test('only the Hack Day blurb mentions prizes, as on /host', () => {
  assert.match(fests.formatBlurbs.hackDay, /prize/i);
  assert.doesNotMatch(fests.formatBlurbs.meetUp, /prize/i);
});
