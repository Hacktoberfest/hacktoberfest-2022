/* The asset retry that _document inlines first in every page's head, and
   the hold that keeps a page from painting without a stylesheet while that
   stylesheet is being retried.

   What the retry is for (Aug 21, 2026): DigitalOcean served the site from
   two origin nodes left on different builds, with no deploy running.
   Content-hashed filenames differ between builds, so an HTML document from
   one node asks for chunks that exist only on that node, and each of those
   requests independently lands on the wrong one about half the time. A 404
   on a stylesheet costs the page its styles; a 404 on a page chunk costs it
   hydration entirely, and then nothing in the bundle can recover, because
   the recovery would have been in the bundle.

   A retry works because the query string makes it a URL Cloudflare has
   never seen, so it goes to the origin and draws a node again. Every
   attempt is a fresh coin toss, so the cap is set by how many assets a page
   has rather than by how unlucky one of them can be: at ten retries a
   single asset survives a fifty-fifty origin with probability 0.9995, and a
   page of a dozen assets loads about 99.4% of the time. At five retries
   that page figure is only 82%, which is not a fix.

   Bounded per URL, so a genuinely absent file 404s its ten times and stops,
   leaving the page exactly where it would have been anyway. Nothing is
   retried that did not announce its own failure.

   What the hold is for (Oct 20, 2026): the two App Platform apps shipped
   one commit with different names for /my's shared CSS chunk, and a
   Cloudflare-pinned 404 on it painted PageHero's corner art at full page
   width, giant red and cream blocks, for a second or two. The retry healed
   it, but a stylesheet a script inserts is not render-blocking the way the
   parser's own was, so the browser paints everything it has while the
   retry is in flight. So from the moment a stylesheet fails until every
   retried stylesheet has loaded or used up its retries, <html> carries the
   hold attribute, the body is hidden, and the /my loader's four squares
   stand on the forest ground in its place. The squares come in after a
   beat, so a retry that lands at once reads as a blink of forest, not a
   loader. The hold has a deadline, counted from the first failure, after
   which the page shows whatever it has and never holds again: a stylesheet
   that will not come is a styling problem, and a page that stays hidden
   would make it an outage.

   The error event alone is a frame too late in Chrome. A failed stylesheet
   stops blocking rendering first and announces its failure in a later
   task, and a frame fits in between: measured against a built /my with
   its shared chunk 404ing, Chrome drew a frame of the page without it
   before the error handler ran, and on a page that server-renders
   PageHero, /activities, that frame is the giant blocks. So the hold has a
   second way in, a check at the top of every frame while the document is
   still parsing. Nothing renders while a head stylesheet is still
   loading, and a frame's animation callbacks run before it paints, so by
   the first one every head stylesheet has loaded or failed: a /_next/
   stylesheet with no sheet and no copy of it that loaded is held for
   there and then, and that frame paints the hold instead. (An inline
   script opening the body can look at the same moment, but it holds back
   the parsing of the body on every healthy load, and Chrome paints the
   empty page in the pause.) */
export const ASSET_RETRY_MAX = 10;
export const ASSET_HOLD_ATTRIBUTE = 'data-asset-hold';
export const ASSET_HOLD_LOADER_ID = 'asset-hold';
export const ASSET_HOLD_DEADLINE_MS = 5000;

/* The hold's look, inlined in the head beside the script because it has to
   work when every stylesheet the page links is the thing that went
   missing. The squares are components/Loader's, colours and wave included
   (test/asset-retry.test.mjs holds the two together). The loader is a
   child of <html>, outside the hidden body, and sits above everything the
   body could still paint. */
export const assetHoldStyle = `html[${ASSET_HOLD_ATTRIBUTE}] body {
  visibility: hidden;
}

#${ASSET_HOLD_LOADER_ID} {
  position: fixed;
  z-index: 2147483647;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* colors.forest */
  background: #3d5f58;
}

#${ASSET_HOLD_LOADER_ID} > div {
  display: flex;
  animation: asset-hold-in 0.2s ease-out 0.3s both;
}

#${ASSET_HOLD_LOADER_ID} span {
  width: clamp(34px, 6vw, 48px);
  height: clamp(34px, 6vw, 48px);
  animation: asset-hold-wave 1.4s ease-in-out infinite;
}

/* colors.orange, colors.sky, colors.ochre, colors.pink */
#${ASSET_HOLD_LOADER_ID} span:nth-child(1) {
  background: #e53927;
}

#${ASSET_HOLD_LOADER_ID} span:nth-child(2) {
  background: #8bb2de;
  animation-delay: 0.12s;
}

#${ASSET_HOLD_LOADER_ID} span:nth-child(3) {
  background: #f5b726;
  animation-delay: 0.24s;
}

#${ASSET_HOLD_LOADER_ID} span:nth-child(4) {
  background: #e97b77;
  animation-delay: 0.36s;
}

@keyframes asset-hold-in {
  from {
    opacity: 0;
  }
}

@keyframes asset-hold-wave {
  0%,
  50%,
  100% {
    transform: translateY(0);
  }

  25% {
    transform: translateY(-40%);
  }
}

@media (prefers-reduced-motion: reduce) {
  #${ASSET_HOLD_LOADER_ID} span {
    animation: none;
  }
}`;

