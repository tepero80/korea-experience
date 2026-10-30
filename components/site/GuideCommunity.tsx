'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import config from '@/data/community-config.json';
type Comment = { id: string; body: string; name: string | null; created_at: string };
declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      remove: (id: string) => void;
      reset: (id: string) => void;
    };
  }
}
export default function GuideCommunity({ id }: { id: string }) {
  const [items, setItems] = useState<Comment[]>([]),
    [signed, setSigned] = useState(false),
    [count, setCount] = useState(0),
    [liked, setLiked] = useState(false),
    [body, setBody] = useState(''),
    [status, setStatus] = useState(''),
    [token, setToken] = useState(''),
    [key, setKey] = useState('');
  const box = useRef<HTMLDivElement>(null),
    widget = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!config.enabled) return;
    let live = true;
    void Promise.all([
      fetch('/api/community?guide=' + encodeURIComponent(id)).then((r) =>
        r.ok ? r.json() : Promise.reject(),
      ),
      fetch('/api/reactions/' + encodeURIComponent(id)).then((r) =>
        r.ok ? r.json() : Promise.reject(),
      ),
      fetch('/api/me').then((r) => r.ok),
      fetch('/api/config').then((r) => (r.ok ? r.json() : Promise.reject())),
    ])
      .then(([comments, reactions, me, settings]) => {
        if (!live) return;
        setItems(comments.items);
        setCount(reactions.count);
        setLiked(reactions.mine === true);
        setSigned(me);
        setKey(settings.turnstileSiteKey);
      })
      .catch(() => {
        if (live) setStatus('Community is temporarily unavailable. The guide remains available.');
      });
    return () => {
      live = false;
    };
  }, [id]);
  useEffect(() => {
    if (!signed || !key || !box.current) return;
    let tries = 0,
      removed = false;
    function render() {
      if (removed || !box.current) return;
      if (window.turnstile) {
        widget.current = window.turnstile.render(box.current, {
          sitekey: key,
          size: box.current.clientWidth < 300 ? 'compact' : 'normal',
          callback: (value: string) => setToken(value),
          'expired-callback': () => setToken(''),
          'error-callback': () =>
            setStatus('The anti-spam check could not load. Try the community page.'),
        });
        return;
      }
      if (++tries < 40) setTimeout(render, 250);
    }
    if (!document.getElementById('ke-turnstile')) {
      const script = document.createElement('script');
      script.id = 'ke-turnstile';
      script.async = true;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      document.head.append(script);
    }
    render();
    return () => {
      removed = true;
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
    };
  }, [signed, key]);
  if (!config.enabled) return null;
  async function helpful() {
    try {
      const r = await fetch('/api/reactions/' + encodeURIComponent(id), {
        method: liked ? 'DELETE' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      if (!r.ok)
        throw Error(
          r.status === 401
            ? 'Sign in to mark a guide helpful.'
            : 'The reaction could not be saved.',
        );
      setLiked(!liked);
      setCount((n) => Math.max(0, n + (liked ? -1 : 1)));
      setStatus(liked ? 'Helpful mark removed.' : 'Marked helpful.');
    } catch (e) {
      setStatus((e as Error).message);
    }
  }
  return (
    <section className="guide-discussion no-print">
      <p className="eyebrow">Questions & useful updates</p>
      <h2>What would help your trip?</h2>
      <button className="action-button" onClick={helpful} aria-pressed={liked}>
        {liked ? 'Marked helpful' : 'This helped me'} · {count}
      </button>
      {items.length ? (
        <ol className="discussion-list">
          {items.map((c) => (
            <li key={c.id}>
              <p className="preserve-lines">{c.body}</p>
              <small>
                {c.name || 'Former traveler'} · {c.created_at.slice(0, 10)}
              </small>
              <Link href={`/community/posts/${c.id}`}>Reply or report ↗</Link>
            </li>
          ))}
        </ol>
      ) : (
        <p>No reviewed questions yet. Share a specific question or a dated correction.</p>
      )}
      {signed ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const r = await fetch('/api/contributions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kind: 'comment', guideId: id, body, turnstileToken: token }),
              });
              const result = await r.json();
              if (!r.ok) throw Error(result.error || 'The comment could not be submitted.');
              setBody('');
              setStatus('Received for review. Your comment will appear after moderation.');
            } catch (e) {
              setStatus((e as Error).message);
            } finally {
              setToken('');
              if (widget.current) window.turnstile?.reset(widget.current);
            }
          }}
        >
          <label className="field" htmlFor="guide-comment">
            <span>Your question or update</span>
            <textarea
              id="guide-comment"
              rows={5}
              required
              minLength={10}
              maxLength={5000}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </label>
          <p className="map-notice">
            Include travel dates and the useful detail. Avoid personal documents, contact details or
            booking codes. Comments and edits require review.
          </p>
          <div ref={box} />
          <button className="button" type="submit" disabled={!token}>
            Send for review
          </button>
        </form>
      ) : (
        <p>
          <Link className="button button-light" href="/community/account">
            Sign in with Google or email
          </Link>
        </p>
      )}
      <p role="status">{status}</p>
    </section>
  );
}
