import Link from 'next/link';
export const metadata = {
  title: 'Editorial standards & corrections',
  description:
    'How Korea Experience researches, checks, illustrates and updates practical travel information.',
  alternates: { canonical: 'https://koreaexperience.com/editorial-policy' },
};
export default function Policy() {
  return (
    <div className="wrap document-page">
      <p className="eyebrow">Useful. Traceable. Open to correction.</p>
      <h1 className="section-title">
        How we make
        <br />
        <em>a useful guide.</em>
      </h1>
      <p>
        Our aim is to help international travelers make a real decision about Korea. We distinguish
        official conditions from planning suggestions, and show what still needs checking before you
        act.
      </p>
      <h2>Research and verification</h2>
      <p>
        We prioritize the official operator, public authority or venue for rules, bookings, fares
        and opening conditions. Newly reviewed guides show a check date and specific sources. An
        information check is a review of those sources, not a personal visit or a guarantee of
        availability.
      </p>
      <h2>How AI is used</h2>
      <p>
        AI assists research organization, writing, data checks and production. We check important
        claims against identifiable sources, disclose uncertainties and correct errors. We do not
        invent visits, experts, interviews, statistics or citations. AI-assisted writing is not
        represented as professional medical, legal or immigration advice.
      </p>
      <h2>Photos, illustrations and maps</h2>
      <p>
        Real photographs have source and license records. They may be historical and do not prove a
        place’s present condition. Generated illustrations are labeled and are not documentary
        evidence. Map pins are overview references; confirm the entrance, accessibility and current
        route in a local map or with the operator.
      </p>
      <Link href="/image-credits" className="text-link">
        Photography credits ↗
      </Link>
      <h2>Dates that mean something</h2>
      <p>
        Publication, substantive update and source-check dates are different. We change an update
        date when the information materially changes, not merely to make an old guide look new.
        Earlier articles awaiting this process are labeled as archive guides.
      </p>
      <h2>Recommendations and estimates</h2>
      <p>
        Suggested routes and choices are editorial judgments. Worked budgets show assumptions rather
        than live quotes. We do not describe unannounced events as bookable or rank services using
        invented scores.
      </p>
      <h2>Advertising and paid links</h2>
      <p>
        Advertising is labeled and kept separate from editorial decisions. A paid link, if present,
        is identified at the point of use. An advertisement is not our recommendation or a
        verification of the advertiser’s claims.
      </p>
      <h2>Corrections, updates and retirement</h2>
      <p>
        Please send the guide URL, the detail that changed and a source if available. We review
        useful corrections, merge duplicate information into a relevant guide, and remove material
        that no longer serves travelers. We preserve useful public URLs where possible.
      </p>
      <Link href="/contact" className="button button-dark">
        Send a correction ↗
      </Link>
    </div>
  );
}
