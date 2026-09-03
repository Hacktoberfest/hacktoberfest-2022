import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { schedule } from 'data/content.mjs';
import { filterZones } from 'lib/schedule.mjs';

import styles from './ScheduleDirectory.module.css';

/* The time zone switcher, as a combobox rather than a native select.

   A <select> with 418 flat options is technically complete and practically
   unusable: the reader knows the name of a city and has to scroll for it.
   Typing is the interface people actually have for "find my city in a long
   list", so this is an input that filters (lib/schedule.mjs's filterZones)
   with a listbox of what survives.

   The ARIA combobox pattern, by the book: the input carries role="combobox"
   with aria-expanded/-controls/-activedescendant, the list is a listbox of
   options, and arrow keys move a highlight the input never loses focus over.

   Closed, the input displays the chosen zone. Opening clears it to a query —
   with the chosen zone as placeholder, so the field never reads empty — and
   closing without a pick restores the display. Committing is the only way the
   value changes, so a half-typed query can never become the page's zone. */
const ZonePicker = ({ zones, value, viewerZone, onChange }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const inputId = useId();
  const listboxId = useId();

  const matches = useMemo(() => filterZones(zones, query), [zones, query]);

  const display =
    value === viewerZone ? `${value} ${schedule.zoneYours}` : value;

  const openList = () => {
    if (open) return;
    setOpen(true);
    setQuery('');
    /* The highlight starts on the zone already chosen, so opening and
       pressing Enter is a no-op rather than a jump to Africa/Abidjan. */
    setHighlight(Math.max(0, zones.indexOf(value)));
  };

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const commit = (zone) => {
    if (zone) onChange(zone);
    close();
  };

  /* A click anywhere outside closes without committing. pointerdown rather
     than click, so it wins against whatever the click was about to do. */
  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) close();
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  /* The highlight follows the keyboard out of view otherwise. */
  useEffect(() => {
    if (!open || !listRef.current) return;
    const option = listRef.current.children[highlight];
    if (option) option.scrollIntoView({ block: 'nearest' });
  }, [open, highlight]);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        openList();
        return;
      }
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setHighlight((i) => (i + step + matches.length) % matches.length || 0);
      return;
    }

    if (event.key === 'Enter') {
      if (!open) return;
      event.preventDefault();
      commit(matches[highlight]);
      return;
    }

    if (event.key === 'Escape') {
      if (!open) return;
      event.preventDefault();
      close();
      return;
    }

    /* Tabbing away is leaving, not choosing. */
    if (event.key === 'Tab' && open) close();
  };

  return (
    <div className={styles.zonePicker} ref={rootRef}>
      <span className={styles.zoneDot} aria-hidden="true" />
      <label className={styles.zoneLabel} htmlFor={inputId}>
        {schedule.timeZoneNote}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        className={styles.zoneInput}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={
          open && matches[highlight] ? `${listboxId}-${highlight}` : undefined
        }
        aria-autocomplete="list"
        autoComplete="off"
        spellCheck="false"
        value={open ? query : display}
        placeholder={display}
        onFocus={openList}
        onClick={openList}
        onChange={(event) => {
          setQuery(event.target.value);
          setHighlight(0);
          if (!open) setOpen(true);
        }}
        onKeyDown={onKeyDown}
      />
      {/* Until this existed, the closed picker read as a caption. Prevented
          mousedown so pressing it focuses the input rather than blurring it. */}
      <span
        className={styles.zoneChevron}
        aria-hidden="true"
        onMouseDown={(event) => {
          event.preventDefault();
          if (inputRef.current) inputRef.current.focus();
          openList();
        }}
      >
        ▾
      </span>

      {open && (
        <ul
          id={listboxId}
          className={styles.zoneList}
          role="listbox"
          aria-label={schedule.timeZoneNote}
          ref={listRef}
        >
          {matches.map((zone, index) => (
            <li
              key={zone}
              id={`${listboxId}-${index}`}
              role="option"
              aria-selected={zone === value}
              className={styles.zoneOption}
              data-active={index === highlight ? 'true' : undefined}
              /* mousedown rather than click, prevented, so the input never
                 blurs mid-pick and the outside-close never races it. */
              onMouseDown={(event) => {
                event.preventDefault();
                commit(zone);
              }}
              onMouseMove={() => setHighlight(index)}
            >
              {zone === viewerZone ? `${zone} ${schedule.zoneYours}` : zone}
            </li>
          ))}
          {matches.length === 0 && (
            <li className={styles.zoneEmpty} aria-disabled="true">
              {schedule.zoneNoMatches}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default ZonePicker;
