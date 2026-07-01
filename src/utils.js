import { VENUES, FILMS, SCR, EVENTS } from "./data.js";
import { COLORS } from "./styles.js";

// --- čas ---
export const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
export const fmtDur = (m) => { const h = Math.floor(m / 60), mm = m % 60; return h > 0 ? `${h} h ${mm} min` : `${mm} min`; };
export const minToStr = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const endTime = (t, r) => { const m = toMin(t) + r; const h = Math.floor(m / 60) % 24, mm = m % 60; return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`; };

// --- přesuny ---
export function walkMin(a, b) {
  if (a === b) return 0;
  const A = VENUES[a], B = VENUES[b];
  if (!A || !B) return 10;
  if (A.grp === "T" && B.grp === "T") return 3;
  if (A.grp === "T") return B.pos;
  if (B.grp === "T") return A.pos;
  return Math.max(5, Math.abs(A.pos - B.pos) + 5);
}

export function haversine(la1, ln1, la2, ln2) {
  const R = 6371000, rad = Math.PI / 180;
  const dLa = (la2 - la1) * rad, dLn = (ln2 - ln1) * rad;
  const x = Math.sin(dLa / 2) ** 2 + Math.cos(la1 * rad) * Math.cos(la2 * rad) * Math.sin(dLn / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export const walkFromVenue = (vid, p) =>
  Math.max(3, Math.round(haversine(VENUES[vid].lat, VENUES[vid].lng, p.la, p.ln) / 75));

// --- otevírací doba ---
export const openAt = (p, mins) => {
  const h = mins / 60;
  return p.c <= 24 ? (h >= p.o && h < p.c) : (h >= p.o || h < (p.c - 24));
};

// --- stav přesunu mezi dvěma po sobě jdoucími položkami ---
export function segInfo(prev, next) {
  const pr = prev.r != null ? prev.r : (FILMS[prev.f] ? FILMS[prev.f].r : 90);
  const gap = toMin(next.t) - (toMin(prev.t) + (pr || 90));
  const walk = walkMin(prev.v, next.v);
  const same = prev.v === next.v;
  let color, code;
  if (gap < 0)            { color = COLORS.bad;  code = "překryv";   }
  else if (same)          { color = COLORS.ok;   code = "ok";        }
  else if (gap < walk)    { color = COLORS.bad;  code = "nestihneš"; }
  else if (gap < walk+10) { color = COLORS.warn; code = "těsné";     }
  else                    { color = COLORS.ok;   code = "ok";        }
  return { gap, walk, same, color, code };
}

// --- sjednocená osa dne ---
export function buildDayItems(day, picked, blocks) {
  const items = [];
  SCR.filter(s => s.day === day && picked.has(s.id)).forEach(s => {
    const f = FILMS[s.f];
    items.push({ id:s.id, t:s.t, v:s.v, r:f.r||90, kind:"film", title:f.t, sec:f.s, f:s.f, disc:s.disc });
  });
  EVENTS.filter(e => e.day === day && picked.has(e.id)).forEach(e => {
    items.push({ id:e.id, t:e.t, v:e.v, r:e.r, kind:"event", title:e.title, sec:"AKCE", cat:e.cat });
  });
  (blocks || []).filter(b => b.day === day).forEach(b => {
    items.push({ id:b.id, t:b.t, v:b.v||"T1", r:b.r||60, kind:"block", title:b.title, sec:"AKCE", place:b.place });
  });
  return items.sort((a, b) => toMin(a.t) - toMin(b.t));
}

// --- barva badge ---
export const badgeColor = (b) =>
  b === "must" ? "#E8A33D" : b === "night" ? "#B0506A" : b === "classic" ? "#C77D55" : "#6BA3C4";
