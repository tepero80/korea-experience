import Link from 'next/link';
import { PRIMARY_TRAVEL_TOOLS, LEGACY_TOOLS } from '@/lib/constants';
import { TOOL_REVIEWS } from '@/lib/tool-review';
import { toolMetadata } from '@/lib/seo';
import { TOOLKIT_PREVIEW } from '@/lib/tool-preview';
export const metadata = toolMetadata(TOOLKIT_PREVIEW);
export default function Tools() {
  return (
    <div className="wrap library-page">
      <header className="page-intro">
        <p className="eyebrow">From reading to doing</p>
        <h1 className="section-title">
          Make your next
          <br />
          <em>travel decision.</em>
        </h1>
        <p>Useful planning tools with clear assumptions. No account needed to begin.</p>
      </header>
      <div className="tools-grid">
        {PRIMARY_TRAVEL_TOOLS.map((t, i) => (
          <Link className="tool-card" href={t.href} key={t.href}>
            <span className="eyebrow">0{i + 1}</span>
            <h2>{t.title} ↗</h2>
            <p>{t.description}</p>
          </Link>
        ))}
      </div>
      <aside className="answer-box">
        <h2>Keep the final check with the operator.</h2>
        <p>
          Estimates are editable. Routes, admissions and tickets need current confirmation; these
          tools do not show live inventory or departures.
        </p>
      </aside>
      <details className="archive-tools">
        <summary>Culture quizzes from the archive</summary>
        <p>Entertainment, separate from travel advice. Older quizzes are being reviewed.</p>
        <div className="archive-links">
          {LEGACY_TOOLS.filter(
            (t) => t.href !== '/tools/trip-budget' && !(t.href.split('/').pop()! in TOOL_REVIEWS),
          ).map((t) => (
            <Link href={t.href} key={t.href}>
              {t.title}
            </Link>
          ))}
        </div>
      </details>
    </div>
  );
}
