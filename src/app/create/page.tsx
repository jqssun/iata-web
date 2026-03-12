'use client';

import { encodeBoardingPass } from '@/lib/api';
import { BarcodedBoardingPass, COMPARTMENT_CODES, COMPARTMENT_GROUPS, KNOWN_CODES, Leg } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function _emptyLeg(): Leg {
  return {
    operating_carrier_pnr_code: '',
    from_city_airport_code: '',
    to_city_airport_code: '',
    operating_carrier_designator: '',
    flight_number: '',
    date_of_flight: '',
    compartment_code: 'Y',
    seat_number: '',
    check_in_sequence_number: '',
    passenger_status: '0',
  };
}

export default function CreatePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [legs, setLegs] = useState<Leg[]>([_emptyLeg()]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateLeg = (i: number, field: keyof Leg, value: string) => {
    setLegs(prev => prev.map((leg, idx) => idx === i ? { ...leg, [field]: value } : leg));
  };

  const addLeg = () => {
    if (legs.length < 9) setLegs(prev => [...prev, _emptyLeg()]);
  };

  const removeLeg = (i: number) => {
    if (legs.length > 1) setLegs(prev => prev.filter((_, idx) => idx !== i));
  };

  const _datepart = (date: string | null | undefined, part: 'day' | 'month' | 'year'): string => {
    if (!date) return '';
    const [y, m, d] = date.split('-');
    if (part === 'day') return d || '';
    if (part === 'month') return m || '';
    return y || '';
  };

  const _updateDate = (i: number, part: 'day' | 'month' | 'year', val: string) => {
    const current = legs[i]!.date_of_flight || '--';
    const [y, m, d] = current.split('-');
    const nd = part === 'day' ? val : (d || '');
    const nm = part === 'month' ? val : (m || '');
    const ny = part === 'year' ? val : (y || '');
    const combined = `${ny}-${nm}-${nd}`;
    updateLeg(i, 'date_of_flight', combined === '--' ? '' : combined);
  };

  const _validate = (): string | null => {
    if (!name.trim()) return 'Passenger name is required';
    for (let i = 0; i < legs.length; i++) {
      const leg = legs[i]!;
      const p = legs.length > 1 ? ` (leg ${i + 1})` : '';
      if (!leg.from_city_airport_code || leg.from_city_airport_code.length !== 3)
        return `From airport code must be 3 characters${p}`;
      if (!leg.to_city_airport_code || leg.to_city_airport_code.length !== 3)
        return `To airport code must be 3 characters${p}`;
      if (!leg.operating_carrier_designator || leg.operating_carrier_designator.length < 2)
        return `Carrier code must be 2-3 characters${p}`;
      if (!leg.flight_number) return `Flight number is required${p}`;
      if (!leg.compartment_code) return `Compartment code is required${p}`;
      if (leg.date_of_flight) {
        const d = new Date(leg.date_of_flight);
        if (isNaN(d.getTime())) return `Date of flight is not valid${p}`;
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const err = _validate();
    if (err) { setError(err); return; }

    setLoading(true);

    const processedLegs = legs.map(leg => ({
      ...leg,
      date_of_flight: leg.date_of_flight ? new Date(leg.date_of_flight).toISOString() : null,
    }));

    const bcbp: BarcodedBoardingPass = {
      data: {
        passenger_name: name.toUpperCase(),
        legs: processedLegs,
      },
    };

    try {
      const barcode = await encodeBoardingPass(bcbp);
      router.push(`/view?barcode=${encodeURIComponent(barcode)}&test=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to encode boarding pass');
      setLoading(false);
    }
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">Enter boarding pass details</h1>

        {error && (
          <div className="govuk-error-summary govuk-!-margin-bottom-6" aria-labelledby="encode-error-title" role="alert" data-module="govuk-error-summary">
            <h2 className="govuk-error-summary__title" id="encode-error-title">There is a problem</h2>
            <div className="govuk-error-summary__body">
              <p className="govuk-body">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="govuk-form-group govuk-!-margin-bottom-8">
            <h2 className="govuk-heading-m">Passenger details</h2>
            <label className="govuk-label" htmlFor="passenger-name">
              Passenger name
            </label>
            <div className="govuk-hint" id="name-hint">
              Surname followed by first name and title, separated by a forward slash. For example: SMITH/JOHNMR
            </div>
            <input
              className="govuk-input"
              id="passenger-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value.toUpperCase())}
              maxLength={20}
              aria-describedby="name-hint"
              autoComplete="off"
            />
          </div>

          {legs.map((leg, i) => (
            <fieldset className="govuk-fieldset govuk-!-margin-bottom-6" key={i}>
              <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                <h2 className="govuk-fieldset__heading">
                  Flight leg {i + 1}
                </h2>
                {legs.length > 1 && (
                  <a
                    href="#"
                    className="govuk-link govuk-body"
                    onClick={e => { e.preventDefault(); removeLeg(i); }}
                  >
                    Remove this section
                  </a>
                )}
              </legend>

              <div className="govuk-form-group">
                <fieldset className="govuk-fieldset" role="group" aria-describedby={`date-hint-${i}`}>
                  <legend className="govuk-fieldset__legend">
                    Date of flight
                  </legend>
                  <div className="govuk-date-input" id={`date-${i}`}>
                    <div className="govuk-date-input__item">
                      <div className="govuk-form-group">
                        <label className="govuk-label govuk-date-input__label" htmlFor={`date-${i}-day`}>Day</label>
                        <input
                          className="govuk-input govuk-date-input__input govuk-input--width-2"
                          id={`date-${i}-day`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={2}
                          value={_datepart(leg.date_of_flight, 'day')}
                          onChange={e => _updateDate(i, 'day', e.target.value)}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="govuk-date-input__item">
                      <div className="govuk-form-group">
                        <label className="govuk-label govuk-date-input__label" htmlFor={`date-${i}-month`}>Month</label>
                        <input
                          className="govuk-input govuk-date-input__input govuk-input--width-2"
                          id={`date-${i}-month`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={2}
                          value={_datepart(leg.date_of_flight, 'month')}
                          onChange={e => _updateDate(i, 'month', e.target.value)}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="govuk-date-input__item">
                      <div className="govuk-form-group">
                        <label className="govuk-label govuk-date-input__label" htmlFor={`date-${i}-year`}>Year</label>
                        <input
                          className="govuk-input govuk-date-input__input govuk-input--width-4"
                          id={`date-${i}-year`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={4}
                          value={_datepart(leg.date_of_flight, 'year')}
                          onChange={e => _updateDate(i, 'year', e.target.value)}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className="govuk-form-group">
                <label className="govuk-label" htmlFor={`pnr-${i}`}>Booking reference (PNR)</label>
                <input className="govuk-input govuk-input--width-10" id={`pnr-${i}`} type="text" maxLength={7} value={leg.operating_carrier_pnr_code || ''} onChange={e => updateLeg(i, 'operating_carrier_pnr_code', e.target.value.toUpperCase())} autoComplete="off" />
              </div>

              <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half">
                  <div className="govuk-form-group">
                    <label className="govuk-label" htmlFor={`from-${i}`}>From (airport code)</label>
                    <input className="govuk-input govuk-input--width-5" id={`from-${i}`} type="text" maxLength={3} value={leg.from_city_airport_code || ''} onChange={e => updateLeg(i, 'from_city_airport_code', e.target.value.toUpperCase())} autoComplete="off" />
                  </div>
                </div>
                <div className="govuk-grid-column-one-half">
                  <div className="govuk-form-group">
                    <label className="govuk-label" htmlFor={`to-${i}`}>To (airport code)</label>
                    <input className="govuk-input govuk-input--width-5" id={`to-${i}`} type="text" maxLength={3} value={leg.to_city_airport_code || ''} onChange={e => updateLeg(i, 'to_city_airport_code', e.target.value.toUpperCase())} autoComplete="off" />
                  </div>
                </div>
              </div>

              <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half">
                  <div className="govuk-form-group">
                    <label className="govuk-label" htmlFor={`carrier-${i}`}>Carrier (airline code)</label>
                    <input className="govuk-input govuk-input--width-5" id={`carrier-${i}`} type="text" maxLength={3} value={leg.operating_carrier_designator || ''} onChange={e => updateLeg(i, 'operating_carrier_designator', e.target.value.toUpperCase())} autoComplete="off" />
                  </div>
                </div>
                <div className="govuk-grid-column-one-half">
                  <div className="govuk-form-group">
                    <label className="govuk-label" htmlFor={`flight-${i}`}>Flight number</label>
                    <input className="govuk-input govuk-input--width-5" id={`flight-${i}`} type="text" maxLength={5} value={leg.flight_number || ''} onChange={e => updateLeg(i, 'flight_number', e.target.value)} autoComplete="off" />
                  </div>
                </div>
              </div>

              <div className="govuk-form-group">
                <label className="govuk-label" htmlFor={`class-${i}`}>Compartment</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select
                    className="govuk-select"
                    id={`class-${i}`}
                    value={KNOWN_CODES.includes(leg.compartment_code || '') ? leg.compartment_code! : '_custom'}
                    onChange={e => {
                      if (e.target.value !== '_custom') updateLeg(i, 'compartment_code', e.target.value);
                      else updateLeg(i, 'compartment_code', '');
                    }}
                  >
                    {COMPARTMENT_GROUPS.map(group => (
                      <optgroup key={group} label={group}>
                        {COMPARTMENT_CODES.filter(c => c.group === group).map(c => (
                          <option key={c.code} value={c.code}>{c.label} ({c.code})</option>
                        ))}
                      </optgroup>
                    ))}
                    <option value="_custom">Other</option>
                  </select>
                  {!KNOWN_CODES.includes(leg.compartment_code || '') && (
                    <input
                      className="govuk-input govuk-input--width-2"
                      type="text"
                      maxLength={1}
                      value={leg.compartment_code || ''}
                      onChange={e => updateLeg(i, 'compartment_code', e.target.value.toUpperCase())}
                      autoComplete="off"
                    />
                  )}
                </div>
              </div>

              <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half">
                  <div className="govuk-form-group">
                    <label className="govuk-label" htmlFor={`seat-${i}`}>Seat number</label>
                    <input className="govuk-input govuk-input--width-5" id={`seat-${i}`} type="text" maxLength={4} value={leg.seat_number || ''} onChange={e => updateLeg(i, 'seat_number', e.target.value.toUpperCase())} autoComplete="off" />
                  </div>
                </div>
                <div className="govuk-grid-column-one-half">
                  <div className="govuk-form-group">
                    <label className="govuk-label" htmlFor={`seq-${i}`}>Check-in sequence</label>
                    <input className="govuk-input govuk-input--width-5" id={`seq-${i}`} type="text" maxLength={5} value={leg.check_in_sequence_number || ''} onChange={e => updateLeg(i, 'check_in_sequence_number', e.target.value)} autoComplete="off" />
                  </div>
                </div>
              </div>

              <details className="govuk-details govuk-!-margin-top-2">
                <summary className="govuk-details__summary">
                  <span className="govuk-details__summary-text">Additional fields (optional)</span>
                </summary>
                <div className="govuk-details__text">
                  <div className="govuk-grid-row">
                    <div className="govuk-grid-column-one-half">
                      <div className="govuk-form-group">
                        <label className="govuk-label" htmlFor={`ff-airline-${i}`}>Frequent flyer (airline code)</label>
                        <input className="govuk-input govuk-input--width-5" id={`ff-airline-${i}`} type="text" maxLength={3} value={leg.frequent_flyer_airline_designator || ''} onChange={e => updateLeg(i, 'frequent_flyer_airline_designator', e.target.value.toUpperCase())} autoComplete="off" />
                      </div>
                    </div>
                    <div className="govuk-grid-column-one-half">
                      <div className="govuk-form-group">
                        <label className="govuk-label" htmlFor={`ff-number-${i}`}>Frequent flyer number</label>
                        <input className="govuk-input govuk-input--width-20" id={`ff-number-${i}`} type="text" maxLength={16} value={leg.frequent_flyer_number || ''} onChange={e => updateLeg(i, 'frequent_flyer_number', e.target.value.toUpperCase())} autoComplete="off" />
                      </div>
                    </div>
                  </div>
                  <div className="govuk-form-group">
                    <label className="govuk-label" htmlFor={`baggage-${i}`}>Free baggage allowance</label>
                    <input className="govuk-input govuk-input--width-5" id={`baggage-${i}`} type="text" maxLength={3} value={leg.free_baggage_allowance || ''} onChange={e => updateLeg(i, 'free_baggage_allowance', e.target.value.toUpperCase())} autoComplete="off" />
                  </div>
                </div>
              </details>
            </fieldset>
          ))}

          {legs.length < 9 && (
            <button type="button" onClick={addLeg} className="govuk-button govuk-button--secondary govuk-!-margin-bottom-6">
              Add another flight leg
            </button>
          )}

          <div className="govuk-button-group">
            <button type="submit" disabled={loading} className="govuk-button" data-module="govuk-button">
              {loading ? 'Loading...' : 'Create'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
