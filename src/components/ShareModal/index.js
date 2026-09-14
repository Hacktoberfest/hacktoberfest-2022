import { useEffect, useMemo, useRef, useState } from 'react';

import { my } from 'data/content.mjs';
import { MLH_ADDRESS_URL } from 'data/links';
import { formatEarnedDate } from 'lib/earnedDate.mjs';
import { CARD_SIZE, bookCardSvg, stickerCardSvg } from 'lib/shareCard.mjs';
import {
  canShareFiles,
  copyPng,
  downloadBlob,
  isSheetDevice,
  fetchStickerSvg,
  startClipboardCopy,
  svgToPngBlob,
} from 'lib/shareImage.mjs';
import { SHARE_NETWORKS, carriesText, composerUrl } from 'lib/shareTargets.mjs';
import { bookCounts, bookStickers } from 'lib/stickerBook.mjs';

import { NETWORK_ICONS } from './networkIcons';
import styles from './ShareModal.module.css';

/* One share system, two subjects: a single sticker or the whole book.
   Both end in the same square picture (lib/shareCard.mjs), and the picture
   goes to the share sheet, the clipboard, a download, or a network's own
   composer (lib/shareTargets.mjs).

   Everything happens here, in the reader's browser. The only thing
   fetched is the sticker files, once, and nothing is posted on anyone's
   behalf: a composer opens in a new tab with the words filled in and the
   reader presses post. No network SDK, no script from anyone else, no
   picture uploaded anywhere.

   Native <dialog>, opened and closed the way the Fest detail modal on
   /fests is (components/FestsDirectory/FestModal): mounted for the whole
   life of the book and opened by effect when there is something to
   share, closed by effect when there is not. That is what lets the exit
   animation play at all: React removing the element on close would take
   it away before a frame of the transition ran. `lastShare` keeps the
   subject so the content does not blank out while the dialog fades.

   The animation itself is entirely in the stylesheet (@starting-style and
   allow-discrete), the Fest modal's to the value, so nothing here waits
   on it or knows how long it takes. The routes out all call onClose: the
   close button, Escape (`cancel`, prevented so the state change drives
   the close), a press-and-release on the backdrop, and `close` as the
   backstop for a browser that closes the dialog some other way.

   No picture, no action: the buttons stay disabled until the PNG exists,
   because every one of them hands over a file. The preview appears
   earlier, the moment the SVG is built, so the modal is never an empty
   box while the canvas works. */

const SITE = 'https://hacktoberfest.com';

/* MyMLH lets an account withhold a name, and the still-mocked half of the
   experience carries `name` while a session carries the two halves. Take
   whichever is there; a card that says nothing about who earned it is
   worse than one that says this. */
const FALLBACK_NAME = 'A Hacktoberfest participant';

const shareName = (user) => {
  if (!user) return FALLBACK_NAME;
  const whole = typeof user.name === 'string' ? user.name.trim() : '';
  if (whole) return whole;
  const joined = [user.firstName, user.lastName]
    .filter((part) => typeof part === 'string' && part.trim())
    .join(' ')
    .trim();
  return joined || FALLBACK_NAME;
};

/* `share` is {kind: 'sticker', sticker} or {kind: 'book'} while the modal
   is open, and null while it is closed. */