/* The body of the inline <script> in _document. ES5 throughout: it runs
   before anything is polyfilled, in every browser that loads the page. */
export const assetRetryScript = `(function () {
  var MAX = ${ASSET_RETRY_MAX};
  var tries = {};
  var root = document.documentElement;
  var pending = {};
  var pendingCount = 0;
  var loader = null;
  var deadline = null;
  var expired = false;
  function lift() {
    pending = {};
    pendingCount = 0;
    root.removeAttribute(${JSON.stringify(ASSET_HOLD_ATTRIBUTE)});
    if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    loader = null;
  }
  function hold(url) {
    if (expired || pending[url]) return;
    pending[url] = true;
    pendingCount += 1;
    if (deadline === null) {
      deadline = setTimeout(function () {
        expired = true;
        lift();
      }, ${ASSET_HOLD_DEADLINE_MS});
    }
    if (loader) return;
    root.setAttribute(${JSON.stringify(ASSET_HOLD_ATTRIBUTE)}, '');
    loader = document.createElement('div');
    loader.id = ${JSON.stringify(ASSET_HOLD_LOADER_ID)};
    loader.setAttribute('aria-hidden', 'true');
    var squares = document.createElement('div');
    for (var i = 0; i < 4; i++) squares.appendChild(document.createElement('span'));
    loader.appendChild(squares);
    root.appendChild(loader);
  }
  function settle(url) {
    if (!pending[url]) return;
    delete pending[url];
    pendingCount -= 1;
    if (pendingCount === 0) lift();
  }
  function retry(el) {
    var isScript = el.tagName === 'SCRIPT';
    var attr = isScript ? 'src' : 'href';
    var value = el.getAttribute(attr);
    if (!value || value.indexOf('/_next/') === -1) return;
    var url = value.split('?')[0];
    /* Only a stylesheet holds the page. A preload of one paints nothing,
       and the stylesheet that uses it reports its own failure. */
    var isStylesheet = !isScript && (el.getAttribute('rel') || '').toLowerCase() === 'stylesheet';
    tries[url] = (tries[url] || 0) + 1;
    if (tries[url] > MAX) {
      if (isStylesheet) settle(url);
      return;
    }
    if (isStylesheet) hold(url);
    var next = document.createElement(el.tagName);
    for (var i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (a.name !== attr) next.setAttribute(a.name, a.value);
    }
    next.setAttribute(attr, url + '?__retry=' + tries[url] + '-' + Math.random().toString(36).slice(2, 8));
    /* Dynamically created scripts default to async, which would let a
       retried chunk run ahead of one still loading. Next's own tags are
       ordered defer; keep that. */
    if (isScript) next.async = false;
    if (isStylesheet) {
      next.addEventListener('load', function () {
        settle(url);
      });
    }
    (el.parentNode || document.head).insertBefore(next, el.nextSibling);
  }
  window.addEventListener('error', function (event) {
    var el = event.target;
    if (!el || !el.tagName) return;
    if (el.tagName === 'SCRIPT' || el.tagName === 'LINK') retry(el);
  }, true);
  /* The check at the top of each frame. A stylesheet with no sheet has
     failed, and its error event will bring the retry. The load listener
     is for a browser that drew a frame while a stylesheet was only slow:
     the hold then lasts as long as the wait, which would have painted
     unstyled anyway, and no longer. */
  var watched = [];
  function check() {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    var loaded = {};
    var unloaded = [];
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (!href || href.indexOf('/_next/') === -1) continue;
      if (links[i].sheet) loaded[href.split('?')[0]] = true;
      else unloaded.push(links[i]);
    }
    for (var j = 0; j < unloaded.length; j++) {
      (function (link) {
        var url = link.getAttribute('href').split('?')[0];
        if (loaded[url] || tries[url] > MAX) return;
        hold(url);
        if (watched.indexOf(link) !== -1) return;
        watched.push(link);
        link.addEventListener('load', function () {
          settle(url);
        });
      })(unloaded[j]);
    }
  }
  function onFrame() {
    check();
    if (document.readyState === 'loading') window.requestAnimationFrame(onFrame);
  }
  if (window.requestAnimationFrame) window.requestAnimationFrame(onFrame);
})();`;
