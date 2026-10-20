// Cloudflare Worker: serves the game (static assets in repo/public) + the leaderboard API.
// The leaderboard lives in a Durable Object (SQLite storage, free plan) — no dashboard setup needed.
import { DurableObject } from "cloudflare:workers";

const OLD = "https://brilliant-souffle-0e22cf.netlify.app/api/leaderboard";
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

export class Leaderboard extends DurableObject {
  async list() {
    const all = await this.ctx.storage.list({ prefix: "p:" });
    const rows = [...all.values()].map((v) => v.row).filter(Boolean);
    rows.sort((a, b) => b.solved - a.solved || a.hints - b.hints || a.time - b.time);
    return rows.slice(0, 100);
  }
  async submit(body) {
    const id = clean(body.id, 64), token = String(body.token || "");
    if (!/^[\w-]{8,64}$/.test(id) || token.length < 8) return { status: 400, body: { error: "bad id" } };
    const key = "p:" + id, prev = await this.ctx.storage.get(key), tok = await sha(token);
    if (prev && prev.tok && prev.tok !== tok) return { status: 403, body: { error: "forbidden" } };
    const row = { id, pseudo: clean(body.pseudo, 20) || "Détective", avatar: clean(body.avatar, 20), ...summarize(body.progress) };
    await this.ctx.storage.put(key, { tok, row, at: Date.now() });
    return { status: 200, body: { ok: true } };
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/leaderboard") {
      const lb = env.LB.get(env.LB.idFromName("main"));
      if (request.method === "GET") return json(await lb.list());
      if (request.method === "POST") {
        let body;
        try { body = await request.json(); } catch { return json({ error: "bad json" }, 400); }
        const r = await lb.submit(body);
        return json(r.body, r.status);
      }
      return json({ error: "method" }, 405);
    }
    if (url.pathname === "/api/legacy") {
      try {
        const r = await fetch(OLD, { headers: { accept: "application/json" } });
        const rows = r.ok ? await r.json() : [];
        return json((Array.isArray(rows) ? rows : []).filter((x) => x && x.pseudo).map((x) => ({
          id: String(x.id || "").slice(0, 64), pseudo: clean(x.pseudo, 20), avatar: clean(x.avatar, 20),
          solved: Math.max(0, Math.min(99, Number(x.solved) || 0)), hints: Number(x.hints) || 0, time: Number(x.time) || 0 })));
      } catch { return json([]); }
    }
    if (url.pathname.startsWith("/api/")) return json({ error: "not found" }, 404);
    const res = await env.ASSETS.fetch(request);
    if (url.pathname === "/sw.js") {
      const h = new Headers(res.headers); h.set("cache-control", "no-cache");
      return new Response(res.body, { status: res.status, headers: h });
    }
    return res;
  },
};
