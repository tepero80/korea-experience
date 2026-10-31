'use client';
import { useEffect, useState, useId, type FormEvent } from 'react';
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
import ToolMeasurement, { useToolCompletion } from './ToolMeasurement';
import ItineraryBoard from './ItineraryBoard';
import type { Place } from '@/lib/content-types';
import PlaceMap from './PlaceMap';
import ToolResultShare from './ToolResultShare';
import {
  budgetShareUrl,
  passShareUrl,
  readBudgetShare,
  readPassShare,
  checklistShareUrl,
  readChecklistShare,
  airportShareUrl,
  readAirportShare,
  rainShareUrl,
  readRainShare,
  type RainInput,
} from '@/lib/tool-share';
import contextPlaces from '@/data/places.json';
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
  const controlId = useId();
  return (
    <div className="field">
      <label htmlFor={controlId}>{label}</label>
      <select id={controlId} name={name} value={value} onChange={(e) => set(e.target.value)}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
function Pass() {
  const complete = useToolCompletion();
  const [days, setDays] = useState(3),
    [travelers, setTravelers] = useState(1),
    [regularCardCost, setRegularCardCost] = useState(0),
    [journeys, setJourneys] = useState(8),
    [fare, setFare] = useState(1550),
    [card, setCard] = useState(true),
    [excluded, setExcluded] = useState(0),
    [result, setResult] = useState<ReturnType<typeof comparePass>>();
  const [error, setError] = useState('');
  useEffect(() => {
    try {
      const input = readPassShare(window.location.search);
      if (!input) return;
      setDays(input.days);
      setJourneys(input.journeys);
      setFare(input.averageFare);
      setCard(input.needsCard);
      setExcluded(input.uncoveredCost);
      setTravelers(input.travelers!);
      setRegularCardCost(input.regularCardCost!);
      setResult(comparePass(input));
    } catch {
      setError('Shared inputs could not be loaded. Enter your own travel conditions below.');
    }
  }, []);
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
          travelers,
          regularCardCost,
        }),
      );
      setError('');
      complete();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <>
      <aside className="source-box">
        <strong>Seoul Climate Card short passes only.</strong>
        <p>
          Count only covered Seoul routes. Busan, KTX and uncovered journeys are excluded.{' '}
          <a href={TRANSPORT_SOURCE.url} target="_blank" rel="noopener noreferrer">
            Check the official coverage before calculating ↗
          </a>
        </p>
      </aside>
      <form className="tool-form" onSubmit={submit}>
        <NumberField
          name="pass-travelers"
          label="Travelers with the same fare and travel pattern"
          value={travelers}
          set={setTravelers}
          min={1}
          max={30}
        />
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
          label="Eligible charged journeys PER TRAVELER (after transfers)"
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
          label="Other transport costs PER TRAVELER (KRW)"
          value={excluded}
          set={setExcluded}
        />
        <NumberField
          name="regular-card-cost"
          label="Pay-as-you-go card purchase PER TRAVELER (KRW; 0 if already owned)"
          value={regularCardCost}
          set={setRegularCardCost}
          max={100000}
        />
        <label className="check-field">
          <input type="checkbox" checked={card} onChange={(e) => setCard(e.target.checked)} />
          Each traveler needs a new physical Climate Card (₩3,000 each)
        </label>
        <p className="field-note">
          ₩1,550 is an editable example, not a quote for every route. Count charged journeys, not
          each vehicle after a free transfer. Enter one person’s journeys, never the combined family
          total. Each rider needs their own pass. Run a separate comparison for children or anyone
          with a different fare, route or existing card. Split any shared taxi fare between
          travelers before entering other costs. Add the actual card purchase cost to the
          pay-as-you-go option if you need one.
        </p>
        <button className="button" type="submit">
          Compare my costs
        </button>
        {error ? <p role="alert">{error}</p> : null}
      </form>
      {result ? (
        <section className="tool-result" aria-live="polite">
          {JSON.stringify({
            days,
            journeys,
            averageFare: fare,
            needsCard: card,
            uncoveredCost: excluded,
            travelers,
            regularCardCost,
          }) !== JSON.stringify(result.assumptions) ? (
            <p className="calculation-stale" role="status">
              Inputs have changed. Compare your costs again to update these results.
            </p>
          ) : null}
          <p className="eyebrow">Per traveler · {result.assumptions.journeys} journeys each</p>
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
              <dt>Eligible fares, per traveler</dt>
              <dd>{KRW.format(result.regularFareCost)}</dd>
            </div>
            <div>
              <dt>Pay-as-you-go card purchase, per traveler</dt>
              <dd>{KRW.format(result.assumptions.regularCardCost)}</dd>
            </div>
            <div>
              <dt>Pass + other transport, per traveler</dt>
              <dd>{KRW.format(result.passTripTotal)}</dd>
            </div>
            <div>
              <dt>Pay as you go + other transport, per traveler</dt>
              <dd>{KRW.format(result.regularTripTotal)}</dd>
            </div>
          </dl>
          <h3>Whole party: {result.assumptions.travelers} travelers</h3>
          <dl className="cost-list">
            <div>
              <dt>Pass option · {result.newCards} new cards included</dt>
              <dd>{KRW.format(result.groupPassTripTotal)}</dd>
            </div>
            <div>
              <dt>Pay as you go option</dt>
              <dd>{KRW.format(result.groupRegularTripTotal)}</dd>
            </div>
            <div>
              <dt>
                {result.groupSaving >= 0
                  ? 'Party saving with passes'
                  : 'Party saving with pay as you go'}
              </dt>
              <dd>{KRW.format(Math.abs(result.groupSaving))}</dd>
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
            url={passShareUrl(result.assumptions)}
            checkedAt={TRANSPORT_SOURCE.checkedAt}
            title="My Seoul transit comparison"
            summary={`${result.assumptions.travelers} travelers, ${result.assumptions.days} service days, ${result.assumptions.journeys} journeys PER TRAVELER at ${KRW.format(result.assumptions.averageFare)} each.`}
            facts={[
              `Party totals including other transport: pass option ${KRW.format(result.groupPassTripTotal)}, pay as you go ${KRW.format(result.groupRegularTripTotal)}. ${result.newCards} new cards included.`,
              `Per traveler: ${KRW.format(result.passCost)} pass/card, ${KRW.format(result.assumptions.regularCardCost)} pay-as-you-go card purchase, ${KRW.format(result.assumptions.uncoveredCost)} other transport. Verify coverage.`,
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
  const complete = useToolCompletion();
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
  const [comparison, setComparison] = useState<ReturnType<typeof calculateBudget>>();
  const [saveNote, setSaveNote] = useState('');
  useEffect(() => {
    try {
      const shared = readBudgetShare(location.search);
      if (shared) {
        setV(shared);
        setR(calculateBudget(shared));
        setSaveNote('Loaded the shared scenario. Amounts are assumptions, not live quotes.');
        return;
      }
      const saved = localStorage.getItem('ke-budget-v1');
      if (!saved) return;
      const data = JSON.parse(saved);
      if (data.version !== 1) return;
      const result = calculateBudget(data.input);
      setV(result.assumptions);
      setR(result);
      setSaveNote('Reopened your last calculation from this browser.');
    } catch {
      setSaveNote(
        'Saved or shared inputs could not be loaded. Your starting values are shown below.',
      );
    }
  }, []);
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
      <section className="budget-start" aria-labelledby="budget-start-title">
        <h2 id="budget-start-title">Start with a sample, then make it yours</h2>
        <p>
          Hypothetical spending styles, not current market prices. Flights, insurance and shopping
          are excluded unless you add them.
        </p>
        <div className="button-row">
          {[
            {
              label: 'Lean',
              roomNight: 80000,
              foodDay: 25000,
              transportDay: 10000,
              activitiesDay: 10000,
            },
            {
              label: 'Comfortable',
              roomNight: 120000,
              foodDay: 35000,
              transportDay: 10000,
              activitiesDay: 20000,
            },
            {
              label: 'More room',
              roomNight: 200000,
              foodDay: 60000,
              transportDay: 15000,
              activitiesDay: 40000,
            },
          ].map(({ label, ...costs }) => (
            <button
              type="button"
              className="action-button"
              key={label}
              onClick={() => setV((current) => ({ ...current, ...costs }))}
            >
              {label} sample
            </button>
          ))}
        </div>
      </section>
      <form
        className="tool-form"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            const result = calculateBudget(v);
            setR(result);
            setError('');
            try {
              localStorage.setItem(
                'ke-budget-v1',
                JSON.stringify({ version: 1, input: result.assumptions }),
              );
              setSaveNote('Last calculation saved in this browser.');
            } catch {
              setSaveNote(
                'Calculation complete. This browser could not save it; use Print / PDF or copy the result.',
              );
            }
            complete();
          } catch (e) {
            setError((e as Error).message);
          }
        }}
      >
        {fields.slice(0, 5).map(([key, label, min, max]) => (
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
        <p className="field-wide field-note">
          Per person/day: food {KRW.format(v.foodDay)}, transport {KRW.format(v.transportDay)},
          activities {KRW.format(v.activitiesDay)}. Other costs {KRW.format(v.oneOff)} per
          person/trip; {v.bufferPercent}% contingency. For different adult/child spending, use your
          party's per-person average or keep separate scenarios.
        </p>
        <details className="field-wide budget-assumptions">
          <summary>Adjust daily spending & contingency</summary>
          <div className="tool-form">
            {fields.slice(5).map(([key, label, min, max]) => (
              <NumberField
                key={key}
                name={key}
                label={label}
                value={v[key]}
                min={min}
                max={max}
                set={(n) => setV((current) => ({ ...current, [key]: n }))}
              />
            ))}
          </div>
        </details>
        <p className="field-note">
          Starting values are hypothetical. Replace them with actual hotel quotes and your choices.
          Add flights, insurance and shopping under other costs.
        </p>
        <button className="button" type="submit">
          Build my budget
        </button>
        {error ? <p role="alert">{error}</p> : null}
      </form>
      <p role="status">{saveNote}</p>
      {r ? (
        <section className="tool-result" aria-live="polite">
          {JSON.stringify(v) !== JSON.stringify(r.assumptions) ? (
            <p className="calculation-stale" role="status">
              Inputs have changed. Build your budget again to update these results.
            </p>
          ) : null}
          <p className="eyebrow">Your editable estimate</p>
          <h2>{KRW.format(r.total)} for the party</h2>
          <p>
            {KRW.format(r.perPerson)} per traveler, rounded up. {r.assumptions.travelers} travelers,{' '}
            {r.assumptions.rooms} {r.assumptions.rooms === 1 ? 'room' : 'rooms'},{' '}
            {r.assumptions.nights} nights, {r.assumptions.days} days.
          </p>
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
          </button>{' '}
          <button className="action-button no-print" onClick={() => setComparison(r)}>
            Keep this scenario for comparison
          </button>
          {comparison ? (
            <aside className="scenario-comparison">
              <h3>Compare your scenarios</h3>
              <p>
                Kept: {KRW.format(comparison.total)} for {comparison.assumptions.travelers}{' '}
                travelers and {comparison.assumptions.days} days. Current: {KRW.format(r.total)} for{' '}
                {r.assumptions.travelers} travelers and {r.assumptions.days} days.
              </p>
              <p>
                {KRW.format(Math.abs(r.total - comparison.total))}{' '}
                {r.total >= comparison.total ? 'more' : 'less'} in total. Compare the party size,
                rooms and trip length as well as spending levels.
              </p>
            </aside>
          ) : null}
          <ToolResultShare
            slug="trip-budget"
            url={budgetShareUrl(r.assumptions)}
            title={`My Korea budget: ${KRW.format(r.total)}`}
            summary={`${r.assumptions.travelers} travelers · ${r.assumptions.days} days · ${r.assumptions.nights} nights · ${r.assumptions.rooms} rooms. Editable hypothetical inputs, not live quotes.`}
            facts={[
              `${KRW.format(r.assumptions.roomNight)} per room/night; ${KRW.format(r.assumptions.foodDay)} food per person/day.`,
              `${r.assumptions.bufferPercent}% contingency. Flights, insurance and shopping excluded unless entered under other costs.`,
            ]}
          />
        </section>
      ) : null}
    </>
  );
}
function Airport() {
  const complete = useToolCompletion();
  const [v, setV] = useState<AirportInput>({
    terminal: 'T1',
    readyTime: '17:00',
    area: 'central',
    people: 2,
    bags: 2,
    stepFree: false,
  });
  const [calculated, setR] = useState<ReturnType<typeof airportOptions>>(),
    [error, setError] = useState('');
  useEffect(() => {
    try {
      const shared = readAirportShare(location.search);
      if (shared) {
        setV(shared);
        setR(airportOptions(shared));
      }
    } catch {
      setError('These shared arrival conditions are invalid. Enter your own conditions below.');
    }
  }, []);
  const r =
    calculated && JSON.stringify(calculated.assumptions) === JSON.stringify(v)
      ? calculated
      : undefined;
  return (
    <>
      <form
        className="tool-form"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            setR(airportOptions(v));
            setError('');
            complete();
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
          <p>
            {r.assumptions.terminal} · ready {r.assumptions.readyTime} Korea time ·{' '}
            {r.assumptions.people} travelers · {r.assumptions.bags} large bags
          </p>
          <h2>
            {r.overnight
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
            url={airportShareUrl(r.assumptions)}
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
            href={
              v.terminal === 'T1'
                ? 'https://www.airportrailroad.com/train/normal/info/100/0'
                : 'https://www.airportrailroad.com/train/normal/info/110/0'
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            AREX all-stop timetable: {v.terminal} ↗
          </a>{' '}
          ·{' '}
          <a
            href={
              v.terminal === 'T1'
                ? 'https://airport.kr/ap_en/1507/subview.do'
                : 'https://airport.kr/ap_en/1510/subview.do'
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Seoul night buses: {v.terminal} ↗
          </a>
        </p>
        <p>
          <a
            href="https://airport.kr/ap_en/1502/subview.do"
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
        <p>
          Checked October 31, 2026. Confirm capacity, fares, tolls and nighttime conditions.{' '}
          <Link href="/blog/airport-limousine-bus-vs-arex-express-train">
            Compare the complete hotel journey
          </Link>
          .
        </p>
      </aside>
    </>
  );
}
function Packing() {
  const complete = useToolCompletion();
  const [month, setMonth] = useState(11),
    [needs, setNeeds] = useState({ children: false, dietary: false, accessibility: false }),
    [done, setDone] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false),
    [storageBlocked, setStorageBlocked] = useState(false),
    [storageNote, setStorageNote] = useState('');
  useEffect(() => {
    let shared = null;
    try {
      shared = readChecklistShare(location.search);
    } catch {
      setStorageNote(
        'The shared checklist conditions are invalid. Your existing browser checklist is preserved.',
      );
      setStorageBlocked(true);
      setLoaded(true);
      return;
    }
    if (shared) {
      setMonth(shared.month);
      setNeeds({
        children: shared.children,
        dietary: shared.dietary,
        accessibility: shared.accessibility,
      });
      // Opening a shared list must not replace the owner's saved progress.
      setStorageBlocked(true);
      setStorageNote(
        'Opened shared conditions. Progress here is temporary; your saved checklist has not been replaced.',
      );
      setLoaded(true);
      return;
    }
    try {
      const raw = localStorage.getItem('ke-checklist-v1');
      if (raw) {
        const saved = JSON.parse(raw);
        if (
          saved.version !== 1 ||
          !Number.isInteger(saved.month) ||
          saved.month < 1 ||
          saved.month > 12 ||
          !saved.needs ||
          !['children', 'dietary', 'accessibility'].every(
            (k) => typeof saved.needs[k] === 'boolean',
          ) ||
          !Array.isArray(saved.done) ||
          saved.done.length > 30 ||
          !saved.done.every((id: unknown) => typeof id === 'string' && /^[a-z-]+$/.test(id))
        )
          throw Error();
        setMonth(saved.month);
        setNeeds(saved.needs);
        setDone([...new Set<string>(saved.done)]);
        setStorageNote('Reopened your checklist from this browser.');
      }
    } catch {
      setStorageBlocked(true);
      setStorageNote(
        'Your previous checklist could not be read and has been preserved. Changes on this page will not replace it.',
      );
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded || storageBlocked) return;
    try {
      localStorage.setItem('ke-checklist-v1', JSON.stringify({ version: 1, month, needs, done }));
      setStorageNote('Checklist progress saved in this browser.');
    } catch {
      setStorageNote(
        'This browser could not save the checklist. Keep a printed copy before leaving.',
      );
    }
  }, [loaded, storageBlocked, month, needs, done]);
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
      <p role="status">{storageNote}</p>
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
                  onChange={(e) => {
                    setDone(e.target.checked ? [...done, i.id] : done.filter((x) => x !== i.id));
                    if (e.target.checked) complete();
                  }}
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
          Progress is saved in this browser when storage is available. Changing the month resets the
          checks. Print a copy for another device. Entry conditions depend on nationality, purpose
          and date.
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
          url={checklistShareUrl({ month, ...needs })}
          facts={[
            r.items.find((i) => i.group === 'Seasonal packing')!.text,
            'Confirm passport-specific entry requirements and the actual trip-date forecast.',
          ]}
        />
      </section>
    </>
  );
}
function Rain({ places, embedded = false }: { places: Place[]; embedded?: boolean }) {
  const complete = useToolCompletion();
  const [region, setRegion] = useState<RainInput['region']>('central'),
    [interest, setInterest] = useState<RainInput['interest']>('museum'),
    [shareError, setShareError] = useState('');
  useEffect(() => {
    try {
      const shared = readRainShare(location.search);
      if (shared) {
        setRegion(shared.region);
        setInterest(shared.interest);
      }
    } catch {
      setShareError(
        'These shared weather-plan conditions are invalid. Choose your own area and interest.',
      );
    }
  }, []);
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
            setRegion(v as RainInput['region']);
            complete();
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
          set={(v) => {
            setInterest(v as RainInput['interest']);
            complete();
          }}
          options={[
            ['museum', 'Museums & craft'],
            ['market', 'Market food — partly sheltered'],
          ]}
        />
      </div>
      {shareError ? <p role="status">{shareError}</p> : null}
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
      <PlaceMap
        places={places.filter((p) => ids.includes(p.id))}
        id={embedded ? 'helper-weather-map' : 'places-and-map'}
      />
      <ToolResultShare
        slug="rainy-day"
        title="My Seoul rain-plan anchor"
        url={rainShareUrl({ region, interest })}
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
export function ContextTravelTool({
  slug,
}: {
  slug: 'airport-transfer' | 'packing-checklist' | 'rainy-day';
}) {
  return (
    <ToolMeasurement key={slug} tool={slug}>
      {slug === 'airport-transfer' ? (
        <Airport />
      ) : slug === 'packing-checklist' ? (
        <Packing />
      ) : (
        <Rain places={contextPlaces as Place[]} embedded />
      )}
    </ToolMeasurement>
  );
}
export default function TravelTool({ slug, title, description, places }: Props) {
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
      <ToolMeasurement key={slug} tool={slug} className="tool-workspace">
        {slug === 'airport-transfer' ? (
          <Airport />
        ) : slug === 'transit-pass' ? (
          <Pass />
        ) : slug === 'trip-budget' ? (
          <Budget />
        ) : slug === 'itinerary' ? (
          <ItineraryBoard />
        ) : slug === 'packing-checklist' ? (
          <Packing />
        ) : (
          <Rain places={places} />
        )}
      </ToolMeasurement>
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
