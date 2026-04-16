# Mémoire Vivante — Design Spec
**Date :** 2026-04-16
**Projet :** Refonte complète du site Michelle Faye
**Stack :** React 18 + Vite · Supabase · OpenAI GPT-4o · Web Speech API · Vercel

---

## Décisions de design

| Dimension | Choix | Raison |
|-----------|-------|--------|
| Style visuel | Éditorial Chaud | Crème, or, brun, serif — ambiance carnet intime / bibliothèque |
| Navigation publique | Sidebar + Contenu | Nav latérale fixe avec catégories, contenu principal à droite |
| Éditeur admin | Éditeur + Panel IA | Zone écriture à gauche, panel IA + publication à droite |
| IA | OpenAI GPT-4o | Boutons améliorer / corriger / réécrire / histoire / résumé |
| Voix | Web Speech API (fr-FR) | Sans clé API, natif Chrome/Edge, Whisper en V2 |
| Architecture | Multi-composants React + Vite | Garder la fondation existante, structure de dossiers claire |

---

## Design System

### Couleurs
```css
--cream:       #FFFBEB;  /* fond principal */
--cream-dark:  #F5EDE0;  /* fond sidebar, encarts */
--ink:         #2C1810;  /* texte principal */
--ink-light:   #57534E;  /* texte secondaire */
--ink-faint:   #78716C;  /* texte tertiaire, dates */
--gold:        #C4955A;  /* accent, labels catégorie */
--gold-light:  #F5EDE0;  /* fond encarts importants */
--blue:        #4A6FA5;  /* CTA, liens, boutons primaires */
--blue-light:  #E8EFF8;  /* fond boutons IA */
--blue-deep:   #2D4A7A;  /* hover boutons */
--rose:        #B85C5C;  /* dictée vocale, destructif */
--white:       #FFFFFF;  /* cartes, inputs */
--border:      #E8DDD4;  /* bordures générales */
```

### Typographie
```css
--serif: 'Playfair Display', Georgia, serif;   /* titres */
--body:  'Source Serif 4', Georgia, serif;     /* corps de texte */
--ui:    'Inter', system-ui, sans-serif;       /* boutons, labels, UI */

/* Échelle */
--text-xs:   12px;
--text-sm:   14px;
--text-base: 18px;   /* minimum body — accessibilité personnes âgées */
--text-lg:   20px;
--text-xl:   24px;
--text-2xl:  32px;
--text-3xl:  42px;
--text-4xl:  52px;

/* Line-height */
--leading-tight:  1.2;
--leading-normal: 1.6;
--leading-relaxed: 1.85;
```

### Espacement
Système 4/8px : `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80`

---

