// Lists players from the old Netlify address so they can recover their progress here.
const OLD = "https://brilliant-souffle-0e22cf.netlify.app/api/leaderboard";
export async function onRequestGet() {
  try {
    const r = await fetch(OLD, { headers: { accept: "application/json" }, cf: { cacheTtl: 60 } });
    if (!r.ok) throw new Error(String(r.status));
    const rows = await r.json();
    const out = (Array.isArray(rows) ? rows : []).filter((x) => x && x.pseudo).map((x) => ({
      id: String(x.id || "").slice(0, 64), pseudo: String(x.pseudo).replace(/[<>&"]/g, "").slice(0, 20),
      avatar: String(x.avatar || "").slice(0, 20), solved: Math.max(0, Math.min(99, Number(x.solved) || 0)),
      hints: Number(x.hints) || 0, time: Number(x.time) || 0 }));
    return new Response(JSON.stringify(out), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
  } catch (e) {
    return new Response(JSON.stringify([]), { headers: { "content-type": "application/json" } });
  }
}
