#!/usr/bin/env node
/**
 * Génère la couverture IA d'un article (Gemini) → public/images/blog/<name>.webp
 * (1200×630, ≤ 150 KB). Une même image sert à la version FR et à la version EN.
 *
 *   GEMINI_API_KEY=... node scripts/generate-cover.mjs \
 *     --name team-building-escape-game-tunisie \
 *     --prompt "Scene: ..."
 *
 * Affiche le chemin à mettre dans le frontmatter (coverImage: /images/blog/<name>.webp).
 * Code de sortie 1 si aucune image n'a pu être générée : NE PAS publier
 * l'article avec une photo de banque d'images à la place.
 */
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'images', 'blog');
const MODELS = ['gemini-3.1-flash-image', 'gemini-3.1-flash-image-preview', 'gemini-2.5-flash-image'];
const STYLE =
  'Photorealistic documentary-style corporate event photography, natural light, authentic candid moment (not stock-photo looking), ' +
  'people are North African / Mediterranean professionals in smart-casual attire, setting clearly in Tunisia. Wide 16:9 landscape framing. ' +
  'Absolutely no text, no letters, no signage, no logos, no watermarks.';

const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : undefined; };
const die = (m) => { console.error(`✗ ${m}`); process.exit(1); };

const name = arg('name');
const scene = arg('prompt');
const KEY = process.env.GEMINI_API_KEY;
if (!name || !scene) die('Usage : --name <nom-seo-kebab-case> --prompt "<scène>"');
if (!KEY) die('GEMINI_API_KEY absente.');
if (!/^[a-z0-9]+(-[a-z0-9]+)+$/.test(name)) die(`Nom invalide "${name}" (kebab-case, sans extension).`);
mkdirSync(OUT, { recursive: true });
const file = path.join(OUT, `${name}.webp`);
if (existsSync(file)) die(`${name}.webp existe déjà — choisir un nom unique.`);

let buf = null;
outer: for (const model of MODELS) {
  for (const imageConfig of [{ aspectRatio: '16:9' }, undefined]) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${STYLE}\n\nScene: ${scene}` }] }],
          generationConfig: { responseModalities: ['IMAGE', 'TEXT'], ...(imageConfig ? { imageConfig } : {}) },
        }),
      });
      const data = await res.json();
      if (data.error) { console.log(`  ${model}: ${String(data.error.message).slice(0, 100)}`); continue; }
      const img = (data.candidates?.[0]?.content?.parts || []).find((p) => p.inlineData);
      if (img) { buf = Buffer.from(img.inlineData.data, 'base64'); console.log(`  ✓ ${model}`); break outer; }
    } catch (e) { console.log(`  ${model}: ${e.message}`); }
  }
}
if (!buf) die('Aucun modèle n’a produit d’image.');

let q = 75, out;
do { out = await sharp(buf).resize(1200, 630, { fit: 'cover', position: 'attention' }).webp({ quality: q }).toBuffer(); q -= 7; }
while (out.length > 150 * 1024 && q >= 40);
if (out.length > 150 * 1024) die('Image > 150 KB après compression.');
writeFileSync(file, out);
console.log(`✓ ${Math.round(out.length / 1024)} KB → coverImage: /images/blog/${name}.webp`);
