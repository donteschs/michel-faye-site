# Mémoire Vivante — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refonte complète du site Michelle Faye en plateforme d'écriture et d'héritage numérique.

**Architecture:** SPA React 18 + Vite avec routing par état. Sidebar fixe pour la navigation publique, éditeur 2 colonnes (Tiptap + panel IA) pour l'admin. Supabase pour auth/DB/storage, OpenAI GPT-4o pour l'assistance à l'écriture, Web Speech API pour la dictée vocale.

**Tech Stack:** React 18 · Vite · Supabase · Tiptap · OpenAI SDK · DOMPurify · Web Speech API · Vercel

---

## File Map

```
src/
├── styles/globals.css
├── lib/
│   ├── supabase.js
│   └── openai.js
├── hooks/
│   ├── useAuth.js
│   ├── useVoiceDictation.js
│   ├── useAIAssistant.js
│   └── useAutoSave.js
├── components/
│   ├── ui/Button.jsx, Input.jsx, Toast.jsx, Badge.jsx, Loader.jsx, index.js
│   ├── layout/Sidebar.jsx, MobileHeader.jsx
│   ├── public/ArticleCard.jsx, ArticleReader.jsx, CommentSection.jsx
│   └── admin/VoiceButton.jsx, AIPanel.jsx, MediaUpload.jsx, AdminArticleList.jsx
├── pages/
│   ├── Home.jsx, Articles.jsx, ArticleDetail.jsx, About.jsx, Contact.jsx, Login.jsx
│   └── admin/AdminDashboard.jsx, AdminEditor.jsx
└── App.jsx
```

---

## Task 1: Nettoyage + Design System CSS

**Files:**
- Modify: `src/App.jsx`
- Create: `src/styles/globals.css`
- Modify: `index.html`
- Modify: `src/main.jsx`

- [ ] Vider `src/App.jsx` :
```jsx
export default function App() {
  return <div>Mémoire Vivante</div>;
}
```

- [ ] Créer `src/styles/globals.css` :
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&family=Inter:wght@400;500;600&display=swap');

