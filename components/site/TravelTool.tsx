'use client';
import { useEffect, useState, useRef, type FormEvent } from 'react';
import Link from 'next/link';
import {
  airportOptions,
  calculateBudget,
  comparePass,
  preparationChecklist,
  KRW,
  TRANSPORT_SOURCE,
  type AirportInput,
  type BudgetInput,
} from '@/lib/travel-tools';
import { track } from '@/lib/analytics';
import ShareActions from './ShareActions';
import type { Place } from '@/lib/content-types';
import PlaceMap from './PlaceMap';
import ToolResultShare from './ToolResultShare';
import community from '@/data/community-config.json';
type Props = { slug: string; title: string; description: string; places: Place[] };
function NumberField({
  name,
  label,
  value,
  set,
  min = 0,
  max = 10000000,
}: {
  name: string;
  label: string;
  value: number;
  set: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="field" htmlFor={name}>
      <span>{label}</span>
      <input
        id={name}
        type="number"
        min={min}
        max={max}
        step="1"
        required
        value={Number.isFinite(value) ? value : ''}
        onChange={(e) => set(e.currentTarget.valueAsNumber)}
      />
    </label>
  );
}
function Select({
  name,
  label,
  value,
  set,
  options,
}: {
  name: string;
  label: string;
  value: string;
  set: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="field" htmlFor={name}>
      <span>{label}</span>
      <select id={name} value={value} onChange={(e) => set(e.target.value)}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
function Pass() {
  const [days, setDays] = useState(3),
    [journeys, setJourneys] = useState(8),
    [fare, setFare] = useState(1550),
    [card, setCard] = useState(true),
    [excluded, setExcluded] = useState(0),
    [result, setResult] = useState<ReturnType<typeof comparePass>>();
  const [error, setError] = useState('');
  function submit(e: FormEvent) {
    e.preventDefault();
    try {
      setResult(
        comparePass({
          days,
          journeys,
          averageFare: fare,
          needsCard: card,
          uncoveredCost: excluded,
        }),
      );
      setError('');
      track('tool_complete', { tool: 'transit-pass' });
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <>
      <form className="tool-form" onSubmit={submit}>
        <NumberField
          name="pass-days"
          label="Consecutive service days (1–7)"
          value={days}
          set={setDays}
          min={1}
          max={7}
        />
        <NumberField
          name="journeys"
          label="Eligible charged journeys (after transfers)"
          value={journeys}
          set={setJourneys}
          max={150}
        />
        <NumberField
          name="fare"
          label="Your average eligible journey fare (KRW)"
          value={fare}
          set={setFare}
          min={1}
          max={100000}
        />
        <NumberField
          name="excluded"
          label="Other transport costs in either option (KRW)"
          value={excluded}
          set={setExcluded}
        />
        <label className="check-field">
          <input type="checkbox" checked={card} onChange={(e) => setCard(e.target.checked)} />
          Add a new physical Climate Card (₩3,000)
        </label>
        <p className="field-note">
          ₩1,550 is an editable example, not a quote for every route. Count charged journeys, not
          each vehicle after a free transfer.
        </p>
        <button className="button" type="submit">
          Compare my costs
        </button>
        {error ? <p role="alert">{error}</p> : null}
      </form>
      {result ? (
        <section className="tool-result" aria-live="polite">
          <p className="eyebrow">Your planning comparison</p>
          <h2>
            {result.saving > 0
              ? `Pass costs ${KRW.format(result.saving)} less`
              : result.saving === 0
                ? 'The costs are equal'
                : `Pay as you go costs ${KRW.format(-result.saving)} less`}
          </h2>
          <dl className="cost-list">
            <div>
              <dt>
                {result.pass.days}-day pass {result.assumptions.needsCard ? '+ new card' : ''}
              </dt>
              <dd>{KRW.format(result.passCost)}</dd>
            </div>
            <div>
              <dt>Eligible journeys paid individually</dt>
              <dd>{KRW.format(result.regularCost)}</dd>
            </div>
            <div>
              <dt>Pass + other transport</dt>
              <dd>{KRW.format(result.passTripTotal)}</dd>
            </div>
            <div>
              <dt>Pay as you go + other transport</dt>
              <dd>{KRW.format(result.regularTripTotal)}</dd>
            </div>
          </dl>
          <p>
            Equal or lower cost begins at{' '}
            <strong>{result.breakEvenJourneys} charged journeys</strong> at your entered fare,
            assuming all counted journeys are covered.
          </p>
          <p>
            Travel days round up to the next available pass length. Service-day validity is not a
            rolling 24-hour period.
          </p>
          <ToolResultShare
            slug="transit-pass"
            title="My Seoul transit comparison"
            summary={`${result.assumptions.days} service days, ${result.assumptions.journeys} eligible charged journeys at ${KRW.format(result.assumptions.averageFare)} each.`}
            facts={[
              `Pass + card where needed: ${KRW.format(result.passCost)}. Individual eligible fares: ${KRW.format(result.regularCost)}.`,
              `Other transport: ${KRW.format(result.assumptions.uncoveredCost)} in either option. Coverage must be verified.`,
            ]}
          />
        </section>
      ) : null}
      <aside className="source-box">
        <h2>Check coverage before buying.</h2>
        <p>
          Tourist passes run for 1, 2, 3, 5 or 7 days. The old prepaid 30-day product ended August
          31, 2026. Resident Climate Pass eligibility is separate.
        </p>
        <p>
          Exclude Sinbundang, GTX, airport/express buses and uncovered routes. The Incheon airport
          exception permits eligible alighting, not boarding.
        </p>
        <a href={TRANSPORT_SOURCE.url} target="_blank" rel="noopener noreferrer">
          Official Seoul coverage, fares and conditions ↗
        </a>
        <p>Checked {TRANSPORT_SOURCE.checkedAt}; confirm current conditions.</p>
      </aside>
    </>
  );
}
function Budget() {
  const [v, setV] = useState<BudgetInput>({
    days: 7,
    nights: 6,
    travelers: 2,
    rooms: 1,
    roomNight: 120000,
    foodDay: 35000,
    transportDay: 10000,
    activitiesDay: 20000,
    oneOff: 100000,
    bufferPercent: 15,
  });
  const [r, setR] = useState<ReturnType<typeof calculateBudget>>(),
    [error, setError] = useState('');
  const fields: [keyof BudgetInput, string, number, number][] = [
    ['days', 'Travel days', 1, 90],
    ['nights', 'Accommodation nights', 0, 90],
    ['travelers', 'Travelers', 1, 30],
    ['rooms', 'Rooms each night', 1, 30],
    ['roomNight', 'Per room per night (KRW)', 0, 10000000],
    ['foodDay', 'Food per person per day (KRW)', 0, 10000000],
    ['transportDay', 'Transport per person per day (KRW)', 0, 10000000],
    ['activitiesDay', 'Activities per person per day (KRW)', 0, 10000000],
    ['oneOff', 'Other costs per person, whole trip (KRW)', 0, 10000000],
    ['bufferPercent', 'Contingency (%)', 0, 100],
  ];
  return (
    <>
      <form
        className="tool-form"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            setR(calculateBudget(v));
            setError('');
            track('tool_complete', { tool: 'trip-budget' });
          } catch (e) {
            setError((e as Error).message);
          }
        }}
      >
        {fields.map(([key, label, min, max]) => (
          <NumberField
            key={key}
            name={key}
            label={label}
            value={v[key]}
            min={min}
            max={max}
            set={(n) => setV({ ...v, [key]: n })}
          />
        ))}
        <p className="field-note">
          Starting values are hypothetical. Replace them with actual hotel quotes and your choices.
          Add flights, insurance and shopping under other costs.
        </p>
        <button className="button" type="submit">
          Build my budget
        </button>
        {error ? <p role="alert">{error}</p> : null}
      </form>
      {r ? (
        <section className="tool-result" aria-live="polite">
          <p className="eyebrow">Your editable estimate</p>
          <h2>{KRW.format(r.total)} for the party</h2>
          <p>
            {KRW.format(r.perPerson)} per traveler, rounded up. {r.assumptions.travelers} travelers,{' '}
            {r.assumptions.rooms} rooms, {r.assumptions.nights} nights, {r.assumptions.days} days.
          </p>
          <ToolResultShare
            slug="trip-budget"
            title={`My Korea budget: ${KRW.format(r.total)}`}
            summary={`${r.assumptions.travelers} travelers · ${r.assumptions.days} days · ${r.assumptions.nights} nights · ${r.assumptions.rooms} rooms. Editable hypothetical inputs, not live quotes.`}
            facts={[
              `${KRW.format(r.assumptions.roomNight)} per room/night; ${KRW.format(r.assumptions.foodDay)} food per person/day.`,
              `${r.assumptions.bufferPercent}% contingency. Flights, insurance and shopping excluded unless entered under other costs.`,
            ]}
          />
          <dl className="cost-list">
            {(
              ['accommodation', 'food', 'transport', 'activities', 'oneOff', 'buffer'] as const
            ).map((key) => (
              <div key={key}>
                <dt>
                  {key === 'oneOff'
                    ? 'Other trip costs'
                    : key === 'buffer'
                      ? 'Contingency'
                      : key.charAt(0).toUpperCase() + key.slice(1)}
                </dt>
                <dd>{KRW.format(r[key])}</dd>
              </div>
            ))}
          </dl>
          <p>
            Rooms × nights for accommodation; travelers × days for daily spending. This is not a
            forecast or a booking quote.
          </p>
          <button className="action-button no-print" onClick={() => window.print()}>
            Print / PDF
          </button>
        </section>
      ) : null}
    </>
  );
}
function Airport() {
  const [v, setV] = useState<AirportInput>({
    terminal: 'T1',
    readyTime: '17:00',
    area: 'central',
    people: 2,
    bags: 2,
    stepFree: false,
  });
  const [r, setR] = useState<ReturnType<typeof airportOptions>>(),
    [error, setError] = useState('');
  return (
    <>
      <form
        className="tool-form"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            setR(airportOptions(v));
            setError('');
            track('tool_complete', { tool: 'airport-transfer' });
          } catch (e) {
            setError((e as Error).message);
          }
        }}
      >
        <Select
          name="terminal"
          label="Arrival terminal"
          value={v.terminal}
          set={(terminal) => setV({ ...v, terminal: terminal as 'T1' | 'T2' })}
          options={[
            ['T1', 'Incheon Terminal 1'],
            ['T2', 'Incheon Terminal 2'],
          ]}
        />
        <label className="field" htmlFor="ready">
          <span>Ready to leave terminal (Korea time)</span>
          <input
            id="ready"
            required
            type="time"
            value={v.readyTime}
            onInput={(e) => {
              const readyTime = e.currentTarget.value;
              setV((current) => ({ ...current, readyTime }));
            }}
          />
        </label>
        <Select
          name="area"
          label="Hotel area"
          value={v.area}
          set={(area) => setV({ ...v, area: area as AirportInput['area'] })}
          options={[
            ['central', 'Central Seoul / Seoul Station'],
            ['hongdae', 'Hongdae'],
            ['gangnam', 'Gangnam'],
            ['other', 'Another area — verify address'],
          ]}
        />
        <NumberField
          name="party"
          label="Travelers"
          value={v.people}
          set={(people) => setV({ ...v, people })}
          min={1}
          max={15}
        />
        <NumberField
          name="bags"
          label="Large bags"
          value={v.bags}
          set={(bags) => setV({ ...v, bags })}
          max={30}
        />
        <label className="check-field">
          <input
            type="checkbox"
            checked={v.stepFree}
            onChange={(e) => setV({ ...v, stepFree: e.target.checked })}
          />
          Step-free access or minimal changes matter
        </label>
        <p className="field-note">
          Use a time after immigration and baggage collection, not landing. No live departures or
          guaranteed accessibility.
        </p>
        <button className="button" type="submit">
          Find what to check first
        </button>
        {error ? <p role="alert">{error}</p> : null}
      </form>
      {r ? (
        <section className="tool-result" aria-live="polite">
          <p className="eyebrow">A decision shortlist</p>
          <h2>
            {r.late
              ? 'Start with a confirmed late-arrival fallback.'
              : 'Compare the whole trip to the hotel door.'}
          </h2>
          <div className="decision-options">
            {r.options.map((o, i) => (
              <div key={o.id}>
                <span className="eyebrow">Check {i + 1}</span>
                <h3>{o.title}</h3>
                <p>{o.fit}</p>
                <p>
                  <strong>Verify:</strong> {o.verify}
                </p>
              </div>
            ))}
          </div>
          <ul>
            {r.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <ToolResultShare
            slug="airport-transfer"
            title="My Incheon arrival shortlist"
            summary={`${r.assumptions.terminal} · ready ${r.assumptions.readyTime} Korea time · ${r.assumptions.people} travelers · ${r.assumptions.bags} large bags · ${r.assumptions.area} hotel area.`}
            facts={[
              r.options[0].title,
              'Verify the terminal timetable, final hotel connection, capacity and current fare. No live departure guarantee.',
            ]}
          />
        </section>
      ) : null}
      <aside className="source-box">
        <h2>Confirm with the operator</h2>
        <p>The last onward connection can be earlier than the airport train’s last departure.</p>
        <p>
          <a
            href="https://airinfo.airport.kr/ap_en/1499/subview.do"
            target="_blank"
            rel="noopener noreferrer"
          >
            Incheon Airport transport ↗
          </a>{' '}
          ·{' '}
          <a
            href="https://airport.kr/ap_en/1515/subview.do"
            target="_blank"
            rel="noopener noreferrer"
          >
            Official airport taxis ↗
          </a>
        </p>
        <p>Checked October 30, 2026. Confirm capacity, fares, tolls and nighttime conditions.</p>
      </aside>
    </>
  );
}
type Stop = { id: string; day: number; time: string; place: string; address: string; note: string };
function Itinerary() {
  const [items, setItems] = useState<Stop[]>([]),
    [loaded, setLoaded] = useState(false),
    [status, setStatus] = useState(''),
    [day, setDay] = useState(1),
    [time, setTime] = useState('10:00'),
    [place, setPlace] = useState(''),
    [address, setAddress] = useState(''),
    [note, setNote] = useState('');
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('ke-itinerary-v1') || '[]');
      if (Array.isArray(p))
        setItems(
          p
            .filter(
              (x) =>
                typeof x.id === 'string' &&
                Number.isInteger(x.day) &&
                x.day >= 1 &&
                x.day <= 90 &&
                typeof x.place === 'string' &&
                typeof x.time === 'string' &&
                typeof x.address === 'string' &&
                typeof x.note === 'string',
            )
            .slice(0, 150),
        );
    } catch {
      setStatus('The previous browser plan could not be read.');
    }
    setLoaded(true);
  }, []);
  function save(next: Stop[]) {
    setItems(next);
    try {
      localStorage.setItem('ke-itinerary-v1', JSON.stringify(next));
      setStatus('Saved on this browser.');
    } catch {
      setStatus('Storage unavailable. Download a backup before leaving.');
    }
  }
  const sorted = [...items].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
  function download() {
    const blob = new Blob([JSON.stringify({ version: 1, items: sorted }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob),
      a = document.createElement('a');
    a.href = url;
    a.download = 'korea-trip-plan-private.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <aside className="answer-box">
        <strong>Private, saved in this browser.</strong>
        <p>
          No account or public link is created. Avoid passport numbers, booking codes and sensitive
          details. Download a backup before clearing browser data.
        </p>
      </aside>
      <form
        className="tool-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (items.length >= 150) {
            setStatus('Up to 150 stops; remove one first.');
            return;
          }
          save([
            ...items,
            {
              id: crypto.randomUUID(),
              day,
              time,
              place: place.trim(),
              address: address.trim(),
              note: note.trim(),
            },
          ]);
          setPlace('');
          setAddress('');
          setNote('');
          track('tool_complete', { tool: 'itinerary' });
        }}
      >
        <NumberField name="day" label="Trip day" value={day} set={setDay} min={1} max={90} />
        <label className="field" htmlFor="stop-time">
          <span>Planned arrival</span>
          <input
            id="stop-time"
            type="time"
            value={time}
            required
            onInput={(e) => setTime(e.currentTarget.value)}
          />
        </label>
        <label className="field" htmlFor="place">
          <span>Place</span>
          <input
            id="place"
            value={place}
            maxLength={120}
            required
            onChange={(e) => setPlace(e.target.value)}
          />
        </label>
        <label className="field" htmlFor="address">
          <span>Korean address / map search</span>
          <input
            id="address"
            value={address}
            maxLength={250}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <label className="field field-wide" htmlFor="note">
          <span>Reservation / opening / transfer reminder</span>
          <textarea
            id="note"
            value={note}
            maxLength={1000}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
        </label>
        <button className="button" disabled={!loaded} type="submit">
          Add stop & save locally
        </button>
      </form>
      <section className="tool-result">
        <div className="section-heading">
          <h2>Your trip board</h2>
          <div className="button-row no-print">
            <button className="action-button" onClick={() => window.print()}>
              Print / PDF
            </button>
            <button className="action-button" onClick={download}>
              Download backup
            </button>
            {community.enabled ? (
              <button
                className="action-button"
                onClick={async () => {
                  try {
                    const r = await fetch('/api/plans', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        title: 'My Korea trip board',
                        data: { items: sorted },
                      }),
                    });
                    if (!r.ok)
                      throw new Error(
                        r.status === 401
                          ? 'Sign in on the community account page, then save again.'
                          : 'Your account copy could not be saved.',
                      );
                    setStatus(
                      'Saved as a private account plan. Manage or share it from your account page.',
                    );
                  } catch (e) {
                    setStatus((e as Error).message);
                  }
                }}
              >
                Save private account copy
              </button>
            ) : null}
          </div>
        </div>
        {!sorted.length ? (
          <p>Add a stop. Leave time for meals, travel and a weather alternative.</p>
        ) : (
          <ol className="itinerary-list">
            {sorted.map((i) => (
              <li key={i.id}>
                <p className="eyebrow">
                  Day {i.day} · {i.time}
                </p>
                <h3>{i.place}</h3>
                {i.address ? <p lang="ko">{i.address}</p> : null}
                <p className="preserve-lines">{i.note}</p>
                <div className="button-row no-print">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://map.naver.com/p/search/${encodeURIComponent(i.address || i.place)}`}
                  >
                    Check location & route ↗
                  </a>
                  <button
                    className="action-button"
                    onClick={() => save(items.filter((x) => x.id !== i.id))}
                  >
                    Remove stop
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}
        <p className="map-notice">
          Times are your notes, not a validated route. Verify openings, reservations, travel time
          and entrances.{' '}
          {community.enabled ? (
            <Link href="/community/account">
              Manage private account copies and revocable sharing links ↗
            </Link>
          ) : (
            'Account sync and public sharing await verified privacy controls.'
          )}
        </p>
        <p role="status">{status}</p>
        {sorted.length ? (
          <ShareActions
            id="trip-board"
            title="My Korea trip route"
            url="https://koreaexperience.com/tools/itinerary"
            summary="Personal planning notes. The link opens the planner; it does not publish or reveal this private board."
            facts={sorted
              .slice(0, 3)
              .map(
                (i) => `Day ${i.day} · ${i.time} · ${i.place}. Confirm openings and travel time.`,
              )}
            category="Your itinerary"
          />
        ) : null}
      </section>
    </>
  );
}
function Packing() {
  const [month, setMonth] = useState(11),
    [needs, setNeeds] = useState({ children: false, dietary: false, accessibility: false }),
    [done, setDone] = useState<string[]>([]);
  const r = preparationChecklist(month, needs);
  return (
    <>
      <div className="tool-form">
        <Select
          name="month"
          label="Visit month"
          value={String(month)}
          set={(v) => {
            setMonth(Number(v));
            setDone([]);
            track('tool_complete', { tool: 'packing-checklist' });
          }}
          options={Array.from({ length: 12 }, (_, i) => [
            String(i + 1),
            new Intl.DateTimeFormat('en', { month: 'long', timeZone: 'UTC' }).format(
              new Date(Date.UTC(2026, i, 1)),
            ),
          ])}
        />
        {(['children', 'dietary', 'accessibility'] as const).map((key) => (
          <label className="check-field" key={key}>
            <input
              type="checkbox"
              checked={needs[key]}
              onChange={(e) => setNeeds({ ...needs, [key]: e.target.checked })}
            />
            {key === 'children'
              ? 'Traveling with children'
              : key === 'dietary'
                ? 'Dietary requirements'
                : 'Accessibility planning'}
          </label>
        ))}
      </div>
      <section className="tool-result">
        <p className="eyebrow">Adapted to your month</p>
        <h2>
          {done.filter((id) => r.items.some((i) => i.id === id)).length} of {r.items.length}{' '}
          complete
        </h2>
        <ul className="checklist">
          {r.items.map((i) => (
            <li key={i.id}>
              <label>
                <input
                  type="checkbox"
                  checked={done.includes(i.id)}
                  onChange={(e) =>
                    setDone(e.target.checked ? [...done, i.id] : done.filter((x) => x !== i.id))
                  }
                />
                <span>
                  <small>{i.group}</small>
                  {i.text}
                </span>
              </label>
            </li>
          ))}
        </ul>
        <p>
          Checks reset when you leave. Print a copy to keep it. Entry conditions depend on
          nationality, purpose and date.
        </p>
        <button className="action-button no-print" onClick={() => window.print()}>
          Print checklist / PDF
        </button>
        <p>
          <a href="https://www.visa.go.kr/" target="_blank" rel="noopener noreferrer">
            Korea Visa Portal ↗
          </a>{' '}
          ·{' '}
          <a href="https://www.weather.go.kr/eng/" target="_blank" rel="noopener noreferrer">
            Korea Meteorological Administration ↗
          </a>
        </p>
        <ToolResultShare
          slug="packing-checklist"
          title="My Korea visit-month checklist"
          summary={`Month ${month} · ${needs.children ? 'with children · ' : ''}${needs.dietary ? 'dietary preparation · ' : ''}${needs.accessibility ? 'accessibility preparation · ' : ''}${r.season} planning.`}
          facts={[
            r.items.find((i) => i.group === 'Seasonal packing')!.text,
            'Confirm passport-specific entry requirements and the actual trip-date forecast.',
          ]}
        />
      </section>
    </>
  );
}
function Rain({ places }: { places: Place[] }) {
  const [region, setRegion] = useState('central'),
    [interest, setInterest] = useState('museum');
  const ids =
    interest === 'museum'
      ? region === 'central'
        ? ['seoul-craft-museum']
        : ['national-museum-korea']
      : ['gwangjang-market'];
  return (
    <>
      <div className="tool-form">
        <Select
          name="rain-region"
          label="Seoul base / preferred area"
          value={region}
          set={(v) => {
            setRegion(v);
            track('tool_complete', { tool: 'rainy-day' });
          }}
          options={[
            ['central', 'Jongno / palace area'],
            ['other', 'Elsewhere — comfortable making a transfer'],
          ]}
        />
        <Select
          name="rain-interest"
          label="Priority"
          value={interest}
          set={setInterest}
          options={[
            ['museum', 'Museums & craft'],
            ['market', 'Market food — partly sheltered'],
          ]}
        />
      </div>
      <section className="tool-result">
        <p className="eyebrow">One main anchor</p>
        <h2>
          {interest === 'museum'
            ? region === 'central'
              ? 'Craft museum + a nearby café'
              : 'National museum + a flexible indoor break'
            : 'Gwangjang Market + a short food stop'}
        </h2>
        <p>
          {interest === 'museum'
            ? 'Confirm opening days and exhibition reservations. Give the main museum a generous block, choose a nearby meal, and keep a second stop optional.'
            : 'Markets are not fully weatherproof. Check covered approaches, slippery surfaces and stall openings. Choose a museum during severe weather.'}
        </p>
        <ol>
          <li>Check weather advisories, hours and closures before leaving.</li>
          <li>Confirm the exact entrance and least exposed walk in a local map.</li>
          <li>Choose a nearby meal; avoid crossing the city for a second reservation.</li>
          <li>If conditions are unsafe, stay near your accommodation.</li>
        </ol>
        <p className="map-notice">
          A small checked Seoul collection, not live availability. Confirm accessibility and
          exhibition fees.
        </p>
      </section>
      <PlaceMap places={places.filter((p) => ids.includes(p.id))} />
      <ToolResultShare
        slug="rainy-day"
        title="My Seoul rain-plan anchor"
        summary={
          interest === 'market'
            ? 'Gwangjang Market, a partly sheltered food option.'
            : region === 'central'
              ? 'Craft Museum near Anguk, plus a nearby meal.'
              : 'National Museum in Yongsan, plus a nearby meal.'
        }
        facts={[
          'Check closures, reservations and the exact entrance before leaving.',
          'Indoor destinations still have outdoor approaches. Postpone sightseeing in unsafe weather.',
        ]}
      />
    </>
  );
}
export default function TravelTool({ slug, title, description, places }: Props) {
  const started = useRef(false);
  useEffect(() => {
    started.current = false;
  }, [slug]);
  return (
    <div className="wrap tool-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/tools">Travel tools</Link>
        <span>/</span>
        <span>{title}</span>
      </nav>
      <header className="page-intro">
        <p className="eyebrow">A practical travel decision</p>
        <h1 className="section-title">{title}</h1>
        <p>{description}</p>
      </header>
      <div
        className="tool-workspace"
        onFocusCapture={() => {
          if (!started.current) {
            started.current = true;
            track('tool_start', { tool: slug });
          }
        }}
      >
        {slug === 'airport-transfer' ? (
          <Airport />
        ) : slug === 'transit-pass' ? (
          <Pass />
        ) : slug === 'trip-budget' ? (
          <Budget />
        ) : slug === 'itinerary' ? (
          <Itinerary />
        ) : slug === 'packing-checklist' ? (
          <Packing />
        ) : (
          <Rain places={places} />
        )}
      </div>
      <aside className="tool-footnote">
        <p>
          Core tools work without signing in. Estimates and checklists are planning aids. Operators
          provide current rules and availability. These pages contain no advertising.
        </p>
        <Link href="/editorial-policy">How we check information ↗</Link>
      </aside>
    </div>
  );
}
