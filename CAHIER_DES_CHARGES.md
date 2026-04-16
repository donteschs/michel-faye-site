# PROJET : MÉMOIRE VIVANTE — PLATEFORME D'ÉCRITURE & D'HÉRITAGE NUMÉRIQUE

## Objectif du projet

Créer une plateforme web élégante et intuitive permettant à une personne âgée (écrivaine) de :

- Centraliser tous ses écrits (journaux, récits, livres, pensées)
- Publier facilement ses contenus
- Enregistrer ses textes à la voix (speech-to-text)
- Être assistée par une IA pour écrire
- Transmettre sa mémoire au monde

Le site doit être conçu comme une **bibliothèque vivante + héritage numérique émotionnel**

---

## STRUCTURE GLOBALE

### 1. Interface ADMIN (privée — pour la marraine)

**Objectif :** Permettre à une personne non technique d'écrire et publier facilement

#### Éditeur intelligent
- Éditeur de texte moderne (type Notion)
- Mise en page simple (titres, paragraphes, images)
- Sauvegarde automatique

#### Assistance IA
- Bouton "Améliorer le texte"
- Bouton "Corriger"
- Bouton "Réécrire avec émotion"
- Bouton "Transformer en histoire"
- Résumé automatique

#### Dictée vocale (CRUCIAL)
- Bouton "Parler"
- Conversion audio → texte en temps réel
- Possibilité de modifier après dictée

#### Gestion des contenus
- Créer / modifier / supprimer : Articles, Journaux, Livres (chapitres)
- Organisation par : Catégories, Tags, Dates

#### Ajout de médias
- Upload images
- Possibilité d'ajouter audio (témoignages)

#### Authentification admin
- Email + mot de passe
- Accès sécurisé

---

### 2. Interface PUBLIQUE (lecteurs)

**Objectif :** Permettre aux visiteurs de découvrir les écrits

#### Accès libre
- Lecture sans compte
- Navigation simple

#### Navigation
- Accueil (présentation)
- Tous les écrits
- Catégories : Journaux, Histoires, Livres
- Recherche

#### Page article
- Titre, Texte, Date
- Audio (si disponible)
- Bouton partager

---

### 3. Espace COMMUNAUTÉ

**Objectif :** Créer de l'échange autour des écrits

#### Authentification utilisateur
- Création de compte obligatoire pour commenter

#### Commentaires
- Sous chaque article
- Réponses (thread)
- Like commentaires

#### Forum simple (optionnel V2)
- Discussions générales
- Questions / échanges

---

## DESIGN & EXPÉRIENCE

### Direction artistique
- Style : **chaleureux, apaisant, élégant**
- Inspiration : carnet intime, bibliothèque, papier ancien

### Couleurs
- Beige / crème / brun
- Noir doux
- Accent doré léger

### UI
- Texte lisible (grandes polices)
- Boutons simples
- Interface adaptée aux personnes âgées

---

## INTÉGRATION IA

- Correction grammaticale
- Amélioration du style
- Reformulation
- Génération de texte
- Résumé automatique

API recommandée : Claude API (Anthropic) ou OpenAI (GPT)

---

## VOIX → TEXTE

- Web Speech API (navigateur) ou Whisper API
- Dictée en direct, insertion dans l'éditeur

---

## STACK TECHNIQUE

| Couche | Technologie |
|--------|-------------|
| Frontend | React + Vite (existant) |
| Backend | Supabase (existant) |
| Base de données | PostgreSQL via Supabase |
| Auth | Supabase Auth (existant) |
| Stockage médias | Supabase Storage ou Cloudinary |
| IA | Claude API / OpenAI |
| Voix | Web Speech API + Whisper |

---

## RÈGLES D'ACCÈS

| Action | Connecté ? |
|--------|------------|
| Lire articles | Non requis |
| Commenter | Oui (compte utilisateur) |
| Publier | Oui (admin seulement) |

---

## MVP — VERSION 1 (priorité)

- [ ] Éditeur texte enrichi (remplacement du textarea actuel)
- [ ] Dictée vocale (Web Speech API)
- [ ] Assistance IA (améliorer / corriger / reformuler)
- [ ] Publication d'articles avec catégories et tags
- [ ] Page publique lecture (refonte UI)
- [ ] Commentaires avec threads et likes
- [ ] Upload d'images dans les articles
- [ ] Sauvegarde automatique des brouillons

---

## V2 — ÉVOLUTION

- Livres structurés avec chapitres
- Audio narration automatique (text-to-speech)
- IA qui écrit à partir de souvenirs dictés
- Timeline de vie visuelle
- Mode "biographie automatique"
- Export PDF des écrits
- Forum communautaire

---

## VISION LONG TERME

Créer une plateforme où une personne peut transmettre toute sa vie. Ses écrits deviennent immortels. Sa voix peut continuer à parler via IA.

> **Une mémoire numérique vivante.**

---

## CONTRAINTES IMPORTANTES

- Ultra simple à utiliser (cible : personne âgée non technique)
- Grandes polices, boutons visibles, pas de surcharge d'UI
- Temps de chargement rapide
- Sécurité des données

---

## BONUS

- Mode lecture audio automatique
- Export PDF des écrits
- Partage sur réseaux sociaux
