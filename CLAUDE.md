# Magicoku — notes for Claude

Live site: https://magicoku.scorclem.workers.dev (Cloudflare Worker, deploys automatically on every push to `main`).

## Layout
- `repo/public/` — what is served (index.html, sw.js, manifest, icons, news.json).
- `repo/worker.js` — API: leaderboard (Durable Object), per-level ranking, legacy import.
- `src/` — build sources. `sh src/build.sh` regenerates `repo/public/index.html`.
  Patches are applied in order by `src/ld/build_ld.py`; translations (KO/JA) live in `src/i18n/`.
  Story mode (10 chapters): environments/texts in `src/story/` (envrt.py, envtext.py, sprites/*.webp), levels `src/ld/lv/s{chapter}n{level}.json` (generator: `src/story/genchap.py`).
  Chapter mechanics (one per story chapter): generator `src/story/genstory.py` (clue types dist/cnt/mirc/mird/mira/mid/knight, poison flasks, liar levels, `dark` flag); game side `src/ld/mech.js` (texts, liar/dark), `mech2.js` (train countdown ch.2, frost ch.5), `mech3.js` (chapter rule popup). Chapters 2, 5, 9 keep their levels (mechanic is runtime only).
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
