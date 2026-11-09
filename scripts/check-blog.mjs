#!/usr/bin/env node
/**
 * Contrôle qualité du blog (npm run check:blog) — bloquant avant tout commit d'article.
 * Vérifie pour chaque .mdx FR/EN :
 *  - frontmatter complet (title, date, excerpt 120–160 car. — bloquant pour les articles
 *    datés ≥ 2026-11-10, avertissement pour les anciens, coverImage)
 *  - couverture locale /images/blog/*.webp existante, ≤ 150 KB, partagée par 2 fichiers max
 *    (la version FR et la version EN d'un même sujet) — jamais une banque d'images externe
 *  - ≥ 1200 mots, pas de titre H1 (#) dans le corps
 *  - liens sortants : 2 maximum par article, jamais vers le domaine non canonique
 *    atelier-evenementiel-tunisie.com sans www
 *  - même nombre d'articles en FR et en EN
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
// Articles publiés avant la mise en place du contrôle : longueur d'excerpt en simple avertissement.
const STRICT_SINCE = '2026-11-10';
const covers = {};
const counts = {};

for (const locale of ['fr', 'en']) {
  const dir = path.join(ROOT, 'content', 'blog', locale);
  const files = readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  counts[locale] = files.length;
  for (const f of files) {
    const id = `${locale}/${f}`;
    const { data, content } = matter(readFileSync(path.join(dir, f), 'utf8'));
    for (const k of ['title', 'date', 'excerpt', 'coverImage']) if (!data[k]) errors.push(`${id}: frontmatter "${k}" manquant`);
    const ex = String(data.excerpt || '');
    if (ex && (ex.length < 120 || ex.length > 160)) (new Date(data.date).toISOString().slice(0, 10) >= STRICT_SINCE ? errors : warnings).push(`${id}: excerpt ${ex.length} car. (120–160, sert de meta description)`);
    const cover = String(data.coverImage || '');
    if (/^https?:/.test(cover)) errors.push(`${id}: coverImage externe (${cover.slice(0, 50)}…) — générer une image IA avec scripts/generate-cover.mjs`);
    else if (cover) {
      const file = path.join(ROOT, 'public', cover);
      if (!existsSync(file)) errors.push(`${id}: coverImage ${cover} introuvable`);
      else if (statSync(file).size > 150 * 1024) errors.push(`${id}: coverImage ${Math.round(statSync(file).size / 1024)} KB (max 150)`);
      (covers[cover] = covers[cover] || []).push(id);
    }
    const words = content.split(/\s+/).filter(Boolean).length;
    if (words < 1200) errors.push(`${id}: ${words} mots (min 1200)`);
    if (/^# /m.test(content)) errors.push(`${id}: titre H1 "# " dans le corps (le titre vient du frontmatter)`);
    const ext = [...content.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
    if (ext.length > 2) errors.push(`${id}: ${ext.length} liens sortants (max 2)`);
    if (ext.some((u) => /^https?:\/\/atelier-evenementiel-tunisie\.com/.test(u))) errors.push(`${id}: lien vers atelier-evenementiel-tunisie.com sans www (utiliser https://www.atelier-evenementiel-tunisie.com/)`);
  }
}
for (const [cover, ids] of Object.entries(covers)) if (ids.length > 2) errors.push(`${cover} utilisée par ${ids.length} articles (max 2 : FR + EN du même sujet)`);
if (counts.fr !== counts.en) errors.push(`${counts.fr} articles FR pour ${counts.en} EN`);

console.log(`Blog check — ${counts.fr} FR / ${counts.en} EN`);
for (const w of warnings) console.log('⚠ ' + w);
for (const e of errors) console.log('✗ ' + e);
console.log(errors.length ? `\n${errors.length} erreur(s) — corriger avant de commiter.` : '✓ Aucune erreur.');
process.exit(errors.length ? 1 : 0);
