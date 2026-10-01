/* The browser half of a share: the sticker files, the card as a picture,
   and the three places a picture can go from here (the share sheet, the
   clipboard, a download). lib/shareCard.mjs builds the SVG; nothing in
   this file knows what the card says.

   Browser only. Every export here touches fetch, Image, canvas, navigator
   or the DOM, so node --test does not read it and neither does the static
   export: components/ShareModal mounts on a click and nowhere else.

   Relative imports, matching lib/: Node's test runner never sees jsconfig's
   alias, and the module it pulls in (stickerImage.mjs) is under test. */
import { stickerImageSrc } from './stickerImage.mjs';

/* One fetch per sticker file per page, promise and all, so the book card
   asking for twenty stickers and a second open of the same modal cost one
   round trip each. The files are immutable for the life of a deploy, so
   force-cache lets the browser answer from disk on a later visit too. A
   failed fetch drops out of the Map: a modal opened again after a blip
   should try once more rather than repeat the failure forever. */
const held = new Map();

export const fetchStickerSvg = async (slug) => {
  const src = stickerImageSrc(slug);
  const waiting = held.get(src);
  if (waiting) return waiting;

  const pending = fetch(src, { cache: 'force-cache' }).then((response) => {
    if (!response.ok)
      throw new Error(`the ${slug} sticker did not load (${response.status})`);
    return response.text();
  });
  pending.catch(() => {
    if (held.get(src) === pending) held.delete(src);
  });
  held.set(src, pending);
  return pending;
};

/* The card's words come off the SVG before it is painted, and the canvas
   draws them instead. An SVG painted through an <img> is a sealed
   document: it cannot see the page's webfonts, so a <text> asking for
   Barlow Semi Condensed gets Barlow only on a computer that has it
   installed, and Arial or Helvetica on everyone else's. The canvas
   belongs to the page and draws with the page's fonts.

   Only the root's own <text> lines come off. Those are in the card's
   units; a <text> inside a nested sticker is in the sticker's, and is
   left where it is (no sticker has one). Each line keeps what the SVG
   gave it, with SVG's whitespace rule applied, and a textLength becomes
   fillText's maxWidth: a line wider than that is squeezed to fit, the
   job textLength was doing. A document that does not parse goes to the
   <img> whole, which then refuses it as it always has. */
const liftWords = (svg) => {
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  const root = doc.documentElement;
  if (
    !root ||
    root.localName !== 'svg' ||
    doc.getElementsByTagName('parsererror').length
  )
    return { art: svg, words: [], units: 0 };

  const words = [...root.children]
    .filter((node) => node.localName === 'text')
    .map((node) => {
      node.remove();
      const number = (name) => Number(node.getAttribute(name)) || 0;
      return {
        value: node.textContent.replace(/\s+/g, ' ').trim(),
        x: number('x'),
        y: number('y'),
        font: `${node.getAttribute('font-weight') || '400'} ${number('font-size')}px ${node.getAttribute('font-family') || 'sans-serif'}`,
        fill: node.getAttribute('fill') || '#000',
        align:
          { middle: 'center', end: 'right' }[
            node.getAttribute('text-anchor')
          ] || 'left',
        maxWidth: number('textLength'),
      };
    });

  const box = (root.getAttribute('viewBox') || '').trim().split(/[\s,]+/);
  const units = Number(box[2]) || Number(root.getAttribute('width')) || 0;
  return {
    art: new XMLSerializer().serializeToString(doc),
    words,
    units,
  };
};

/* Every face the words ask for, loaded for the very characters they
   carry (the page's stylesheet splits each face by script). A face that
   will not load is no reason to hold the picture back: after three
   seconds the words are drawn with whatever has arrived, and a face
   still missing falls back down its stack. */
