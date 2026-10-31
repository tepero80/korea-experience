'use client';
import { useState, type ComponentType } from 'react';
type HelperSlug = 'airport-transfer' | 'packing-checklist' | 'rainy-day';
const labels: Record<HelperSlug, { title: string; description: string }> = {
  'airport-transfer': {
    title: 'Check your arrival options',
    description:
      'Use your terminal-exit time, party and luggage to identify what to check with the operator.',
  },
  'packing-checklist': {
    title: 'Make a checklist for your visit month',
    description:
      'Adapt the reminders to children, dietary needs and accessibility, then keep your progress in this browser.',
  },
  'rainy-day': {
    title: 'Choose a weather backup',
    description:
      'Compare a small set of indoor anchors by area and interest. Confirm the actual visit date and route.',
  },
};
export default function TripHelper({ tool }: { tool: HelperSlug }) {
  const [Widget, setWidget] = useState<ComponentType<{ slug: HelperSlug }> | null>(null),
    [loading, setLoading] = useState(false),
    [error, setError] = useState('');
  const label = labels[tool];
  if (!label) return null;
  return (
    <aside className="context-helper" aria-label={label.title}>
      <h3>{label.title}</h3>
      <p>{label.description}</p>
      {Widget ? (
        <Widget slug={tool} />
      ) : (
        <button
          className="action-button"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setError('');
            try {
              const module = await import('./TravelTool');
              setWidget(() => module.ContextTravelTool);
            } catch {
              setError(
                'The helper could not load. The guide and official links remain available. Try again.',
              );
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? 'Loading helper…' : 'Open this planning helper'}
        </button>
      )}
      {error ? <p role="status">{error}</p> : null}
    </aside>
  );
}
