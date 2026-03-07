import Link from 'next/link';

export default function EncodePage() {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">Encode a boarding pass</h1>

        <p className="govuk-body">
          You can encode your flight details into a valid Bar Coded Boarding Pass (BCBP) text. You should only use this service for your own boarding pass.
        </p>

        <p className="govuk-body">Use this service to:</p>
        <ul className="govuk-list govuk-list--bullet">
          <li>generate a barcode string from passenger and flight details</li>
          <li>verify existing decoded data by re-encoding the output</li>
        </ul>

        <h2 className="govuk-heading-m govuk-!-margin-top-6">Before you start</h2>

        <p className="govuk-body">You will need:</p>
        <ul className="govuk-list govuk-list--bullet">
          <li>your title, and your full name as it appears on your travel document</li>
          <li>at least one flight leg with flight number, date, and route</li>
          <li>your booking reference or Passenger Name Record (PNR), compartment code, seat number, check-in status and sequence number</li>
        </ul>

        <Link href="/create" className="govuk-button govuk-button--start govuk-!-margin-top-3">
          Start now
          <svg className="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
          </svg>
        </Link>

        <section className="govuk-!-margin-top-8">
          <h2 className="govuk-heading-m">Other ways to view</h2>
          <p className="govuk-body">
            Use a different service if you want to <Link href="/decode" className="govuk-link">view boarding pass information</Link> on an existing barcode or directly from barcode text.
          </p>
        </section>

      </div>
    </div>
  );
}
