import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

import {
  ASSET_HOLD_ATTRIBUTE,
  ASSET_HOLD_DEADLINE_MS,
  ASSET_HOLD_LOADER_ID,
  ASSET_RETRY_MAX,
  assetHoldStyle,
  assetRetryScript,
} from '../src/lib/assetRetry.mjs';

/* The inline script in _document is a string, so nothing type-checks it
   and no bundler ever parses it. Run it, against just enough of a DOM to
   watch what it does: elements with attributes, children, listeners and a
   stylesheet once they load, a window that hands the capture-phase error
   listener back, and a clock and frames the test moves by hand. */
class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.attributes = [];
    this.children = [];
    this.parentNode = null;
    this.listeners = {};
    this.sheet = null;
  }

  getAttribute(name) {
    const found = this.attributes.find((a) => a.name === name);
    return found ? found.value : null;
  }

  setAttribute(name, value) {
    const found = this.attributes.find((a) => a.name === name);
    if (found) found.value = String(value);
    else this.attributes.push({ name, value: String(value) });
  }

  removeAttribute(name) {
    this.attributes = this.attributes.filter((a) => a.name !== name);
  }

  hasAttribute(name) {
    return this.getAttribute(name) !== null;
  }

  addEventListener(type, listener) {
    (this.listeners[type] ||= []).push(listener);
  }

  dispatch(type) {
    for (const listener of this.listeners[type] || []) {
      listener({ type, target: this });
    }
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  insertBefore(child, reference) {
    child.parentNode = this;
    const at = reference ? this.children.indexOf(reference) : -1;
    if (at === -1) this.children.push(child);
    else this.children.splice(at, 0, child);
    return child;
  }

  removeChild(child) {
    this.children = this.children.filter((c) => c !== child);
    child.parentNode = null;
    return child;
  }

  get nextSibling() {
    if (!this.parentNode) return null;
    const siblings = this.parentNode.children;
    return siblings[siblings.indexOf(this) + 1] || null;
  }
}

const element = (tagName, attributes = {}) => {
  const el = new FakeElement(tagName);
  for (const [name, value] of Object.entries(attributes)) {
    el.setAttribute(name, value);
  }
  return el;
};

const page = ({ animationFrames = true } = {}) => {
  const html = element('html');
  const head = html.appendChild(element('head'));
  html.appendChild(element('body'));

  let onError = null;
  let now = 0;
  let timers = [];
  let nextTimer = 1;
  let frameCallbacks = [];

  const document = {
    readyState: 'loading',
    documentElement: html,
    head,
    createElement: (tagName) => element(tagName),
    querySelectorAll: (selector) => {
      assert.equal(selector, 'link[rel="stylesheet"]');
      return head.children.filter(
        (c) => c.tagName === 'LINK' && c.getAttribute('rel') === 'stylesheet',
      );
    },
  };
  const window = {
    addEventListener: (type, listener, capture) => {
      if (type === 'error' && capture) onError = listener;
    },
  };
  if (animationFrames) {
    window.requestAnimationFrame = (callback) => frameCallbacks.push(callback);
  }

  const context = {
    Math,
    document,
    window,
    setTimeout: (run, ms) => {
      const id = nextTimer++;
      timers.push({ id, run, at: now + ms });
      return id;
    },
    clearTimeout: (id) => {
      timers = timers.filter((t) => t.id !== id);
    },
  };
  runInNewContext(assetRetryScript, context);

  return {
    html,
    head,
    /* Puts a tag in the head, the way the parser does. */
    add: (tagName, attributes) =>
      head.appendChild(element(tagName, attributes)),
    fail: (el) => onError({ target: el }),
    load: (el) => {
      el.sheet = {};
      el.dispatch('load');
    },
    /* The top of a frame: the animation callbacks, before the paint. */
    frame: () => {
      const due = frameCallbacks;
      frameCallbacks = [];
      for (const callback of due) callback(0);
    },
    framesQueued: () => frameCallbacks.length,
    parsed: () => {
      document.readyState = 'interactive';
    },
    advance: (ms) => {
      now += ms;
      const due = timers.filter((t) => t.at <= now);
      timers = timers.filter((t) => t.at > now);
      for (const timer of due) timer.run();
    },
    held: () => html.hasAttribute(ASSET_HOLD_ATTRIBUTE),
    loader: () => html.children.find((c) => c.id === ASSET_HOLD_LOADER_ID),
    /* The tag the last retry of this one put in, or the tag itself. */
    latest: (el) => {
      const attr = el.tagName === 'SCRIPT' ? 'src' : 'href';
      const url = el.getAttribute(attr).split('?')[0];
      return [...head.children]
        .reverse()
        .find(
          (c) =>
            c.tagName === el.tagName &&
            c.getAttribute('rel') === el.getAttribute('rel') &&
            (c.getAttribute(attr) || '').split('?')[0] === url,
        );
    },
  };
};

