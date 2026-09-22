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
  assert.ok(fests.formatBadges.mlhMemberEvent.length > 0);
  assert.ok(fests.formatBlurbs.hackDay.length > 0);
  assert.ok(fests.formatBlurbs.meetUp.length > 0);
  assert.ok(fests.formatBlurbs.mlhMemberEvent.length > 0);
  assert.ok(fests.formatFilter.mlhMemberEvent.length > 0);
  assert.ok(fests.memberEventNotice.title.length > 0);
  assert.ok(fests.memberEventNotice.body.length > 0);
  assert.equal(fests.memberEventNotice.points.length, 3);
  fests.memberEventNotice.points.forEach((point) => {
    assert.ok(point.lead.length > 0);
    assert.ok(point.rest.length > 0);
  });
  assert.ok(fests.memberEventNotice.link.lead.length > 0);
  assert.ok(fests.memberEventNotice.link.label.length > 0);
  assert.ok(fests.memberEventAdmission.label.length > 0);
  assert.ok(fests.memberEventAdmission.body.length > 0);
  assert.ok(fests.formatBadges.popup.length > 0);
  assert.ok(fests.formatBlurbs.popup.length > 0);
  assert.ok(fests.formatFilter.popup.length > 0);
  assert.ok(fests.popupNotice.title.length > 0);
  assert.ok(fests.popupNotice.body.length > 0);
  assert.equal(fests.popupNotice.points.length, 3);
  fests.popupNotice.points.forEach((point) => {
    assert.ok(point.lead.length > 0);
    assert.ok(point.rest.length > 0);
  });
  assert.ok(fests.visitCta.length > 0);
  assert.equal(fests.dayCount(3), '3 days');
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

/* The one promise the notice and the blurb must keep straight: no
   Hacktoberfest prizes at a Member Event, and the intro no longer claims
   every listing is a one-day Fest. */
test('Member Event copy leads with the swag and keeps the prize fact', () => {
  assert.match(fests.memberEventNotice.title, /swag/i);
  assert.match(
    fests.memberEventNotice.points.map((p) => `${p.lead} ${p.rest}`).join(' '),
    /application or approval/i,
  );
  assert.match(fests.formatBlurbs.mlhMemberEvent, /no Hacktoberfest prize/i);
  assert.match(
    fests.memberEventNotice.points.map((p) => `${p.lead} ${p.rest}`).join(' '),
    /prize/i,
  );
});

/* A Pop-Up is a partner's event. The copy must say so, must send people
   to the event for registration, and must not promise or rule out
   Hacktoberfest prize categories: that is the host's call, and the blurb
   says they are not guaranteed. */
test('Pop-Up copy says partner, sends people to the event to register, and leaves prizes to the host', () => {
  const points = fests.popupNotice.points
    .map((p) => `${p.lead} ${p.rest}`)
    .join(' ');
  assert.match(points, /ticket|pass|register/i);
  assert.match(fests.popupNotice.body, /partnered/);
  assert.match(fests.formatBlurbs.popup, /partnered/);
  assert.match(fests.formatBlurbs.popup, /prize categories aren’t guaranteed/);
  assert.doesNotMatch(fests.formatBlurbs.popup, /no Hacktoberfest prize/i);
  /* Swag is the one thing every Pop-Up has. A Hacktoberfest table, and
     Hacktoberfest people standing behind it, are not: some events hand the
     swag out themselves. Neither the blurb nor the notice may tell someone
     to go and look for a table that may not exist. */
  assert.match(fests.formatBlurbs.popup, /swag/i);
  assert.match(fests.popupNotice.body, /swag/i);
  assert.doesNotMatch(fests.formatBlurbs.popup, /table/i);
  assert.doesNotMatch(fests.popupNotice.body, /table/i);
  assert.equal(fests.formatBadges.popup, 'Pop-Up');
  assert.equal(fests.formatFilter.popup, 'Pop-Ups');
});
