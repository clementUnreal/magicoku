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
function sanitizeProgress(progress) {
  const out = {};
  for (const [k, v] of Object.entries(progress || {}).slice(0, 60)) {
    if (!/^[a-z0-9]{1,12}$/.test(k) || !v || !v.solved) continue;
    out[k] = { t: Math.max(0, Math.min(86400, Math.round(Number(v.time) || 0))), h: Math.max(0, Math.min(999, Number(v.hints) || 0)),
      a: Math.max(1, Math.min(999, Number(v.attempts) || 1)) };
  }
  return out;
}
// Same detective name on several devices / imported twice: keep only their best line.
function dedupe(rows, better) {
  const best = new Map();
  for (const r of rows) {
    const k = String(r.pseudo || "").toLowerCase();
    const cur = best.get(k);
    if (!cur || better(r, cur) < 0) best.set(k, r);
  }
  return [...best.values()];
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
  // Copies players from the old Netlify leaderboard (at most every 5 minutes).
  // Imported rows have no token yet: the player claims them via "Récupérer ma progression".
  async importLegacy() {
    const last = (await this.ctx.storage.get("__legacy_at")) || 0;
    if (Date.now() - last < 300000) return;
    await this.ctx.storage.put("__legacy_at", Date.now());
    try {
      const r = await fetch(OLD, { headers: { accept: "application/json" } });
      if (!r.ok) return;
      const rows = await r.json();
      for (const x of Array.isArray(rows) ? rows : []) {
        const id = clean(x && x.id, 64);
        if (!/^[\w-]{8,64}$/.test(id) || !x.pseudo) continue;
        const row = { id, pseudo: clean(x.pseudo, 20), avatar: clean(x.avatar, 20),
          solved: Math.max(0, Math.min(999, Number(x.solved) || 0)), hints: Number(x.hints) || 0, time: Number(x.time) || 0 };
        const prev = await this.ctx.storage.get("p:" + id);
        if (!prev || (!prev.tok && prev.row.solved < row.solved)) await this.ctx.storage.put("p:" + id, { tok: null, row, at: Date.now(), imported: true });
      }
    } catch {}
  }
  async list() {
    await this.importLegacy();
    const all = await this.ctx.storage.list({ prefix: "p:" });
    const cmp = (a, b) => b.solved - a.solved || a.hints - b.hints || a.time - b.time;
    const rows = dedupe([...all.values()].map((v) => v.row).filter(Boolean), cmp);
    rows.sort(cmp);
    return rows.slice(0, 100);
  }
  async level(lid) {
    const all = await this.ctx.storage.list({ prefix: "p:" });
    const rows = [];
    for (const v of all.values()) {
      const x = v && v.prog && v.prog[lid];
      if (x && v.row) rows.push({ id: v.row.id, pseudo: v.row.pseudo, avatar: v.row.avatar, time: x.t, hints: x.h, attempts: x.a });
    }
    const cmp = (a, b) => a.hints - b.hints || a.time - b.time || a.attempts - b.attempts;
    const out = dedupe(rows, cmp);
    out.sort(cmp);
    return out.slice(0, 100);
  }
  async submit(body) {
    const id = clean(body.id, 64), token = String(body.token || "");
    if (!/^[\w-]{8,64}$/.test(id) || token.length < 8) return { status: 400, body: { error: "bad id" } };
    const key = "p:" + id, prev = await this.ctx.storage.get(key), tok = await sha(token);
    if (prev && prev.tok && prev.tok !== tok) return { status: 403, body: { error: "forbidden" } };
    const row = { id, pseudo: clean(body.pseudo, 20) || "Détective", avatar: clean(body.avatar, 20), ...summarize(body.progress) };
    await this.ctx.storage.put(key, { tok, row, prog: sanitizeProgress(body.progress), at: Date.now() });
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
    if (url.pathname === "/api/level") {
      const lid = url.searchParams.get("id") || "";
      if (!/^[a-z0-9]{1,12}$/.test(lid)) return json({ error: "bad level" }, 400);
      return json(await env.LB.get(env.LB.idFromName("main")).level(lid));
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
