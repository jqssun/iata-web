export interface Leg {
  operating_carrier_pnr_code?: string | null;
  from_city_airport_code?: string | null;
  to_city_airport_code?: string | null;
  operating_carrier_designator?: string | null;
  flight_number?: string | null;
  date_of_flight?: string | null;
  compartment_code?: string | null;
  seat_number?: string | null;
  check_in_sequence_number?: string | null;
  passenger_status?: string | null;
  airline_numeric_code?: string | null;
  document_form_serial_number?: string | null;
  selectee_indicator?: string | null;
  international_documentation_verification?: string | null;
  marketing_carrier_designator?: string | null;
  frequent_flyer_airline_designator?: string | null;
  frequent_flyer_number?: string | null;
  id_ad_indicator?: string | null;
  free_baggage_allowance?: string | null;
  fast_track?: boolean | null;
  for_individual_airline_use?: string | null;
}

export interface BoardingPassData {
  legs?: Leg[] | null;
  passenger_name?: string | null;
  passenger_description?: string | null;
  source_of_check_in?: string | null;
  source_of_boarding_pass_issuance?: string | null;
  date_of_issue_of_boarding_pass?: string | null;
  document_type?: string | null;
  airline_designator_of_boarding_pass_issuer?: string | null;
  baggage_tag_licence_plate_number?: string | null;
  first_non_consecutive_baggage_tag_licence_plate_number?: string | null;
  second_non_consecutive_baggage_tag_licence_plate_number?: string | null;
  type_of_security_data?: string | null;
  security_data?: string | null;
}

export interface BoardingPassMetaData {
  format_code?: string | null;
  number_of_legs_encoded?: number | null;
  electronic_ticket_indicator?: string | null;
  beginning_of_version_number?: string | null;
  version_number?: number | null;
  beginning_of_security_data?: string | null;
}

export interface BarcodedBoardingPass {
  data?: BoardingPassData | null;
  meta?: BoardingPassMetaData | null;
}

export interface DecodeRequest {
  barcode: string;
  year?: number | null;
}

export interface BarcodeResponse {
  barcode: string;
}

export const BARCODE_MAX_LENGTH = 1000;

export interface CompartmentCode {
  code: string;
  label: string;
  group: string;
}

export const COMPARTMENT_CODES: CompartmentCode[] = [
  { code: 'P', label: 'First Premium', group: 'First' },
  { code: 'F', label: 'First', group: 'First' },
  { code: 'A', label: 'First Discounted', group: 'First' },
  { code: 'J', label: 'Business Full Fare', group: 'Business' },
  { code: 'C', label: 'Business', group: 'Business' },
  { code: 'I', label: 'Business Discounted', group: 'Business' },
  { code: 'D', label: 'Business Deep Discount', group: 'Business' },
  { code: 'W', label: 'Premium Economy Full Fare', group: 'Premium Economy' },
  { code: 'S', label: 'Premium Economy', group: 'Premium Economy' },
  { code: 'Y', label: 'Economy Full Fare', group: 'Economy' },
  { code: 'B', label: 'Economy Flexible', group: 'Economy' },
  { code: 'H', label: 'Economy Standard', group: 'Economy' },
  { code: 'K', label: 'Economy Standard', group: 'Economy' },
  { code: 'M', label: 'Economy Standard', group: 'Economy' },
  { code: 'L', label: 'Economy Discounted', group: 'Economy' },
  { code: 'Q', label: 'Economy Discounted', group: 'Economy' },
  { code: 'V', label: 'Economy Deep Discount', group: 'Economy' },
];

export const COMPARTMENT_GROUPS = [...new Set(COMPARTMENT_CODES.map(c => c.group))];

export const KNOWN_CODES = COMPARTMENT_CODES.map(c => c.code);

export function compartmentLabel(code?: string | null): string | null {
  if (!code) return null;
  const entry = COMPARTMENT_CODES.find(c => c.code === code);
  return entry ? `${entry.label} (${entry.code})` : code;
}