:root {
  --cream: #FFFBEB; --cream-dark: #F5EDE0; --ink: #2C1810;
  --ink-light: #57534E; --ink-faint: #78716C;
  --gold: #C4955A; --gold-light: #F5EDE0;
  --blue: #4A6FA5; --blue-light: #E8EFF8; --blue-deep: #2D4A7A;
  --rose: #B85C5C; --rose-light: #FDECEA;
  --white: #FFFFFF; --border: #E8DDD4;
  --serif: 'Playfair Display', Georgia, serif;
  --body: 'Source Serif 4', Georgia, serif;
  --ui: 'Inter', system-ui, sans-serif;
  --text-xs: 12px; --text-sm: 14px; --text-base: 18px;
  --text-lg: 20px; --text-xl: 24px; --text-2xl: 32px;
  --text-3xl: 42px; --text-4xl: 52px;
  --leading-tight: 1.2; --leading-normal: 1.6; --leading-relaxed: 1.85;
  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --shadow-sm: 0 1px 3px rgba(44,36,32,0.06);
  --shadow-md: 0 4px 16px rgba(44,36,32,0.08);
  --shadow-lg: 0 8px 32px rgba(44,36,32,0.10);
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--cream); color: var(--ink); font-family: var(--body); font-size: var(--text-base); line-height: var(--leading-relaxed); -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4 { font-family: var(--serif); line-height: var(--leading-tight); }
a { color: var(--blue); text-decoration: none; }
a:hover { color: var(--blue-deep); }
button { font-family: var(--ui); cursor: pointer; border: none; background: none; }
input, textarea, select { font-family: var(--body); font-size: var(--text-base); }
img { max-width: 100%; height: auto; display: block; }
:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; border-radius: 4px; }
```

- [ ] Mettre à jour `index.html` avec `lang="fr"`, title et meta description.
- [ ] Importer `./styles/globals.css` dans `src/main.jsx`.
- [ ] Vérifier : `npm run dev` → page visible, Playfair Display chargée.
- [ ] Commit : `git add -A && git commit -m "feat: design system CSS + project reset"`

---

## Task 2: Composants UI de base

**Files:** `src/components/ui/Button.jsx`, `Input.jsx`, `Toast.jsx`, `Badge.jsx`, `Loader.jsx`, `index.js`

- [ ] Créer `src/components/ui/Loader.jsx` :
```jsx
export default function Loader({ size = 20, color = 'var(--ink-faint)' }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:3, height:size }} aria-label="Chargement">
      {[0, 0.2, 0.4].map((delay, i) => (
        <span key={i} style={{ width:size/4, height:size/4, borderRadius:'50%', background:color, display:'inline-block', animation:`pulse 1.4s ${delay}s infinite ease-in-out` }} />
      ))}
      <style>{`@keyframes pulse{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
    </span>
  );
}
```

- [ ] Créer `src/components/ui/Button.jsx` :
```jsx
import Loader from './Loader';
const variants = {
  primary:   { background:'var(--blue)', color:'#fff', border:'none' },
  secondary: { background:'transparent', color:'var(--blue)', border:'1px solid var(--blue)' },
  ghost:     { background:'transparent', color:'var(--ink-light)', border:'1px solid var(--border)' },
  danger:    { background:'transparent', color:'var(--rose)', border:'1px solid var(--rose)' },
};
const sizes = {
  sm: { padding:'6px 14px', fontSize:'var(--text-sm)' },
  md: { padding:'10px 24px', fontSize:'var(--text-base)' },
  lg: { padding:'14px 36px', fontSize:'var(--text-lg)' },
};
export default function Button({ children, variant='primary', size='md', disabled=false, loading=false, onClick, type='button', style={} }) {
  return (
    <button type={type} disabled={disabled||loading} onClick={onClick}
      style={{ ...variants[variant], ...sizes[size], borderRadius:6, fontFamily:'var(--ui)', fontWeight:600, letterSpacing:'0.02em', cursor:disabled||loading?'not-allowed':'pointer', opacity:disabled?.5:1, transition:'var(--transition)', display:'inline-flex', alignItems:'center', gap:8, ...style }}>
      {loading ? <Loader size={16} color={variant==='primary'?'#fff':'var(--ink-faint)'} /> : children}
    </button>
  );
}
```

- [ ] Créer `src/components/ui/Badge.jsx` :
```jsx
const presets = {
  gold:    { background:'var(--gold-light)', color:'var(--gold)' },
  blue:    { background:'var(--blue-light)', color:'var(--blue)' },
  rose:    { background:'var(--rose-light)', color:'var(--rose)' },
  neutral: { background:'var(--cream-dark)', color:'var(--ink-faint)' },
};
export default function Badge({ children, preset='gold', style={} }) {
  return (
    <span style={{ ...presets[preset], display:'inline-block', padding:'3px 10px', borderRadius:100, fontSize:'var(--text-xs)', fontFamily:'var(--ui)', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', ...style }}>
      {children}
    </span>
  );
}
```

- [ ] Créer `src/components/ui/Input.jsx` :
```jsx
export default function Input({ label, type='text', value, onChange, placeholder, error, required, multiline=false, rows=4, style={} }) {
  const base = { width:'100%', padding:'12px 16px', border:`1px solid ${error?'var(--rose)':'var(--border)'}`, borderRadius:8, fontSize:'var(--text-base)', fontFamily:'var(--body)', color:'var(--ink)', background:'var(--white)', outline:'none', transition:'var(--transition)', lineHeight:'var(--leading-relaxed)' };
  return (
    <div style={{ marginBottom:20, ...style }}>
      {label && <label style={{ display:'block', fontSize:'var(--text-sm)', fontFamily:'var(--ui)', fontWeight:600, color:'var(--ink)', marginBottom:6 }}>{label}{required&&<span style={{color:'var(--rose)',marginLeft:4}}>*</span>}</label>}
      {multiline
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{ ...base, resize:'vertical', minHeight:rows*28 }} />
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={base} />}
      {error && <p style={{ color:'var(--rose)', fontSize:'var(--text-sm)', marginTop:6 }}>{error}</p>}
    </div>
  );
}
```

- [ ] Créer `src/components/ui/Toast.jsx` :
```jsx
import { useEffect } from 'react';
export default function Toast({ message, type='success', onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div role="status" aria-live="polite" style={{ position:'fixed', bottom:24, right:24, background:type==='error'?'var(--rose)':'var(--ink)', color:'#fff', padding:'14px 24px', borderRadius:8, fontSize:'var(--text-sm)', fontFamily:'var(--ui)', zIndex:1000, boxShadow:'var(--shadow-lg)', animation:'slideUp .3s ease', maxWidth:340 }}>
      {message}
      <style>{`@keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}
