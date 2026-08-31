/* The host's own description, parsed into something the Fest modal can
   render.

   Organizer HQ takes markdown: MLH's own default copy is written in it, and
   the field arrives from their API as source text rather than as HTML. So a
   host who writes `**Saturday**` or a bulleted schedule must not have their
   asterisks and hyphens shown back to them.

   This returns a structure rather than an HTML string, the same way
   parseAnswerMarkdown does for FAQ answers, and for a stronger reason: FAQ
   copy is ours, while this is a stranger's text arriving through two APIs.
   React renders the text nodes below as text, so markup a host writes -
   `<script>`, an onclick attribute, anything - is displayed rather than
   interpreted. There is no HTML string anywhere in this path to sanitize,
   because none is ever built.

   The subset is what hosts actually write, measured across the live payload
   on 2026-08-31: paragraphs, bulleted and numbered lists, **bold**,
   *italic*, and [label](href) links. Anything outside it stays literal.

   Returns an array of blocks:
     { type: 'paragraph',   parts }
     { type: 'bulletList',  items: [{ parts }, ...] }
     { type: 'orderedList', items: [{ parts }, ...] }

   `parts` is an array of:
     { text }                 - plain prose
     { text, bold: true }     - **bold**
     { text, italic: true }   - *italic*
     { text, href }           - a link whose destination we will follow */

/* Bold before italic, so the ** of a bold run is never read as one italic
   asterisk either side of it.

   `_underscores_` are deliberately NOT italics. No host has written one, and
   treating them as markup would italicise the middle of file_name_here - a
   real cost against no benefit. */
const INLINE_MARKUP =
  /\*\*([^*]+)\*\*|\*([^*\n]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

/* A link is only a link if we would be willing to send a reader there.
   `javascript:` and `data:` URLs are the reason this list is an allowlist
   rather than a denylist: this text is host-authored, and an href is the one
   part of it that a browser acts on rather than displays. A rejected link
   keeps its label as prose, so the host's sentence still reads. */
const SAFE_LINK = /^(https?:\/\/|mailto:)/i;

const parseInline = (line) => {
  const parts = [];
  let lastIndex = 0;
  let match;

  INLINE_MARKUP.lastIndex = 0;

  // eslint-disable-next-line no-cond-assign
  while ((match = INLINE_MARKUP.exec(line))) {
    const [whole, bold, italic, label, href] = match;

    if (match.index > lastIndex) {
      parts.push({ text: line.slice(lastIndex, match.index) });
    }

    if (bold !== undefined) {
      parts.push({ text: bold, bold: true });
    } else if (italic !== undefined) {
      parts.push({ text: italic, italic: true });
    } else if (SAFE_LINK.test(href)) {
      parts.push({ text: label, href });
    } else {
      // Not a destination we will follow, so it was never a link: show the
      // words the host wrote, exactly as they wrote them.
      parts.push({ text: whole });
    }

    lastIndex = match.index + whole.length;
  }

  if (lastIndex < line.length) {
    parts.push({ text: line.slice(lastIndex) });
  }

  return parts.length ? parts : [{ text: '' }];
};

const BULLET = /^\s*[-*+]\s+(.*)$/;
const ORDERED = /^\s*\d+[.)]\s+(.*)$/;
/* Rendered as a bold line rather than an <h4>: a heading inside a modal's
   body would compete with the Fest's own name above it. Supported at all
   only so `## Schedule` never reaches the page with its hashes showing. */
const HEADING = /^\s*#{1,6}\s+(.*)$/;

const listBlock = (lines, marker, type) => ({
  type,
  items: lines.map((line) => ({ parts: parseInline(line.match(marker)[1]) })),
});

export const parseFestDescription = (description) => {
  if (typeof description !== 'string') return [];

  /* CRLF throughout the live data - Organizer HQ is a Rails textarea. A
     blank line opens a new block; single newlines inside a paragraph are
     the host's wrapping, and join up as markdown says they should. */
  const lines = description.replace(/\r\n?/g, '\n').split('\n');

  const blocks = [];
  let paragraph = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: 'paragraph', parts: parseInline(paragraph.join(' ')) });
    paragraph = [];
  };

  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      flushParagraph();
      index += 1;
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      flushParagraph();
      blocks.push({
        type: 'paragraph',
        parts: parseInline(heading[1]).map((part) => ({ ...part, bold: true })),
      });
      index += 1;
      continue;
    }

    const marker = BULLET.test(line)
      ? BULLET
      : ORDERED.test(line)
        ? ORDERED
        : null;

    if (marker) {
      flushParagraph();

      const run = [];
      while (index < lines.length && marker.test(lines[index])) {
        run.push(lines[index]);
        index += 1;
      }

      blocks.push(
        listBlock(
          run,
          marker,
          marker === BULLET ? 'bulletList' : 'orderedList',
        ),
      );
      continue;
    }

    paragraph.push(line.trim());
    index += 1;
  }

  flushParagraph();

  return blocks;
};