## Architecture des fichiers

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx          # Nav publique latérale
│   │   ├── Header.jsx           # Header mobile uniquement
│   │   └── Footer.jsx
│   ├── public/
│   │   ├── ArticleCard.jsx      # Carte article dans la grille
│   │   ├── ArticleReader.jsx    # Page de lecture complète
│   │   ├── CommentSection.jsx   # Commentaires + threads + likes
│   │   └── CitationBanner.jsx   # Citation rotative
│   ├── admin/
│   │   ├── AdminEditor.jsx      # Éditeur principal (Tiptap)
│   │   ├── AIPanel.jsx          # Panel boutons IA + résultat
│   │   ├── VoiceButton.jsx      # Bouton dictée vocale
│   │   ├── MediaUpload.jsx      # Upload image/audio
│   │   └── AdminArticleList.jsx # Liste articles admin
│   └── ui/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Toast.jsx
│       ├── Badge.jsx
│       └── Loader.jsx
├── pages/
│   ├── Home.jsx
│   ├── Articles.jsx
│   ├── ArticleDetail.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Login.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       └── AdminEditor.jsx
├── hooks/
│   ├── useVoiceDictation.js     # Web Speech API fr-FR
│   ├── useAIAssistant.js        # OpenAI GPT-4o
│   └── useAutoSave.js           # Sauvegarde brouillon toutes les 30s
├── lib/
│   ├── supabase.js              # Client Supabase
│   └── openai.js                # Client OpenAI + prompts
├── styles/
│   └── globals.css              # Variables CSS + reset
└── App.jsx                      # Routing par état + auth context
```

---

## Interface Publique

### Layout
- Sidebar fixe gauche (240px desktop) avec logo, navigation, recherche, citation
- Zone contenu principale (flex:1) scrollable
- Mobile : sidebar cachée, header avec burger menu

### Sidebar
- Logo "Michelle *Faye*" (Playfair Display)
- Tagline : "Écrits & Mémoires"
- Navigation : Accueil · Tous les écrits · Journaux · Histoires · Livres · Réflexions politiques
- Barre de recherche (filtre en temps réel)
- Citation du jour (rotative toutes les 12s)
- En bas : À propos · Contact · lien Admin discret

### Page Accueil
- Photo/avatar Michelle (ou initiales MF avec dégradé crème/or)
- Titre + présentation courte
- Section "Textes importants" (articles épinglés) — cartes or
- Section "Derniers écrits" (4 articles récents)
- Bouton "Voir tous les écrits"

### Page Écrits
- Filtres catégorie (pills)
- Grille auto-fill (min 320px) de cartes articles
- Chaque carte : catégorie (couleur), titre, date, extrait 3 lignes, badge "Important" si épinglé

### Page Article
- Catégorie + titre H1 (42px) + date
- Corps texte 20px, line-height 1.9, max-width 720px centré
- Lecteur audio si `audio_url` présent
- Barre partage (copier lien, email)
- Section commentaires

### Commentaires
- Affichés sans connexion (lecture)
- Connexion obligatoire pour commenter
- Threads (réponses à un commentaire)
- Bouton like sur chaque commentaire
- Formulaire : nom + texte (si connecté)
- Admin peut supprimer tout commentaire

---

## Interface Admin

### Accès
- Route `/admin` protégée — redirige vers `/login` si non connecté
- Seul `michele.fay@sfr.fr` a le rôle admin
- Lecteurs connectés ne voient pas l'espace admin

### Dashboard
- Titre "Espace de publication"
- Liste articles : titre, catégorie, statut (publié/brouillon), date
- Actions : Modifier · Supprimer (confirmation) · Aperçu
- Bouton "Nouvel écrit" en haut à droite

### Éditeur (2 colonnes)

**Colonne gauche (flex:1) :**
- Champ titre (grand, Playfair Display)
- Bandeau dictée vocale — fond rose clair, bouton rouge "🎤 Démarrer"
  - Indicateur d'écoute animé (3 points pulsants)
  - Transcription insérée à la position du curseur dans Tiptap
- Éditeur Tiptap : gras, italique, H2, H3, listes, citations, lien
- Upload image (drag & drop + bouton) → Supabase Storage → insère dans le texte
- Upload audio (bouton) → Supabase Storage → attaché à l'article

**Colonne droite (280px) :**
- Section "Assistant IA" :
  - 5 boutons : Améliorer le style · Corriger · Réécrire avec émotion · Transformer en histoire · Résumé auto
  - Encart résultat IA avec boutons "Insérer" / "Remplacer"
  - Indicateur de chargement pendant appel OpenAI
- Section "Publication" :
  - Sélecteur catégorie
  - Champ tags (chips)
  - Case "Texte important" (épinglé sur l'accueil)
  - Bouton "Enregistrer brouillon" (gris)
  - Bouton "Publier" (bleu)
- Indicateur sauvegarde auto ("Sauvegardé il y a 30s")

---

## Modèle de données Supabase

### Table `articles`
```sql
id            uuid primary key default gen_random_uuid()
title         text not null
category      text not null  -- 'Journal' | 'Histoire' | 'Livre' | 'Réflexion politique'
content       text           -- HTML généré par Tiptap
excerpt       text           -- auto-généré (200 premiers chars stripped)
status        text default 'draft'  -- 'draft' | 'published'
important     boolean default false
image_url     text
audio_url     text
tags          text[]
date          date default current_date
created_at    timestamptz default now()
updated_at    timestamptz default now()
author_id     uuid references auth.users
```

### Table `comments`
```sql
id            uuid primary key default gen_random_uuid()
article_id    uuid references articles(id) on delete cascade
user_id       uuid references auth.users
parent_id     uuid references comments(id)  -- null = commentaire racine
content       text not null
likes_count   integer default 0
created_at    timestamptz default now()
```

### Table `comment_likes`
```sql
id            uuid primary key default gen_random_uuid()
comment_id    uuid references comments(id) on delete cascade
user_id       uuid references auth.users
created_at    timestamptz default now()
unique(comment_id, user_id)
```

### Table `profiles`
```sql
id            uuid primary key references auth.users
email         text
display_name  text
avatar_url    text
created_at    timestamptz default now()
```

### Supabase Storage
- Bucket `article-images` — public
- Bucket `article-audio` — public

---

## Intégrations

### OpenAI GPT-4o
```
Clé : VITE_OPENAI_API_KEY (variable d'environnement)
Modèle : gpt-4o
Max tokens : 1000
Temperature : 0.7
```

Prompts système par bouton :
- **Améliorer** : "Tu es un éditeur littéraire francophone. Améliore le style de ce texte en conservant la voix et les idées de l'auteure. Retourne uniquement le texte amélioré."
- **Corriger** : "Corrige l'orthographe et la grammaire de ce texte français sans changer le style ni les idées. Retourne uniquement le texte corrigé."
- **Réécrire avec émotion** : "Réécris ce texte avec plus de profondeur émotionnelle et de sensibilité poétique, en gardant la première personne et les faits. Retourne uniquement le texte réécrit."
- **Transformer en histoire** : "Transforme ce texte en récit narratif vivant à la première personne, avec des détails sensoriels et une progression dramatique. Retourne uniquement le récit."
- **Résumé** : "Génère un résumé de 2-3 phrases de ce texte en français. Retourne uniquement le résumé."

### Web Speech API
```javascript
recognition.lang = 'fr-FR'
recognition.continuous = true
recognition.interimResults = true
```
Transcription insérée dans Tiptap via `editor.commands.insertContent()`.

---

## Règles d'accès

| Action | Visiteur | Lecteur connecté | Admin |
|--------|----------|-----------------|-------|
| Lire articles | ✅ | ✅ | ✅ |
| Rechercher | ✅ | ✅ | ✅ |
| Commenter | ❌ | ✅ | ✅ |
| Liker commentaire | ❌ | ✅ | ✅ |
| Supprimer commentaire | ❌ | ❌ | ✅ |
| Publier article | ❌ | ❌ | ✅ |
| Modifier article | ❌ | ❌ | ✅ |
| Supprimer article | ❌ | ❌ | ✅ |

---

## MVP — Ordre de build

1. Structure de dossiers + design system CSS (variables, reset, polices)
2. Composants UI de base (Button, Input, Toast, Badge, Loader)
3. Layout public (Sidebar, routing par état)
4. Pages publiques (Home, Articles, ArticleDetail, About, Contact)
5. Auth (Login admin + login lecteur)
6. Supabase (tables, RLS policies, Storage)
7. Dashboard admin + liste articles
8. Éditeur Tiptap + sauvegarde auto
9. Dictée vocale (Web Speech API)
10. Intégration OpenAI (5 boutons IA)
11. Upload médias (images + audio)
12. Commentaires (threads + likes)

---

## Hors scope MVP (V2)
- Livres structurés avec chapitres
- Text-to-speech automatique (lecture à voix haute)
- Timeline de vie
- Export PDF
- Forum communautaire
- Whisper API (remplacement Web Speech API)
