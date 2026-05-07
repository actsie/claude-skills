import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.DISCORD_SUBMISSIONS_WEBHOOK;
  if (!webhookUrl) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const { name, url, category, description, email } = await req.json();

  const payload = {
    embeds: [
      {
        title: '🛠️ New Agent Tool Submission',
        color: 0x0d7a5f,
        fields: [
          { name: 'Tool Name', value: name || '—', inline: true },
          { name: 'URL', value: url || '—', inline: true },
          { name: 'Category', value: category || '—', inline: true },
          { name: 'Description', value: description || '—' },
          { name: 'Submitted by', value: email || '—', inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Discord request failed' }, { status: response.status });
  }

  return NextResponse.json({ ok: true });
}
