import assert from 'node:assert/strict';
import test from 'node:test';

import { getInvolved, homeWall } from '../src/data/content.mjs';
import {
  HOME_WALL_DIGITALOCEAN_URL,
  HOME_WALL_MLH_URL,
} from '../src/data/links.js';
import { sponsors } from '../src/data/sponsors.mjs';

/* The homepage wall reuses the /sponsor roster but is its own placement:
   its own copy block, and its own utm_content on every outbound logo so
   attribution can tell the two walls apart. */

test('the homepage wall copy is complete', () => {
  assert.ok(homeWall.eyebrow);
  assert.ok(homeWall.heading.lead && homeWall.heading.accent);
  assert.ok(homeWall.intro);
});

test('the homepage wall heading does not repeat a neighbour section', () => {
  const heading = `${homeWall.heading.lead} ${homeWall.heading.accent}`;
  assert.notEqual(
    heading,
    `${getInvolved.heading.lead} ${getInvolved.heading.accent}`,
  );
});

test('every sponsor carries a homepage placement URL', () => {
  sponsors.forEach((entry) => {
    const url = new URL(entry.homeUrl);
    assert.equal(url.protocol, 'https:', `${entry.name}: not https`);
    assert.equal(
      url.hostname,
      new URL(entry.url).hostname,
      `${entry.name}: home placement must point at the same site`,
    );
    assert.equal(
      url.searchParams.get('utm_content'),
      `home-sponsor-logo-${entry.slug}`,
      `${entry.name}: utm_content must name the homepage placement`,
    );
  });
});

test('the homepage partner links name their placement', () => {
  const contents = [
    [HOME_WALL_MLH_URL, 'home-wall-mlh'],
    [HOME_WALL_DIGITALOCEAN_URL, 'home-wall-digitalocean'],
  ];
  contents.forEach(([href, content]) => {
    assert.equal(new URL(href).searchParams.get('utm_content'), content);
  });
});

test('new homepage wall copy keeps the house voice', () => {
  const strings = JSON.stringify(homeWall);
  assert.ok(!strings.includes('—'), 'no em dashes in new copy');
  assert.ok(!/organizer/i.test(strings), 'say hosts, not organizers');
});
