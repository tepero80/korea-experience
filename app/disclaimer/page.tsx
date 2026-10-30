import Link from 'next/link';
export const metadata = {
  title: 'Travel, safety and medical information',
  alternates: { canonical: 'https://koreaexperience.com/disclaimer' },
};
export default function Safety() {
  return (
    <div className="wrap document-page">
      <p className="eyebrow">Safety and individual decisions</p>
      <h1>Use the right source for the decision.</h1>
      <p>
        Our guides provide general travel information and editorial suggestions. They do not
        determine immigration eligibility, medical suitability, individual safety or whether an
        operator can serve your needs.
      </p>
      <h2>Medical information</h2>
      <p>
        Ask a qualified clinician or pharmacist about your own symptoms, medication or treatment.
        Older medical-tourism articles remain in the archive while reviewed; a price, procedure
        description or advertisement is not a recommendation to undergo treatment. For an emergency
        in Korea, call 119 for fire and ambulance or 112 for police.
      </p>
      <h2>Food, access and weather</h2>
      <p>
        Confirm ingredients and cross-contact directly for dietary restrictions and allergies. Check
        the exact entrance, lifts and assistance arrangements for accessibility. Follow current
        weather alerts and operator closures; a seasonal average or overview map does not establish
        safe conditions.
      </p>
      <h2>Corrections</h2>
      <p>
        Report a material error through <Link href="/contact">contact and corrections</Link>. The{' '}
        <Link href="/editorial-policy">editorial policy</Link> explains how we distinguish official
        facts, estimates and recommendations.
      </p>
    </div>
  );
}
