import Link from 'next/link';
export const metadata = {
  title: 'Terms of use and community rules',
  alternates: { canonical: 'https://koreaexperience.com/terms' },
};
export default function Terms() {
  return (
    <div className="wrap document-page">
      <p className="eyebrow">Updated October 30, 2026</p>
      <h1>Terms of use</h1>
      <p>
        Korea Experience offers travel information and planning aids. Confirm entry requirements,
        reservations, fares, opening conditions and individual needs with the responsible operator
        before relying on them.
      </p>
      <h2>Planning tools and content</h2>
      <p>
        Calculations depend on your inputs and the assumptions shown. They are not live quotes,
        bookings or a guarantee of availability. Maps show overview markers unless explicitly
        verified otherwise. Older archive guides may await a fresh review.{' '}
        <Link href="/editorial-policy">Our editorial policy</Link> explains sources, corrections and
        imagery.
      </p>
      <h2>Community participation</h2>
      <p>
        When accounts are available, use an email or Google account you control. Keep sign-in links
        private. Submit only content you have the right to share. Do not publish private
        identifiers, harassment, hate, scams, unlawful material, spam or misleading commercial
        claims. Disclose a relevant business or affiliate relationship.
      </p>
      <p>
        Contributions and edits require review. We may withhold, hide, restore or remove content and
        restrict accounts to enforce these rules. A public travel answer is not individualized
        medical, legal or emergency advice. Use official services for urgent help.
      </p>
      <h2>Your contributions and plans</h2>
      <p>
        You retain rights in your contributions and permit Korea Experience to display, format and
        moderate the content you submit for publication. Private plans are not public by default. A
        shared link is readable by anyone who receives it; review the selected fields and remove
        sensitive information before creating a snapshot. Later private edits are not published
        automatically. Account controls allow contribution deletion and shared-link revocation.
      </p>
      <h2>Reuse and advertising</h2>
      <p>
        You may share links and the supplied summary cards with their original attribution and
        destination link. Third-party photographs retain the specific licenses listed in{' '}
        <Link href="/image-credits">image credits</Link>; those licenses govern their reuse. Paid
        links are labeled. Advertisements do not establish an editorial endorsement or change the
        need to check the provider’s conditions.
      </p>
      <h2>Service changes and contact</h2>
      <p>
        Free services and external operators can change or become unavailable. We aim to correct
        material errors and keep core guides accessible. Send disputes, rights requests or
        corrections through <Link href="/contact">contact</Link>. These terms do not remove rights
        that applicable law gives you.
      </p>
    </div>
  );
}
