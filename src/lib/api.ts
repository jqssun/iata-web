import { BarcodedBoardingPass, BarcodeResponse, DecodeRequest } from './types';

const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

async function _post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || `Failed (${res.status})`);
  }

  return res.json();
}

export function decodeBoardingPass(barcode: string, year?: number) {
  const req: DecodeRequest = { barcode, ...(year ? { year } : {}) };
  return _post<BarcodedBoardingPass>('/api/decode', req);
}

export async function encodeBoardingPass(bcbp: BarcodedBoardingPass) {
  const data = await _post<BarcodeResponse>('/api/encode', bcbp);
  return data.barcode;
}