const SHARED_CSS = '/_next/static/css/24ee4ea17878f806.css';
const PAGE_CSS = '/_next/static/css/1c70c474653b1e35.css';

const stylesheet = (p, href) =>
  p.add('link', { rel: 'stylesheet', href, 'data-n-p': '' });

test('a stylesheet that 404s is retried under a new URL, beside the original', () => {
  const p = page();
  const original = stylesheet(p, SHARED_CSS);

  p.fail(original);

  const retry = p.latest(original);
  assert.notEqual(retry, original);
  assert.equal(original.nextSibling, retry);
  assert.match(
    retry.getAttribute('href'),
    /^\/_next\/static\/css\/24ee4ea17878f806\.css\?__retry=1-[a-z0-9]+$/,
  );
  assert.equal(retry.getAttribute('rel'), 'stylesheet');
  assert.equal(retry.getAttribute('data-n-p'), '');
});

/* The Oct 20 incident: the retry is not render-blocking, so without the
   hold the page paints PageHero's corner art at full width until it
   lands. The hold has to be up by the time the error handler returns,
   which is before the browser can paint again. */
test('a stylesheet that 404s holds the page behind the loader at once', () => {
  const p = page();
  const original = stylesheet(p, SHARED_CSS);

  assert.equal(p.held(), false);
  assert.equal(p.loader(), undefined);

  p.fail(original);

  assert.equal(p.held(), true);
  const loader = p.loader();
  assert.ok(loader, 'the loader is a child of <html>, outside the body');
  assert.equal(loader.getAttribute('aria-hidden'), 'true');
  assert.equal(loader.children.length, 1);
  assert.equal(loader.children[0].children.length, 4);
  for (const square of loader.children[0].children) {
    assert.equal(square.tagName, 'SPAN');
  }
});

test('the hold lifts once the retried stylesheet loads', () => {
  const p = page();
  const original = stylesheet(p, SHARED_CSS);

  p.fail(original);
  p.load(p.latest(original));

  assert.equal(p.held(), false);
  assert.equal(p.loader(), undefined);
});

test('a retry that 404s too keeps the hold, and the next one can lift it', () => {
  const p = page();
  const original = stylesheet(p, SHARED_CSS);

  p.fail(original);
  p.fail(p.latest(original));
  p.fail(p.latest(original));
  assert.equal(p.held(), true);
  assert.match(p.latest(original).getAttribute('href'), /\?__retry=3-/);
  assert.equal(
    p.html.children.filter((c) => c.id === ASSET_HOLD_LOADER_ID).length,
    1,
    'one loader however many retries',
  );

  p.load(p.latest(original));
  assert.equal(p.held(), false);
});

test('the hold waits for every stylesheet being retried', () => {
  const p = page();
  const shared = stylesheet(p, SHARED_CSS);
  const pageCss = stylesheet(p, PAGE_CSS);

  p.fail(shared);
  p.fail(pageCss);
  p.load(p.latest(shared));
  assert.equal(p.held(), true, 'one of the two is still missing');

  p.load(p.latest(pageCss));
  assert.equal(p.held(), false);
});

test('a stylesheet that runs out of retries lifts the hold', () => {
  const p = page();
  const original = stylesheet(p, SHARED_CSS);

  p.fail(original);
  for (let i = 1; i < ASSET_RETRY_MAX; i++) p.fail(p.latest(original));
  assert.equal(p.held(), true, 'the last retry is still in flight');
  assert.match(
    p.latest(original).getAttribute('href'),
    new RegExp(`\\?__retry=${ASSET_RETRY_MAX}-`),
  );

  p.fail(p.latest(original));
  assert.equal(p.held(), false);
  assert.equal(p.loader(), undefined);
  assert.equal(
    p.head.children.length,
    1 + ASSET_RETRY_MAX,
    'the cap still stops the retries',
  );
});

