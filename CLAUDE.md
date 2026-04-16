# Michelle Faye — Site personnel

## Stack
- React 18 + Vite (SPA, pas de router — navigation gérée via état `page`)
- Supabase pour la BDD (articles + commentaires) et l'auth
- CSS inline dans `App.jsx` (variable `css`, classes courtes minifiées)
- Déployé sur Vercel (`vercel.json` présent)

## Architecture
Tout le code est dans `src/App.jsx` — un seul composant `App` avec :
- Navigation par état `page` : `home | articles | article | about | contact | login | admin`
- Auth admin : email `michele.fay@sfr.fr`, via Supabase Auth
- Tables Supabase : `articles` (id, title, category, content, important, date), `comments` (id, article_id, author_name, content, created_at)

## Conventions CSS
- Classes courtes minifiées (ex: `.ac` = article card, `.ag` = article grid, `.sh` = sticky header)
- Variables CSS dans `:root` : `--cream`, `--ink`, `--blue`, `--gold`, `--rose`, etc.
- Typographies : `--serif` (Playfair Display) pour titres, `--body` (Source Serif 4) pour texte

## Points importants
- Le formulaire Contact ne fait pas encore d'envoi réel (juste une notif fake)
- Les clés Supabase sont hardcodées dans App.jsx (clé anon publique = normal)
- Responsive mobile géré par media query `max-width:768px`
