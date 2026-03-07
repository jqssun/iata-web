'use client';

import BarcodeScanner from '@/components/BarcodeScanner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DecodePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = (input: string) => {
    setError(null);
    setLoading(true);
    router.push(`/view?barcode=${encodeURIComponent(input)}`);
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <h1 className="govuk-heading-xl">View your boarding pass information</h1>
        <p className="govuk-body-l">
          Enter, scan, or upload a boarding pass barcode
        </p>

        <BarcodeScanner onScan={handleScan} isLoading={loading} />

        {error && (
          <div className="govuk-error-summary govuk-!-margin-top-6" aria-labelledby="error-summary-title" role="alert" data-module="govuk-error-summary">
            <h2 className="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>
            <div className="govuk-error-summary__body">
              <p className="govuk-body">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