test('the hold never outlasts its deadline, and never comes back after it', () => {
  const p = page();
  const original = stylesheet(p, SHARED_CSS);

  p.fail(original);
  p.advance(ASSET_HOLD_DEADLINE_MS - 1);
  assert.equal(p.held(), true);

  p.advance(1);
  assert.equal(p.held(), false);
  assert.equal(p.loader(), undefined);

  /* Still retried, just no longer hidden for. */
  const late = stylesheet(p, PAGE_CSS);
  p.fail(late);
  assert.notEqual(p.latest(late), late);
  assert.equal(p.held(), false);
});

test('the deadline counts from the first failure, not the latest', () => {
  const p = page();
  const shared = stylesheet(p, SHARED_CSS);

  p.fail(shared);
  p.load(p.latest(shared));
  p.advance(ASSET_HOLD_DEADLINE_MS - 100);

  const pageCss = stylesheet(p, PAGE_CSS);
  p.fail(pageCss);
  assert.equal(p.held(), true);

  p.advance(100);
  assert.equal(p.held(), false);
});

/* Chrome stops render-blocking on a failed stylesheet before it fires the
   error event, and paints in between. The check at the top of each frame
   closes that gap: nothing renders until the head's stylesheets have
   settled, so a frame that finds one with no sheet holds before it paints,
   without waiting to be told. */
test('the first frame holds for a stylesheet that failed before saying so', () => {
  const p = page();
  const original = stylesheet(p, SHARED_CSS);

  p.frame();
  assert.equal(p.held(), true);
  assert.ok(p.loader());

  p.fail(original);
  assert.equal(p.held(), true);
  p.load(p.latest(original));
  assert.equal(p.held(), false);
});

test('a frame holds nothing when every stylesheet loaded', () => {
  const p = page();
  p.load(stylesheet(p, SHARED_CSS));
  p.load(stylesheet(p, PAGE_CSS));
  stylesheet(p, 'https://fonts.googleapis.com/css2?family=Inter');

  p.frame();

  assert.equal(p.held(), false);
  assert.equal(p.loader(), undefined);
});

test('a stylesheet a frame took for failed lifts the hold by loading', () => {
  const p = page();
  const slow = stylesheet(p, SHARED_CSS);

  p.frame();
  p.frame();
  p.frame();
  assert.equal(p.held(), true);
  assert.equal(slow.listeners.load.length, 1, 'watched once, not per frame');

  p.load(slow);
  assert.equal(p.held(), false);
});

test('a frame leaves alone a stylesheet whose retry already landed', () => {
  const p = page();
  const original = stylesheet(p, SHARED_CSS);

  p.fail(original);
  p.load(p.latest(original));
  p.frame();

  assert.equal(p.held(), false);
});

test('a frame leaves alone a stylesheet that ran out of retries', () => {
  const p = page();
  const original = stylesheet(p, SHARED_CSS);

  p.fail(original);
  for (let i = 0; i < ASSET_RETRY_MAX; i++) p.fail(p.latest(original));
  assert.equal(p.held(), false);

  p.frame();
  assert.equal(p.held(), false);
});

/* The parser can add a stylesheet after the first frame in a browser that
   paints early, so the check runs every frame until the document has
   parsed, then once more for the last of them, and stops. */
test('frames are checked until the document has parsed, and then not', () => {
  const p = page();
  assert.equal(p.framesQueued(), 1);

  p.frame();
  p.frame();
  assert.equal(p.framesQueued(), 1);

  p.parsed();
  const late = stylesheet(p, PAGE_CSS);
  p.frame();
  assert.equal(p.held(), true, 'the frame after parsing still looks');
  assert.equal(p.framesQueued(), 0);

  p.load(late);
  assert.equal(p.held(), false);
});

test('a browser without animation frames still gets the retry and the hold', () => {
  const p = page({ animationFrames: false });
  const original = stylesheet(p, SHARED_CSS);

  p.fail(original);

  assert.equal(p.held(), true);
  assert.notEqual(p.latest(original), original);
});