const ShareModal = ({ share, experience, onClose }) => {
  const dialogRef = useRef(null);
  const copiedTimer = useRef(null);
  /* The subject on screen, which outlives the one selected: on close
     `share` goes null at once and this does not, so the dialog has
     something to draw while it leaves. */
  const lastShare = useRef(share || null);
  /* Whether the press that began a click landed on the backdrop: a click
     whose mousedown was inside the modal is a drag that finished outside
     it, and closing on it would throw away what someone was reading. */
  const pressedOutside = useRef(false);
  /* Set while this component is the one closing the dialog, so the `close`
     event that follows is told apart from one the browser originated and
     onClose runs once per exit. */
  const selfClosing = useRef(false);
  const [svg, setSvg] = useState(null);
  const [png, setPng] = useState(null);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hint, setHint] = useState(null);
  /* A sheet this browser offered and then refused. Chrome on macOS says
     yes to navigator.share and to canShare with the file, and rejects
     the call itself with NotAllowedError; once it has, the button is a
     dead one, so it goes and the composers stand first. */
  const [sheetRefused, setSheetRefused] = useState(false);

  useEffect(() => {
    if (share) lastShare.current = share;
  }, [share]);

  /* Read `share` directly while there is one, the ref only on the way
     out: a state copy would lag the open by a render. */
  const displayed = share || lastShare.current;
  const kind = displayed ? displayed.kind : null;
  const sticker = displayed ? displayed.sticker : null;

  /* The book, read once per experience rather than on every render: the
     card is built from it in the effect below, and a Copied state ticking
     over must not re-derive twenty stickers to get there. */
  const book = useMemo(
    () =>
      kind === 'book'
        ? bookStickers(experience, { addressHref: MLH_ADDRESS_URL })
        : null,
    [kind, experience],
  );
  const counts = useMemo(() => (book ? bookCounts(book) : null), [book]);

  const text =
    kind === 'book'
      ? my.share.text.book(counts.earned, counts.total)
      : sticker
        ? my.share.text.sticker(sticker.label)
        : '';
  const filename =
    kind === 'book'
      ? 'hacktoberfest-2026-sticker-book.png'
      : sticker
        ? `hacktoberfest-2026-${sticker.id}.png`
        : 'hacktoberfest-2026.png';

  /* Open and close follow `share`, not mount and unmount. */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (share) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      selfClosing.current = true;
      dialog.close();
    }
  }, [share]);

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  /* Built once per share: the subject cannot change under an open modal,
     since a new share is a new object. Everything from the last share is
     cleared first, so a second open never shows the first one's picture
     for a frame. `live` guards the state writes so a share closed
     mid-render leaves nothing behind. */
  useEffect(() => {
    if (!share) return undefined;
    let live = true;
    setSvg(null);
    setPng(null);
    setFailed(false);
    setHint(null);
    setCopied(false);

    const build = async () => {
      const name = shareName(experience && experience.user);
      if (share.kind === 'book') {
        const all = bookStickers(experience, { addressHref: MLH_ADDRESS_URL });
        const earned = all.filter((entry) => entry.completed);
        const drawn = await Promise.all(
          earned.map(async (entry) => ({
            id: entry.id,
            label: entry.label,
            svg: await fetchStickerSvg(entry.id),
          })),
        );
        const tally = bookCounts(all);
        return bookCardSvg({
          name,
          stickers: drawn,
          earned: tally.earned,
          total: tally.total,
        });
      }
      return stickerCardSvg({
        name,
        sticker: {
          label: share.sticker.label,
          svg: await fetchStickerSvg(share.sticker.id),
        },
        earnedAt: share.sticker.completedAt
          ? formatEarnedDate(share.sticker.completedAt)
          : null,
      });
    };

    build()
      .then((card) => {
        if (!live) return null;
        setSvg(card);
        return svgToPngBlob(card, CARD_SIZE);
      })
      .then((blob) => {
        if (live && blob) setPng(blob);
      })
      /* A sticker file that would not load (offline, say) or a canvas
         that would not paint: the actions stay disabled, since there is
         no picture to hand over, and the modal says so in place of the
         preview rather than sitting grey. */
      .catch(() => {
        if (live) setFailed(true);
      });

    return () => {
      live = false;
    };
  }, [share, experience]);

  /* The file the sheet takes, and whether this browser will take it. A
     phone or tablet thing (isSheetDevice): on a desktop the composers are
     the way in. Asked of the real file rather than of navigator.share
     alone: a desktop Chrome says yes to the one and no to the other, and
     a sheet that cannot carry the picture is worse than no sheet.
     Memoised on the picture, so the two-second Copied state does not ask
     again. */
  const file = useMemo(
    () =>
      png && typeof File !== 'undefined'
        ? new File([png], filename, { type: 'image/png' })
        : null,
    [png, filename],
  );
  const sheet = useMemo(
    () =>
      file && !sheetRefused && isSheetDevice() ? canShareFiles([file]) : false,
    [file, sheetRefused],
  );
  const ready = Boolean(png);

  const onSheet = async () => {
    try {
      await navigator.share({ files: [file], text });
    } catch (error) {
      /* Cancelled is the person's own doing and not an error to report.
         Anything else is a sheet that will not open (Chrome on macOS
         refuses every call with NotAllowedError, after saying it could),
         and a button that did nothing is the one outcome not allowed:
         the picture goes onto the clipboard instead, or downloads where
         the clipboard will not take it, and the line under says so. */
      if (error && error.name === 'AbortError') return;
      setSheetRefused(true);
      /* The line goes up on the refusal itself, and the copy is started
         and not awaited, as a composer's is: a clipboard write can sit
         unresolved, and the words should not wait on it. Where the
         clipboard says no, the picture downloads and the line changes. */
      setHint('sheetRefused');
      startClipboardCopy(png, text).then((done) => {
        if (done) return;
        downloadBlob(png, filename);
        setHint('sheetRefusedSaved');
      });
    }
  };

  const onCopy = async () => {
    const done = await copyPng(png);
    if (!done) {
      downloadBlob(png, filename);
      return;
    }
    setCopied(true);
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  /* A composer opens with the words filled in where it takes words, and
     the picture (with the words, for the one that does not) goes onto
     the clipboard on the same click, started before the window opens and
     never awaited; see startClipboardCopy. The hint then says to paste.
     LinkedIn takes an address and nothing else, so its hint asks for a
     few words too. Set from this network every time, so pressing another
     clears a line that no longer applies. */
  const onNetwork = (network) => {
    if (png) startClipboardCopy(png, text);
    window.open(
      composerUrl(network, { text, url: SITE }),
      '_blank',
      'noopener',
    );
    setHint(carriesText(network) ? 'paste' : 'pasteWords');
  };

  /* Light dismiss as the Fest modal does it: a click on the dialog
     element itself whose point lies outside the dialog's box is the
     backdrop. The padded box catches clicks on the content, and a
     keyboard-driven click reports 0,0 but comes from a button. */
  const isOutside = (event) => {
    const dialog = dialogRef.current;
    if (!dialog || event.target !== dialog) return false;
    const rect = dialog.getBoundingClientRect();
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );
  };

  const status = failed
    ? ''
    : !ready
      ? my.share.preparing
      : hint === 'paste'
        ? my.share.pasteHint
        : hint === 'pasteWords'
          ? my.share.pasteHintNoText
          : hint === 'sheetRefused'
            ? my.share.sheetRefused
            : hint === 'sheetRefusedSaved'
              ? my.share.sheetRefusedSaved
              : '';

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      /* Only a close this component did not ask for reaches onClose: one
         it did ask for is the tail of a close already in progress. */
      onClose={() => {
        if (selfClosing.current) {
          selfClosing.current = false;
          return;
        }
        onClose();
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onMouseDown={(event) => {
        pressedOutside.current = isOutside(event);
      }}
      onClick={(event) => {
        if (pressedOutside.current && isOutside(event)) onClose();
        pressedOutside.current = false;
      }}
      aria-labelledby="share-modal-title"
    >
      {/* Empty until something has been shared. The <dialog> itself is in
          the DOM from the start, because the effect above needs it to
          open it at all. */}
      {displayed && (
        <>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label={my.share.buttons.close}
          >
            <span aria-hidden="true">×</span>
          </button>

          {/* The heading the acknowledgements modal wears, and a line
              under it saying what the buttons do. */}
          <h3 id="share-modal-title" className={styles.heading}>
            {kind === 'book' ? my.share.title.book : my.share.title.sticker}
          </h3>
          <p className={styles.lede}>{my.share.lede}</p>

          {/* The card says what this modal already says, in the same
              words, so it is decorative here: an alt would read the
              sticker's name and the reader's own name back to them twice. */}
          <div className={styles.preview}>
            {svg && (
              <img
                className={styles.previewImage}
                src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
                alt=""
              />
            )}
            {failed && !svg && (
              <p className={styles.previewError} role="alert">
                {my.share.error}
              </p>
            )}
          </div>

          {/* Posting first. Where the browser can hand a file to the
              system sheet (phones, mostly) that is the one button, since
              the network uploads the picture itself; the composers follow
              as the other way. Everywhere else the composers are the
              block. All wait on the picture, since every one of them
              takes it along. */}
          <div className={styles.post}>
            {sheet && (
              <button
                type="button"
                className={`hf-button ${styles.sheet}`}
                onClick={onSheet}
                disabled={!ready}
              >
                {my.share.buttons.share}
              </button>
            )}
            {sheet && <p className={styles.postOn}>{my.share.sheetThen}</p>}
            {/* Four tiles, one per composer: the network's own mark, its
                name set large, and what the press does under it, so the
                choice is legible before anyone has to trust it. */}
            <div className={styles.networks}>
              {SHARE_NETWORKS.map((network) => (
                <button
                  key={network}
                  type="button"
                  className={styles.tile}
                  onClick={() => onNetwork(network)}
                  disabled={!ready}
                >
                  <span className={styles.tileMark}>
                    {NETWORK_ICONS[network]}
                  </span>
                  <span className={styles.tileName}>
                    {my.share.networks[network]}
                  </span>
                  <span className={styles.tileAction}>
                    {my.share.networkAction}
                  </span>
                </button>
              ))}
            </div>
            {/* Always in the tree, so a screen reader announces the
                change rather than the arrival of a new element: the wait
                for the picture, then the paste line once a composer has
                opened. */}
            <p className={styles.hint} role="status">
              {status}
            </p>
          </div>

          {/* The quieter way: the picture on its own, for a post written
              elsewhere or kept. */}
          <div className={styles.keep}>
            <span className={styles.keepLabel}>{my.share.keep}</span>
            <button
              type="button"
              className={styles.keepAction}
              onClick={onCopy}
              disabled={!ready}
            >
              {copied ? my.share.buttons.copied : my.share.buttons.copy}
            </button>
            <button
              type="button"
              className={styles.keepAction}
              onClick={() => downloadBlob(png, filename)}
              disabled={!ready}
            >
              {my.share.buttons.download}
            </button>
          </div>
        </>
      )}
    </dialog>
  );
};

export default ShareModal;
