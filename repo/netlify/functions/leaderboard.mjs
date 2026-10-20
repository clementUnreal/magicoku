import { getStore, listStores } from "@netlify/blobs";
import { createHash } from "node:crypto";

const store = () => getStore({ name: "magicoku-leaderboard", consistency: "strong" });
const sha = (s) => createHash("sha256").update(String(s)).digest("hex");
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const clean = (s, n) => String(s ?? "").replace(/[<>&"]/g, "").trim().slice(0, n);

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

// One-time import of scores saved by the previous leaderboard (other blob stores on this site).
async function migrate(s) {
  if (await s.get("__migrated")) return;
  try {
    const { stores } = await listStores();
    for (const name of stores) {
      if (name === "magicoku-leaderboard") continue;
      const old = getStore({ name, consistency: "strong" });
      const { blobs } = await old.list();
      for (const b of blobs) {
        let v = null;
        try { v = await old.get(b.key, { type: "json" }); } catch { continue; }
        const rows = Array.isArray(v) ? v : v && typeof v === "object" && !v.pseudo ? Object.values(v) : [v];
        for (const r of rows) {
          if (!r || typeof r !== "object" || !r.pseudo) continue;
          const id = clean(r.id || b.key, 64);
          if (!/^[\w-]{8,64}$/.test(id) || (await s.get(id))) continue;
          const sum = r.progress ? summarize(r.progress) : { solved: Number(r.solved) || 0, hints: Number(r.hints) || 0, time: Number(r.time) || 0 };
          await s.setJSON(id, { id, pseudo: clean(r.pseudo, 20), avatar: clean(r.avatar, 20), ...sum, tok: null, at: Date.now(), imported: name });
        }
      }
    }
  } catch (e) { console.log("migrate", e && e.message); }
  await s.set("__migrated", String(Date.now()));
}

export default async (req) => {
  const s = store();
  if (req.method === "GET") {
    await migrate(s);
    const { blobs } = (await s.list());
    const rows = (await Promise.all(blobs.filter((b) => !b.key.startsWith("__")).map((b) => s.get(b.key, { type: "json" })))).filter(Boolean)
      .map(({ id, pseudo, avatar, solved, hints, time }) => ({ id, pseudo, avatar, solved, hints, time }))
      .sort((a, b) => b.solved - a.solved || a.hints - b.hints || a.time - b.time)
      .slice(0, 100);
    return json(rows);
  }
  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return json({ error: "bad json" }, 400); }
    const id = clean(body.id, 64), token = String(body.token || "");
    if (!/^[\w-]{8,64}$/.test(id) || token.length < 8) return json({ error: "bad id" }, 400);
    const prev = await s.get(id, { type: "json" });
    if (prev && prev.tok && prev.tok !== sha(token)) return json({ error: "forbidden" }, 403);
    const pseudo = clean(body.pseudo, 20) || "Détective";
    const avatar = clean(body.avatar, 20);
    const rec = { id, pseudo, avatar, ...summarize(body.progress), tok: sha(token), at: Date.now() };
    await s.setJSON(id, rec);
    return json({ ok: true });
  }
  return json({ error: "method" }, 405);
};

export const config = { path: "/api/leaderboard" };
