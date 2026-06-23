import { POST } from '@/app/api/contact/route';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-123' }),
  })),
}));

function req(body: object) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/contact', () => {
  it('returns 400 when required fields are empty', async () => {
    const res = await POST(req({ company: '', participants: '', activity: '', message: '' }));
    expect(res.status).toBe(400);
  });

  it('returns 200 silently when honeypot _website is filled', async () => {
    const res = await POST(req({
      company: 'SpamBot',
      participants: '10-20',
      activity: 'outdoor',
      message: 'Buy cheap pills',
      _website: 'http://spam.com',
    }));
    expect(res.status).toBe(200);
  });

  it('returns 200 with success:true on valid submission', async () => {
    const res = await POST(req({
      company: 'Acme Corp',
      participants: '20-50',
      activity: 'culinary',
      message: 'We want to book a team building event for Q3.',
    }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });
});
