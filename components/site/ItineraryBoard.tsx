'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  ITINERARY_KEY,
  accountPlanData,
  dateForDay,
  emptyPlan,
  normalizePlan,
  publicPlanData,
  readLocalPlan,
  timingWarnings,
  writeLocalPlan,
  type ItineraryPlan,
  type ItineraryStop,
  type SharePlanOptions,
} from '@/lib/itinerary';
import community from '@/data/community-config.json';
import { track } from '@/lib/analytics';

const blankStop = () =>
  ({
    id: '',
    day: 1,
    time: '10:00',
    place: '',
    address: '',
    note: '',
    durationMinutes: 60,
    travelBufferMinutes: 30,
  }) as ItineraryStop;
const accountId = (v: unknown): v is string => typeof v === 'string' && /^[\w-]{10,100}$/.test(v);
function download(data: string, name: string) {
  const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function api(path: string, method = 'GET', data?: unknown) {
  const response = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: data ? { 'Content-Type': 'application/json' } : {},
    body: data ? JSON.stringify(data) : undefined,
  });
  let value;
  try {
    value = await response.json();
  } catch {
    throw Error('The account service is unavailable. Your browser plan is still here.');
  }
  if (!response.ok)
    throw Object.assign(
      Error(
        typeof value.error === 'string'
          ? value.error
          : 'The account request failed. Your browser plan is still here.',
      ),
      { status: response.status },
    );
  return value;
}
function PublicPreview({ plan }: { plan: ItineraryPlan }) {
  return (
    <div className="public-plan-preview">
      <p>{plan.startDate ? `Starts ${plan.startDate} · ` : ''}Korea time</p>
      {plan.notes ? <p className="preserve-lines">{plan.notes}</p> : null}
      <ol>
        {plan.items.map((s) => (
          <li key={s.id}>
            <strong>
              Day {s.day}
              {s.time ? ` · ${s.time}` : ''} · {s.place}
            </strong>
            {s.address ? <p>{s.address}</p> : null}
            {s.note ? <p className="preserve-lines">{s.note}</p> : null}
            <p>
              {s.durationMinutes === null ? 'Visit time not set' : `${s.durationMinutes} min visit`}{' '}
              ·{' '}
              {s.travelBufferMinutes === null
                ? 'Travel buffer not set'
                : `${s.travelBufferMinutes} min travel buffer`}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
export default function ItineraryBoard() {
  const [plan, setPlan] = useState<ItineraryPlan>(emptyPlan),
    [loaded, setLoaded] = useState(false),
    [blocked, setBlocked] = useState(false),
    [message, setMessage] = useState(''),
    [title, setTitle] = useState('My Korea trip'),
    [stop, setStop] = useState<ItineraryStop>(blankStop),
    [editing, setEditing] = useState<string | null>(null),
    [remoteId, setRemoteId] = useState<string | null>(null),
    [busy, setBusy] = useState(false),
    [needsLogin, setNeedsLogin] = useState(false),
    [shareUrl, setShareUrl] = useState(''),
    [candidate, setCandidate] = useState<{ id: string; title: string; plan: ItineraryPlan } | null>(
      null,
    );
  const [shareOptions, setShareOptions] = useState<SharePlanOptions>({
    includeNotes: false,
    includeAddresses: false,
    includeDates: false,
  });
  const file = useRef<HTMLInputElement>(null);
  function rememberAccount(id: string) {
    setRemoteId(id);
    try {
      localStorage.setItem('ke-itinerary-account-v1', JSON.stringify({ version: 1, id }));
    } catch {}
  }
  function save(next: ItineraryPlan) {
    const valid = normalizePlan(next);
    setPlan(valid);
    setShareUrl('');
    try {
      writeLocalPlan(localStorage, valid);
      setMessage('Saved in this browser. Download a backup before clearing browser data.');
    } catch (e) {
      setMessage((e as Error).message + ' Changes are only on this page; download a backup.');
    }
  }
  useEffect(() => {
    let alive = true;
    let local = emptyPlan();
    try {
      local = readLocalPlan(localStorage);
      setPlan(local);
    } catch (e) {
      setBlocked(true);
      setMessage((e as Error).message + ' Your existing browser data has been preserved.');
    }
    try {
      const meta = JSON.parse(localStorage.getItem('ke-itinerary-account-v1') || 'null');
      if (meta?.version === 1 && accountId(meta.id)) setRemoteId(meta.id);
      const savedTitle = JSON.parse(localStorage.getItem('ke-itinerary-title-v1') || 'null');
      if (
        savedTitle?.version === 1 &&
        typeof savedTitle.title === 'string' &&
        savedTitle.title.length <= 100
      )
        setTitle(savedTitle.title);
    } catch {
      /* Optional metadata must not block recovery of a valid board. */
    }
    setLoaded(true);
    let id: string | null = null;
    const fragment = location.hash.match(/^#account-plan=([\w-]{10,100})$/);
    try {
      if (fragment) {
        id = fragment[1];
        localStorage.setItem(
          'ke-itinerary-open-account-v1',
          JSON.stringify({ id, expires: Date.now() + 3600000 }),
        );
        history.replaceState(null, '', location.pathname);
      } else {
        const pending = JSON.parse(localStorage.getItem('ke-itinerary-open-account-v1') || 'null');
        if (pending?.expires > Date.now() && accountId(pending.id)) id = pending.id;
      }
    } catch {
      if (fragment) id = fragment[1];
    }
    if (id)
      void api('/api/plans/' + encodeURIComponent(id))
        .then((value) => {
          const opened = normalizePlan(
            typeof value.data === 'string' ? JSON.parse(value.data) : value.data,
          );
          if (!alive) return;
          setCandidate({ id: value.id, title: value.title, plan: opened });
          setMessage('Your account plan is ready to open. Review the replacement below.');
        })
        .catch((e) => {
          if (alive) {
            setMessage(e.message);
            if (e.status === 401) setNeedsLogin(true);
          }
        });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (loaded && !blocked)
      try {
        localStorage.setItem('ke-itinerary-title-v1', JSON.stringify({ version: 1, title }));
      } catch {}
  }, [title, loaded, blocked]);
  function submit(e: FormEvent) {
    e.preventDefault();
    try {
      if (!editing && plan.items.length >= 150)
        throw Error('Keep up to 150 stops. Remove a stop or start another plan.');
      const next = {
        ...stop,
        id: editing || crypto.randomUUID(),
        place: stop.place.trim(),
        address: stop.address.trim(),
        note: stop.note.trim(),
      };
      save({
        ...plan,
        items: editing
          ? plan.items.map((s) => (s.id === editing ? next : s))
          : [...plan.items, next],
      });
      setEditing(null);
      setStop({ ...blankStop(), day: next.day, time: '' });
      track('tool_complete', { tool: 'itinerary' });
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  function move(id: string, direction: -1 | 1) {
    const index = plan.items.findIndex((s) => s.id === id),
      item = plan.items[index];
    const group = plan.items.map((s, i) => ({ s, i })).filter((v) => v.s.day === item.day);
    const other = group[group.findIndex((v) => v.i === index) + direction];
    if (!other) return;
    const items = [...plan.items];
    [items[index], items[other.i]] = [items[other.i], items[index]];
    save({ ...plan, items });
  }
  async function saveAccount() {
    const data = accountPlanData(plan);
    const value = await api(
      remoteId ? '/api/plans/' + encodeURIComponent(remoteId) : '/api/plans',
      remoteId ? 'PUT' : 'POST',
      { title: title.trim(), data },
    );
    const id = remoteId || value.id;
    if (!accountId(id)) throw Error('The saved plan did not return a valid reference.');
    rememberAccount(id);
    setNeedsLogin(false);
    return { id, data };
  }
  async function action(fn: () => Promise<void>) {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      setMessage((e as Error).message);
      if ((e as { status?: number }).status === 401) setNeedsLogin(true);
    } finally {
      setBusy(false);
    }
  }
  const warnings = timingWarnings(plan),
    days = [...new Set(plan.items.map((s) => s.day))].sort((a, b) => a - b),
    preview = publicPlanData(plan, shareOptions);
  return (
    <>
      <aside className="answer-box">
        <strong>Your trip, saved privately in this browser.</strong>
        <p>
          Add stops, adjust your own visit times and leave travel buffers. Account saving is
          optional. A public link is created only after you review the shared version.
        </p>
      </aside>
      <p role="status" className="planner-status">
        {message}
      </p>
      {blocked ? (
        <aside className="source-box">
          <h2>Existing data needs recovery</h2>
          <p>Editing is paused so an unreadable or newer plan is not overwritten.</p>
          <button
            className="action-button"
            onClick={() =>
              download(
                localStorage.getItem(ITINERARY_KEY) ||
                  localStorage.getItem('ke-itinerary-v1') ||
                  'null',
                'korea-trip-recovery.json',
              )
            }
          >
            Download existing data for recovery
          </button>
        </aside>
      ) : null}
      {candidate ? (
        <aside className="source-box">
          <h2>Open “{candidate.title}”?</h2>
          <p>
            This replaces the browser board shown below. Download its backup first if you need both.
            Your account copy stays private.
          </p>
          <button
            className="action-button"
            onClick={() =>
              download(JSON.stringify(plan, null, 2), 'korea-current-board-private.json')
            }
          >
            Back up current board
          </button>{' '}
          <button
            disabled={blocked}
            className="button"
            onClick={() => {
              save(candidate.plan);
              setTitle(candidate.title);
              rememberAccount(candidate.id);
              setCandidate(null);
              try {
                localStorage.removeItem('ke-itinerary-open-account-v1');
              } catch {}
            }}
          >
            Open account plan
          </button>{' '}
          <button
            className="action-button"
            onClick={() => {
              setCandidate(null);
              try {
                localStorage.removeItem('ke-itinerary-open-account-v1');
              } catch {}
            }}
          >
            Keep current board
          </button>
        </aside>
      ) : null}
      <fieldset disabled={!loaded || blocked} className="planner-fields">
        <legend className="sr-only">Edit your trip</legend>
        <div className="tool-form">
          <label className="field">
            Plan title
            <input
              value={title}
              maxLength={100}
              onChange={(e) => {
                setTitle(e.target.value);
                try {
                  localStorage.setItem(
                    'ke-itinerary-title-v1',
                    JSON.stringify({ version: 1, title: e.target.value }),
                  );
                } catch {
                  setMessage('Title changes could not be saved in this browser.');
                }
              }}
            />
          </label>
          <label className="field">
            Start date, optional
            <input
              type="date"
              min="2000-01-01"
              max="2100-12-31"
              value={plan.startDate || ''}
              onChange={(e) => {
                try {
                  save({ ...plan, startDate: e.target.value || null });
                } catch (error) {
                  setMessage((error as Error).message);
                }
              }}
            />
          </label>
        </div>
        <form className="tool-form stop-editor" onSubmit={submit} id="stop-editor">
          <h2 className="field-wide">{editing ? 'Edit this stop' : 'Add your next stop'}</h2>
          <label className="field">
            Trip day
            <input
              type="number"
              min={1}
              max={90}
              required
              value={Number.isNaN(stop.day) ? '' : stop.day}
              onChange={(e) => setStop({ ...stop, day: e.target.valueAsNumber })}
            />
          </label>
          <label className="field">
            Planned arrival, Korea time
            <input
              type="time"
              value={stop.time}
              onChange={(e) => setStop({ ...stop, time: e.target.value })}
            />
          </label>
          <label className="field">
            Place
            <input
              required
              maxLength={120}
              value={stop.place}
              onChange={(e) => setStop({ ...stop, place: e.target.value })}
            />
          </label>
          <label className="field">
            Korean address / map search
            <input
              maxLength={250}
              value={stop.address}
              onChange={(e) => setStop({ ...stop, address: e.target.value })}
            />
          </label>
          <label className="field">
            Visit duration, minutes
            <input
              type="number"
              min={0}
              max={1440}
              value={stop.durationMinutes ?? ''}
              placeholder="Not set"
              onChange={(e) =>
                setStop({
                  ...stop,
                  durationMinutes: e.target.value === '' ? null : e.target.valueAsNumber,
                })
              }
            />
          </label>
          <label className="field">
            Travel buffer after this stop, minutes
            <input
              type="number"
              min={0}
              max={1440}
              value={stop.travelBufferMinutes ?? ''}
              placeholder="Not set"
              onChange={(e) =>
                setStop({
                  ...stop,
                  travelBufferMinutes: e.target.value === '' ? null : e.target.valueAsNumber,
                })
              }
            />
          </label>
          <label className="field field-wide">
            Private reminder
            <textarea
              value={stop.note}
              maxLength={1000}
              rows={2}
              onChange={(e) => setStop({ ...stop, note: e.target.value })}
            />
          </label>
          <p className="field-note">
            The starting 60-minute visit and 30-minute travel buffer are editable placeholders, not
            verified durations. Leave them blank if unknown.
          </p>
          <div className="button-row field-wide">
            <button className="button" type="submit">
              {editing ? 'Save stop changes' : 'Add stop & save locally'}
            </button>
            {editing ? (
              <button
                type="button"
                className="action-button"
                onClick={() => {
                  setEditing(null);
                  setStop(blankStop());
                }}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
        <section className="tool-result" aria-labelledby="board-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Asia/Seoul · your chosen order</p>
              <h2 id="board-title">Your trip board</h2>
            </div>
            <div className="button-row no-print">
              <button className="action-button" onClick={() => window.print()}>
                Print / PDF
              </button>
              <button
                className="action-button"
                onClick={() =>
                  download(JSON.stringify(plan, null, 2), 'korea-trip-plan-private.json')
                }
              >
                Download backup
              </button>
              <button className="action-button" onClick={() => file.current?.click()}>
                Import backup
              </button>
            </div>
          </div>
          <input
            ref={file}
            className="sr-only"
            aria-label="Import trip JSON file"
            type="file"
            accept=".json,application/json"
            onChange={async (e) => {
              const selected = e.target.files?.[0];
              if (!selected) return;
              try {
                if (selected.size > 250000) throw Error('Choose a trip JSON file under 250 KB.');
                const imported = normalizePlan(JSON.parse(await selected.text()));
                if (
                  !confirm(
                    `Replace this browser board with ${imported.items.length} imported stops? Download a backup first if needed.`,
                  )
                )
                  return;
                save(imported);
                setRemoteId(null);
                try {
                  localStorage.removeItem('ke-itinerary-account-v1');
                } catch {}
                setEditing(null);
              } catch (error) {
                setMessage((error as Error).message);
              } finally {
                e.target.value = '';
              }
            }}
          />
          {!plan.items.length ? (
            <p>
              No stops yet. Add a place here or choose “Add to trip board” in a guide's map section.
            </p>
          ) : null}
          {days.map((day) => (
            <section className="trip-day" key={day}>
              <h3>
                Day {day}
                {dateForDay(plan.startDate, day) ? ` · ${dateForDay(plan.startDate, day)}` : ''}
              </h3>
              <ol className="itinerary-list">
                {plan.items
                  .filter((s) => s.day === day)
                  .map((s, index, array) => (
                    <li key={s.id}>
                      <p className="eyebrow">{s.time || 'Arrival time not set'} · Korea time</p>
                      <h4>{s.place}</h4>
                      {s.address ? <p lang="ko">{s.address}</p> : null}
                      <p>
                        {s.durationMinutes === null
                          ? 'Visit time not set'
                          : `${s.durationMinutes} min visit`}{' '}
                        ·{' '}
                        {s.travelBufferMinutes === null
                          ? 'Travel buffer not set'
                          : `${s.travelBufferMinutes} min travel buffer`}
                      </p>
                      {s.note ? <p className="preserve-lines">{s.note}</p> : null}
                      <div className="button-row no-print">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://map.naver.com/p/search/${encodeURIComponent(s.address || s.place)}`}
                        >
                          Check route ↗
                        </a>
                        <button
                          className="action-button"
                          onClick={() => {
                            setStop({ ...s });
                            setEditing(s.id);
                            document
                              .getElementById('stop-editor')
                              ?.scrollIntoView({ block: 'start', behavior: 'smooth' });
                          }}
                        >
                          Edit <span className="sr-only">{s.place}</span>
                        </button>
                        <button
                          className="action-button"
                          disabled={index === 0}
                          aria-label={`Move ${s.place} earlier`}
                          onClick={() => move(s.id, -1)}
                        >
                          ↑ Earlier
                        </button>
                        <button
                          className="action-button"
                          disabled={index === array.length - 1}
                          aria-label={`Move ${s.place} later`}
                          onClick={() => move(s.id, 1)}
                        >
                          ↓ Later
                        </button>
                        <button
                          className="action-button"
                          onClick={() => {
                            if (confirm(`Remove ${s.place} from this board?`)) {
                              save({ ...plan, items: plan.items.filter((x) => x.id !== s.id) });
                              if (editing === s.id) {
                                setEditing(null);
                                setStop(blankStop());
                              }
                            }
                          }}
                        >
                          Remove <span className="sr-only">{s.place}</span>
                        </button>
                      </div>
                    </li>
                  ))}
              </ol>
            </section>
          ))}
          {warnings.length ? (
            <aside className="calculation-stale">
              <h3>Check these timings</h3>
              <ul>
                {warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </aside>
          ) : null}
          <p className="map-notice">
            Order, times and buffers are your notes, not a validated route. Confirm openings,
            reservations, entrances and actual travel times. Reordering does not automatically
            change arrival times.
          </p>
          <details>
            <summary>Private plan notes</summary>
            <label className="field">
              General reminders
              <textarea
                rows={4}
                maxLength={10000}
                value={plan.notes}
                onChange={(e) => save({ ...plan, notes: e.target.value })}
              />
            </label>
            <p>Keep passport numbers, card details and booking codes outside this planner.</p>
          </details>
        </section>
        {community.enabled ? (
          <section className="tool-result no-print">
            <h2>Keep an account copy</h2>
            <p>
              {remoteId
                ? 'Save updates to the account plan you opened.'
                : 'Save privately to your signed-in account so you can reopen it from another device.'}{' '}
              Downloaded and browser copies remain independent.
            </p>
            <div className="button-row">
              <button
                className="button"
                disabled={busy || !title.trim()}
                onClick={() =>
                  action(async () => {
                    await saveAccount();
                    setMessage('Private account copy saved. Reopen it from Your travel account.');
                  })
                }
              >
                {busy
                  ? 'Working…'
                  : remoteId
                    ? 'Update private account plan'
                    : 'Save private account copy'}
              </button>
              <Link href="/community/account">Open your account</Link>
              {remoteId ? (
                <button
                  className="action-button"
                  disabled={busy}
                  onClick={() => {
                    setRemoteId(null);
                    try {
                      localStorage.removeItem('ke-itinerary-account-v1');
                    } catch {}
                    setMessage('The next account save will create a separate copy.');
                  }}
                >
                  Save as a separate account plan
                </button>
              ) : null}
            </div>
            {needsLogin ? (
              <p>
                <Link href="/community/account?returnTo=%2Ftools%2Fitinerary">
                  Sign in with Google or email, then return to this board
                </Link>
                . Your local changes stay in this browser.
              </p>
            ) : null}
            <details className="share-plan-review">
              <summary>Review a public sharing snapshot</summary>
              <p>
                Anyone with the link can read the selected information. The snapshot will not change
                when you edit your private plan. Create a replacement link to publish changes; this
                revokes the previous link.
              </p>
              <div className="share-options">
                {(
                  [
                    ['includeNotes', 'Include private plan and stop notes'],
                    ['includeAddresses', 'Include exact addresses'],
                    ['includeDates', 'Include the start date'],
                  ] as const
                ).map(([key, label]) => (
                  <label className="check-field" key={key}>
                    <input
                      type="checkbox"
                      checked={shareOptions[key]}
                      onChange={(e) => {
                        setShareOptions({ ...shareOptions, [key]: e.target.checked });
                        setShareUrl('');
                      }}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <h3>People with the link will see: {title}</h3>
              <PublicPreview plan={preview} />
              <p>
                Review names and locations for personal information before publishing. Internal
                guide IDs and account details are excluded.
              </p>
              <button
                className="button"
                disabled={busy || !title.trim() || (!preview.items.length && !preview.notes)}
                onClick={() =>
                  action(async () => {
                    const saved = await saveAccount();
                    const response = await api('/api/plans/' + saved.id + '/share', 'POST', {
                      ...shareOptions,
                      expectedData: JSON.stringify(saved.data),
                    });
                    setShareUrl(response.url);
                    setMessage(
                      'A public snapshot was created. Your private account copy remains separate.',
                    );
                  })
                }
              >
                Save & create reviewed public link
              </button>
              {shareUrl ? (
                <p>
                  <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                    Open your shared snapshot ↗
                  </a>{' '}
                  <button
                    className="action-button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(shareUrl);
                        setMessage('Public sharing link copied.');
                      } catch {
                        setMessage('Copy is unavailable. Open the link and copy its address.');
                      }
                    }}
                  >
                    Copy public link
                  </button>
                </p>
              ) : null}
              {remoteId ? (
                <p>
                  <button
                    className="action-button"
                    disabled={busy}
                    onClick={() =>
                      action(async () => {
                        await api('/api/plans/' + remoteId + '/share', 'DELETE', {});
                        setShareUrl('');
                        setMessage('All public links for this account plan have been revoked.');
                      })
                    }
                  >
                    Revoke all public links for this plan
                  </button>
                </p>
              ) : null}
            </details>
          </section>
        ) : null}
      </fieldset>
    </>
  );
}
