# Magicoku
Jeu d'enquête logique dans une école de magie.

Hébergement : **Cloudflare Pages** (root directory `repo`, output directory `public`, pas de commande de build).

- `public/` : le jeu (index.html, icônes, manifest, service worker)
- `functions/api/leaderboard.js` : classement (KV namespace lié sous le nom `LB`)
- `functions/api/legacy.js` : liste des joueurs de l'ancienne adresse Netlify, pour récupérer sa progression
- `netlify/` + `netlify.toml` : ancienne version Netlify (plus utilisée)