const FONT_WAIT = 3000;
const loadFaces = (words) => {
  if (typeof document === 'undefined' || !document.fonts) return null;
  return Promise.race([
    Promise.all(
      words.map((word) =>
        document.fonts.load(word.font, word.value).catch(() => null),
      ),
    ),
    new Promise((resolve) => setTimeout(resolve, FONT_WAIT)),
  ]);
};

/* A data URL rather than a blob URL because an <img> loading an SVG
   from a blob is tainted in Safari and the canvas then refuses to give
   the pixels back. The SVG carries no outside reference of its own (see
   the note at the top of lib/shareCard.mjs), so the art is complete the
   moment the image loads. */
const loadImage = (svg) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('the card did not draw'));
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });

/* The card, painted: the art through the <img>, then the words on top
   in the page's own type. */
export const svgToPngBlob = async (svg, size) => {
  const { art, words, units } = liftWords(svg);
  const [image] = await Promise.all([loadImage(art), loadFaces(words)]);

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('the card had nowhere to be drawn');
  context.drawImage(image, 0, 0, size, size);

  context.scale(size / (units || size), size / (units || size));
  context.textBaseline = 'alphabetic';
  for (const word of words) {
    context.font = word.font;
    context.fillStyle = word.fill;
    context.textAlign = word.align;
    if (word.maxWidth)
      context.fillText(word.value, word.x, word.y, word.maxWidth);
    else context.fillText(word.value, word.x, word.y);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('the card did not come out as a picture'));
    }, 'image/png');
  });
};

/* Whether this is a device where the system share sheet is the way a
   picture goes to a post: a touch screen with no hover, which is a phone
   or a tablet. On a desktop the sheet is a poorer way in than the
   composers (and Chrome on macOS offers one it then refuses to open), so
   the button is a phone thing. False where there is no window to ask. */
export const isSheetDevice = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  try {
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  } catch (_) {
    return false;
  }
};

/* Whether this browser will take a file through the share sheet. Asked
   with the real file: a desktop Chrome answers yes to navigator.share and
   no to this, and offering a sheet that cannot take the picture is worse
   than not offering one. */
export const canShareFiles = (files) => {
  if (typeof navigator === 'undefined') return false;
  try {
    return Boolean(
      navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: Array.isArray(files) ? files : [] }),
    );
  } catch (_) {
    return false;
  }
};

/* Copying an image is the one path that fails quietly and often: Firefox
   has no ClipboardItem for PNG on every version, and any browser refuses
   when the document is not focused or the permission is denied. So this
   answers true or false and never throws, and the caller falls back to a
   download rather than leaving a button that did nothing. */
export const copyPng = async (blob) => {
  if (
    typeof navigator === 'undefined' ||
    typeof ClipboardItem === 'undefined' ||
    !navigator.clipboard ||
    !navigator.clipboard.write
  )
    return false;

  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    return true;
  } catch (_) {
    return false;
  }
};

/* The last resort, and the one that always works. The object URL is
   revoked on the next turn of the loop rather than in the same statement:
   the click has started the download by then, and holding the blob any
   longer than that leaks it for the life of the page. */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

/* The picture and the words onto the clipboard in one write, started on
   the click itself and never awaited by the caller: a composer is about
   to open in a new tab, and a write asked for after that can be refused
   for want of focus, while an await before it would spend the click's
   gesture on the popup. One item with both representations, so a text
   field takes the words and a composer takes the picture. Resolves true
   or false, never throws; a browser with no ClipboardItem gets false at
   once and the caller says nothing about pasting. */
export const startClipboardCopy = (blob, text) => {
  if (
    typeof navigator === 'undefined' ||
    typeof ClipboardItem === 'undefined' ||
    !navigator.clipboard ||
    !navigator.clipboard.write
  )
    return Promise.resolve(false);
  try {
    const item = new ClipboardItem({
      'image/png': blob,
      'text/plain': new Blob([text], { type: 'text/plain' }),
    });
    return navigator.clipboard
      .write([item])
      .then(() => true)
      .catch(() => false);
  } catch (_) {
    return Promise.resolve(false);
  }
};
