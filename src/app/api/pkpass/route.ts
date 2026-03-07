import { NextRequest, NextResponse } from 'next/server';

const PKPASS_API = process.env.PKPASS_API_URL || 'http://localhost:8000/api/pkpass';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { host } = new URL(PKPASS_API);

  const res = await fetch(PKPASS_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Host': host,
    },
    body: JSON.stringify({
      barcodeValue: body.barcodeValue,
      barcodeFormat: body.barcodeFormat,
      title: body.title || 'Boarding Pass',
      colorPreset: body.colorPreset || 'dark',
      label: body.label,
      value: body.value,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { detail: `pkpass request failed (${res.status})` },
      { status: res.status }
    );
  }

  const data = await res.arrayBuffer();
  return new NextResponse(data, {
    headers: {
      'Content-Type': 'application/vnd.apple.pkpass',
      'Content-Disposition': 'attachment; filename="pass.pkpass"',
    },
  });
}
