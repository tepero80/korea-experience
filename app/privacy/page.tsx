import Link from 'next/link';
import AdPrivacySettings from '@/components/site/AdPrivacySettings';
export const metadata = {
  title: 'Privacy and cookie choices',
  alternates: { canonical: 'https://koreaexperience.com/privacy' },
};
export default function Privacy() {
  return (
    <div className="wrap document-page">
      <p className="eyebrow">Updated October 31, 2026</p>
      <h1>Privacy and cookie choices</h1>
      <p>
        This page explains the data used by Korea Experience. Contact{' '}
        <a href="mailto:contact@koreaexperience.com">contact@koreaexperience.com</a> about access,
        correction or deletion.
      </p>
      <h2>Reading and local planning</h2>
      <p>
        Cloudflare delivers the site and processes network requests for delivery and security. Saved
        guides and the browser trip board use storage on your device. They are not uploaded
        automatically. Clearing browser data removes those local copies. Do not put passport
        numbers, booking codes or sensitive details into travel notes.
      </p>
      <h2>Optional measurement</h2>
      <p>
        On the production site, optional Google Analytics measurement loads only after the analytics
        choice is accepted. It measures pages and actions such as tool completion and sharing
        handoffs. We do not send names, emails, private notes or the text of searches to analytics.
        Choosing essential only keeps core reading and planning available.
      </p>
      <p>
        You can change the analytics choice using the cookie settings control in the footer. Browser
        privacy controls can also clear stored choices. Preview and development pages do not load
        production advertising or analytics.
      </p>
      <h2>Advertising</h2>
      <AdPrivacySettings />
      <p>
        When advertising is enabled, Google may use cookies or similar technologies for ad delivery,
        measurement, fraud prevention and personalization subject to the consent offered in your
        region. Advertising consent is handled separately from our analytics choice.{' '}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
        >
          How Google uses information from partner sites
        </a>
        .
      </p>
      <h2>Accounts and community, when enabled</h2>
      <p>
        Google sign-in provides the account identifier, verified email and basic profile information
        needed for authentication. Email sign-in sends a short-lived, single-use link using Resend.
        Cloudflare D1 stores the account, sessions, public display name, contributions, reactions,
        saved guides, moderation records and private plans. Authentication secrets and raw sign-in
        links are never public.
      </p>
      <p>
        Posts, replies and updates are reviewed before publication. Your display name appears with
        approved contributions. Private plans remain private until you deliberately create a shared
        link. Anyone holding that link can read the shared plan; revoking it disables the old link.
        Avoid sharing personal information in a public contribution.
      </p>
      <h2>Deletion and retention</h2>
      <p>
        Account deletion removes active sessions, the profile, saved guides, private plans and
        shared links. You can choose to delete contributions or keep reviewed contributions
        anonymously. Moderation history may retain the action and reason without the deleted
        profile. Security counters and delivery budget records are minimized; operational backups
        may retain historical data until their retention period ends. We will not describe a backup
        as instantly erased.
      </p>
      <h2>External services and maps</h2>
      <p>
        Interactive maps load OpenStreetMap tiles only when requested; the tile service receives the
        map requests. External directions, social sharing and source links take you to those
        services and their policies. Downloaded share cards are created in your browser. Pressing
        Share or opening a social sharing window does not publish a post automatically.
      </p>
      <h2>Your questions</h2>
      <p>
        Ask us before posting sensitive information. If a community account control is unavailable,
        use the <Link href="/contact">contact and correction page</Link>. We update this notice when
        the service changes.
      </p>
    </div>
  );
}
