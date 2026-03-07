'use client';

import { useEffect, useRef, useState } from 'react';

const BARCODE_FORMATS = [
  { value: 'pdf417', label: 'PDF417' },
  { value: 'qrcode', label: 'QR Code' },
  { value: 'azteccode', label: 'Aztec' },
  { value: 'datamatrix', label: 'Data Matrix' },
] as const;

type BarcodeFormat = typeof BARCODE_FORMATS[number]['value'];

interface FormatOption {
  key: string;
  label: string;
  type: 'select' | 'boolean';
  options?: { value: string; label: string }[];
  default: string | boolean;
}

const FORMAT_OPTIONS: Record<BarcodeFormat, FormatOption[]> = {
  pdf417: [
    { key: 'columns', label: 'Columns', type: 'select', default: '5',
      options: [
        { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' },
        { value: '4', label: '4' }, { value: '5', label: '5' }, { value: '6', label: '6' },
        { value: '7', label: '7' }, { value: '8', label: '8' },
      ] },
    { key: 'eclevel', label: 'Error correction', type: 'select', default: '2',
      options: [
        { value: '0', label: '0 (minimum)' }, { value: '1', label: '1' }, { value: '2', label: '2 (standard)' },
        { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5', label: '5' },
        { value: '6', label: '6' }, { value: '7', label: '7' }, { value: '8', label: '8 (maximum)' },
      ] },
    { key: 'rowmult', label: 'Row height multiplier', type: 'select', default: '3',
      options: [
        { value: '2', label: '2' }, { value: '3', label: '3 (standard)' },
        { value: '4', label: '4' }, { value: '5', label: '5' },
      ] },
    { key: 'compact', label: 'Compact', type: 'boolean', default: false },
  ],
  qrcode: [
    { key: 'eclevel', label: 'Error correction', type: 'select', default: 'M',
      options: [
        { value: 'L', label: 'L (7%)' }, { value: 'M', label: 'M (15%)' },
        { value: 'Q', label: 'Q (25%)' }, { value: 'H', label: 'H (30%)' },
      ] },
    { key: 'version', label: 'Version (size)', type: 'select', default: '',
      options: [
        { value: '', label: 'Auto' },
        ...Array.from({ length: 40 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
      ] },
  ],
  azteccode: [
    { key: 'eclevel', label: 'Error correction (%)', type: 'select', default: '23',
      options: [
        { value: '5', label: '5%' }, { value: '10', label: '10%' }, { value: '15', label: '15%' },
        { value: '23', label: '23% (standard)' }, { value: '30', label: '30%' }, { value: '40', label: '40%' },
      ] },
    { key: 'layers', label: 'Layers', type: 'select', default: '',
      options: [
        { value: '', label: 'Auto' },
        ...Array.from({ length: 32 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
      ] },
    { key: 'compact', label: 'Compact', type: 'boolean', default: false },
  ],
  datamatrix: [
    { key: 'columns', label: 'Symbol size', type: 'select', default: '',
      options: [
        { value: '', label: 'Auto' },
        { value: '10', label: '10x10' }, { value: '12', label: '12x12' }, { value: '14', label: '14x14' },
        { value: '16', label: '16x16' }, { value: '18', label: '18x18' }, { value: '20', label: '20x20' },
        { value: '22', label: '22x22' }, { value: '24', label: '24x24' }, { value: '26', label: '26x26' },
        { value: '32', label: '32x32' }, { value: '36', label: '36x36' }, { value: '40', label: '40x40' },
        { value: '44', label: '44x44' }, { value: '48', label: '48x48' },
      ] },
    { key: 'dmre', label: 'Rectangular', type: 'boolean', default: false },
  ],
};

function _defaultOpts(fmt: BarcodeFormat): Record<string, string | boolean> {
  const opts: Record<string, string | boolean> = {};
  for (const opt of FORMAT_OPTIONS[fmt]) {
    opts[opt.key] = opt.default;
  }
  return opts;
}

interface BarcodeDisplayProps {
  barcode: string;
  test?: boolean;
}

export default function BarcodeDisplay({ barcode, test }: BarcodeDisplayProps) {
  const [format, setFormat] = useState<BarcodeFormat>('pdf417');
  const [formatOpts, setFormatOpts] = useState<Record<string, string | boolean>>(_defaultOpts('pdf417'));
  const [barcodeError, setBarcodeError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFormatChange = (fmt: BarcodeFormat) => {
    setFormat(fmt);
    setFormatOpts(_defaultOpts(fmt));
  };

  const updateOpt = (key: string, value: string | boolean) => {
    setFormatOpts(prev => ({ ...prev, [key]: value }));
  };

  const _drawTestWatermark = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const diag = Math.sqrt(w * w + h * h);
    const fontSize = diag * 0.16;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.atan2(h, w));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const text = 'TEST ONLY';
    ctx.strokeStyle = 'rgba(200, 0, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeText(text, 0, 0);
    ctx.fillStyle = 'rgba(200, 0, 0, 0.2)';
    ctx.fillText(text, 0, 0);
    ctx.restore();
  };

  useEffect(() => {
    if (!canvasRef.current || !barcode) return;
    setBarcodeError(null);
    import('bwip-js').then(bwipjs => {
      if (!canvasRef.current) return;

      const _buildOpts = (opts: Record<string, string | boolean>) => {
        const extra: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(opts)) {
          if (v === '' || v === false) continue;
          if (v === true) { extra[k] = true; continue; }
          const num = Number(v);
          extra[k] = isNaN(num) ? v : num;
        }
        let bcid: string = format;
        if (extra.compact) {
          if (format === 'pdf417') bcid = 'pdf417compact';
          if (format === 'azteccode') bcid = 'azteccodecompact';
          delete extra.compact;
        }
        return { bcid, extra };
      };

      const _render = (bcid: string, extra: Record<string, unknown>) => {
        bwipjs.toCanvas(canvasRef.current!, {
          bcid,
          text: barcode,
          scale: 2,
          padding: 10,
          backgroundcolor: 'f8fafc',
          ...extra,
        });
        if (test) _drawTestWatermark(canvasRef.current!);
      };

      try {
        const { bcid, extra } = _buildOpts(formatOpts);
        _render(bcid, extra);
      } catch {
        // Retry with auto size/version/layers
        try {
          const autoOpts = { ...formatOpts };
          delete autoOpts.version;
          delete autoOpts.layers;
          delete autoOpts.columns;
          const { bcid, extra } = _buildOpts(autoOpts);
          _render(bcid, extra);
          setBarcodeError('Selected size too small for the data.');
        } catch {
          setBarcodeError('Could not generate barcode with these settings. Try adjusting the options.');
        }
      }
    }).catch(() => {});
  }, [barcode, format, formatOpts, test]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(barcode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '15px', marginBottom: '15px' }}>
        <div className="govuk-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="barcode-format" className="govuk-label" style={{ marginBottom: '5px' }}>Format</label>
          <select
            id="barcode-format"
            className="govuk-select"
            value={format}
            onChange={e => handleFormatChange(e.target.value as BarcodeFormat)}
          >
            {BARCODE_FORMATS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        {FORMAT_OPTIONS[format].filter(o => o.type !== 'boolean').map(opt => (
          <div className="govuk-form-group" style={{ marginBottom: 0 }} key={opt.key}>
            <label htmlFor={`opt-${opt.key}`} className="govuk-label" style={{ marginBottom: '5px' }}>{opt.label}</label>
            <select
              id={`opt-${opt.key}`}
              className="govuk-select"
              value={String(formatOpts[opt.key] ?? opt.default)}
              onChange={e => updateOpt(opt.key, e.target.value)}
            >
              {opt.options!.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {FORMAT_OPTIONS[format].some(o => o.type === 'boolean') && (
        <div className="govuk-checkboxes govuk-checkboxes--small" style={{ minHeight: 0, marginBottom: '15px' }}>
          {FORMAT_OPTIONS[format].filter(o => o.type === 'boolean').map(opt => (
            <div className="govuk-checkboxes__item" key={opt.key}>
              <input
                className="govuk-checkboxes__input"
                id={`opt-${opt.key}`}
                type="checkbox"
                checked={!!formatOpts[opt.key]}
                onChange={e => updateOpt(opt.key, e.target.checked)}
              />
              <label className="govuk-label govuk-checkboxes__label" htmlFor={`opt-${opt.key}`}>
                {opt.label}
              </label>
            </div>
          ))}
        </div>
      )}

      {barcodeError && (
        <div className="govuk-error-message govuk-!-margin-bottom-2">
          <span className="govuk-visually-hidden">Error:</span> {barcodeError}
        </div>
      )}

      <div className="govuk-notification-banner govuk-!-margin-top-2" role="region" aria-labelledby="barcode-banner-title">
        <div className="govuk-notification-banner__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="govuk-notification-banner__title" id="barcode-banner-title">{test ? 'DCS TRAINING ONLY' : 'Barcode'}</h2>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.print(); }}
            className="govuk-notification-banner__title govuk-link"
            style={{ color: '#ffffff', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Print
          </a>
        </div>
        <div className="govuk-notification-banner__content" style={{ position: 'relative', padding: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '15px 0', maxWidth: 'none', overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
            <p className="govuk-body" style={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all', textAlign: 'center', padding: '0 15px', marginBottom: 0 }}>{barcode}</p>
          </div>
          <div style={{ position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleCopy}
              className="govuk-button govuk-button--secondary"
              title="Copy barcode string to clipboard"
              style={{ marginBottom: 0 }}
              data-module="govuk-button"
            >
              {copySuccess ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
