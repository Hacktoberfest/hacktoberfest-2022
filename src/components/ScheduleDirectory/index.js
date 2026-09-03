import { useCallback, useEffect, useMemo, useState } from 'react';

import Loader from 'components/Loader';
import { schedule } from 'data/content.mjs';
import {
  getScheduleRaw,
  normalizeSchedule,
  viewerTimeZone,
} from 'lib/schedule.mjs';

import AgendaStream from './AgendaStream';
import EventModal from './EventModal';
import ZonePicker from './ZonePicker';
import styles from './ScheduleDirectory.module.css';

/* CSS Modules rather than styled-components throughout this directory, the
   same as FestsDirectory: everything below renders after a client-side fetch,
   and styled-components emits no CSS on that path.

   There is one view. The agenda is already a list, so the calendar-or-list
   toggle earlier versions carried had nothing left to toggle between — and
   with it went the URL parameter and the phone-specific default, since the
   same stream works at every width. */
const ScheduleDirectory = () => {
  /* The RAW payload, not normalised events: which day an event falls on
     depends on the zone it is read in, so normalisation happens below, per
     zone, and a zone switch re-runs it without another request. */
  const [state, setState] = useState({ status: 'loading', raw: [] });
  const [selected, setSelected] = useState(null);

  /* Resolved once, on the client, then the reader's to change. Server-side
     there is no reader and no zone, and reading one during SSR would bake the
     build machine's zone into the export for everybody. */
  const [timeZone, setTimeZone] = useState('UTC');
  const [viewerZone, setViewerZone] = useState(null);
  /* The minute hand behind the ON AIR chips, owned here because two surfaces
     read it — the stream's rows and the modal — and they must agree on the
     instant. Everything that JUDGES it stays pure (isOnAir takes `now` as an
     argument); this is merely where the clock gets read, once a minute, so a
     stream that starts while the page sits open lights up without a reload. */
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(tick);
  }, []);

  const load = useCallback(() => {
    setState({ status: 'loading', raw: [] });

    getScheduleRaw().then(
      (raw) => setState({ status: 'ready', raw }),
      () => setState({ status: 'error', raw: [] }),
    );
  }, []);

  useEffect(() => {
    const zone = viewerTimeZone();
    setViewerZone(zone);
    setTimeZone(zone);
    load();
  }, [load]);

  const events = useMemo(
    () => normalizeSchedule(state.raw, timeZone),
    [state.raw, timeZone],
  );

  /* Every zone the runtime knows, with the current one merged in for the
     rare browser that cannot enumerate them — the select must never be
     missing its own value. */
  const zones = useMemo(() => {
    let known = [];
    try {
      known = Intl.supportedValuesOf('timeZone');
    } catch (_) {
      known = ['UTC'];
    }
    return known.includes(timeZone) ? known : [timeZone, ...known];
  }, [timeZone]);

  /* Idempotent, because the modal has three routes out and any of them may
     call it — see the note in EventModal. */
  const closeEvent = useCallback(() => setSelected(null), []);

  if (state.status === 'loading') {
    return (
      <div className={styles.state}>
        <Loader />
        <p className={styles.stateBody}>{schedule.loading}</p>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className={styles.state}>
        <h2 className={styles.stateTitle}>{schedule.error.title}</h2>
        <p className={styles.stateBody}>{schedule.error.body}</p>
        <button type="button" className={styles.retry} onClick={load}>
          {schedule.error.retryCta}
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className={styles.state}>
        <h2 className={styles.stateTitle}>{schedule.empty.title}</h2>
        <p className={styles.stateBody}>{schedule.empty.body}</p>
      </div>
    );
  }

  return (
    <section className={styles.root} aria-label={schedule.monthLabel}>
      {/* The band is full-bleed so its ground runs edge to edge; the column
          inside it carries the shell width. */}
      <div className={styles.inner}>
        {/* The month as a plain heading, the zone as an actual control. The
            previous bar welded both into a search-bar-style instrument, which
            promised a control that was not one — the instrument treatment is
            earned by the select and only the select. */}
        <div className={styles.toolbar}>
          <h2 className={styles.month}>{schedule.monthLabel}</h2>
          <ZonePicker
            zones={zones}
            value={timeZone}
            viewerZone={viewerZone}
            onChange={setTimeZone}
          />
        </div>

        <AgendaStream
          events={events}
          timeZone={timeZone}
          onSelect={setSelected}
          now={now}
        />

        <EventModal
          event={selected}
          timeZone={timeZone}
          onClose={closeEvent}
          now={now}
        />
      </div>
    </section>
  );
};

export default ScheduleDirectory;
