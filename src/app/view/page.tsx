'use client';

import BoardingPassCard from '@/components/BoardingPassCard';
import { decodeBoardingPass } from '@/lib/api';
import { BarcodedBoardingPass } from '@/lib/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ViewContent() {
  const searchParams = useSearchParams();
  const barcode = searchParams.get('barcode') || '';
  const isTest = searchParams.get('test') === '1';
  const [result, setResult] = useState<BarcodedBoardingPass | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!barcode) {
      setError('No barcode provided.');
      setLoading(false);
      return;
    }
    decodeBoardingPass(barcode)
      .then(setResult)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to read boarding pass'))
      .finally(() => setLoading(false));
  }, [barcode]);

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <Link href="/decode" className="govuk-back-link">Back</Link>

        <h1 className="govuk-heading-xl">Your boarding pass information</h1>

        {loading && (
          <div className="govuk-inset-text">
            <p className="govuk-body">Loading boarding pass...</p>
          </div>
        )}

        {error && (
          <div className="govuk-error-summary govuk-!-margin-top-6" aria-labelledby="error-summary-title" role="alert" data-module="govuk-error-summary">
            <h2 className="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>
            <div className="govuk-error-summary__body">
              <p className="govuk-body">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <BoardingPassCard bcbp={result} barcode={barcode} test={isTest} />
        )}
      </div>
    </div>
  );
}

export default function ViewPage() {
  return (
    <Suspense fallback={
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <div className="govuk-inset-text">
            <p className="govuk-body">Loading boarding pass...</p>
          </div>
        </div>
      </div>
    }>
      <ViewContent />
    </Suspense>
  );
}
