# Magicoku — notes for Claude

Live site: https://magicoku.scorclem.workers.dev (Cloudflare Worker, deploys automatically on every push to `main`).

## Layout
- `repo/public/` — what is served (index.html, sw.js, manifest, icons, news.json).
- `repo/worker.js` — API: leaderboard (Durable Object), per-level ranking, legacy import.
- `src/` — build sources. `sh src/build.sh` regenerates `repo/public/index.html`.
  Patches are applied in order by `src/ld/build_ld.py`; translations (KO/JA) live in `src/i18n/`.
  Story mode (10 chapters): environments/texts in `src/story/` (envrt.py, envtext.py, sprites/*.webp), levels `src/ld/lv/s{chapter}n{level}.json` (generator: `src/story/genchap.py`).
  Chapter mechanics (one per story chapter): generator `src/story/genstory.py` (clue types dist/cnt/mirc/mird/mira/mid (knight no longer used), poison flasks, liar levels, `dark` and `nox` (no crosses, ch.7) flags); game side `src/ld/mech.js` (texts, liar/dark), `mech2.js` (train countdown ch.2, frost ch.5), `mech3.js` (chapter rule popup). Chapters 2, 5, 9 keep their levels (mechanic is runtime only).
  Shop/profile/cosmetics are OPEN to everyone (`shopOn()` in `src/ld/beta.js`); wallets are bound to the devices that first used them (`pids`, extended by /api/restore). Daily puzzle also OPEN (`dailyOn()`): one try per day, best score of the day gets +100 shards (settled next day). Was beta: daily puzzle (pool `lv/dy*.json`, generator `src/story/gendaily.py`, same puzzle for everyone per Paris date), moon shards wallet, shop (cross styles, music styles, characters, ornaments, titles, renaming), profile. Server side in `repo/worker.js` (`/api/daily`, `/api/shop`, `/api/profile`, prices in `SHOP`).
  Chat (`src/ld/chat.js`, server `chat()` in worker.js, route /api/chat): global thread `c:global` (last 200), DMs `dm:a|b`, per-user meta `cm:pseudo` (seen, blocked, convs); admin can delete global messages. Presence: `src/ld/presence.js`, /api/ping + /api/presence, progress syncs also count.
  Extra modes: rush (u*), night (n*), liar (l*) levels also in `src/ld/lv/`.

## Release checklist (every update)
1. Edit sources in `src/`, run `sh src/build.sh`.
   (build.sh also writes `repo/public/version.json`; open games compare it to their build and show a "new version" banner.)
2. Bump the cache name `magicoku-vN` in `repo/public/sw.js`.
3. **Add an entry at the top of `repo/public/news.json`** (next `id`, today's date, an emoji `icon`,
   and `t`/`d` texts in `fr`, `en`, `ko`, `ja`). Players see it in the in-game "✨ Nouveautés" panel
   with a red badge until they open it.
4. Commit and push to `main`.

French must be impeccable (a Korean player uses the game to learn French).
