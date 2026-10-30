'use client';
import { useEffect, useState } from 'react';
import { readSaved, writeSaved } from '@/lib/saved';
import { track } from '@/lib/analytics';
import Icon from './Icon';
import community from '@/data/community-config.json';
export default function SaveButton({
  id,
  slug,
  title,
  category,
}: {
  id: string;
  slug: string;
  title: string;
  category: string;
}) {
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const sync = () => setSaved(readSaved().some((p) => p.id === id));
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('ke-saved-change', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('ke-saved-change', sync);
    };
  }, [id]);
  function toggle() {
    try {
      const items = readSaved();
      writeSaved(
        saved
          ? items.filter((p) => p.id !== id)
          : [...items, { id, slug, title, category, savedAt: new Date().toISOString() }],
      );
      setMessage(saved ? 'Removed from this browser.' : 'Saved in this browser.');
      track(saved ? 'guide_unsave' : 'guide_save', { content_id: id, category });
      if (community.enabled)
        void fetch('/api/saved/' + encodeURIComponent(id), {
          method: saved ? 'DELETE' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        })
          .then((r) =>
            setMessage(
              r.ok
                ? saved
                  ? 'Removed from this browser and your account.'
                  : 'Saved here and in your account.'
                : r.status === 401
                  ? 'Saved in this browser. Sign in to sync with your account.'
                  : 'Browser list updated; account sync could not be confirmed.',
            ),
          )
          .catch(() => setMessage('Browser list updated; account sync is unavailable.'));
    } catch {
      setMessage('This browser could not save the guide. Check storage permissions.');
    }
  }
  return (
    <div className="save-action">
      <button className="action-button" onClick={toggle} aria-pressed={saved}>
        <Icon name={saved ? 'check' : 'bookmark'} />
        {saved ? 'Saved' : 'Save guide'}
      </button>
      <span className="sr-only" role="status">
        {message}
      </span>
    </div>
  );
}