test('a script is retried without holding the page', () => {
  const p = page();
  const chunk = p.add('script', {
    src: '/_next/static/chunks/pages/my-b723e6ae59947f9c.js',
    defer: '',
  });

  p.fail(chunk);

  const retriedChunk = p.latest(chunk);
  assert.match(retriedChunk.getAttribute('src'), /\?__retry=1-/);
  assert.equal(retriedChunk.async, false);
  assert.equal(p.held(), false);
});

/* A preload or a prefetch fetches for a tag that asks for the same URL
   itself, so a retry of one under a new URL is a file nothing ever uses. */
test('preloads and prefetches are not retried', () => {
  const p = page();
  const links = [
    { rel: 'preload', href: SHARED_CSS, as: 'style' },
    {
      rel: 'preload',
      href: '/_next/static/chunks/pages/my-b723e6ae59947f9c.js',
      as: 'script',
    },
    {
      rel: 'modulepreload',
      href: '/_next/static/chunks/pages/my-b723e6ae59947f9c.js',
    },
    {
      rel: 'prefetch',
      href: '/_next/static/chunks/pages/activities-0a8e3a1b2c4d5e6f.js',
      as: 'script',
    },
  ].map((attributes) => p.add('link', attributes));

  for (const link of links) p.fail(link);

  assert.equal(p.head.children.length, links.length);
  assert.equal(p.held(), false);
});

/* Next links a preload ahead of every stylesheet it puts in the head, and
   a URL Cloudflare has pinned to a 404 fails every tag that asks for it.
   The retries are counted per URL, so the preload's failures must not
   spend the ones the stylesheet needs. */
test('a preload that 404s leaves its stylesheet every retry', () => {
  const p = page();
  p.add('link', { rel: 'preload', href: SHARED_CSS, as: 'style' });
  const original = stylesheet(p, SHARED_CSS);

  const failed = new Set();
  const failEverything = () => {
    const due = p.head.children.filter((c) => !failed.has(c));
    for (const el of due) {
      failed.add(el);
      p.fail(el);
    }
    return due.length;
  };

  for (let i = 0; i < ASSET_RETRY_MAX; i++) {
    failEverything();
    assert.equal(p.held(), true, `still held after round ${i + 1}`);
  }
  assert.match(
    p.latest(original).getAttribute('href'),
    new RegExp(`\\?__retry=${ASSET_RETRY_MAX}-`),
  );

  failEverything();
  assert.equal(p.held(), false);
  assert.equal(failEverything(), 0, 'nothing left to retry');
  assert.equal(
    p.head.children.filter((c) => c.getAttribute('rel') === 'stylesheet')
      .length,
    1 + ASSET_RETRY_MAX,
  );
});

test('a stylesheet from anywhere but /_next/ is neither retried nor held for', () => {
  const p = page();
  const fonts = stylesheet(p, 'https://fonts.googleapis.com/css2?family=Inter');

  p.fail(fonts);

  assert.equal(p.latest(fonts), fonts);
  assert.equal(p.held(), false);
});

test('the hold style hides the body only while <html> is marked', () => {
  assert.match(
    assetHoldStyle,
    new RegExp(
      `html\\[${ASSET_HOLD_ATTRIBUTE}\\] body \\{\\s*visibility: hidden;`,
    ),
  );
  assert.match(assetHoldStyle, new RegExp(`#${ASSET_HOLD_LOADER_ID} \\{`));
});

/* The hold hands over to /my's own loader on the pages that have one, so
   the two have to be the same squares on the same ground. */
test('the hold loader wears components/Loader colours, in its order', () => {
  const loaderCss = readFileSync(
    new URL('../src/components/Loader/Loader.module.css', import.meta.url),
    'utf8',
  );
  const background = (selector) =>
    loaderCss.match(
      new RegExp(`\\.${selector} \\{[^}]*background: (#[0-9a-f]{6})`),
    )[1];

  const ground = background('loading');
  const squares = ['boxOrange', 'boxSky', 'boxOchre', 'boxPink'].map(
    background,
  );

  assert.match(
    assetHoldStyle,
    new RegExp(`#${ASSET_HOLD_LOADER_ID} \\{[^}]*background: ${ground};`),
  );
  squares.forEach((colour, i) => {
    assert.match(
      assetHoldStyle,
      new RegExp(`span:nth-child\\(${i + 1}\\) \\{\\s*background: ${colour};`),
    );
  });
});