```

- [ ] Créer `src/components/ui/index.js` :
```js
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Toast } from './Toast';
export { default as Badge } from './Badge';
export { default as Loader } from './Loader';
```

- [ ] Commit : `git add -A && git commit -m "feat: UI base components"`

---

## Task 3: Supabase — lib + tables SQL + Storage

**Files:** `src/lib/supabase.js`, `.env.local`

- [ ] Créer `.env.local` :
```
VITE_SUPABASE_URL=https://obcopcseuuwmjprcbrnf.supabase.co
VITE_SUPABASE_ANON_KEY=<clé anon existante>
VITE_OPENAI_API_KEY=sk-...
```

- [ ] Vérifier `.gitignore` contient `.env.local` : `grep ".env.local" .gitignore || echo ".env.local" >> .gitignore`

- [ ] Créer `src/lib/supabase.js` :
```js
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

- [ ] Exécuter dans Supabase SQL Editor :
```sql
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Journal',
  content text,
  excerpt text,
  status text not null default 'draft' check (status in ('draft','published')),
  important boolean not null default false,
  image_url text, audio_url text,
  tags text[] default '{}',
  date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_id uuid references auth.users
);
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text, display_name text, avatar_url text,
  created_at timestamptz not null default now()
);
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles(id) on delete cascade,
  user_id uuid not null references auth.users,
  parent_id uuid references comments(id),
  content text not null,
  likes_count integer not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references comments(id) on delete cascade,
  user_id uuid not null references auth.users,
  created_at timestamptz not null default now(),
  unique(comment_id, user_id)
);
create or replace function handle_new_user() returns trigger as $$
begin insert into profiles (id, email) values (new.id, new.email); return new; end;
$$ language plpgsql security definer;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();
```

- [ ] Configurer RLS dans Supabase SQL Editor :
```sql
alter table articles enable row level security;
create policy "publié lisible" on articles for select using (status='published');
create policy "admin tout" on articles for all using (auth.jwt()->>'email'='michele.fay@sfr.fr');
alter table profiles enable row level security;
create policy "profiles lisibles" on profiles for select using (true);
create policy "own profile" on profiles for all using (auth.uid()=id);
alter table comments enable row level security;
create policy "comments lisibles" on comments for select using (true);
create policy "insert commentaire" on comments for insert with check (auth.uid()=user_id);
create policy "admin delete comment" on comments for delete using (auth.jwt()->>'email'='michele.fay@sfr.fr');
create policy "own delete comment" on comments for delete using (auth.uid()=user_id);
alter table comment_likes enable row level security;
create policy "likes lisibles" on comment_likes for select using (true);
create policy "insert like" on comment_likes for insert with check (auth.uid()=user_id);
create policy "delete like" on comment_likes for delete using (auth.uid()=user_id);
```

- [ ] Créer dans Supabase Storage : bucket `article-images` (public) + bucket `article-audio` (public).

- [ ] Commit : `git add src/lib/supabase.js .gitignore && git commit -m "feat: Supabase client + schema documented"`

---

## Task 4: Auth hook + App.jsx routing

**Files:** `src/hooks/useAuth.js`, `src/App.jsx`

- [ ] Créer `src/hooks/useAuth.js` :
```js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
const ADMIN_EMAIL = 'michele.fay@sfr.fr';
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);
  return {
    user, loading,
    isAdmin: user?.email === ADMIN_EMAIL,
    isAuthenticated: !!user,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
  };
}
```

