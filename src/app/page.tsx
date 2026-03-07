import Link from 'next/link';

export default function Home() {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">View your boarding pass information</h1>

        <p className="govuk-body">
          You can view your boarding pass information if it is compliant with the IATA Bar Coded Boarding Pass (BCBP) standard.
        </p>

        <p className="govuk-body">Use this service to:</p>
        <ul className="govuk-list govuk-list--bullet">
          <li>check your personal information stored on a boarding pass, including passenger name, status and description, and frequent flyer details</li>
          <li>view your flight booking details, including your booking reference, compartment, seat number, and discount indicator</li>
          <li>view your checked baggage details if applicable, including check-in sequence number, tag number and allowance, and fast track status</li>
          <li>view or share boarding pass data in an alternative matrix barcode format for instant access and backup</li>
        </ul>

        <h2 className="govuk-heading-m govuk-!-margin-top-6">Before you start</h2>

        <p className="govuk-body">You will need one of the following:</p>
        <ul className="govuk-list govuk-list--bullet">
          <li>a boarding pass barcode to scan or upload - this can either be a printed boarding pass or a screenshot</li>
          <li>the barcode text from your boarding pass</li>
        </ul>

        <Link href="/decode" className="govuk-button govuk-button--start govuk-!-margin-top-3">
          Start now
          <svg className="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
          </svg>
        </Link>

        <section className="govuk-!-margin-top-8">
          <h2 className="govuk-heading-m">Other ways to view</h2>
          <p className="govuk-body">
            You can also <Link href="/encode" className="govuk-link">encode a boarding pass</Link> to store it in your mobile wallet:
          </p>
          <ul className="govuk-list govuk-list--bullet">
            <li><Link href="https://support.google.com/wallet/answer/12059256" className="govuk-link">Google Wallet</Link></li>
            <li><Link href="https://support.apple.com/123179" className="govuk-link">Apple Wallet</Link></li>
          </ul>
        </section>

        <h3 className="govuk-heading-s govuk-!-margin-top-6">Data integrity notice</h3>
        <div className="govuk-inset-text">
          This service is a sandboxed implementation. No Personally Identifiable Information (PII) or document serials are stored or retained. Users are solely responsible for ensuring that all data inputs comply with applicable data protection laws and airline terms of service. No liability is accepted for any misuse of content provided by this service. All data consumed and processed by this service should be duly verified against the relevant party's records.
        </div>

        <details className="govuk-details govuk-!-margin-top-6">
          <summary className="govuk-details__summary">
            <span className="govuk-details__summary-text">
              About Bar Coded Boarding Pass (BCBP)
            </span>
          </summary>
          <div className="govuk-details__text">
            <p className="govuk-body">
              This service is fully compliant with IATA Resolution 792 (Version 8, effective 2020), and provides additional support for all data sections including multi-leg itineraries, conditional fields including frequent flyer data and baggage information, and security data.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
