import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/settings';
import { event } from '@/lib/event';

export const dynamic = 'force-dynamic';

/** Links públicos usados pela página (grupo de WhatsApp). O link Deriv passa sempre por /api/tracking. */
export async function GET() {
  try {
    const { whatsappUrl } = await getSettings();
    return NextResponse.json({ whatsappUrl }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[settings:GET]', err);
    return NextResponse.json({ whatsappUrl: event.whatsappGroupUrl }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
