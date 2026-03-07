import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:8000';

export function proxy(path: string) {
  return async (req: NextRequest) => {
    const body = await req.json();

    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        { detail: data?.detail || `Request failed (${res.status})` },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  };
}
