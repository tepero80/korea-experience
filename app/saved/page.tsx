import SavedGuides from '@/components/site/SavedGuides';
export const metadata = { title: 'Your saved guides', robots: { index: false, follow: true } };
export default function Saved() {
  return (
    <div className="wrap library-page">
      <div className="page-intro">
        <p className="eyebrow">Keep the useful details</p>
        <h1 className="section-title">
          Ready when
          <br />
          <em>you need them.</em>
        </h1>
        <p>A personal collection of guides for the trip you are planning.</p>
      </div>
      <SavedGuides />
    </div>
  );
}