- [ ] Réécrire `src/App.jsx` — routing par état + AppContext + Toast :
```jsx
import { useState, createContext, useContext } from 'react';
import { useAuth } from './hooks/useAuth';
import Sidebar from './components/layout/Sidebar';
import MobileHeader from './components/layout/MobileHeader';
import Toast from './components/ui/Toast';
// Pages (importées dynamiquement)
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEditor from './pages/admin/AdminEditor';

export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export default function App() {
  const auth = useAuth();
  const [page, setPage] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [editArticle, setEditArticle] = useState(null);
  const [mobNavOpen, setMobNavOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = (to, data = null) => {
    setPage(to); setMobNavOpen(false);
    if (to === 'article') setSelectedArticle(data);
    if (to === 'editor') setEditArticle(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const notify = (message, type = 'success') => setToast({ message, type });

  const renderPage = () => {
    if (auth.loading) return null;
    switch (page) {
      case 'home':    return <Home />;
      case 'articles':return <Articles />;
      case 'article': return <ArticleDetail />;
      case 'about':   return <About />;
      case 'contact': return <Contact />;
      case 'login':   return <Login />;
      case 'admin':   return auth.isAdmin ? <AdminDashboard /> : <Login />;
      case 'editor':  return auth.isAdmin ? <AdminEditor /> : <Login />;
      default:        return <Home />;
    }
  };

  return (
    <AppContext.Provider value={{ ...auth, page, navigate, selectedArticle, editArticle, notify }}>
      <div style={{ display:'flex', minHeight:'100dvh', background:'var(--cream)' }}>
        <Sidebar />
        <MobileHeader open={mobNavOpen} onToggle={() => setMobNavOpen(o => !o)} />
        <main style={{ flex:1, marginLeft:240, minHeight:'100dvh', display:'flex', flexDirection:'column' }} className="main-content">
          {renderPage()}
        </main>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <style>{`@media(max-width:768px){.main-content{margin-left:0!important;padding-top:64px}}`}</style>
    </AppContext.Provider>
  );
}
```

- [ ] Commit : `git add -A && git commit -m "feat: auth hook + App routing context"`

---

## Task 5: Layout — Sidebar + MobileHeader

**Files:** `src/components/layout/Sidebar.jsx`, `src/components/layout/MobileHeader.jsx`

- [ ] Créer `src/components/layout/Sidebar.jsx` — sidebar fixe 240px avec :
  - Logo "Michelle Faye" cliquable → home
  - Barre de recherche (filtre en temps réel sur Articles)
  - Nav : Accueil, Tous les écrits
  - Section Catégories : Journaux, Histoires, Livres, Réflexions
  - Encart citation rotative (12s interval)
  - Footer nav : À propos, Contact, Espace admin (ou Publier + Déconnexion si admin)
  - NavLink component interne avec active state, borderLeft gold, hover effect
  - Masqué sur mobile via `@media(max-width:768px){display:none}`

- [ ] Créer `src/components/layout/MobileHeader.jsx` — header fixe 64px :
  - Logo + burger menu
  - `display:none` sur desktop, `display:flex` sur mobile
  - Bouton burger toggle `aria-label`

- [ ] Vérifier : sidebar visible desktop, header mobile sur 375px.
- [ ] Commit : `git add -A && git commit -m "feat: Sidebar + MobileHeader layout"`

---

## Task 6: Pages publiques — Home, Articles, ArticleDetail

**Files:** `src/pages/Home.jsx`, `Articles.jsx`, `ArticleDetail.jsx`, `src/components/public/ArticleCard.jsx`

- [ ] Installer DOMPurify : `npm install dompurify`

- [ ] Créer `src/components/public/ArticleCard.jsx` — carte cliquable avec :
  - Point doré si `article.important`
  - Badge catégorie coloré (gold=Journal, blue=Histoire, gris=Livre, rose=Réflexion)
  - Titre Playfair Display 20px
  - Date formatée fr-FR
  - Extrait 3 lignes (-webkit-line-clamp: 3)
  - Hover : translateY(-2px) + shadow-md + border gold

