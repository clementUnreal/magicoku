// Cloudflare Pages Function — /api/leaderboard
// Needs a KV namespace bound as "LB" (Pages > Settings > Bindings).
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const clean = (s, n) => String(s ?? "").replace(/[<>&"]/g, "").trim().slice(0, n);
async function sha(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(s)));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function summarize(progress) {
  let solved = 0, hints = 0, time = 0;
  for (const v of Object.values(progress || {})) {
    if (!v || !v.solved) continue;
    solved += 1;
    hints += Math.max(0, Math.min(999, Number(v.hints) || 0));
    time += Math.max(0, Math.min(86400, Number(v.time) || 0));
  }
  return { solved: Math.min(solved, 999), hints, time };
}

export async function onRequestGet({ env }) {
  if (!env.LB) return json({ error: "KV binding LB missing" }, 500);
  const rows = [];
  let cursor;
  do {
    const page = await env.LB.list({ prefix: "p:", cursor });
    for (const k of page.keys) if (k.metadata) rows.push(k.metadata);
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  rows.sort((a, b) => b.solved - a.solved || a.hints - b.hints || a.time - b.time);
  return json(rows.slice(0, 100));
}

export async function onRequestPost({ request, env }) {
  if (!env.LB) return json({ error: "KV binding LB missing" }, 500);
  let body;
  try { body = await request.json(); } catch { return json({ error: "bad json" }, 400); }
  const id = clean(body.id, 64), token = String(body.token || "");
  if (!/^[\w-]{8,64}$/.test(id) || token.length < 8) return json({ error: "bad id" }, 400);
  const key = "p:" + id;
  const prev = await env.LB.get(key, { type: "json" });
  const tok = await sha(token);
  if (prev && prev.tok && prev.tok !== tok) return json({ error: "forbidden" }, 403);
  const row = { id, pseudo: clean(body.pseudo, 20) || "Détective", avatar: clean(body.avatar, 20), ...summarize(body.progress) };
  if (prev && prev.tok === tok && ["pseudo", "avatar", "solved", "hints", "time"].every((k) => prev.row && prev.row[k] === row[k])) return json({ ok: true, unchanged: true });
  await env.LB.put(key, JSON.stringify({ tok, row, at: Date.now() }), { metadata: row });
  return json({ ok: true });
}
