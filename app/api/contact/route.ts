import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { company, participants, activity, message, _website } = body;

  if (_website) {
    return NextResponse.json({ success: true });
  }

  if (!company?.trim() || !participants || !activity || !message?.trim()) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  try {
    await sendContactEmail({
      company: company.trim(),
      participants,
      activity,
      message: message.trim(),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Mail send error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
