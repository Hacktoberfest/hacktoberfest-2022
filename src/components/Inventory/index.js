import { useEffect, useState } from 'react';

import { my } from 'data/content.mjs';
import {
  inventoryItems,
  inventoryLayout,
  openingSlot,
} from 'lib/inventory.mjs';

import Drawer from './Drawer';
import styles from './Inventory.module.css';
import Slot from './Slot';

/* The inventory, the last band on /my: what the stickers earned, as a
   locker drawn as an open book. The left page is the cells, one per
   thing, physical or digital; the right page is the one picked, set the
   way the sticker book sets a page, with a head and a note; the spine
   runs under both. Empty cells say there is room for more; no number of
   slots is ever promised. Nothing here tracks a parcel: a thing is in
   the locker or it is not.

   The things are the API's (GET /api/me/items, experience.items): their
   names, their two facts, their call to action. The pure half is
   lib/inventory.mjs: the art by slug, how the grid pads, which slot
   opens. This file draws it.

   The grid is a listbox with one tab stop: arrow keys move the selection
   by one, or by a row, and the drawer is a live region so the change is
   read out. A thing earned since the participant last looked
   (lib/justEarned.mjs) wears a NEW flag until it is opened, and the
   locker opens on it. */
const Inventory = ({ experience, justEarned }) => {
  const items = inventoryItems(experience);
  /* More to earn while the catalogue holds anything unearned. The count
     is the earned things; the unearned ones sit in the grid as room with
     a name. */
  const earnable = items.some((item) => !item.earned);
  const { columns, empties } = inventoryLayout(items.length, { earnable });

  const [selected, setSelected] = useState(() =>
    openingSlot(items, justEarned),
  );
  /* Opened this mount: a NEW flag clears when its slot is picked, and
     stays cleared for the mount even as the experience revalidates. */
  const [opened, setOpened] = useState(() => new Set());
  const [turnedFor, setTurnedFor] = useState(null);
  useEffect(() => {
    if (!justEarned || justEarned.size === 0 || turnedFor === justEarned)
      return;
    setTurnedFor(justEarned);
    setSelected(openingSlot(items, justEarned));
  }, [justEarned]);

  /* A selection that no longer exists (a revalidation took the thing
     away) falls back to what the locker would open on. */
  const current = items.some((item) => item.id === selected)
    ? selected
    : openingSlot(items, justEarned);
  const currentItem = items.find((item) => item.id === current) || null;

  const pick = (id) => {
    setSelected(id);
    setOpened((known) => (known.has(id) ? known : new Set([...known, id])));
  };

  const onKeyDown = (event) => {
    if (items.length === 0) return;
    const index = Math.max(
      0,
      items.findIndex((item) => item.id === current),
    );
    const step = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: columns,
      ArrowUp: -columns,
      Home: -index,
      End: items.length - 1 - index,
    }[event.key];
    if (step === undefined) return;
    event.preventDefault();
    const next = items[Math.min(items.length - 1, Math.max(0, index + step))];
    pick(next.id);
    const button = event.currentTarget.querySelector(
      `[data-slot="${next.id}"]`,
    );
    if (button) button.focus();
  };

  const earnedCount = items.filter((item) => item.earned).length;
  const intro =
    earnedCount === 0
      ? my.inventory.intro.empty
      : earnable
        ? my.inventory.intro.some
        : my.inventory.intro.full;

  const isNew = (item) =>
    Boolean(
      justEarned &&
        item.newId &&
        justEarned.has(item.newId) &&
        !opened.has(item.id),
    );

  return (
    <section className={styles.band} aria-labelledby="inventory-heading">
      <h2 id="inventory-heading" className={styles.heading}>
        {my.inventory.heading.lead} <em>{my.inventory.heading.accent}</em>
      </h2>
      <p className={styles.intro}>{intro}</p>
      <div className={styles.locker}>
        <div className={styles.page}>
          <div className={styles.pageHead}>
            <h3 className={styles.pageTitle}>
              {my.inventory.pages.have.title}
            </h3>
            <p className={styles.pageNote}>{my.inventory.pages.have.note}</p>
          </div>
          <div
            className={styles.cells}
            style={{ '--columns': columns }}
            role="listbox"
            aria-label={my.inventory.listLabel}
            tabIndex={items.length > 0 ? 0 : undefined}
            onKeyDown={onKeyDown}
          >
            {items.map((item) => (
              <Slot
                key={item.id}
                item={item}
                selected={item.id === current}
                isNew={isNew(item)}
                onPick={() => pick(item.id)}
              />
            ))}
            {/* Room: an empty die-cut slot per cell while there is more to
                earn, and nothing said; a full locker finishes its row with
                blank cells. */}
            {Array.from({ length: empties }, (_, index) => (
              <div
                key={`empty-${index}`}
                className={`${styles.cell} ${styles.cellEmpty}`}
                aria-hidden="true"
              >
                {earnable && <span className={styles.slot} />}
              </div>
            ))}
          </div>
        </div>
        <Drawer item={currentItem} />
        <div className={styles.spine}>
          <span className={styles.spineCount}>
            {my.inventory.count(earnedCount)}
          </span>
          <span className={styles.count}>
            {earnable ? my.inventory.room : my.inventory.full}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Inventory;
