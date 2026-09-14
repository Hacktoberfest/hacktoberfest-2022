import { my } from 'data/content.mjs';
import { stickerImageSrc } from 'lib/stickerImage.mjs';

import styles from './Inventory.module.css';

/* The line under a thing's name: its kind, physical or digital; Not yet
   while it is not earned; or the ask for the DEV connection. */
export const statusLabel = (item) =>
  item.needsDev ? my.inventory.devUnlinked : my.inventory.kinds[item.kind];

/* One cell of the locker, drawn as the sticker book draws its cells
   (components/Album/StickerCell): the thing in its slot, peeled up and
   leaning its own way once earned, with a tick on its corner; its name
   under it, the API's, with the variant's title for a thing earned more
   than once (a certificate per Fest); and one line saying which kind of
   thing it is. A thing on DEV with no DEV account linked asks for the
   connection. Only earned things are drawn. A sticker sits
   in the book's die-cut circle; anything else is drawn as itself, since
   circles are for stickers. NEW on the corner while the thing is new and
   unopened. A button in a listbox; the name carries the line too, so a
   screen reader hears it. */
const Slot = ({ item, selected, isNew, onPick }) => {
  const status = statusLabel(item);
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      aria-label={`${item.variant ? `${item.name}, ${item.variant.title}` : item.name}, ${status}`}
      data-slot={item.slot}
      data-item={item.id}
      data-kind={item.kind}
      data-shape={item.sticker ? 'sticker' : 'thing'}
      data-earned={item.earned ? 'true' : undefined}
      data-needs-dev={item.needsDev ? 'true' : undefined}
      data-selected={selected ? 'true' : undefined}
      data-new={isNew ? 'true' : undefined}
      tabIndex={-1}
      className={styles.cell}
      onClick={onPick}
    >
      <span className={styles.slot}>
        <span className={styles.sticker}>
          <img
            className={styles.stickerImage}
            src={stickerImageSrc(item.art)}
            alt=""
            draggable="false"
          />
        </span>
        {item.earned && (
          <span className={styles.tick} aria-hidden="true">
            ✓
          </span>
        )}
      </span>
      <span className={styles.cellTitle}>{item.name}</span>
      {item.variant && (
        <span className={styles.cellVariant}>{item.variant.title}</span>
      )}
      <span className={styles.cellStatus}>{status}</span>
      {isNew && (
        <span className={styles.newFlag} aria-hidden="true">
          {my.inventory.drawer.newFlag}
        </span>
      )}
    </button>
  );
};

export default Slot;
