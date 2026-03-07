'use client';

import { BarcodedBoardingPass, Leg, compartmentLabel } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import BarcodeDisplay from './BarcodeDisplay';
import WalletButtons from './WalletButtons';

interface BoardingPassCardProps {
  bcbp: BarcodedBoardingPass;
  barcode?: string;
  test?: boolean;
}

function _Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <tr className="govuk-table__row">
      <th scope="row" className="govuk-table__header" style={{ width: '50%' }}>{label}</th>
      <td className="govuk-table__cell" style={{ wordBreak: 'break-all' }}>{value}</td>
    </tr>
  );
}

function _Table({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <table className="govuk-table">
      <caption className="govuk-table__caption govuk-table__caption--m">{caption}</caption>
      <tbody className="govuk-table__body">
        {children}
      </tbody>
    </table>
  );
}

function LegCard({ leg }: { leg: Leg }) {
  const title = `${leg.from_city_airport_code} to ${leg.to_city_airport_code} (${leg.operating_carrier_designator}${leg.flight_number?.replace(/^0+/, '')})`;
  return (
    <_Table caption={title}>
      <_Row label="Booking reference" value={leg.operating_carrier_pnr_code} />
      <_Row label="From" value={leg.from_city_airport_code} />
      <_Row label="To" value={leg.to_city_airport_code} />
      <_Row label="Carrier" value={leg.operating_carrier_designator} />
      <_Row label="Flight number" value={leg.flight_number} />
      <_Row label="Date of flight" value={leg.date_of_flight ? new Date(leg.date_of_flight).toLocaleDateString(undefined, { day: 'numeric', month: 'long' }) : undefined} />
      <_Row label="Compartment" value={compartmentLabel(leg.compartment_code)} />
      <_Row label="Seat" value={leg.seat_number?.trim()} />
      <_Row label="Check-in sequence" value={leg.check_in_sequence_number} />
      <_Row label="Passenger status" value={leg.passenger_status} />
      {leg.marketing_carrier_designator && (
        <_Row label="Marketing carrier" value={leg.marketing_carrier_designator} />
      )}
      {leg.frequent_flyer_airline_designator && (
        <_Row label="Frequent flyer airline" value={leg.frequent_flyer_airline_designator} />
      )}
      {leg.frequent_flyer_number && (
        <_Row label="Frequent flyer number" value={leg.frequent_flyer_number} />
      )}
      {leg.airline_numeric_code && (
        <_Row label="Airline numeric code" value={leg.airline_numeric_code} />
      )}
      {leg.document_form_serial_number && (
        <_Row label="Document serial number" value={leg.document_form_serial_number} />
      )}
      {leg.selectee_indicator && (
        <_Row label="Selectee indicator" value={leg.selectee_indicator} />
      )}
      {leg.international_documentation_verification && (
        <_Row label="International doc. verification" value={leg.international_documentation_verification} />
      )}
      {leg.id_ad_indicator && (
        <_Row label="ID/AD indicator" value={leg.id_ad_indicator} />
      )}
      {leg.free_baggage_allowance && (
        <_Row label="Free baggage allowance" value={leg.free_baggage_allowance} />
      )}
      {leg.fast_track != null && (
        <_Row label="Fast track" value={leg.fast_track ? 'Yes' : 'No'} />
      )}
      {leg.for_individual_airline_use && (
        <_Row label="Airline use" value={leg.for_individual_airline_use} />
      )}
    </_Table>
  );
}


function _sourceLabel(code?: string | null): string | null {
  if (!code) return null;
  const map: Record<string, string> = {
    W: 'Web', K: 'Kiosk', R: 'Remote/mobile', O: 'Airport agent', T: 'Town agent',
  };
  return map[code] || code;
}

export default function BoardingPassCard({ bcbp, barcode, test }: BoardingPassCardProps) {
  const data = bcbp.data;
  const meta = bcbp.meta;
  const legs = data?.legs || [];

  return (
    <div className="govuk-!-margin-top-6">
      {barcode && <BarcodeDisplay barcode={barcode} test={test ?? false} />}

      <_Table caption="Passenger details">
        <_Row label="Passenger name" value={data?.passenger_name} />
        <_Row label="Passenger description" value={data?.passenger_description} />
        <_Row label="Source of check-in" value={_sourceLabel(data?.source_of_check_in)} />
        <_Row label="Source of boarding pass issuance" value={_sourceLabel(data?.source_of_boarding_pass_issuance)} />
        <_Row label="Date of issue" value={formatDate(data?.date_of_issue_of_boarding_pass)} />
        <_Row label="Document type" value={data?.document_type} />
        <_Row label="Issuing airline" value={data?.airline_designator_of_boarding_pass_issuer} />
        {data?.baggage_tag_licence_plate_number && (
          <_Row label="Baggage tag" value={data.baggage_tag_licence_plate_number} />
        )}
        {data?.first_non_consecutive_baggage_tag_licence_plate_number && (
          <_Row label="Baggage tag (2nd)" value={data.first_non_consecutive_baggage_tag_licence_plate_number} />
        )}
        {data?.second_non_consecutive_baggage_tag_licence_plate_number && (
          <_Row label="Baggage tag (3rd)" value={data.second_non_consecutive_baggage_tag_licence_plate_number} />
        )}
      </_Table>

      {legs.map((leg, i) => (
        <LegCard key={i} leg={leg} />
      ))}

      {meta && (
        <details className="govuk-details govuk-!-margin-top-4">
          <summary className="govuk-details__summary">
            <span className="govuk-details__summary-text">Metadata and security</span>
          </summary>
          <div className="govuk-details__text">
            <table className="govuk-table">
              <tbody className="govuk-table__body">
                <_Row label="Format code" value={meta.format_code} />
                <_Row label="Number of legs" value={meta.number_of_legs_encoded?.toString()} />
                <_Row label="Electronic ticket" value={meta.electronic_ticket_indicator} />
                <_Row label="Version" value={meta.version_number?.toString()} />
                {data?.type_of_security_data && (
                  <_Row label="Security data type" value={data.type_of_security_data} />
                )}
                {data?.security_data && (
                  <_Row label="Security data" value={data.security_data} />
                )}
              </tbody>
            </table>
          </div>
        </details>
      )}

      {barcode && legs[0] && (
        <WalletButtons
          barcode={barcode}
          barcodeFormat="pdf417"
          flight={`${legs[0].operating_carrier_designator}${legs[0].flight_number?.replace(/^0+/, '')}`}
          from={legs[0].from_city_airport_code || ''}
          to={legs[0].to_city_airport_code || ''}
          seat={legs[0].seat_number?.trim().replace(/^0+/, '') || ''}
          bookingRef={legs[0].operating_carrier_pnr_code || ''}
          passengerName={data?.passenger_name || ''}
        />
      )}
    </div>
  );
}
