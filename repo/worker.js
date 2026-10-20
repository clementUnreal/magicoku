// Cloudflare Worker: serves the game (static assets in repo/public) + the leaderboard API.
// The leaderboard lives in a Durable Object (SQLite storage, free plan) — no dashboard setup needed.
import { DurableObject } from "cloudflare:workers";

const ADMIN = "clemonchichi";
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
  for (const [k, v] of Object.entries(progress || {}).slice(0, 200)) {
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
  // Best known result per level for a detective name (case-insensitive), across all their rows.
  async progress(pseudo) {
    const want = String(pseudo || "").trim().toLowerCase();
    if (!want) return {};
    const all = await this.ctx.storage.list({ prefix: "p:" });
    const out = {};
    let n = 0;
    for (const v of all.values()) {
      if (!v || !v.row || String(v.row.pseudo || "").trim().toLowerCase() !== want) continue;
      // old / imported rows only know how many cases were solved, not which ones
      const known = v.prog ? Object.keys(v.prog).length : 0;
      if ((Number(v.row.solved) || 0) > known) n = Math.max(n, Number(v.row.solved) || 0);
      if (!v.prog) continue;
      for (const [k, x] of Object.entries(v.prog)) {
        const cur = out[k];
        if (!cur || x.h < cur.h || (x.h === cur.h && x.t < cur.t)) out[k] = x;
      }
    }
    if (n) out._n = Math.min(n, 999);
    return out;
  }
  // ---- recovery codes: one per detective name, only the admin can list them ----
  async secret() {
    let s = await this.ctx.storage.get("__secret");
    if (!s) { s = crypto.randomUUID() + crypto.randomUUID(); await this.ctx.storage.put("__secret", s); }
    return s;
  }
  async codeFor(pseudo) {
    const A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789", h = await sha((await this.secret()) + "|" + String(pseudo || "").trim().toLowerCase());
    let c = "";
    for (let i = 0; i < 6; i++) c += A[parseInt(h.slice(i * 2, i * 2 + 2), 16) % A.length];
    return c;
  }
  async admins() {
    let a = await this.ctx.storage.get("__admins");
    if (!a) { // first use: the existing "clemonchichi" lines become the admin devices
      const all = await this.ctx.storage.list({ prefix: "p:" });
      a = [...all.values()].filter((v) => v && v.tok && v.row && String(v.row.pseudo).trim().toLowerCase() === ADMIN).map((v) => v.row.id);
      await this.ctx.storage.put("__admins", a);
    }
    return a;
  }
  async isAdmin(id, token) {
    const v = await this.ctx.storage.get("p:" + clean(id, 64));
    if (!v || !v.tok || v.tok !== (await sha(token)) || String(v.row && v.row.pseudo).trim().toLowerCase() !== ADMIN) return false;
    return (await this.admins()).includes(v.row.id);
  }
  async codes(id, token) {
    if (!(await this.isAdmin(id, token))) return { status: 403, body: { error: "forbidden" } };
    const all = await this.ctx.storage.list({ prefix: "p:" }), by = new Map();
    for (const v of all.values()) {
      if (!v || !v.row || !v.row.pseudo) continue;
      const k = String(v.row.pseudo).trim().toLowerCase(), cur = by.get(k);
      if (!cur || v.row.solved > cur.solved) by.set(k, { pseudo: v.row.pseudo, avatar: v.row.avatar, solved: v.row.solved });
    }
    const out = [];
    for (const [k, r] of by) out.push({ ...r, code: await this.codeFor(k) });
    out.sort((a, b) => b.solved - a.solved || a.pseudo.localeCompare(b.pseudo));
    return { status: 200, body: out };
  }
  async restore(body) {
    const pseudo = clean(body.pseudo, 20), code = String(body.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    await new Promise((r) => setTimeout(r, 400)); // slow down guessing
    if (!pseudo || code.length !== 6 || code !== (await this.codeFor(pseudo))) return { status: 403, body: { error: "bad code" } };
    const progress = await this.progress(pseudo), all = await this.ctx.storage.list({ prefix: "p:" });
    let best = null;
    for (const v of all.values()) if (v && v.row && String(v.row.pseudo).trim().toLowerCase() === pseudo.toLowerCase() && (!best || v.row.solved > best.solved)) best = v.row;
    if (!best) return { status: 404, body: { error: "unknown" } };
    // the admin recovering on a new device keeps admin rights there
    const nid = clean(body.newId, 64);
    if (pseudo.toLowerCase() === ADMIN && /^[\w-]{8,64}$/.test(nid)) { const a = await this.admins(); if (!a.includes(nid)) { a.push(nid); await this.ctx.storage.put("__admins", a); } }
    return { status: 200, body: { pseudo: best.pseudo, avatar: best.avatar, progress } };
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
    // progress is no longer given out by name alone: a recovery code is needed
    if (url.pathname === "/api/progress") return json({});
    if (url.pathname === "/api/restore" || url.pathname === "/api/admin/codes") {
      if (request.method !== "POST") return json({ error: "method" }, 405);
      let body;
      try { body = await request.json(); } catch { return json({ error: "bad json" }, 400); }
      const lb = env.LB.get(env.LB.idFromName("main"));
      const r = url.pathname === "/api/restore" ? await lb.restore(body) : await lb.codes(body.id, String(body.token || ""));
      return json(r.body, r.status);
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
