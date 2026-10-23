// Cloudflare Worker: serves the game (static assets in repo/public) + the leaderboard API.
// The leaderboard lives in a Durable Object (SQLite storage, free plan) — no dashboard setup needed.
import { DurableObject } from "cloudflare:workers";

const ADMIN = "clemonchichi";
// ---- daily puzzle + shop (beta) ----
const QUILL_BASE = 100, QUILL_STEP = 50;
const SHOP = {
  // cross styles
  "x:star": 60, "x:moon": 60, "x:heart": 60, "x:skull": 90, "x:paw": 90, "x:spark": 120,
  // music styles
  "m:box": 80, "m:lofi": 120, "m:fair": 120, "m:mystery": 150,
  // characters for the profile picture
  "c:fox": 200, "c:cat": 200, "c:snowowl": 200, "c:toad": 250, "c:dragon": 350, "c:pochacco": 999, "c:penguin": 999, "c:darkknight": 999, "c:mandrake": 150, "c:snowman": 150, "c:gargoyle": 200, "c:owl": 200, "c:cauldron": 120, "c:statue": 250,
  // ornaments around the profile picture
  "o:gold": 100, "o:flowers": 120, "o:stars": 150, "o:frost": 150, "o:flames": 200, "o:rainbow": 300,
  // titles
  "t:apprenti": 40, "t:limier": 80, "t:plume": 80, "t:lune": 150, "t:maitre": 250, "t:legende": 500,
  // rename the suspects: price set by the auction (QUILL_BASE + QUILL_STEP per purchase)
  "n:rename": 100,
};
const SLOT = { x: "x", m: "m", c: "c", o: "o", t: "t" };
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const dscore = (r) => r.t + 30 * r.e + 60 * r.h;
const dcmp = (a, b) => dscore(a) - dscore(b) || a.at - b.at;
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
    const top = rows.slice(0, 100);
    for (const r of top) { const w = await this.ctx.storage.get("w:" + String(r.pseudo || "").trim().toLowerCase()); if (w) r.cos = this.pub(w); }
    return top;
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
    if (/^[\w-]{8,64}$/.test(nid)) { const w = await this.wallet(best.pseudo); if (w.pids && !w.pids.includes(nid)) { w.pids.push(nid); await this.saveWallet(best.pseudo, w); } }
    if (pseudo.toLowerCase() === ADMIN && /^[\w-]{8,64}$/.test(nid)) { const a = await this.admins(); if (!a.includes(nid)) { a.push(nid); await this.ctx.storage.put("__admins", a); } }
    return { status: 200, body: { pseudo: best.pseudo, avatar: best.avatar, progress } };
  }
  async auth(id, token) {
    const v = await this.ctx.storage.get("p:" + clean(id, 64));
    if (!v || !v.tok || v.tok !== (await sha(token)) || !v.row) return null;
    return v.row;
  }
  async wallet(pseudo) {
    const k = "w:" + String(pseudo || "").trim().toLowerCase();
    return (await this.ctx.storage.get(k)) || { coins: 0, owned: [], eq: {}, names: {}, wins: 0, played: 0 };
  }
  async saveWallet(pseudo, w) { await this.ctx.storage.put("w:" + String(pseudo || "").trim().toLowerCase(), w); }
  // podium bonus for finished days, paid once
  async settle() {
    const t = today(), all = await this.ctx.storage.list({ prefix: "d:" });
    for (const [k, d] of all) {
      const date = k.slice(2);
      if (date >= t || d.settled) continue;
      const rows = Object.values(d.rows || {}).sort(dcmp);
      const bonus = [100];
      for (let i = 0; i < Math.min(bonus.length, rows.length); i++) {
        const w = await this.wallet(rows[i].pseudo);
        w.coins += bonus[i]; if (i === 0) w.wins = (w.wins || 0) + 1;
        (w.log = w.log || []).unshift({ at: Date.now(), n: bonus[i], why: "podium:" + date + ":" + (i + 1) }); w.log = w.log.slice(0, 30);
        await this.saveWallet(rows[i].pseudo, w);
      }
      d.settled = true; await this.ctx.storage.put(k, d);
    }
  }
  pub(w) { return { title: w.eq.t || null, orn: w.eq.o || null, chara: w.eq.c || null }; }
  async daily(date) {
    await this.settle();
    const date_ = /^\d{4}-\d{2}-\d{2}$/.test(date || "") ? date : today();
    const d = (await this.ctx.storage.get("d:" + date_)) || { rows: {} };
    const rows = Object.values(d.rows).sort(dcmp);
    for (const r of rows) r.cos = this.pub(await this.wallet(r.pseudo));
    return { date: date_, today: today(), rows: rows.slice(0, 100).map((r) => ({ pseudo: r.pseudo, avatar: r.avatar, t: r.t, e: r.e, h: r.h, s: dscore(r), cos: r.cos })) };
  }
  async dailySubmit(body) {
    const row = await this.auth(body.id, String(body.token || ""));
    if (!row) return { status: 403, body: { error: "forbidden" } };
    const date = today();
    if (body.date !== date) return { status: 409, body: { error: "not today", today: date } };
    const key = "d:" + date, d = (await this.ctx.storage.get(key)) || { rows: {} }, me = String(row.pseudo).trim().toLowerCase();
    // admin correction of his own time for the day (one-shot request from the admin device)
    if (body.admin === "settime") {
      if (me !== ADMIN || !(await this.isAdmin(body.id, String(body.token || "")))) return { status: 403, body: { error: "forbidden" } };
      if (!d.rows[me]) return { status: 404, body: { error: "not played" } };
      Object.assign(d.rows[me], { t: Math.max(1, Math.min(86400, Math.round(Number(body.t) || 0))), e: 0, h: 0 });
      await this.ctx.storage.put(key, d);
      return { status: 200, body: { ok: true, row: d.rows[me] } };
    }
    const w = await this.wallet(row.pseudo);
    if (d.rows[me]) return { status: 200, body: { already: true, coins: w.coins, earned: 0 } };
    const r = { pseudo: row.pseudo, avatar: row.avatar, t: Math.max(1, Math.min(86400, Math.round(Number(body.t) || 0))), e: Math.max(0, Math.min(99, Number(body.e) || 0)), h: Math.max(0, Math.min(99, Number(body.h) || 0)), at: Date.now() };
    d.rows[me] = r; await this.ctx.storage.put(key, d);
    const earned = 20 + (r.e === 0 ? 10 : 0) + (r.h === 0 ? 10 : 0);
    w.coins += earned; w.played = (w.played || 0) + 1;
    (w.log = w.log || []).unshift({ at: Date.now(), n: earned, why: "daily:" + date }); w.log = w.log.slice(0, 30);
    await this.saveWallet(row.pseudo, w);
    const rows = Object.values(d.rows).sort(dcmp);
    return { status: 200, body: { earned, coins: w.coins, rank: rows.findIndex((x) => x === r || x.pseudo === r.pseudo) + 1, of: rows.length } };
  }
  // the renaming quill is an auction: the names are shared by every player, each purchase costs 50 more
  async quill() { return (await this.ctx.storage.get("__quill")) || { names: {}, n: 0, by: null, at: 0 }; }
  pubQuill(q) { return { names: q.names || {}, price: QUILL_BASE + QUILL_STEP * (q.n || 0), by: q.by || null, at: q.at || 0, n: q.n || 0 }; }
  async shop(body) {
    await this.settle();
    const row = await this.auth(body.id, String(body.token || ""));
    if (!row) return { status: 403, body: { error: "forbidden" } };
    const w = await this.wallet(row.pseudo), item = String(body.item || "");
    // a wallet belongs to the devices that first used it (+ devices recovered with the code)
    if (!w.pids || !w.pids.length) { w.pids = [row.id]; await this.saveWallet(row.pseudo, w); }
    else if (!w.pids.includes(row.id)) return { status: 423, body: { error: "other device", coins: w.coins } };
    // old personal renaming quill (bought before the auction): refunded once
    if (w.owned.includes("n:rename")) { w.owned = w.owned.filter((x) => x !== "n:rename"); w.coins += 100; w.names = {}; await this.saveWallet(row.pseudo, w); }
    const q = await this.quill();
    if (body.action === "buyquill" || (body.action === "buy" && item === "n:rename")) {
      const price = QUILL_BASE + QUILL_STEP * (q.n || 0);
      if ((w.quill || 0) > 0) return { status: 200, body: Object.assign({}, w, { gq: this.pubQuill(q) }) };
      if (w.coins < price) return { status: 402, body: { error: "not enough", wallet: w, gq: this.pubQuill(q) } };
      w.coins -= price; w.quill = 1; q.n = (q.n || 0) + 1;
      (w.log = w.log || []).unshift({ at: Date.now(), n: -price, why: "quill" }); w.log = w.log.slice(0, 30);
      await this.ctx.storage.put("__quill", q); await this.saveWallet(row.pseudo, w);
      return { status: 200, body: Object.assign({}, w, { gq: this.pubQuill(q) }) };
    }
    if (body.action === "buy") {
      if (!(item in SHOP)) return { status: 400, body: { error: "unknown item" } };
      if (w.owned.includes(item)) return { status: 200, body: w };
      if (w.coins < SHOP[item]) return { status: 402, body: { error: "not enough", wallet: w } };
      w.coins -= SHOP[item]; w.owned.push(item);
      const sl = SLOT[item.split(":")[0]]; if (sl) w.eq[sl] = item;
      await this.saveWallet(row.pseudo, w);
    } else if (body.action === "equip") {
      const sl = SLOT[item.split(":")[0]] || SLOT[String(body.slot || "")];
      if (!sl) return { status: 400, body: { error: "bad slot" } };
      if (item && !item.endsWith(":none") && !w.owned.includes(item)) return { status: 403, body: { error: "not owned" } };
      if (!item || item.endsWith(":none")) delete w.eq[sl]; else w.eq[sl] = item;
      await this.saveWallet(row.pseudo, w);
    } else if (body.action === "names") {
      if (!((w.quill || 0) > 0)) return { status: 403, body: { error: "not owned", gq: this.pubQuill(q) } };
      const out = {};
      for (const [k, v] of Object.entries(body.names || {}).slice(0, 40)) { const kk = clean(k, 20), vv = clean(v, 16); if (kk && vv && vv !== kk) out[kk] = vv; }
      q.names = out; q.by = row.pseudo; q.at = Date.now(); w.quill = 0;
      await this.ctx.storage.put("__quill", q); await this.saveWallet(row.pseudo, w);
    } else if (body.action === "grant") {
      // admin test helper: give coins to yourself
      if (String(row.pseudo).trim().toLowerCase() !== ADMIN || !(await this.isAdmin(body.id, String(body.token || "")))) return { status: 403, body: { error: "forbidden" } };
      w.coins += Math.max(0, Math.min(5000, Number(body.n) || 0)); await this.saveWallet(row.pseudo, w);
    }
    return { status: 200, body: Object.assign({}, w, { gq: this.pubQuill(q) }) };
  }
  async names() { return this.pubQuill(await this.quill()); }
  async profile(pseudo) {
    const want = String(pseudo || "").trim().toLowerCase(); if (!want) return null;
    const all = await this.ctx.storage.list({ prefix: "p:" });
    let best = null;
    for (const v of all.values()) if (v && v.row && String(v.row.pseudo).trim().toLowerCase() === want && (!best || v.row.solved > best.solved)) best = v.row;
    if (!best) return null;
    const w = await this.wallet(best.pseudo);
    return { pseudo: best.pseudo, avatar: best.avatar, solved: best.solved, hints: best.hints, time: best.time, wins: w.wins || 0, played: w.played || 0, cos: this.pub(w) };
  }
  // ---- presence: who is playing right now ----
  async ping(body) {
    const row = await this.auth(body.id, String(body.token || ""));
    if (!row) return { status: 403, body: { error: "forbidden" } };
    const on = (await this.ctx.storage.get("__online")) || {}, now = Date.now();
    for (const k in on) if (now - on[k].at > 3600000) delete on[k];
    on[String(row.pseudo).trim().toLowerCase()] = { at: now, p: body.playing ? 1 : 0 };
    await this.ctx.storage.put("__online", on);
    return { status: 200, body: { ok: true } };
  }
  async presence() {
    const on = (await this.ctx.storage.get("__online")) || {}, now = Date.now(), out = {};
    for (const [k, v] of Object.entries(on)) out[k] = { ago: Math.round((now - v.at) / 1000), p: v.p };
    return out;
  }
  // ---- chat: global thread + private messages ----
  async chat(body) {
    const row = await this.auth(body.id, String(body.token || ""));
    if (!row) return { status: 403, body: { error: "forbidden" } };
    const me = String(row.pseudo).trim().toLowerCase(), now = Date.now();
    const dmKey = (a, b) => "dm:" + [a, b].sort().join("|");
    const meta = (await this.ctx.storage.get("cm:" + me)) || { seen: {}, blocked: [], last: 0, convs: {} };
    const save = () => this.ctx.storage.put("cm:" + me, meta);
    const known = async (p) => { const all = await this.ctx.storage.list({ prefix: "p:" }); for (const v of all.values()) if (v && v.row && String(v.row.pseudo).trim().toLowerCase() === p) return v.row; return null; };
    const a = body.action;
    if (a === "send") {
      const text = String(body.text || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 300);
      if (!text) return { status: 400, body: { error: "empty" } };
      if (now - (meta.last || 0) < 2000) return { status: 429, body: { error: "slow down" } };
      meta.last = now;
      const msg = { i: crypto.randomUUID().slice(0, 12), f: row.pseudo, av: row.avatar || "", t: text, at: now };
      const to = String(body.to || "").trim().toLowerCase();
      if (!to) {
        const g = (await this.ctx.storage.get("c:global")) || []; g.push(msg); await this.ctx.storage.put("c:global", g.slice(-200));
      } else {
        if (to === me) return { status: 400, body: { error: "self" } };
        const other = await known(to); if (!other) return { status: 404, body: { error: "unknown" } };
        const om = (await this.ctx.storage.get("cm:" + to)) || { seen: {}, blocked: [], last: 0, convs: {} };
        if ((om.blocked || []).includes(me)) return { status: 200, body: { ok: true } }; // silently dropped
        const k = dmKey(me, to), l = (await this.ctx.storage.get(k)) || []; l.push(msg); await this.ctx.storage.put(k, l.slice(-300));
        meta.convs[to] = { n: other.pseudo, av: other.avatar || "", at: now }; meta.seen[to] = now;
        om.convs = om.convs || {}; om.convs[me] = { n: row.pseudo, av: row.avatar || "", at: now }; await this.ctx.storage.put("cm:" + to, om);
      }
      await save();
      return { status: 200, body: { ok: true, msg } };
    }
    if (a === "list") {
      const w = String(body.with || "").trim().toLowerCase();
      let l = w ? ((await this.ctx.storage.get(dmKey(me, w))) || []) : ((await this.ctx.storage.get("c:global")) || []);
      l = l.filter((m) => !(meta.blocked || []).includes(String(m.f).trim().toLowerCase()));
      meta.seen[w || "_g"] = now; await save();
      return { status: 200, body: { msgs: l.slice(-120), blocked: meta.blocked || [] } };
    }
    if (a === "summary") {
      const g = (await this.ctx.storage.get("c:global")) || [];
      const gu = g.filter((m) => m.at > (meta.seen._g || 0) && String(m.f).trim().toLowerCase() !== me && !(meta.blocked || []).includes(String(m.f).trim().toLowerCase())).length;
      const convs = [];
      for (const [k, c] of Object.entries(meta.convs || {})) {
        if ((meta.blocked || []).includes(k)) continue;
        const l = (await this.ctx.storage.get(dmKey(me, k))) || [], last = l[l.length - 1];
        const un = l.filter((m) => m.at > (meta.seen[k] || 0) && String(m.f).trim().toLowerCase() !== me).length;
        convs.push({ k, n: c.n, av: c.av, at: last ? last.at : c.at, last: last ? last.t.slice(0, 60) : "", lastMe: last ? String(last.f).trim().toLowerCase() === me : false, un });
      }
      convs.sort((x, y) => y.at - x.at);
      return { status: 200, body: { g: gu, gLast: g.length ? { f: g[g.length - 1].f, t: g[g.length - 1].t.slice(0, 60), at: g[g.length - 1].at } : null, convs, blocked: meta.blocked || [] } };
    }
    if (a === "block" || a === "unblock") {
      const w = String(body.who || "").trim().toLowerCase(); if (!w || w === me) return { status: 400, body: { error: "bad" } };
      meta.blocked = (meta.blocked || []).filter((x) => x !== w); if (a === "block") meta.blocked.push(w);
      await save(); return { status: 200, body: { blocked: meta.blocked } };
    }
    if (a === "delete") {
      if (me !== ADMIN || !(await this.isAdmin(body.id, String(body.token || "")))) return { status: 403, body: { error: "forbidden" } };
      const g = (await this.ctx.storage.get("c:global")) || []; await this.ctx.storage.put("c:global", g.filter((m) => m.i !== body.mid));
      return { status: 200, body: { ok: true } };
    }
    return { status: 400, body: { error: "action" } };
  }
  async submit(body) {
    const id = clean(body.id, 64), token = String(body.token || "");
    if (!/^[\w-]{8,64}$/.test(id) || token.length < 8) return { status: 400, body: { error: "bad id" } };
    const key = "p:" + id, prev = await this.ctx.storage.get(key), tok = await sha(token);
    if (prev && prev.tok && prev.tok !== tok) return { status: 403, body: { error: "forbidden" } };
    const row = { id, pseudo: clean(body.pseudo, 20) || "Détective", avatar: clean(body.avatar, 20), ...summarize(body.progress) };
    const prog = sanitizeProgress(body.progress);
    // moon shards: +10 for every level solved for the first time from now on (per detective name)
    let earned = 0;
    try {
      const pk = row.pseudo.trim().toLowerCase(), w = await this.wallet(row.pseudo);
      if (!w.base) {
        const done = new Set();
        const all = await this.ctx.storage.list({ prefix: "p:" });
        for (const v of all.values()) if (v && v.row && String(v.row.pseudo).trim().toLowerCase() === pk && v.prog) Object.keys(v.prog).forEach((k) => done.add(k));
        w.done = [...done]; w.base = Date.now();
      }
      const done = new Set(w.done || []);
      for (const k of Object.keys(prog)) if (!done.has(k)) { done.add(k); earned += 10; }
      if (earned || !w.base0) {
        w.done = [...done]; w.base0 = true; w.coins += earned;
        if (earned) { (w.log = w.log || []).unshift({ at: Date.now(), n: earned, why: "levels" }); w.log = w.log.slice(0, 30); }
        await this.saveWallet(row.pseudo, w);
      }
    } catch {}
    await this.ctx.storage.put(key, { tok, row, prog, at: Date.now() });
    // any progress sync (even from an old version of the game) counts as "playing right now"
    try {
      const on = (await this.ctx.storage.get("__online")) || {}, pk = row.pseudo.trim().toLowerCase(), now = Date.now();
      on[pk] = { at: now, p: 1 }; await this.ctx.storage.put("__online", on);
    } catch {}
    return { status: 200, body: { ok: true, earned } };
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
    if (url.pathname === "/api/names" && request.method === "GET") return json(await env.LB.get(env.LB.idFromName("main")).names());
    if (url.pathname === "/api/daily" && request.method === "GET") return json(await env.LB.get(env.LB.idFromName("main")).daily(url.searchParams.get("date")));
    if (url.pathname === "/api/profile") { const r = await env.LB.get(env.LB.idFromName("main")).profile(clean(url.searchParams.get("pseudo"), 20)); return r ? json(r) : json({ error: "unknown" }, 404); }
    if (url.pathname === "/api/chat" && request.method === "POST") {
      let body; try { body = await request.json(); } catch { return json({ error: "bad json" }, 400); }
      const r = await env.LB.get(env.LB.idFromName("main")).chat(body); return json(r.body, r.status);
    }
    if (url.pathname === "/api/presence") return json(await env.LB.get(env.LB.idFromName("main")).presence());
    if (url.pathname === "/api/ping" && request.method === "POST") {
      let body; try { body = await request.json(); } catch { return json({ error: "bad json" }, 400); }
      const r = await env.LB.get(env.LB.idFromName("main")).ping(body); return json(r.body, r.status);
    }
    if (url.pathname === "/api/daily" || url.pathname === "/api/shop") {
      if (request.method !== "POST") return json({ error: "method" }, 405);
      let body;
      try { body = await request.json(); } catch { return json({ error: "bad json" }, 400); }
      const lb = env.LB.get(env.LB.idFromName("main"));
      const r = url.pathname === "/api/daily" ? await lb.dailySubmit(body) : await lb.shop(body);
      return json(r.body, r.status);
    }
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
    // never let the browser reuse an old copy of the page, the service worker or the version file
    const ct = res.headers.get("content-type") || "";
    if (url.pathname === "/sw.js" || url.pathname === "/" || url.pathname.endsWith(".html") || url.pathname.endsWith("version.json") || ct.includes("text/html")) {
      const h = new Headers(res.headers); h.set("cache-control", "no-cache, must-revalidate");
      return new Response(res.body, { status: res.status, headers: h });
    }
    return res;
  },
};
