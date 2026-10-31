'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import config from '@/data/community-config.json';
import { readGuideDraft, writeGuideDraft } from '@/lib/guide-drafts';
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
export default function GuideCommunity({ id, slug }: { id: string; slug: string }) {
  const [items, setItems] = useState<Comment[]>([]),
    [signed, setSigned] = useState<boolean | null>(null),
    [count, setCount] = useState(0),
    [liked, setLiked] = useState(false),
    [body, setBody] = useState(''),
    [status, setStatus] = useState(''),
    [token, setToken] = useState(''),
    [key, setKey] = useState('');
  const [active, setActive] = useState(false),
    [draftLoaded, setDraftLoaded] = useState(false),
    [draftError, setDraftError] = useState(''),
    [submitting, setSubmitting] = useState(false),
    [retry, setRetry] = useState(0),
    [dataRetry, setDataRetry] = useState(0);
  const [apiState, setApiState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle'),
    [spamError, setSpamError] = useState(false);
  const section = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null),
    widget = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!config.enabled || !section.current) return;
    if (!('IntersectionObserver' in window)) {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    try {
      setBody(readGuideDraft(localStorage, id));
    } catch {
      setDraftError('Local drafts are unavailable. Copy your text before leaving this page.');
    } finally {
      setDraftLoaded(true);
    }
  }, [id]);
  useEffect(() => {
    if (!config.enabled || !active) return;
    setApiState('loading');
    let live = true;
    void Promise.allSettled([
      fetch('/api/community?guide=' + encodeURIComponent(id)).then((r) =>
        r.ok ? r.json() : Promise.reject(),
      ),
      fetch('/api/reactions/' + encodeURIComponent(id)).then((r) =>
        r.ok ? r.json() : Promise.reject(),
      ),
      fetch('/api/me').then((r) => (r.ok ? true : r.status === 401 ? false : Promise.reject())),
      fetch('/api/config').then((r) => (r.ok ? r.json() : Promise.reject())),
    ]).then(([comments, reactions, me, settings]) => {
      if (!live) return;
      if (comments.status === 'fulfilled' && Array.isArray(comments.value.items))
        setItems(comments.value.items);
      if (reactions.status === 'fulfilled') {
        setCount(reactions.value.count);
        setLiked(reactions.value.mine === true);
      }
      setSigned(me.status === 'fulfilled' ? me.value : null);
      setKey(settings.status === 'fulfilled' ? settings.value.turnstileSiteKey : '');
      const ok = [comments, reactions, me, settings].every((r) => r.status === 'fulfilled');
      setApiState(ok ? 'ready' : 'error');
      if (!ok)
        setStatus(
          'Some community features are temporarily unavailable. Retry below; your draft stays in this browser.',
        );
      else if (dataRetry > 0) setStatus('Community reconnected. Your text is still here.');
    });
    return () => {
      live = false;
    };
  }, [id, active, dataRetry]);
  useEffect(() => {
    if (!signed || !key || !box.current) return;
    let tries = 0,
      removed = false;
    function render() {
      if (removed || !box.current) return;
      if (window.turnstile) {
        try {
          widget.current = window.turnstile.render(box.current, {
            sitekey: key,
            size: box.current.clientWidth < 300 ? 'compact' : 'normal',
            callback: (value: string) => {
              setToken(value);
              setSpamError(false);
            },
            'expired-callback': () => setToken(''),
            'error-callback': () => {
              setToken('');
              setSpamError(true);
              setStatus(
                'The anti-spam check could not load. Retry the check, or return later. Your draft stays in this browser.',
              );
            },
          });
        } catch {
          setSpamError(true);
          setStatus('The anti-spam check could not start. Retry the check or return later.');
        }
        return;
      }
      if (++tries < 40) setTimeout(render, 250);
      else {
        setSpamError(true);
        setStatus('The anti-spam check could not load. Retry the check, or return later.');
      }
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
      try {
        if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      } catch {}
      widget.current = undefined;
    };
  }, [signed, key, retry]);
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
    <section className="guide-discussion no-print" id="discussion" ref={section}>
      <p className="eyebrow">Questions & useful updates</p>
      <h2>What would help your trip?</h2>
      {apiState === 'error' ? (
        <button type="button" className="action-button" onClick={() => setDataRetry((n) => n + 1)}>
          Retry community
        </button>
      ) : null}
      <button
        className="action-button"
        onClick={helpful}
        aria-pressed={liked}
        disabled={apiState !== 'ready'}
      >
        {liked ? 'Marked helpful' : 'This helped me'}
        {apiState === 'ready' ? ` · ${count}` : ''}
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
        <p>
          {apiState === 'ready'
            ? 'No reviewed questions yet. Share a specific question or a dated correction.'
            : apiState === 'loading'
              ? 'Loading reviewed questions…'
              : 'Questions and updates appear here after review.'}
        </p>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!signed || !token || submitting) return;
          setSubmitting(true);
          try {
            const r = await fetch('/api/contributions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ kind: 'comment', guideId: id, body, turnstileToken: token }),
            });
            const result = await r.json();
            if (!r.ok)
              throw Error(
                typeof result.error === 'string'
                  ? result.error
                  : result.error?.message || 'The comment could not be submitted.',
              );
            setBody('');
            try {
              writeGuideDraft(localStorage, id, '');
            } catch {}
            setStatus('Received for review. Your comment will appear after moderation.');
          } catch (e) {
            setStatus((e as Error).message);
          } finally {
            setToken('');
            setSubmitting(false);
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
            onChange={(e) => {
              setBody(e.target.value);
              try {
                writeGuideDraft(localStorage, id, e.target.value);
              } catch {
                setDraftError('Draft could not be saved here. Copy your text before signing in.');
              }
            }}
            disabled={!draftLoaded}
          />
        </label>
        {draftError ? <p role="alert">{draftError}</p> : null}
        <p className="map-notice">
          Include travel dates and the useful detail. Avoid personal documents, contact details or
          booking codes. Comments and edits require review.
        </p>
        <p className="map-notice">
          Up to 20 drafts stay on this browser for 7 days. An email link opened on another device
          cannot restore this draft.
        </p>
        {signed ? (
          <>
            <div ref={box} />
            <button className="button" type="submit" disabled={!token || submitting}>
              {submitting ? 'Sending…' : 'Send for review'}
            </button>
            {spamError ? (
              <button
                type="button"
                className="action-button"
                onClick={() => {
                  setToken('');
                  setSpamError(false);
                  setRetry((n) => n + 1);
                  setStatus('Retrying the anti-spam check…');
                }}
              >
                Retry anti-spam check
              </button>
            ) : null}
          </>
        ) : signed === false ? (
          <Link
            className="button button-light"
            href={`/community/account?returnTo=${encodeURIComponent('/blog/' + slug + '#discussion')}`}
            onClick={(e) => {
              try {
                writeGuideDraft(localStorage, id, body);
              } catch {
                e.preventDefault();
                setDraftError(
                  'Copy your text before leaving. This browser could not save the draft.',
                );
              }
            }}
          >
            Save draft & sign in with Google or email
          </Link>
        ) : (
          <p role="status">
            {apiState === 'loading'
              ? 'Checking sign-in…'
              : 'Sign-in status is unavailable. Retry community before signing in or sending your draft.'}
          </p>
        )}
        {body ? (
          <button
            type="button"
            className="action-button"
            onClick={() => {
              if (!confirm('Discard this local draft?')) return;
              try {
                writeGuideDraft(localStorage, id, '');
                setBody('');
                setStatus('Draft discarded.');
              } catch {
                setStatus('Draft could not be removed from browser storage.');
              }
            }}
          >
            Discard draft
          </button>
        ) : null}
      </form>
      <p role="status">{status}</p>
    </section>
  );
}
