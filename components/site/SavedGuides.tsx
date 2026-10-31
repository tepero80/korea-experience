'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { mergeAccountSaves, readSaved, writeSaved, type SavedGuide } from '@/lib/saved';
import community from '@/data/community-config.json';
interface Catalog {
  id: string;
  slug: string;
  title: string;
  category: string;
}
export default function SavedGuides() {
  const [items, setItems] = useState<SavedGuide[]>([]);
  const [catalog, setCatalog] = useState<Catalog[] | null>(null);
  const [removed, setRemoved] = useState<SavedGuide | null>(null);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => {
      setItems(readSaved());
      setReady(true);
    };
    sync();
    window.addEventListener('ke-saved-change', sync);
    window.addEventListener('storage', sync);
    const controller = new AbortController();
    void fetch('/content-catalog.json', { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Invalid catalog');
        setCatalog(data);
      })
      .catch((e) => {
        if (e.name !== 'AbortError')
          setError(
            'Current guide details could not be checked. Your saved list is still on this browser.',
          );
      });
    return () => {
      controller.abort();
      window.removeEventListener('ke-saved-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  useEffect(() => {
    if (!community.enabled || !catalog) return;
    let live = true;
    void fetch('/api/saved')
      .then(async (r) => {
        if (r.status === 401) return null;
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (!live || !data) return;
        if (!Array.isArray(data.items)) throw new Error('Invalid account saves');
        writeSaved(
          mergeAccountSaves(
            readSaved(),
            data.items.map((item: { guide_id?: unknown }) => item?.guide_id),
            catalog,
            new Date().toISOString(),
          ),
        );
      })
      .catch(() => {
        if (live) setError('Account sync is unavailable. Your browser list still works.');
      });
    return () => {
      live = false;
    };
  }, [catalog]);
  function remove(item: SavedGuide) {
    try {
      writeSaved(items.filter((i) => i.id !== item.id));
      setRemoved(item);
      setError('');
      if (community.enabled)
        void fetch('/api/saved/' + encodeURIComponent(item.id), {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        })
          .then((r) => {
            if (!r.ok && r.status !== 401)
              setError('Removed locally; account removal could not be confirmed.');
          })
          .catch(() => setError('Removed locally; account sync is unavailable.'));
    } catch {
      setError('Could not update browser storage.');
    }
  }
  function undo() {
    if (!removed) return;
    try {
      writeSaved([...readSaved().filter((i) => i.id !== removed.id), removed]);
      if (community.enabled)
        void fetch('/api/saved/' + encodeURIComponent(removed.id), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        })
          .then((r) => {
            if (!r.ok)
              setError('Restored on this browser; account restoration could not be confirmed.');
          })
          .catch(() => setError('Restored locally; account sync is unavailable.'));
      setRemoved(null);
    } catch {
      setError('Could not restore browser storage.');
    }
  }
  return (
    <>
      <aside className="answer-box">
        <p>
          <strong>Saved on this browser.</strong> No account is required. Clearing this browser’s
          storage removes this list. Your trip board is saved separately.
        </p>
        <Link href="/tools/itinerary" className="text-link">
          Open your trip board ↗
        </Link>
      </aside>
      {error ? <p role="status">{error}</p> : null}
      {removed ? (
        <p role="status" className="inline-message">
          Removed “{removed.title}”. <button onClick={undo}>Undo</button>
        </p>
      ) : null}
      {!ready ? (
        <p>Loading your saved guides…</p>
      ) : !items.length ? (
        <div className="empty-state">
          <h2>A little collection for your trip.</h2>
          <p>Use “Save guide” on any article to keep it here.</p>
          <Link href="/blog" className="button button-dark">
            Explore the guides ↗
          </Link>
        </div>
      ) : (
        <ul className="saved-list">
          {items.map((item) => {
            const current = catalog?.find((c) => c.id === item.id);
            const available = catalog === null ? !item.unavailable : Boolean(current);
            return (
              <li key={item.id}>
                <div>
                  <span className="eyebrow">{current?.category || item.category}</span>
                  {available ? (
                    <Link href={`/blog/${current?.slug || item.slug}`}>
                      <h2>{current?.title || item.title} ↗</h2>
                    </Link>
                  ) : (
                    <>
                      <h2>{item.title}</h2>
                      <p>
                        This guide is no longer published.{' '}
                        <Link href="/blog">Find a current alternative.</Link>
                      </p>
                    </>
                  )}
                </div>
                <button className="action-button" onClick={() => remove(item)}>
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