- [ ] Créer `src/pages/Home.jsx` — page accueil avec :
  - Hero : titre H1 avec `<em>lumière</em>` en bleu, description, bouton CTA
  - Avatar MF avec dégradé crème/or et bordure intérieure or (si pas de photo)
  - Section "Textes importants" (articles.filter(a => a.important)) — cartes or avec border-left gold
  - Section "Derniers écrits" (4 articles récents) — grille ArticleCard
  - Bouton "Voir tous les écrits" si > 4 articles
  - SectionTitle helper : h2 + ligne décorative flex

- [ ] Créer `src/pages/Articles.jsx` — liste filtrée avec :
  - H1 "Tous les écrits"
  - Pills filtre catégorie (Tous + 4 catégories) — active = bleu plein
  - Grille auto-fill minmax(280px, 1fr) ArticleCard
  - Message "Aucun article" si filtré vide

- [ ] Créer `src/pages/ArticleDetail.jsx` avec :
  - Bouton retour ← Retour aux écrits
  - Badge catégorie + H1 42px + date
  - Lecteur `<audio controls>` si audio_url présent
  - Corps du texte sanitisé avec DOMPurify :
    ```jsx
    import DOMPurify from 'dompurify';
    // dans le JSX :
    <div style={{ fontSize:'var(--text-lg)', lineHeight:1.9, color:'var(--ink)' }}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(a.content || '') }} />
    ```
  - Barre partage (copier lien via `navigator.clipboard.writeText`)
  - `<CommentSection articleId={a.id} />`

- [ ] Commit : `git add -A && git commit -m "feat: public pages Home, Articles, ArticleDetail + DOMPurify"`

---

## Task 7: About, Contact, Login

**Files:** `src/pages/About.jsx`, `Contact.jsx`, `Login.jsx`

- [ ] Créer `src/pages/About.jsx` — page statique avec :
  - H1, 2 paragraphes, encart citation gold (border-left 4px gold + fond gold-light)
  - H2 "Un engagement au quotidien" + para
  - H2 "L'écriture comme héritage" + para

- [ ] Créer `src/pages/Contact.jsx` — formulaire avec :
  - Champs nom, email, message via composant Input
  - Bouton Envoyer (placeholder OK pour MVP — email service en V2)
  - notify("Message envoyé !") + reset form

- [ ] Créer `src/pages/Login.jsx` — double mode signin/signup avec :
  - Toggle signin ↔ signup
  - Mode signup : champ nom supplémentaire
  - Erreur Supabase affichée en rouge
  - Après login admin → navigate('admin'), sinon → navigate('home')
  - Après signup → notify("Compte créé ! Vérifiez votre email.")

- [ ] Commit : `git add -A && git commit -m "feat: About, Contact, Login pages"`

---

## Task 8: Admin Dashboard

**Files:** `src/components/admin/AdminArticleList.jsx`, `src/pages/admin/AdminDashboard.jsx`

- [ ] Créer `src/components/admin/AdminArticleList.jsx` — liste articles admin :
  - Chaque item : titre + badge statut (Publié=blue / Brouillon=neutral) + catégorie + date
  - Boutons : Modifier (navigate editor) · Publier/Dépublier (toggle status) · Supprimer (window.confirm puis delete)
  - Message vide si aucun article

- [ ] Créer `src/pages/admin/AdminDashboard.jsx` :
  - H1 "Espace de publication" + Badge "Admin"
  - Compteur publiés / brouillons
  - Bouton "+ Nouvel écrit" → navigate('editor', null)
  - AdminArticleList avec callback onRefresh

- [ ] Commit : `git add -A && git commit -m "feat: admin dashboard + article list"`

---

## Task 9: Éditeur Tiptap + Sauvegarde auto

**Files:** `src/hooks/useAutoSave.js`, `src/pages/admin/AdminEditor.jsx`

- [ ] Installer Tiptap :
```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder
```

