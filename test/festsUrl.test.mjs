import assert from 'node:assert/strict';
import test from 'node:test';

import { festsDirectoryUrl } from '../src/lib/festsUrl.mjs';

const url = (search, query, view, fest) =>
  festsDirectoryUrl({ pathname: '/fests/', search, query, view, fest });

/* The shortest URL that reproduces what you are looking at is the one worth
   pasting, so the two defaults are spelled by their absence. */
test('an unfiltered list view is the bare path', () => {
  assert.equal(url('', '', 'list'), '/fests/');
  assert.equal(url('?q=berlin&view=map', '', 'list'), '/fests/');
});

test('a query and the map view each get a param', () => {
  assert.equal(url('', 'berlin', 'list'), '/fests/?q=berlin');
  assert.equal(url('', '', 'map'), '/fests/?view=map');
  assert.equal(url('', 'berlin', 'map'), '/fests/?q=berlin&view=map');
});

test('going back to a default drops only that param', () => {
  assert.equal(url('?q=berlin&view=map', 'berlin', 'list'), '/fests/?q=berlin');
  assert.equal(url('?q=berlin&view=map', '', 'map'), '/fests/?view=map');
});

/* Anything else already on the URL is not this component's to throw away —
   campaign tags are the obvious case, and they arrive on exactly the links
   most worth measuring. */
test('params this page does not own survive untouched', () => {
  assert.equal(
    url('?utm_source=discord', 'berlin', 'list'),
    '/fests/?utm_source=discord&q=berlin',
  );
  assert.equal(
    url('?utm_source=discord', '', 'list'),
    '/fests/?utm_source=discord',
  );
});

test('a query is encoded rather than pasted in raw', () => {
  assert.equal(url('', 'são paulo', 'list'), '/fests/?q=s%C3%A3o+paulo');
  assert.equal(url('', 'a&b=c', 'list'), '/fests/?q=a%26b%3Dc');
});

test('an open modal is a param, and closing it drops it', () => {
  assert.equal(url('', '', 'list', 'fest-london'), '/fests/?fest=fest-london');
  assert.equal(url('?fest=fest-london', '', 'list'), '/fests/');
});

/* Opening a Fest out of a filtered map view has to keep the reader's place
   behind the modal, or closing it would dump them back at an unfiltered
   list. */
test('the modal param rides alongside the query and the view', () => {
  assert.equal(
    url('', 'berlin', 'map', 'fest-berlin'),
    '/fests/?q=berlin&view=map&fest=fest-berlin',
  );
});

/* The format filter rides in the URL like the rest of the state. */
test('a named format filter is in the URL and all is spelled by absence', () => {
  assert.equal(
    festsDirectoryUrl({ pathname: '/fests/', search: '', format: 'meetUp' }),
    '/fests/?format=meetUp',
  );
  assert.equal(
    festsDirectoryUrl({
      pathname: '/fests/',
      search: '?format=meetUp',
      format: 'all',
    }),
    '/fests/',
  );
  /* Junk never survives into a pasteable link. */
  assert.equal(
    festsDirectoryUrl({
      pathname: '/fests/',
      search: '?format=hackathon',
      format: 'hackathon',
    }),
    '/fests/',
  );
});
