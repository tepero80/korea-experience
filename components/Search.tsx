'use client';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import Icon from './site/Icon';
import { track } from '@/lib/analytics';
import { searchIntent } from '@/lib/search-intents';
import { findGuideMatches, guideQueryTerms, indexGuides, type SearchGuide } from '@/lib/guide-search';

let guideIndex: Promise<ReturnType<typeof indexGuides>> | undefined;

function loadGuideIndex() {
  guideIndex ??= fetch('/search-index.json')
    .then(async (response) => {
      if (!response.ok) throw new Error('Search unavailable');
      const guides: SearchGuide[] = await response.json();
      return indexGuides(guides);
    })
    .catch((error: unknown) => {
      guideIndex = undefined;
      throw error;
    });
  return guideIndex;
}

export default function Search({ variant = 'icon' }: { variant?: 'icon' | 'hero' }) {
  const inputId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const index = useRef<ReturnType<typeof indexGuides> | null>(null);
  const reported = useRef(new Set<string>());
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchGuide[]>([]);
  const [settledQuery, setSettledQuery] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const open = () => {
    dialog.current?.showModal();
    input.current?.focus();
  };
  const close = () => {
    dialog.current?.close();
    trigger.current?.focus();
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        variant === 'icon' &&
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();
        open();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [variant]);
  async function load() {
    if (index.current) return;
    setStatus('loading');
    try {
      index.current = await loadGuideIndex();
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }
  useEffect(() => {
    if (status !== 'ready') return;
    const timer = setTimeout(() => {
      const terms = guideQueryTerms(query);
      const found = findGuideMatches(index.current ?? [], query, terms);
      setResults(found);
      setSettledQuery(query);
      const intent = searchIntent(query);
      if (terms.length && !found.length && !reported.current.has(intent)) {
        if (track('search_no_results', { term_count: terms.length, intent }))
          reported.current.add(intent);
      }
    }, 160);
    return () => clearTimeout(timer);
  }, [query, status]);
  return (
    <>
      <button
        ref={trigger}
        onClick={open}
        className={variant === 'hero' ? 'home-search-trigger' : 'icon-button'}
        aria-label="Search guides"
      >
        <Icon name="search" />
        {variant === 'hero' ? (
          <>
            <span>Where do you want to go?</span>
            <span className="home-search-label">Search guides</span>
          </>
        ) : null}
      </button>
      <dialog
        ref={dialog}
        className="search-dialog"
        onCancel={() => trigger.current?.focus()}
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') close();
        }}
      >
        <div className="search-dialog-top">
          <label htmlFor={inputId}>What are you planning?</label>
          <button className="icon-button" aria-label="Close search" onClick={close}>
            <Icon name="close" />
          </button>
        </div>
        <input
          ref={input}
          id={inputId}
          name="guide-search"
          type="search"
          autoComplete="off"
          placeholder="Try airport, winter, or vegetarian…"
          value={query}
          onFocus={() => void load()}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="search-results" aria-live="polite">
          {status === 'loading' ? (
            <p>Loading guides…</p>
          ) : status === 'error' ? (
            <p>
              Search could not load.{' '}
              <Link href="/blog" onClick={close}>
                Browse the guide library
              </Link>{' '}
              or try again later.
            </p>
          ) : query.trim() && settledQuery !== query ? (
            <p>Finding matching guides…</p>
          ) : !query.trim() ? (
            <p>
              Search by question, place, or travel need. <kbd>Esc</kbd> to close.
            </p>
          ) : results.length ? (
            <ul>
              {results.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} onClick={close}>
                    <span className="eyebrow">{r.category}</span>
                    <strong>{r.title}</strong>
                    <span>{r.excerpt}</span>
                    <small>
                      {r.reviewed ? 'Reviewed guide' : 'Archive — recheck important conditions'}
                    </small>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              No matching guides yet.{' '}
              <Link href="/blog" onClick={close}>
                Explore by category
              </Link>{' '}
              or{' '}
              <Link href="/contact" onClick={close}>
                tell us what you need
              </Link>
              .
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}