- [ ] Créer `src/hooks/useAutoSave.js` — sauvegarde Supabase toutes les 30s :
```js
import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
export function useAutoSave(articleId, getData, intervalMs = 30000) {
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  const save = useCallback(async () => {
    const data = getData();
    if (!data.title && !data.content) return;
    setSaving(true);
    try {
      if (articleId) {
        await supabase.from('articles').update({ ...data, status:'draft' }).eq('id', articleId);
      } else {
        await supabase.from('articles').insert({ ...data, status:'draft' });
      }
      setLastSaved(new Date());
    } finally { setSaving(false); }
  }, [articleId, getData]);
  useEffect(() => {
    const t = setInterval(save, intervalMs);
    return () => clearInterval(t);
  }, [save, intervalMs]);
  return { lastSaved, saving, saveNow: save };
}
```

- [ ] Créer `src/pages/admin/AdminEditor.jsx` — layout 2 colonnes :
  - **Header sticky** : bouton Retour + titre + indicateur sauvegarde auto
  - **Colonne gauche (flex:1)** :
    - `<VoiceButton onTranscript={...} />`
    - Input titre (grande, Playfair Display, sans bordure)
    - Barre outils Tiptap : G, I, H2, H3, ❝, ≡ (boutons toggle actif=bleu)
    - `<EditorContent editor={editor} />` (min-height 400px)
    - `<MediaUpload ... />` en pied
  - **Colonne droite (280px)** :
    - `<AIPanel ... />`
    - Sélecteur catégorie
    - Champ tags (texte libre, split par virgule)
    - Checkbox "Texte important"
    - Boutons Publier + Enregistrer brouillon
  - Style Tiptap `::before` placeholder + blockquote gold dans `<style>`

- [ ] Commit : `git add -A && git commit -m "feat: Tiptap editor + auto-save"`

---

## Task 10: Dictée vocale

**Files:** `src/hooks/useVoiceDictation.js`, `src/components/admin/VoiceButton.jsx`

- [ ] Créer `src/hooks/useVoiceDictation.js` :
```js
import { useState, useRef, useCallback } from 'react';
export function useVoiceDictation(onTranscript) {
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  const ref = useRef(null);
  const start = useCallback(() => {
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = 'fr-FR'; r.continuous = true; r.interimResults = true;
    r.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      if (e.results[e.results.length - 1].isFinal) onTranscript(t);
    };
    r.onerror = r.onend = () => setListening(false);
    ref.current = r; r.start(); setListening(true);
  }, [supported, onTranscript]);
  const stop = useCallback(() => { ref.current?.stop(); setListening(false); }, []);
  return { listening, supported, toggle: listening ? stop : start };
}
```

- [ ] Créer `src/components/admin/VoiceButton.jsx` — bandeau en haut de l'éditeur :
  - Fond rose clair quand actif, fond cream-dark sinon
  - Icône 🎤 + label + description
  - 3 points animés (pulse) quand écoute en cours
  - Bouton toggle rouge "▶ Démarrer" / "⏹ Arrêter"
  - Message si navigateur non supporté (Chrome/Edge requis)

- [ ] Commit : `git add -A && git commit -m "feat: voice dictation Web Speech API fr-FR"`

---

## Task 11: Intégration OpenAI

**Files:** `src/lib/openai.js`, `src/hooks/useAIAssistant.js`, `src/components/admin/AIPanel.jsx`

- [ ] Installer SDK : `npm install openai`

- [ ] Créer `src/lib/openai.js` avec client + AI_PROMPTS :
```js
import OpenAI from 'openai';
export const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true });
export const AI_PROMPTS = {
  improve: { label:'✨ Améliorer le style', system:"Tu es un éditeur littéraire francophone. Améliore le style en conservant la voix de l'auteure. Retourne uniquement le texte amélioré." },
  correct: { label:'✓ Corriger', system:"Corrige l'orthographe et la grammaire sans changer le style. Retourne uniquement le texte corrigé." },
  emotion: { label:'💛 Réécrire avec émotion', system:"Réécris avec plus de profondeur émotionnelle et de sensibilité poétique. Garde la 1ère personne et les faits. Retourne uniquement le texte réécrit." },
  story:   { label:'📖 Transformer en histoire', system:"Transforme en récit narratif vivant à la 1ère personne avec détails sensoriels. Retourne uniquement le récit." },
  summary: { label:'📋 Résumé automatique', system:"Génère un résumé de 2-3 phrases en français. Retourne uniquement le résumé." },
};
```

