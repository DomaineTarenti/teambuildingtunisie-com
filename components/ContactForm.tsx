'use client';
import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: form.get('company'),
          participants: form.get('participants'),
          activity: form.get('activity'),
          message: form.get('message'),
          _website: form.get('_website'),
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const inputClass =
    'w-full border border-brand/15 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-primary transition-colors text-brand';

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-secondary text-center mb-4">
          {t('title')}
        </h2>
        <p className="text-center text-brand/50 mb-12 text-sm">Réponse sous 24h</p>

        {status === 'success' ? (
          <div className="text-center p-10 bg-primary/8 rounded-2xl border border-primary/20">
            <div className="text-4xl mb-4">✓</div>
            <p className="text-secondary font-heading font-bold text-lg">{t('success')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-2xl shadow-sm border border-brand/5">
            {/* Honeypot — hidden from real users, bots fill it */}
            <input type="text" name="_website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <div>
              <label className="block text-sm font-medium text-brand mb-2">{t('company')}</label>
              <input type="text" name="company" required className={inputClass} placeholder="Ex: Groupe TotalEnergies" />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand mb-2">{t('participants')}</label>
              <select name="participants" required className={inputClass}>
                <option value="">—</option>
                {(['10-20', '20-50', '50-100', '100+'] as const).map((v) => (
                  <option key={v} value={v}>{t(`participantsOptions.${v}`)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand mb-2">{t('activity')}</label>
              <select name="activity" required className={inputClass}>
                <option value="">—</option>
                {(['outdoor', 'culinary', 'creative', 'sports', 'wellbeing', 'custom'] as const).map((v) => (
                  <option key={v} value={v}>{t(`activityOptions.${v}`)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand mb-2">{t('message')}</label>
              <textarea name="message" required rows={4} className={`${inputClass} resize-none`} placeholder="Décrivez votre projet..." />
            </div>

            {status === 'error' && (
              <p className="text-red-500 text-sm">{t('error')}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-primary text-white font-heading font-bold text-base py-4 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-md shadow-primary/20"
            >
              {status === 'loading' ? '...' : t('submit')}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
