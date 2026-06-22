# teambuildingtunisie.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (FR/EN) Next.js 14 team building reference site for Tunisia targeting HR and company managers, with invisible partner site cross-links in sections and blog articles, a 4-field contact form sending leads server-side to hello@atelier-evenementiel-tunisie.com, and 15 blog articles per language (1 200+ words each).

**Architecture:** Next.js 14 App Router with next-intl for locale routing (`/fr/` default, `/en/`), MDX files in `/content/blog/[locale]/` for blog content, Nodemailer in a server-only API route so the destination email is never exposed client-side, Tailwind CSS with Space Grotesk + Inter fonts, deployed on Vercel (free tier).

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, next-intl, next-mdx-remote, gray-matter, Nodemailer, @tailwindcss/typography, Vercel

## Global Constraints

- **No phone number** anywhere in the site — not in components, not in content
- **No email address** visible in any rendered HTML or client-side JS
- **No links to partner sites in the footer** — footer has copyright + legal notice only
- **Invisible partner links:** standard `<a href>` tags styled `text-inherit no-underline hover:no-underline` — visually identical to surrounding text, clickable, crawlable by Google
- **Form destination:** `process.env.CONTACT_EMAIL` = `hello@atelier-evenementiel-tunisie.com` (env var, server only)
- **Partner sites:** `atelier-evenementiel-tunisie.com` (agency), `domainetarenti.com` (venue), `tunisiaeventlab.com` (SEO), `agence-evenementielle-tunisie.com` (SEO)
- **Color palette:** primary `#FF6B35`, secondary `#1A1A2E`, background `#F5F5F0`, text `#2D2D2D`
- **Fonts:** Space Grotesk (headings, 600–700), Inter (body, 400–500)
- **Blog:** minimum 1 200 words per article, 15 FR + 15 EN articles

---

## File Map

```
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx           # Locale layout + NextIntlClientProvider + per-page metadata
│   │   ├── page.tsx             # Home — assembles all section components
│   │   └── blog/
│   │       ├── page.tsx         # Blog list
│   │       └── [slug]/
│   │           └── page.tsx     # Article page + generateMetadata
│   ├── api/
│   │   └── contact/
│   │       └── route.ts         # POST — Nodemailer, never exposes CONTACT_EMAIL
│   ├── sitemap.ts               # Auto sitemap.xml
│   ├── robots.ts                # robots.txt
│   └── globals.css              # Tailwind base + Google Fonts import
├── components/
│   ├── Header.tsx               # 'use client' — nav + FR/EN toggle
│   ├── Footer.tsx               # Server — copyright + mentions légales only
│   ├── InvisibleLink.tsx        # Server — <a> styled as plain text
│   ├── Hero.tsx                 # Server — hero section
│   ├── WhyTeamBuilding.tsx      # Server — 3-icon section
│   ├── Activities.tsx           # Server — 6 cards with InvisibleLink
│   ├── ClientLogos.tsx          # Server — logo placeholder grid
│   ├── BlogPreview.tsx          # Server — 3 latest posts
│   └── ContactForm.tsx          # 'use client' — form + fetch /api/contact
├── content/
│   └── blog/
│       ├── fr/                  # 15 × .mdx files
│       └── en/                  # 15 × .mdx files
├── lib/
│   ├── mdx.ts                   # getAllPosts(locale), getPostBySlug(locale, slug)
│   └── mail.ts                  # createMailTransport(), sendContactEmail(data)
├── messages/
│   ├── fr.json                  # All FR UI strings
│   └── en.json                  # All EN UI strings
├── __tests__/
│   ├── api/contact.test.ts      # API route tests (nodemailer mocked)
│   └── lib/mdx.test.ts          # Blog utility tests
├── middleware.ts                 # next-intl locale routing
├── i18n.ts                      # next-intl server config
├── next.config.js               # withNextIntl wrapper
├── tailwind.config.ts           # Custom colors + fonts + typography plugin
├── tsconfig.json                # Strict TS, @/* alias
├── jest.config.ts               # Jest + node environment
└── .env.local                   # SMTP vars — gitignored
```

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`, `next.config.js`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `app/globals.css`, `.env.local`, `jest.config.ts`

**Interfaces:**
- Produces: runnable Next.js 14 dev server on port 3000, Jest test runner

- [ ] **Step 1: Bootstrap Next.js project**

```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --no-git
```

Expected: project files created including `app/`, `public/`, `tailwind.config.ts`, `tsconfig.json`.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install next-intl next-mdx-remote gray-matter nodemailer @tailwindcss/typography
npm install -D @types/nodemailer jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest ts-jest
```

- [ ] **Step 3: Replace `next.config.mjs` with `next.config.js`**

Delete `next.config.mjs` and create `next.config.js`:
```js
const withNextIntl = require('next-intl/plugin')('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com'],
  },
};

module.exports = withNextIntl(nextConfig);
```

- [ ] **Step 4: Configure `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#1A1A2E',
        background: '#F5F5F0',
        brand: '#2D2D2D',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
```

- [ ] **Step 5: Configure `app/globals.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-body text-brand bg-background;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }
}
```

- [ ] **Step 6: Create `jest.config.ts`**

```ts
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react' } }] },
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
};

export default config;
```

- [ ] **Step 7: Create `.env.local`**

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-login@example.com
SMTP_PASS=your-password
CONTACT_EMAIL=hello@atelier-evenementiel-tunisie.com
```

> Fill with real SMTP credentials before testing email. For Gmail use SMTP_HOST=smtp.gmail.com + an App Password (not your account password). For Brevo/Sendinblue use smtp-relay.brevo.com port 587.

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```
Expected: server starts on http://localhost:3000, no errors in terminal.

- [ ] **Step 9: Commit**

```bash
git init && git add -A
git commit -m "feat: scaffold Next.js 14 project with Tailwind, next-intl, MDX, Nodemailer deps"
```

---

### Task 2: i18n setup

**Files:**
- Create: `i18n.ts`, `middleware.ts`, `messages/fr.json`, `messages/en.json`, `app/[locale]/layout.tsx`, `app/[locale]/page.tsx` (stub)

**Interfaces:**
- Consumes: `next.config.js` (Task 1)
- Produces: `getTranslations(namespace)` available in all server components, `useTranslations(namespace)` in client components, locale routing `/fr/` and `/en/` active

- [ ] **Step 1: Create `i18n.ts`**

```ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));
```

- [ ] **Step 2: Create `middleware.ts`**

```ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localeDetection: true,
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

- [ ] **Step 3: Create `messages/fr.json`**

```json
{
  "nav": {
    "blog": "Blog",
    "cta": "Demander un devis"
  },
  "hero": {
    "title": "Le Team Building en Tunisie",
    "subtitle": "Des expériences inoubliables pour souder vos équipes et booster la performance",
    "cta": "Demander un devis"
  },
  "why": {
    "title": "Pourquoi le team building ?",
    "cohesion": { "title": "Cohésion", "text": "Renforcez les liens entre vos collaborateurs et créez une culture d'équipe solide et durable." },
    "performance": { "title": "Performance", "text": "Des équipes soudées sont plus efficaces, créatives et engagées dans leur travail quotidien." },
    "wellbeing": { "title": "Bien-être", "text": "Offrez à vos équipes une expérience ressourçante qui booste la motivation et réduit le turnover." }
  },
  "activities": {
    "title": "Nos activités",
    "outdoor": "Outdoor & Aventure",
    "culinary": "Team Building Culinaire",
    "creative": "Ateliers Créatifs",
    "sports": "Challenges Sportifs",
    "wellbeing": "Bien-être & Mindfulness",
    "custom": "Sur Mesure"
  },
  "clients": {
    "title": "Ils nous font confiance"
  },
  "blog": {
    "title": "Nos derniers articles",
    "readMore": "Lire la suite",
    "viewAll": "Voir tous les articles"
  },
  "contact": {
    "title": "Demandez un devis",
    "company": "Votre entreprise",
    "participants": "Nombre de participants",
    "participantsOptions": {
      "10-20": "10 à 20 personnes",
      "20-50": "20 à 50 personnes",
      "50-100": "50 à 100 personnes",
      "100+": "Plus de 100 personnes"
    },
    "activity": "Type d'activité",
    "activityOptions": {
      "outdoor": "Outdoor & Aventure",
      "culinary": "Culinaire",
      "creative": "Créatif",
      "sports": "Sportif",
      "wellbeing": "Bien-être",
      "custom": "Sur mesure"
    },
    "message": "Votre message",
    "submit": "Envoyer ma demande",
    "success": "Votre demande a bien été envoyée. Nous vous répondrons dans les plus brefs délais.",
    "error": "Une erreur est survenue. Veuillez réessayer."
  },
  "footer": {
    "copyright": "© 2026 Team Building Tunisie. Tous droits réservés.",
    "legal": "Mentions légales"
  }
}
```

- [ ] **Step 4: Create `messages/en.json`**

```json
{
  "nav": {
    "blog": "Blog",
    "cta": "Request a quote"
  },
  "hero": {
    "title": "Team Building in Tunisia",
    "subtitle": "Unforgettable experiences to unite your teams and boost performance",
    "cta": "Request a quote"
  },
  "why": {
    "title": "Why team building?",
    "cohesion": { "title": "Cohesion", "text": "Strengthen bonds between your employees and build a solid, lasting team culture." },
    "performance": { "title": "Performance", "text": "United teams are more efficient, creative, and engaged in their daily work." },
    "wellbeing": { "title": "Well-being", "text": "Give your teams a rejuvenating experience that boosts motivation and reduces turnover." }
  },
  "activities": {
    "title": "Our activities",
    "outdoor": "Outdoor & Adventure",
    "culinary": "Culinary Team Building",
    "creative": "Creative Workshops",
    "sports": "Sports Challenges",
    "wellbeing": "Well-being & Mindfulness",
    "custom": "Custom Events"
  },
  "clients": {
    "title": "They trust us"
  },
  "blog": {
    "title": "Latest articles",
    "readMore": "Read more",
    "viewAll": "View all articles"
  },
  "contact": {
    "title": "Request a quote",
    "company": "Your company",
    "participants": "Number of participants",
    "participantsOptions": {
      "10-20": "10 to 20 people",
      "20-50": "20 to 50 people",
      "50-100": "50 to 100 people",
      "100+": "More than 100 people"
    },
    "activity": "Activity type",
    "activityOptions": {
      "outdoor": "Outdoor & Adventure",
      "culinary": "Culinary",
      "creative": "Creative",
      "sports": "Sports",
      "wellbeing": "Well-being",
      "custom": "Custom"
    },
    "message": "Your message",
    "submit": "Send my request",
    "success": "Your request has been sent. We will get back to you shortly.",
    "error": "An error occurred. Please try again."
  },
  "footer": {
    "copyright": "© 2026 Team Building Tunisia. All rights reserved.",
    "legal": "Legal notice"
  }
}
```

- [ ] **Step 5: Create `app/[locale]/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isFr = locale === 'fr';
  const title = isFr
    ? 'Team Building Tunisie — Activités & Séminaires d\'entreprise'
    : 'Team Building Tunisia — Corporate Activities & Seminars';
  const description = isFr
    ? 'Organisez des activités de team building inoubliables en Tunisie. Outdoor, culinaire, créatif, sportif. Devis gratuit en 24h.'
    : 'Organize unforgettable team building activities in Tunisia. Outdoor, culinary, creative, sports. Free quote within 24h.';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: isFr ? 'fr_FR' : 'en_US',
      url: `https://teambuildingtunisie.com/${locale}`,
      siteName: 'Team Building Tunisie',
      images: [{ url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80', width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://teambuildingtunisie.com/${locale}`,
      languages: {
        fr: 'https://teambuildingtunisie.com/fr',
        en: 'https://teambuildingtunisie.com/en',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Create stub `app/[locale]/page.tsx`**

```tsx
export default function HomePage() {
  return <main><h1 className="p-8 font-heading text-4xl text-secondary">Team Building Tunisie</h1></main>;
}
```

- [ ] **Step 7: Delete the root `app/page.tsx` and `app/layout.tsx`** that create-next-app generated (routes are now under `app/[locale]/`)

- [ ] **Step 8: Verify locale routing**

```bash
npm run dev
```
Visit http://localhost:3000 — browser redirects to http://localhost:3000/fr
Visit http://localhost:3000/en — shows EN stub with no errors.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add next-intl i18n routing for /fr and /en locales with FR/EN message files"
```

---

### Task 3: Header, Footer, InvisibleLink

**Files:**
- Create: `components/Header.tsx`, `components/Footer.tsx`, `components/InvisibleLink.tsx`
- Modify: `app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `messages/*.json` keys `nav`, `footer` (Task 2)
- Produces: `<Header>`, `<Footer>`, `<InvisibleLink href="">` used everywhere

- [ ] **Step 1: Create `components/InvisibleLink.tsx`**

```tsx
import { AnchorHTMLAttributes } from 'react';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export default function InvisibleLink({ href, children, className = '', ...props }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={`text-inherit no-underline hover:no-underline ${className}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
      {...props}
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 2: Create `components/Header.tsx`**

```tsx
'use client';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale = locale === 'fr' ? 'en' : 'fr';
  const otherPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-heading font-bold text-xl text-white">
          Team Building<span className="text-primary"> Tunisie</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href={`/${locale}/blog`}
            className="text-white/80 hover:text-primary transition-colors text-sm font-medium"
          >
            {t('blog')}
          </Link>
          <Link
            href={otherPath}
            className="text-white/60 hover:text-white text-xs font-medium border border-white/20 rounded px-2 py-1 transition-colors"
          >
            {otherLocale.toUpperCase()}
          </Link>
          <a
            href="#contact"
            className="bg-primary text-white font-medium text-sm px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
          >
            {t('cta')}
          </a>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create `components/Footer.tsx`**

```tsx
import { getTranslations } from 'next-intl/server';

export default async function Footer() {
  const t = await getTranslations('footer');
  return (
    <footer className="bg-secondary text-white/40 py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p>{t('copyright')}</p>
        <a href="#" className="hover:text-white/70 transition-colors">
          {t('legal')}
        </a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Update `app/[locale]/layout.tsx` to wrap with Header + Footer**

Add imports and wrap body:
```tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// ... existing imports

export default async function LocaleLayout({ children, params: { locale } }) {
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <div className="pt-16">{children}</div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify**

```bash
npm run dev
```
Visit http://localhost:3000/fr — dark fixed header with orange "Demander un devis" CTA and "EN" toggle, dark footer with copyright. No phone number, no external links.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Header (fixed, FR/EN toggle), Footer (copyright only), InvisibleLink component"
```

---

### Task 4: Hero and WhyTeamBuilding sections

**Files:**
- Create: `components/Hero.tsx`, `components/WhyTeamBuilding.tsx`
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `messages/*.json` keys `hero`, `why` (Task 2)
- Produces: `<Hero>`, `<WhyTeamBuilding>` server components

- [ ] **Step 1: Create `components/Hero.tsx`**

```tsx
import { getTranslations } from 'next-intl/server';

export default async function Hero() {
  const t = await getTranslations('hero');
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80')" }}
      />
      <div className="absolute inset-0 bg-secondary/70" />
      <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-primary/10 rounded-tl-full" />
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="inline-block bg-primary/20 text-primary border border-primary/30 rounded-full px-4 py-1 text-sm font-medium mb-6">
          Tunisie · Outdoor · Culinaire · Créatif
        </div>
        <h1 className="font-heading font-bold text-5xl md:text-7xl mb-6 leading-tight">
          {t('title')}
        </h1>
        <p className="text-xl md:text-2xl text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>
        <a
          href="#contact"
          className="inline-block bg-primary text-white font-heading font-bold text-lg px-10 py-4 rounded-full hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/30"
        >
          {t('cta')}
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/WhyTeamBuilding.tsx`**

```tsx
import { getTranslations } from 'next-intl/server';

const icons = {
  cohesion: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  performance: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  wellbeing: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
};

export default async function WhyTeamBuilding() {
  const t = await getTranslations('why');
  const items = ['cohesion', 'performance', 'wellbeing'] as const;

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-secondary text-center mb-16">
          {t('title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item} className="text-center p-8 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-shadow border border-brand/5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
                {icons[item]}
              </div>
              <h3 className="font-heading font-bold text-xl text-secondary mb-3">
                {t(`${item}.title`)}
              </h3>
              <p className="text-brand/65 leading-relaxed text-sm">
                {t(`${item}.text`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update `app/[locale]/page.tsx`**

```tsx
import Hero from '@/components/Hero';
import WhyTeamBuilding from '@/components/WhyTeamBuilding';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhyTeamBuilding />
    </main>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```
Visit http://localhost:3000/fr — full-screen hero with orange CTA button, followed by 3-column white card section. Switch to /en — all text in English.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Hero and WhyTeamBuilding sections"
```

---

### Task 5: Activities and ClientLogos sections

**Files:**
- Create: `components/Activities.tsx`, `components/ClientLogos.tsx`
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `messages/*.json` keys `activities`, `clients` (Task 2); `<InvisibleLink>` (Task 3)
- Produces: `<Activities>` with 6 partner-linked cards, `<ClientLogos>` placeholder

- [ ] **Step 1: Create `components/Activities.tsx`**

```tsx
import { getTranslations } from 'next-intl/server';
import InvisibleLink from './InvisibleLink';

const activities = [
  {
    key: 'outdoor',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    link: 'https://domainetarenti.com',
  },
  {
    key: 'culinary',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    link: 'https://atelier-evenementiel-tunisie.com',
  },
  {
    key: 'creative',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
    link: 'https://atelier-evenementiel-tunisie.com',
  },
  {
    key: 'sports',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
    link: 'https://atelier-evenementiel-tunisie.com',
  },
  {
    key: 'wellbeing',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    link: 'https://domainetarenti.com',
  },
  {
    key: 'custom',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    link: 'https://atelier-evenementiel-tunisie.com',
  },
] as const;

export default async function Activities() {
  const t = await getTranslations('activities');

  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-white text-center mb-16">
          {t('title')}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map(({ key, image, link }) => (
            <InvisibleLink key={key} href={link}>
              <div className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${image}')` }}
                />
                <div className="absolute inset-0 bg-secondary/50 group-hover:bg-primary/60 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-end p-6">
                  <h3 className="font-heading font-bold text-white text-lg">
                    {t(key)}
                  </h3>
                </div>
              </div>
            </InvisibleLink>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/ClientLogos.tsx`**

```tsx
import { getTranslations } from 'next-intl/server';

export default async function ClientLogos() {
  const t = await getTranslations('clients');
  return (
    <section className="py-20 bg-background border-y border-brand/5">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-brand/40 text-sm font-medium uppercase tracking-widest mb-10">
          {t('title')}
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-10 bg-secondary/8 rounded-lg flex items-center justify-center"
            >
              <span className="text-secondary/20 font-heading text-xs font-bold tracking-wider">LOGO</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update `app/[locale]/page.tsx`**

```tsx
import Hero from '@/components/Hero';
import WhyTeamBuilding from '@/components/WhyTeamBuilding';
import Activities from '@/components/Activities';
import ClientLogos from '@/components/ClientLogos';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhyTeamBuilding />
      <Activities />
      <ClientLogos />
    </main>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```
Visit http://localhost:3000/fr — 6 dark cards with photo + hover overlay appear. Clicking a card navigates to the partner site. Logo row shows 6 subtle placeholders.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Activities section with invisible partner links and ClientLogos placeholder"
```

---

### Task 6: Contact form and API route

**Files:**
- Create: `lib/mail.ts`, `app/api/contact/route.ts`, `components/ContactForm.tsx`, `__tests__/api/contact.test.ts`
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `messages/*.json` keys `contact` (Task 2); `process.env.CONTACT_EMAIL`, `SMTP_*` vars (.env.local)
- Produces: POST `/api/contact` (400 on missing fields, 200 on bot/success); `<ContactForm>` client component

- [ ] **Step 1: Write the failing API route tests**

Create `__tests__/api/contact.test.ts`:
```ts
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
```

- [ ] **Step 2: Run tests to confirm failure**

```bash
npx jest __tests__/api/contact.test.ts
```
Expected: FAIL — `Cannot find module '@/app/api/contact/route'`

- [ ] **Step 3: Create `lib/mail.ts`**

```ts
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
```

- [ ] **Step 4: Create `app/api/contact/route.ts`**

```ts
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
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npx jest __tests__/api/contact.test.ts
```
Expected: 3 tests PASS

- [ ] **Step 6: Create `components/ContactForm.tsx`**

```tsx
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
```

- [ ] **Step 7: Update `app/[locale]/page.tsx`**

```tsx
import Hero from '@/components/Hero';
import WhyTeamBuilding from '@/components/WhyTeamBuilding';
import Activities from '@/components/Activities';
import ClientLogos from '@/components/ClientLogos';
import ContactForm from '@/components/ContactForm';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhyTeamBuilding />
      <Activities />
      <ClientLogos />
      <ContactForm />
    </main>
  );
}
```

- [ ] **Step 8: Verify form renders correctly**

```bash
npm run dev
```
Visit http://localhost:3000/fr — scroll to bottom. Fill and submit form. Success message appears. (Real email requires valid SMTP in .env.local.)

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add 4-field contact form with honeypot anti-spam and server-side Nodemailer API route"
```

---

### Task 7: Blog MDX infrastructure

**Files:**
- Create: `lib/mdx.ts`, `__tests__/lib/mdx.test.ts`, `app/[locale]/blog/page.tsx`, `app/[locale]/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `next-mdx-remote`, `gray-matter` (Task 1)
- Produces:
  - `getAllPosts(locale: string): PostMeta[]` — sorted by date descending
  - `getPostBySlug(locale: string, slug: string): Post` — throws if not found
  - Blog list page at `/[locale]/blog`
  - Article page at `/[locale]/blog/[slug]`

- [ ] **Step 1: Write failing tests for blog utilities**

Create `__tests__/lib/mdx.test.ts`:
```ts
import path from 'path';
import fs from 'fs';
import { getAllPosts, getPostBySlug } from '@/lib/mdx';

const testDir = path.join(process.cwd(), 'content/blog/fr');
const testFile = path.join(testDir, 'test-article-temp.mdx');

beforeAll(() => {
  fs.mkdirSync(testDir, { recursive: true });
  fs.writeFileSync(
    testFile,
    `---\ntitle: Test Article\ndate: 2026-01-15\nexcerpt: A short excerpt.\ncoverImage: https://images.unsplash.com/photo-1?w=1200&q=80\n---\n\nThis is the article content.`
  );
});

afterAll(() => {
  fs.rmSync(testFile, { force: true });
});

describe('getAllPosts', () => {
  it('returns an array for a valid locale', () => {
    const posts = getAllPosts('fr');
    expect(Array.isArray(posts)).toBe(true);
  });

  it('includes the test article', () => {
    const posts = getAllPosts('fr');
    expect(posts.some((p) => p.slug === 'test-article-temp')).toBe(true);
  });

  it('returns posts sorted newest first', () => {
    const posts = getAllPosts('fr');
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(new Date(posts[i].date).getTime());
    }
  });
});

describe('getPostBySlug', () => {
  it('returns correct frontmatter', () => {
    const post = getPostBySlug('fr', 'test-article-temp');
    expect(post.title).toBe('Test Article');
    expect(post.excerpt).toBe('A short excerpt.');
  });

  it('returns content', () => {
    const post = getPostBySlug('fr', 'test-article-temp');
    expect(post.content).toContain('This is the article content.');
  });

  it('throws for unknown slug', () => {
    expect(() => getPostBySlug('fr', 'non-existent-9999')).toThrow();
  });
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
npx jest __tests__/lib/mdx.test.ts
```
Expected: FAIL — `Cannot find module '@/lib/mdx'`

- [ ] **Step 3: Create `lib/mdx.ts`**

```ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(locale: string): PostMeta[] {
  const dir = path.join(BLOG_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf-8'));
      return {
        slug,
        title: String(data.title ?? ''),
        date: String(data.date ?? ''),
        excerpt: String(data.excerpt ?? ''),
        coverImage: String(data.coverImage ?? ''),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(locale: string, slug: string): Post {
  const filePath = path.join(BLOG_DIR, locale, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? ''),
    date: String(data.date ?? ''),
    excerpt: String(data.excerpt ?? ''),
    coverImage: String(data.coverImage ?? ''),
    content,
  };
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx jest __tests__/lib/mdx.test.ts
```
Expected: 5 tests PASS

- [ ] **Step 5: Create `app/[locale]/blog/page.tsx`**

```tsx
import { getAllPosts } from '@/lib/mdx';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const posts = getAllPosts(locale);
  const t = await getTranslations('blog');

  return (
    <main className="pt-24 pb-20 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="font-heading font-bold text-5xl text-secondary mb-4 text-center">Blog</h1>
        <p className="text-center text-brand/50 mb-16 text-sm">Team Building Tunisie</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="group block">
              <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-brand/5 h-full flex flex-col">
                {post.coverImage && (
                  <div
                    className="h-48 bg-cover bg-center flex-none"
                    style={{ backgroundImage: `url('${post.coverImage}')` }}
                  />
                )}
                <div className="p-6 flex flex-col flex-1">
                  <time className="text-xs text-brand/40 mb-3 block">
                    {new Date(post.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </time>
                  <h2 className="font-heading font-bold text-lg text-secondary mb-3 group-hover:text-primary transition-colors line-clamp-2 flex-1">
                    {post.title}
                  </h2>
                  <p className="text-brand/60 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <span className="mt-4 text-primary text-sm font-medium">{t('readMore')} →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Create `app/[locale]/blog/[slug]/page.tsx`**

```tsx
import { getPostBySlug, getAllPosts } from '@/lib/mdx';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Params = { locale: string; slug: string };

export async function generateStaticParams({ params: { locale } }: { params: { locale: string } }) {
  return getAllPosts(locale).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params: { locale, slug } }: { params: Params }): Promise<Metadata> {
  try {
    const post = getPostBySlug(locale, slug);
    return {
      title: `${post.title} | Team Building Tunisie`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        images: post.coverImage ? [{ url: post.coverImage }] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params: { locale, slug } }: { params: Params }) {
  let post;
  try {
    post = getPostBySlug(locale, slug);
  } catch {
    notFound();
  }

  return (
    <main className="pt-24 pb-20 bg-background">
      <article className="max-w-3xl mx-auto px-4">
        <Link
          href={`/${locale}/blog`}
          className="inline-block text-brand/50 hover:text-primary text-sm mb-8 transition-colors"
        >
          ← Blog
        </Link>
        {post.coverImage && (
          <div
            className="h-64 md:h-96 rounded-2xl bg-cover bg-center mb-10"
            style={{ backgroundImage: `url('${post.coverImage}')` }}
          />
        )}
        <time className="text-sm text-brand/40 mb-4 block">
          {new Date(post.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </time>
        <h1 className="font-heading font-bold text-4xl md:text-5xl text-secondary mb-10 leading-tight">
          {post.title}
        </h1>
        <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-secondary prose-a:text-inherit prose-a:no-underline hover:prose-a:no-underline prose-p:text-brand/80 prose-p:leading-relaxed">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </main>
  );
}
```

- [ ] **Step 7: Create content directories**

```bash
mkdir -p content/blog/fr content/blog/en
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add MDX blog infrastructure — lib/mdx.ts, blog list page, article page with MDXRemote"
```

---

### Task 8: BlogPreview section and home page final assembly

**Files:**
- Create: `components/BlogPreview.tsx`
- Modify: `app/[locale]/page.tsx` (final version)

**Interfaces:**
- Consumes: `getAllPosts(locale: string): PostMeta[]` from `lib/mdx` (Task 7); `messages/*.json` keys `blog` (Task 2)
- Produces: `<BlogPreview locale>` server component; complete 6-section home page

- [ ] **Step 1: Create `components/BlogPreview.tsx`**

```tsx
import { getAllPosts } from '@/lib/mdx';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function BlogPreview({ locale }: { locale: string }) {
  const posts = getAllPosts(locale).slice(0, 3);
  const t = await getTranslations('blog');

  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-heading font-bold text-4xl text-white">{t('title')}</h2>
          <Link
            href={`/${locale}/blog`}
            className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
          >
            {t('viewAll')} →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="group block">
              <article className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/40 transition-colors h-full flex flex-col">
                {post.coverImage && (
                  <div
                    className="h-40 bg-cover bg-center flex-none"
                    style={{ backgroundImage: `url('${post.coverImage}')` }}
                  />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <time className="text-white/35 text-xs mb-2 block">
                    {new Date(post.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
                      year: 'numeric', month: 'long',
                    })}
                  </time>
                  <h3 className="font-heading font-bold text-white group-hover:text-primary transition-colors text-base line-clamp-2 flex-1 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-white/40 text-xs line-clamp-2">{post.excerpt}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Final `app/[locale]/page.tsx`**

```tsx
import Hero from '@/components/Hero';
import WhyTeamBuilding from '@/components/WhyTeamBuilding';
import Activities from '@/components/Activities';
import ClientLogos from '@/components/ClientLogos';
import BlogPreview from '@/components/BlogPreview';
import ContactForm from '@/components/ContactForm';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <main>
      <Hero />
      <WhyTeamBuilding />
      <Activities />
      <ClientLogos />
      <BlogPreview locale={locale} />
      <ContactForm />
    </main>
  );
}
```

- [ ] **Step 3: Verify full home page**

```bash
npm run dev
```
Visit http://localhost:3000/fr — all sections in sequence: Hero → Why (light) → Activities (dark) → Logos (light) → Blog preview hidden if 0 posts → Contact form (light).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add BlogPreview section and finalize home page assembly"
```

---

### Task 9: 15 French blog articles

**Files:** `content/blog/fr/[slug].mdx` × 15

**MDX frontmatter format (apply to every file):**
```
---
title: [Article title in French]
date: 2026-0X-XX
excerpt: [2 sentences, 150–160 chars, keyword-rich for SEO meta]
coverImage: https://images.unsplash.com/[relevant-query]?w=1200&q=80
---
```

**Invisible link format in body (1–2 per article, already styled via `prose-a:text-inherit prose-a:no-underline`):**
```mdx
un [cadre naturel exceptionnel](https://domainetarenti.com)
une [agence spécialisée](https://atelier-evenementiel-tunisie.com)
```

- [ ] **Step 1: Write all 15 FR articles — full content, 1 200+ words each**

Use the briefs below. Each article must have: correct frontmatter, H2/H3 structure matching the sections listed, professional French for HR managers, exactly the invisible links specified, minimum 1 200 words.

---

**FR-01** `les-meilleures-activites-team-building-tunisie.mdx`
- Title: Les 10 meilleures activités de team building en Tunisie
- Date: 2026-01-15 | Cover: photo?q=team+work
- Keywords: activités team building Tunisie, team building Tunisie
- H2 sections: Introduction, 1. Activités outdoor et nature, 2. Team building culinaire, 3. Ateliers créatifs, 4. Challenges sportifs, 5. Bien-être et mindfulness, 6. Escape game et jeux de rôle, 7. Team building digital, 8. Expériences culturelles tunisiennes, 9. Séminaires résidentiels, 10. Activités sur mesure, Comment choisir la bonne activité, Conclusion
- Invisible links: "cadre naturel" → domainetarenti.com ; "agence spécialisée" → atelier-evenementiel-tunisie.com

**FR-02** `organiser-seminaire-entreprise-tunis.mdx`
- Title: Organiser un séminaire d'entreprise à Tunis : guide complet 2026
- Date: 2026-01-22 | Cover: photo?q=business+conference+tunisia
- Keywords: séminaire entreprise Tunis, organiser séminaire Tunisie
- H2 sections: Pourquoi choisir Tunis pour votre séminaire, Choisir le bon lieu, Définir le budget, Construire le programme, Intégrer des activités team building, Logistique et hébergement, Transport et transferts, Prestataires et sous-traitance, Checklist de l'organisateur, Conclusion
- Invisible links: "activités complémentaires" → atelier-evenementiel-tunisie.com

**FR-03** `team-building-outdoor-tunisie.mdx`
- Title: Team building outdoor en Tunisie : idées et lieux incontournables
- Date: 2026-02-01 | Cover: photo?q=outdoor+nature+tunisia
- Keywords: team building outdoor Tunisie, activités outdoor entreprise Tunisie
- H2 sections: Les atouts de l'outdoor pour les équipes, Montagnes et forêts de Kroumirie, Désert et dunes du Sud tunisien, Côte et sports nautiques, Les oliveraies et domaines ruraux, Organisation pratique d'une journée outdoor, Sécurité et encadrement, Lieux de référence en Tunisie, Pour les groupes internationaux, Conclusion
- Invisible links: "domaine naturel" → domainetarenti.com ; "prestataire événementiel" → atelier-evenementiel-tunisie.com

**FR-04** `choisir-agence-team-building-tunisie.mdx`
- Title: Comment choisir son agence de team building en Tunisie en 2026
- Date: 2026-02-10 | Cover: photo?q=business+meeting+handshake
- Keywords: agence team building Tunisie, choisir prestataire team building
- H2 sections: Pourquoi passer par une agence, Les critères de sélection essentiels, Questions à poser lors du premier contact, Expérience et références clients, Budget et transparence tarifaire, Catalogue standard vs programme sur mesure, Les signes d'une agence sérieuse, Les red flags à éviter, Comparer plusieurs devis, Conclusion
- Invisible links: "agence de référence en Tunisie" → atelier-evenementiel-tunisie.com

**FR-05** `team-building-culinaire-tunisie.mdx`
- Title: Team building culinaire en Tunisie : une expérience unique à partager
- Date: 2026-02-18 | Cover: photo?q=cooking+team+workshop
- Keywords: team building culinaire Tunisie, atelier cuisine entreprise
- H2 sections: La force du culinaire pour souder une équipe, La cuisine tunisienne comme vecteur culturel, Types d'ateliers culinaires, Couscous royal collaboratif, Pâtisseries orientales, Barbecue et grillades, Organisation pratique, Durée et format recommandé, Pour les équipes internationales, Bénéfices RH mesurables, Conclusion
- Invisible links: "experts en animation culinaire" → atelier-evenementiel-tunisie.com

**FR-06** `avantages-team-building-cohesion-equipe.mdx`
- Title: Les avantages du team building pour la cohésion d'équipe en entreprise
- Date: 2026-03-01 | Cover: photo?q=team+success+business
- Keywords: avantages team building entreprise, cohésion équipe team building
- H2 sections: Team building : bien plus qu'une journée de détente, Améliorer la communication inter-équipes, Renforcer la confiance et la collaboration, Réduire le turnover et l'absentéisme, Stimuler la créativité et l'innovation, Révéler les leaders naturels, Retour sur investissement (ROI) du team building, Intégrer le team building dans la stratégie RH, Études de cas et exemples concrets, Conclusion
- Invisible links: "programme annuel de team building" → atelier-evenementiel-tunisie.com

**FR-07** `team-building-international-tunisie.mdx`
- Title: Team building international en Tunisie : tout ce qu'il faut savoir
- Date: 2026-03-10 | Cover: photo?q=international+business+group+tunisia
- Keywords: team building international Tunisie, séminaire international Tunisie
- H2 sections: Tunisie, destination MICE en pleine croissance, Avantages géographiques et climatiques, Accessibilité internationale, Langue de travail et interprétariat, Hébergement 4-5 étoiles, Activités interculturelles, Formalités visa et logistique, Budget en devises, Accompagnement clé en main, Conclusion
- Invisible links: "accompagnement clé en main" → atelier-evenementiel-tunisie.com

**FR-08** `team-building-grands-groupes-tunisie.mdx`
- Title: Team building pour grands groupes en Tunisie (100 personnes et plus)
- Date: 2026-03-18 | Cover: photo?q=large+group+event+outdoor
- Keywords: team building grands groupes Tunisie, événement 100 personnes Tunisie
- H2 sections: Les défis spécifiques aux grands groupes, Logistique et coordination multi-équipes, Choisir un espace modulable, Activités adaptées aux grandes jauges, Le système de rotation par sous-groupes, Restauration à grande échelle, Audiovisuel et scénographie, Timing et planning détaillé, Budget grands groupes, Conclusion
- Invisible links: "espace modulable idéal" → domainetarenti.com

**FR-09** `team-building-creatif-ateliers-artistiques.mdx`
- Title: Team building créatif : ateliers artistiques pour entreprises en Tunisie
- Date: 2026-03-25 | Cover: photo?q=art+workshop+team
- Keywords: team building créatif Tunisie, atelier artistique entreprise
- H2 sections: La créativité au service de la performance, Types d'ateliers artistiques, Peinture collective, Céramique et argile, Photographie, Musique et percussions, La Tunisie et son artisanat ancestral, Bénéfices cognitifs et émotionnels, Adapter l'atelier à tous les profils, Organisation pratique, Conclusion
- Invisible links: "ateliers créatifs sur mesure" → atelier-evenementiel-tunisie.com

**FR-10** `budget-team-building-tunisie.mdx`
- Title: Budget team building en Tunisie : combien prévoir en 2026
- Date: 2026-04-05 | Cover: photo?q=business+planning+budget
- Keywords: budget team building Tunisie, coût team building entreprise Tunisie
- H2 sections: Les fourchettes de prix en 2026, Variables qui influencent le coût, Par type d'activité, Par taille de groupe, Poste transport et transferts, Poste restauration, Poste hébergement, Optimiser son budget sans sacrifier la qualité, Demander et comparer les devis, Conclusion
- Invisible links: "demander un devis personnalisé" → atelier-evenementiel-tunisie.com

**FR-11** `team-building-bien-etre-yoga-meditation.mdx`
- Title: Team building bien-être : yoga, méditation et cohésion en Tunisie
- Date: 2026-04-14 | Cover: photo?q=yoga+meditation+group+outdoor
- Keywords: team building bien-être Tunisie, yoga entreprise Tunisie
- H2 sections: Le bien-être au travail en 2026, Yoga en groupe : briser les barrières, Méditation pleine conscience et gestion du stress, Retraite bien-être d'une journée, Massage et sophrologie, Choisir le bon cadre naturel, Bénéfices mesurables sur la productivité, Intégrer le bien-être dans le programme annuel, Pour les équipes sous pression, Conclusion
- Invisible links: "cadre naturel et serein" → domainetarenti.com

**FR-12** `team-building-regions-tunisie.mdx`
- Title: Team building hors de Tunis : découvrir les régions tunisiennes
- Date: 2026-04-22 | Cover: photo?q=tunisia+landscape+nature
- Keywords: team building régions Tunisie, team building Cap Bon Tabarka Djerba
- H2 sections: Pourquoi sortir de Tunis, Cap Bon et Hammamet, Nabeul et l'artisanat, Tabarka et le Nord-Ouest, Djerba, île de toutes les cultures, Le Sahara tunisien, Bizerte et les lacs, Logistique en région, Lieux de réception hors capitale, Conclusion
- Invisible links: "lieu de réception en dehors de Tunis" → domainetarenti.com

**FR-13** `team-building-sportif-challenges-equipe.mdx`
- Title: Team building sportif : challenges et compétitions d'équipe en Tunisie
- Date: 2026-05-03 | Cover: photo?q=sports+team+competition
- Keywords: team building sportif Tunisie, challenges sportifs entreprise
- H2 sections: Sport et cohésion : un duo gagnant, Olympiades inter-équipes, Course d'orientation, Karting et sports mécaniques, Padel et sports de raquette, Voile et sports nautiques, Cyclisme et VTT, Gérer l'inclusivité pour les non-sportifs, Remise des prix et célébration, Conclusion
- Invisible links: "organisateurs de challenges sportifs" → atelier-evenementiel-tunisie.com

**FR-14** `tendances-team-building-2026-afrique-nord.mdx`
- Title: Tendances team building 2026 en Afrique du Nord
- Date: 2026-05-15 | Cover: photo?q=innovation+future+business
- Keywords: tendances team building 2026, team building Afrique du Nord
- H2 sections: Bilan 2025 et évolution du marché, Le hybride présentiel-distanciel s'impose, RSE et team building engagé, Inclusion et diversité au cœur des programmes, Le bien-être domine l'agenda, Intelligence artificielle dans l'animation, Expériences locales et immersives, Micro-events fréquents vs grand événement annuel, La Tunisie dans le contexte MENA, Perspectives 2027, Conclusion
- Invisible links: "acteurs innovants du marché tunisien" → atelier-evenementiel-tunisie.com

**FR-15** `team-building-sur-mesure-entreprise.mdx`
- Title: Team building sur mesure : pourquoi adapter l'expérience à votre entreprise
- Date: 2026-06-01 | Cover: photo?q=custom+design+creative+meeting
- Keywords: team building sur mesure Tunisie, programme team building personnalisé
- H2 sections: Les limites du catalogue standard, L'analyse des besoins, le point de départ, Diagnostic d'équipe : quels enjeux traiter ?, Co-construction du programme avec l'agence, Exemple de programme sur mesure sur 2 jours, Intégrer les valeurs et la culture de l'entreprise, Mesurer l'impact après l'événement, Suivi post-événement et fidélisation, Pourquoi faire appel à un expert, Conclusion
- Invisible links: "experts en team building sur mesure" → atelier-evenementiel-tunisie.com

---

- [ ] **Step 2: Verify FR blog**

```bash
npm run dev
```
Visit http://localhost:3000/fr/blog — confirm 15 article cards appear. Click 2–3 articles — confirm full content renders (1200+ words visible), invisible links are present in text but unstyled.

- [ ] **Step 3: Commit**

```bash
git add content/blog/fr/
git commit -m "content: add 15 French blog articles (1 200+ words each) with invisible partner links"
```

---

### Task 10: 15 English blog articles

**Files:** `content/blog/en/[slug].mdx` × 15

Same frontmatter format and invisible link rules as Task 9. Same Unsplash cover images (same queries, different photo IDs to avoid duplication). Minimum 1 200 words, professional English for international HR managers, H2/H3 structure.

- [ ] **Step 1: Write all 15 EN articles — full content, 1 200+ words each**

---

**EN-01** `best-team-building-activities-tunisia.mdx`
- Title: The 10 Best Team Building Activities in Tunisia
- Date: 2026-01-16 | Keywords: team building activities Tunisia
- Sections: Introduction, 1. Outdoor & Adventure, 2. Culinary Workshops, 3. Creative Arts, 4. Sports Challenges, 5. Well-being & Mindfulness, 6. Escape Games, 7. Digital Team Building, 8. Cultural Experiences, 9. Residential Seminars, 10. Custom Events, How to Choose, Conclusion
- Invisible links: "natural setting" → domainetarenti.com ; "specialist agency" → atelier-evenementiel-tunisie.com

**EN-02** `organize-corporate-seminar-tunis.mdx`
- Title: How to Organize a Corporate Seminar in Tunis: Complete 2026 Guide
- Date: 2026-01-23 | Keywords: corporate seminar Tunis, organize seminar Tunisia
- Sections: Why Choose Tunis, Selecting the Venue, Budgeting, Building the Program, Integrating Team Building, Accommodation & Logistics, Transport, Vendors & Outsourcing, Organizer's Checklist, Conclusion
- Invisible links: "complementary team activities" → atelier-evenementiel-tunisie.com

**EN-03** `outdoor-team-building-tunisia.mdx`
- Title: Outdoor Team Building in Tunisia: Ideas and Must-Visit Venues
- Date: 2026-02-02 | Keywords: outdoor team building Tunisia, outdoor corporate activities Tunisia
- Sections: The Power of Outdoor for Teams, Northern Mountains & Forests, Desert Dunes of the South, Coastline & Water Sports, Rural Estates & Olive Groves, Practical Organisation, Safety & Supervision, Key Venues in Tunisia, For International Groups, Conclusion
- Invisible links: "rural estate" → domainetarenti.com ; "event specialist" → atelier-evenementiel-tunisie.com

**EN-04** `choose-team-building-agency-tunisia.mdx`
- Title: How to Choose a Team Building Agency in Tunisia in 2026
- Date: 2026-02-11 | Keywords: team building agency Tunisia, choose event provider Tunisia
- Sections: Why Work with an Agency, Key Selection Criteria, Questions to Ask, Experience & Client References, Pricing Transparency, Catalogue vs Custom, Signs of a Serious Agency, Red Flags, Comparing Quotes, Conclusion
- Invisible links: "leading agency in Tunisia" → atelier-evenementiel-tunisie.com

**EN-05** `culinary-team-building-tunisia.mdx`
- Title: Culinary Team Building in Tunisia: A Unique Shared Experience
- Date: 2026-02-19 | Keywords: culinary team building Tunisia, cooking workshop corporate
- Sections: Why Culinary Works for Teams, Tunisian Cuisine as Cultural Bridge, Types of Culinary Workshops, Collaborative Couscous, Oriental Pastries, Barbecue Challenges, Practical Organisation, Ideal Format & Duration, For International Teams, Measurable HR Benefits, Conclusion
- Invisible links: "culinary animation experts" → atelier-evenementiel-tunisie.com

**EN-06** `benefits-team-building-team-cohesion.mdx`
- Title: The Benefits of Team Building for Team Cohesion in Companies
- Date: 2026-03-02 | Keywords: team building benefits, team cohesion corporate
- Sections: Team Building: More Than a Day Out, Improving Cross-Team Communication, Building Trust & Collaboration, Reducing Turnover & Absenteeism, Boosting Creativity & Innovation, Revealing Natural Leaders, ROI of Team Building, Embedding Team Building in HR Strategy, Case Studies, Conclusion
- Invisible links: "annual team building programme" → atelier-evenementiel-tunisie.com

**EN-07** `international-team-building-tunisia.mdx`
- Title: International Team Building in Tunisia: Everything You Need to Know
- Date: 2026-03-11 | Keywords: international team building Tunisia, international seminar Tunisia
- Sections: Tunisia: a Growing MICE Destination, Geographic & Climate Advantages, International Accessibility, Working Language & Interpretation, 4–5 Star Accommodation, Intercultural Activities, Visa & Logistics, FX Budgeting, Turnkey Support, Conclusion
- Invisible links: "turnkey event support" → atelier-evenementiel-tunisie.com

**EN-08** `team-building-large-groups-tunisia.mdx`
- Title: Team Building for Large Groups in Tunisia (100+ People)
- Date: 2026-03-19 | Keywords: team building large groups Tunisia, corporate event 100 people Tunisia
- Sections: Challenges of Large Groups, Logistics & Multi-Team Coordination, Choosing a Flexible Venue, Activities for Large Audiences, Rotation-Based Sub-Group System, Catering at Scale, AV & Stage Design, Detailed Scheduling, Large-Group Budget, Conclusion
- Invisible links: "flexible modular venue" → domainetarenti.com

**EN-09** `creative-team-building-art-workshops.mdx`
- Title: Creative Team Building: Art Workshops for Companies in Tunisia
- Date: 2026-03-26 | Keywords: creative team building Tunisia, art workshop corporate
- Sections: Creativity as a Performance Driver, Types of Art Workshops, Collective Painting, Pottery & Clay, Photography, Music & Percussion, Tunisia's Artisan Heritage, Cognitive & Emotional Benefits, Adapting for All Profiles, Practical Logistics, Conclusion
- Invisible links: "bespoke creative workshops" → atelier-evenementiel-tunisie.com

**EN-10** `team-building-budget-tunisia.mdx`
- Title: Team Building Budget in Tunisia: How Much to Budget in 2026
- Date: 2026-04-06 | Keywords: team building budget Tunisia, team building cost Tunisia
- Sections: 2026 Price Ranges, Cost Variables, By Activity Type, By Group Size, Transport & Transfers, Catering, Accommodation, Optimising Without Cutting Quality, Requesting & Comparing Quotes, Conclusion
- Invisible links: "request a personalised quote" → atelier-evenementiel-tunisie.com

**EN-11** `wellbeing-team-building-yoga-meditation.mdx`
- Title: Wellbeing Team Building: Yoga, Meditation and Cohesion in Tunisia
- Date: 2026-04-15 | Keywords: wellbeing team building Tunisia, yoga corporate Tunisia
- Sections: Workplace Wellbeing in 2026, Group Yoga: Breaking Down Barriers, Mindfulness Meditation & Stress Management, One-Day Wellbeing Retreat, Massage & Sophrology, Choosing the Right Natural Setting, Measurable Productivity Benefits, Embedding Wellbeing in Annual Planning, For High-Pressure Teams, Conclusion
- Invisible links: "peaceful natural setting" → domainetarenti.com

**EN-12** `team-building-regions-tunisia.mdx`
- Title: Team Building Outside Tunis: Exploring Tunisia's Regions
- Date: 2026-04-23 | Keywords: team building regions Tunisia, team building Cap Bon Tabarka Djerba
- Sections: Why Leave the Capital, Cap Bon & Hammamet, Nabeul & Artisan Crafts, Tabarka & the North-West, Djerba, Island of Cultures, The Tunisian Sahara, Bizerte & the Lakes, Regional Logistics, Reception Venues Outside Tunis, Conclusion
- Invisible links: "reception venue outside Tunis" → domainetarenti.com

**EN-13** `sports-team-building-challenges.mdx`
- Title: Sports Team Building: Challenges and Competitions in Tunisia
- Date: 2026-05-04 | Keywords: sports team building Tunisia, corporate sports challenges
- Sections: Sport & Cohesion: a Winning Pair, Multi-Team Olympics, Orienteering, Karting, Padel & Racket Sports, Sailing & Water Sports, Cycling & Mountain Biking, Inclusivity for Non-Athletes, Awards Ceremony & Celebration, Conclusion
- Invisible links: "corporate sports challenge organisers" → atelier-evenementiel-tunisie.com

**EN-14** `team-building-trends-2026-north-africa.mdx`
- Title: Team Building Trends 2026 in North Africa
- Date: 2026-05-16 | Keywords: team building trends 2026, team building North Africa
- Sections: 2025 Review & Market Evolution, Hybrid In-Person/Remote Becomes Standard, CSR-Driven Team Building, Inclusion & Diversity at the Core, Wellbeing Dominates the Agenda, AI in Event Animation, Local & Immersive Experiences, Frequent Micro-Events vs Annual Grand Event, Tunisia in the MENA Context, 2027 Outlook, Conclusion
- Invisible links: "innovative players in the Tunisian market" → atelier-evenementiel-tunisie.com

**EN-15** `custom-team-building-company.mdx`
- Title: Custom Team Building: Why Tailoring the Experience to Your Company Matters
- Date: 2026-06-02 | Keywords: custom team building Tunisia, bespoke team building programme
- Sections: The Limits of Off-the-Shelf Packages, Needs Analysis: the Starting Point, Team Diagnostic: What Challenges to Address?, Co-Designing the Programme with Your Agency, Sample 2-Day Custom Programme, Embedding Company Values & Culture, Measuring Impact After the Event, Post-Event Follow-Up & Loyalty, Why Work with a Specialist, Conclusion
- Invisible links: "custom team building specialists" → atelier-evenementiel-tunisie.com

---

- [ ] **Step 2: Verify EN blog**

```bash
npm run dev
```
Visit http://localhost:3000/en/blog — confirm 15 EN article cards appear. Click 2–3 — confirm full English content renders.

- [ ] **Step 3: Commit**

```bash
git add content/blog/en/
git commit -m "content: add 15 English blog articles (1 200+ words each) with invisible partner links"
```

---

### Task 11: SEO — sitemap, robots.txt, metadata

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/[locale]/layout.tsx` (already has `generateMetadata` from Task 2 — no changes needed)

**Interfaces:**
- Consumes: `getAllPosts(locale: string): PostMeta[]` from `lib/mdx` (Task 7)
- Produces: `/sitemap.xml` with all pages and articles, `/robots.txt`

- [ ] **Step 1: Create `app/sitemap.ts`**

```ts
import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/mdx';

const BASE = 'https://teambuildingtunisie.com';
const LOCALES = ['fr', 'en'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = LOCALES.flatMap((locale) => [
    { url: `${BASE}/${locale}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${BASE}/${locale}/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
  ]);

  const blogRoutes = LOCALES.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({
      url: `${BASE}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...staticRoutes, ...blogRoutes];
}
```

- [ ] **Step 2: Create `app/robots.ts`**

```ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://teambuildingtunisie.com/sitemap.xml',
  };
}
```

- [ ] **Step 3: Verify**

```bash
npm run build && npm start
```
Visit http://localhost:3000/sitemap.xml — confirm 4 static routes + 30 blog routes appear.
Visit http://localhost:3000/robots.txt — confirm sitemap URL is present.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add auto sitemap.xml and robots.txt for SEO"
```

---

### Task 12: Vercel deployment

**Files:**
- Create: `vercel.json`

**Interfaces:**
- Consumes: all previous tasks
- Produces: live production site at teambuildingtunisie.com

- [ ] **Step 1: Create `vercel.json`**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

- [ ] **Step 2: Final local build — fix any TypeScript or build errors**

```bash
npm run build
```
Expected: exits with code 0, no errors. Fix any TypeScript errors before continuing.

- [ ] **Step 3: Commit and push to GitHub**

```bash
git add -A
git commit -m "feat: add vercel.json and confirm production build passes"
git remote add origin https://github.com/YOUR_USERNAME/teambuildingtunisie.git
git push -u origin main
```

- [ ] **Step 4: Deploy on Vercel**

1. Go to https://vercel.com → "Add New Project" → import the GitHub repo
2. In Project Settings → Environment Variables, add:
   - `SMTP_HOST` — your SMTP server hostname
   - `SMTP_PORT` — `587`
   - `SMTP_USER` — your email login
   - `SMTP_PASS` — your email password or Gmail App Password
   - `CONTACT_EMAIL` — `hello@atelier-evenementiel-tunisie.com`
3. Click Deploy. Vercel builds and assigns a `.vercel.app` URL.

- [ ] **Step 5: Add custom domain**

1. In Vercel → Settings → Domains → Add `teambuildingtunisie.com`
2. At your domain registrar, set the DNS records Vercel provides (typically a CNAME for `www` and an A record for the root)
3. Wait for DNS propagation (up to 48h)

- [ ] **Step 6: Smoke-test live site**

Visit https://teambuildingtunisie.com:
- `/` → redirects to `/fr` ✓
- `/en` → English version ✓
- `/fr/blog` → 15 FR articles ✓
- `/en/blog` → 15 EN articles ✓
- Contact form → submits and shows success message, email arrives at hello@atelier-evenementiel-tunisie.com ✓
- `/sitemap.xml` → all URLs present ✓
- No phone number visible anywhere ✓
- No email address visible anywhere ✓
- Activity cards link to partner sites (invisible styling) ✓
