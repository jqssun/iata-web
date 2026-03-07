import { BarcodedBoardingPass, BarcodeResponse, DecodeRequest } from './types';

const API_URL = process.env.API_URL || 'http://localhost:8000';

export async function decodeBoardingPass(barcode: string, year?: number): Promise<BarcodedBoardingPass> {
  const req: DecodeRequest = { barcode, ...(year ? { year } : {}) };

  const res = await fetch(`${API_URL}/iata/decode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || `Decode failed (${res.status})`);
  }

  return res.json();
}

export async function encodeBoardingPass(bcbp: BarcodedBoardingPass): Promise<string> {
  const res = await fetch(`${API_URL}/iata/encode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bcbp),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || `Encode failed (${res.status})`);
  }

  const data: BarcodeResponse = await res.json();
  return data.barcode;
}
