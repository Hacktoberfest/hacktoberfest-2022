import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';

const copy = my.dashboard.photos;

/* The strings a host reads on the Photo gallery card. The intro is also
   pinned by fest-dashboard-page.test.mjs, which proves the card never bakes
   into the static export. */

test('the card is framed around sharing photos', () => {
  assert.equal(copy.title, 'Photo gallery');
  assert.equal(
    copy.intro,
    'Share photos from your Fest with your community and with MLH.',
  );
});

test('only Hack Days are told photos are required, and why', () => {
  assert.equal(
    copy.hackDayRequired,
    'Uploading photos is required for your Hack Day reimbursement.',
  );
});

test('a Fest MLH has not made an album for yet is told it is coming', () => {
  assert.equal(copy.pending, 'Your photo gallery links will appear here soon.');
});

test('the upload link says who it is for', () => {
  assert.equal(copy.upload.label, 'Upload');
  assert.equal(copy.upload.cta, 'Upload photos');
  assert.equal(
    copy.upload.hint,
    'Only share this link with people taking photos at your Fest.',
  );
});

test('the gallery link is the one to share', () => {
  assert.equal(copy.gallery.label, 'Gallery');
  assert.equal(copy.gallery.cta, 'View gallery');
  assert.equal(
    copy.gallery.hint,
    'Share this with your community once photos are up.',
  );
});

test('no new string carries an em dash', () => {
  const strings = JSON.stringify(copy);
  assert.ok(!strings.includes('—'), 'an em dash crept into the copy');
});
