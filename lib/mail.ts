import nodemailer from 'nodemailer';

interface ContactData {
  company: string;
  participants: string;
  activity: string;
  message: string;
}

export async function sendContactEmail(data: ContactData): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Team Building Tunisie" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL,
    subject: `Nouvelle demande team building — ${data.company}`,
    text: `Entreprise : ${data.company}\nParticipants : ${data.participants}\nActivité : ${data.activity}\nMessage : ${data.message}`,
    html: `
<h2 style="color:#1A1A2E">Nouvelle demande de team building</h2>
<p><strong>Entreprise :</strong> ${data.company}</p>
<p><strong>Participants :</strong> ${data.participants}</p>
<p><strong>Type d'activité :</strong> ${data.activity}</p>
<p><strong>Message :</strong><br>${data.message.replace(/\n/g, '<br>')}</p>
    `.trim(),
  });
}
