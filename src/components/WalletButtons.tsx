'use client';

interface WalletButtonsProps {
  barcode: string;
  barcodeFormat: string;
  flight: string;
  from: string;
  to: string;
  seat: string;
  bookingRef: string;
  passengerName: string;
}

const PKPASS_FORMAT_MAP: Record<string, string> = {
  pdf417: 'PDF417',
  qrcode: 'QR',
  azteccode: 'Aztec',
  datamatrix: 'DataMatrix',
};

export default function WalletButtons({ barcode, barcodeFormat, flight, from, to, seat, bookingRef, passengerName }: WalletButtonsProps) {
  const handleAppleWallet = async () => {
    try {
      const res = await fetch('/api/pkpass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcodeValue: barcode,
          barcodeFormat: PKPASS_FORMAT_MAP[barcodeFormat] || 'PDF417',
          title: `✈ ${from} to ${to} (${flight})`,
          colorPreset: 'dark',
          label: `REF: ${bookingRef}`,
          value: `${passengerName} (${seat})`,
        }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pass.pkpass';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // request failed
    }
  };

  const handleGoogleWallet = async () => {
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(b => b ? resolve(b) : reject(), 'image/png');
      });
      const file = new File([blob], 'PASS.PNG', { type: 'image/png' });
      await navigator.share({ files: [file] });
    } catch {
      // share cancelled or not supported
    }
  };

  return (
    <div className="no-print" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
      <button
        onClick={handleAppleWallet}
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        aria-label="Add to Apple Wallet"
      >
        <img
          src="/assets/images/US-UK_Add_to_Apple_Wallet_RGB_101421.svg"
          alt="Add to Apple Wallet"
          height={48}
        />
      </button>
      <button
        onClick={handleGoogleWallet}
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        aria-label="Add to Google Wallet"
      >
        <img
          src="/assets/images/enUS_add_to_google_wallet_add-wallet-badge.svg"
          alt="Add to Google Wallet"
          height={48}
        />
      </button>
    </div>
  );
}
