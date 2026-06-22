# Design Spec — teambuildingtunisie.com

**Date :** 2026-06-22  
**Statut :** Approuvé  

---

## 1. Contexte & objectifs

**teambuildingtunisie.com** est un site vitrine de référencement positionné sur le marché du team building en Tunisie. Il cible les **RH et responsables d'entreprises tunisiennes et internationales**.

Objectifs :
- Être une référence SEO sur les requêtes team building Tunisie (FR + EN)
- Collecter des demandes de devis via un formulaire court
- Rediriger discrètement le trafic vers les sites du groupe via des liens invisibles dans les sections et le blog
- Ne jamais afficher de numéro de téléphone
- Masquer l'email de destination à l'utilisateur

**Sites du groupe :**
| Site | Rôle |
|------|------|
| `atelier-evenementiel-tunisie.com` | Agence organisatrice principale |
| `domainetarenti.com` | Lieu événementiel |
| `tunisiaeventlab.com` | Référencement complémentaire |
| `agence-evenementielle-tunisie.com` | Référencement complémentaire |

---

## 2. Stack technique

| Couche | Choix |
|--------|-------|
| Framework | Next.js 14 (App Router) |
| Style | Tailwind CSS |
| Langage | TypeScript |
| Email | Nodemailer (route API serveur) |
| i18n | next-intl |
| Blog | Fichiers MDX (`/content/blog/fr/` et `/content/blog/en/`) |
| Hébergement | Vercel (gratuit) |
| Anti-spam | Honeypot field côté serveur |

---

## 3. Structure des routes

```
/                        → redirect vers /fr ou /en (détection navigateur)
/[lang]/                 → Home page
/[lang]/blog/            → Liste des articles
/[lang]/blog/[slug]/     → Article individuel
/api/contact             → Route serveur — traitement formulaire uniquement
```

---

## 4. Home page — sections dans l'ordre

### 4.1 Hero
- Titre accrocheur + sous-titre en FR/EN
- CTA "Demander un devis" scrollant vers le formulaire
- Photo d'équipe en arrière-plan avec overlay coloré

### 4.2 Pourquoi le team building ?
- 3 blocs icône + texte court : Cohésion / Performance / Bien-être
- Ton corporate énergique

### 4.3 Nos activités
- 6 cartes visuelles : Outdoor, Culinaire, Créatif, Sportif, Bien-être, Sur mesure
- Chaque carte contient un lien invisible vers le site du groupe approprié :
  - Activités outdoor/lieu → `domainetarenti.com`
  - Organisation/sur mesure → `atelier-evenementiel-tunisie.com`
  - Liens codés `<a href>` avec classes `text-inherit no-underline hover:no-underline` — cliquables mais sans style visible, indexés par Google

### 4.4 Ils nous font confiance
- Logos clients (placeholders au lancement, à remplacer)

### 4.5 Blog — 3 derniers articles
- Aperçus des 3 articles les plus récents
- Lien vers `/[lang]/blog/`

### 4.6 Formulaire de contact
- **4 champs :**
  1. Entreprise (texte libre)
  2. Nombre de participants (select : 10-20 / 20-50 / 50-100 / 100+)
  3. Type d'activité (select : Outdoor / Culinaire / Créatif / Sportif / Bien-être / Sur mesure)
  4. Message (textarea)
- Honeypot field caché (anti-spam)
- Soumission → `POST /api/contact`
- Nodemailer envoie à `hello@atelier-evenementiel-tunisie.com`
- Confirmation affichée dans la page, pas d'email envoyé à l'utilisateur
- Aucun numéro de téléphone affiché nulle part

### 4.7 Footer
- Copyright + Mentions légales uniquement
- Aucun lien vers les autres sites du groupe dans le footer

---

## 5. Blog

### Volume de contenu au lancement
- **15 articles minimum** par langue (FR + EN) = 30 fichiers MDX
- **1 200 mots minimum** par article
- Sujets centrés sur le team building en Tunisie (long tail SEO)

### Exemples de sujets FR
1. Les 10 meilleures activités de team building en Tunisie
2. Organiser un séminaire d'entreprise à Tunis : guide complet
3. Team building outdoor en Tunisie : idées et lieux
4. Comment choisir son agence de team building en Tunisie
5. Team building culinaire : une expérience à partager
6. Les avantages du team building pour la cohésion d'équipe
7. Team building international en Tunisie : ce qu'il faut savoir
8. Activités team building pour grands groupes (100+ personnes)
9. Team building créatif : ateliers artistiques en entreprise
10. Budget team building : combien prévoir en Tunisie
11. Team building bien-être : yoga, méditation et cohésion
12. Organiser un team building en dehors de Tunis : régions et lieux
13. Team building sportif : challenges et compétitions d'équipe
14. Les tendances team building 2026 en Afrique du Nord
15. Team building sur mesure : pourquoi adapter l'expérience à votre équipe

### Liens discrets dans les articles
- Dans le corps des articles, des termes naturels sont liés aux sites du groupe
- Style : `text-inherit no-underline hover:no-underline` — cliquables, invisibles visuellement, indexés par Google
- Ex : "...un cadre naturel exceptionnel comme **le Domaine Tarenti**..." → lien vers `domainetarenti.com`
- Ex : "...faire appel à **une agence spécialisée**..." → lien vers `atelier-evenementiel-tunisie.com`

---

## 6. Design visuel

### Palette
| Rôle | Couleur |
|------|---------|
| Principale | `#FF6B35` (orange vif) |
| Secondaire | `#1A1A2E` (bleu nuit) |
| Fond | `#F5F5F0` (blanc cassé) |
| Texte | `#2D2D2D` |

### Typographie
- Titres : `Space Grotesk` (moderne, impactant)
- Corps : `Inter` (lisible, universel)

### Principes visuels
- Sections alternées fond clair / fond sombre
- Cartes activités : photo plein cadre + overlay coloré au survol
- Animations légères à l'entrée (fade-in) — pas de parallaxe lourde
- Entièrement responsive mobile
- Images de lancement : Unsplash/Pexels (libres de droits), remplaçables

---

## 7. SEO technique

- `<title>` et `<meta description>` uniques par page et par article
- `sitemap.xml` généré automatiquement par Next.js
- `robots.txt` standard
- Open Graph (titre, description, image) pour partage LinkedIn/Facebook
- URLs canoniques propres par langue

---

## 8. Internationalisation

- Bibliothèque : `next-intl`
- Langues : Français (`/fr/`) et Anglais (`/en/`)
- Détection automatique de la langue du navigateur à l'entrée sur `/`
- Basculement FR ↔ EN via un toggle dans le header
- Tous les textes de l'interface dans des fichiers de traduction (`/messages/fr.json`, `/messages/en.json`)

---

## 9. Ce qui est explicitement exclu

- Numéro de téléphone (aucun, nulle part)
- Email visible dans l'interface
- Liens évidents vers les autres sites (footer, header, boutons)
- Email de confirmation envoyé à l'utilisateur après soumission
- Système d'authentification ou espace client
- Paiement en ligne
