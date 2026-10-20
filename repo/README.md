# Magicoku
Jeu d'enquête logique dans une école de magie.

Hébergement : **Cloudflare Workers** (déploiement `npx wrangler deploy` à la racine, config dans `/wrangler.jsonc`). Le classement est stocké dans un Durable Object (`repo/worker.js`).

- `public/` : le jeu (index.html, icônes, manifest, service worker)
- `functions/api/leaderboard.js` : classement (KV namespace lié sous le nom `LB`)
- `functions/api/legacy.js` : liste des joueurs de l'ancienne adresse Netlify, pour récupérer sa progression
- `netlify/` + `netlify.toml` : ancienne version Netlify (plus utilisée)