- [ ] Créer `src/hooks/useAIAssistant.js` :
```js
import { useState } from 'react';
import { openai, AI_PROMPTS } from '../lib/openai';
export function useAIAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const run = async (key, content) => {
    if (!content.trim()) return null;
    setLoading(true); setError(null);
    try {
      const res = await openai.chat.completions.create({
        model:'gpt-4o', max_tokens:1000, temperature:0.7,
        messages:[{ role:'system', content:AI_PROMPTS[key].system }, { role:'user', content }]
      });
      return res.choices[0].message.content.trim();
    } catch(e) { setError(e.message||'Erreur OpenAI'); return null; }
    finally { setLoading(false); }
  };
  return { run, loading, error };
}
```

- [ ] Créer `src/components/admin/AIPanel.jsx` — panel dans colonne droite :
  - 5 boutons (un par clé AI_PROMPTS) — bouton actif affiche Loader
  - Résultat dans encart bleu-light avec 3 boutons : Insérer / Remplacer / ✕ Ignorer
  - Message d'erreur en rose si echec API

- [ ] Commit : `git add -A && git commit -m "feat: OpenAI GPT-4o integration (5 AI buttons)"`

---

## Task 12: Upload Médias

**Files:** `src/components/admin/MediaUpload.jsx`

- [ ] Créer `src/components/admin/MediaUpload.jsx` :
  - Input file caché (ref) pour image (`accept="image/*"`) + audio (`accept="audio/*"`)
  - Upload vers Supabase Storage via `supabase.storage.from(bucket).upload(path, file)`
  - Nom fichier : `${Date.now()}-${random}.${ext}`
  - Récupérer URL publique : `supabase.storage.from(bucket).getPublicUrl(path)`
  - Indicateur "✓ Image ajoutée" + bouton ✕ pour supprimer
  - Boutons Ghost "🖼 Image" + "🎵 Audio" avec Loader pendant upload

- [ ] Commit : `git add -A && git commit -m "feat: media upload Supabase Storage"`

---

## Task 13: Commentaires (threads + likes)

**Files:** `src/components/public/CommentSection.jsx`

- [ ] Créer `src/components/public/CommentSection.jsx` :
  - Chargement : `comments` + `comment_likes` (si user connecté)
  - `roots` = commentaires sans parent_id, `replies(id)` = commentaires avec parent_id
  - CommentCard récursif (depth max 1 pour lisibilité)
  - Like toggle : insert/delete comment_likes + update likes_count
  - Bouton Répondre → affiche ReplyForm inline
  - Suppression : admin peut tout supprimer, user peut supprimer son propre commentaire
  - Si non connecté : message + bouton "Se connecter" → navigate('login')
  - ReplyForm : composant interne avec textarea + Publier + Annuler

- [ ] Commit : `git add -A && git commit -m "feat: comments with threads and likes"`

---

## Task 14: Vérification finale + déploiement

- [ ] Tester flux complet :
  1. Home → cliquer un article → lire → commenter (après login)
  2. Login admin → créer article avec dictée → bouton IA → publier
  3. Vérifier article visible sur Home et Articles

- [ ] Vérifier responsive 375px : sidebar cachée, header mobile présent, pas de scroll horizontal.

- [ ] Ajouter `.superpowers/` au `.gitignore` :
```bash
echo ".superpowers/" >> .gitignore
```

- [ ] Commit final :
```bash
git add -A && git commit -m "feat: Memoire Vivante MVP complete"
```

- [ ] Ajouter variables d'env dans Vercel Dashboard :
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_OPENAI_API_KEY`

- [ ] Push et vérifier le déploiement Vercel.
