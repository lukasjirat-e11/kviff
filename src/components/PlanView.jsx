import { useState } from "react";
import { SECTIONS, VENUES, PLACES, CAT, TICKET, PICKS, SCR } from "../data.js";
import { toMin, fmtDur, endTime, segInfo, buildDayItems, walkFromVenue, openAt } from "../utils.js";
import { COLORS, S } from "../styles.js";
import Chip from "./Chip.jsx";

export default function PlanView({ day, picked, toggle, setDetail, tickets, cycleTicket, blocks, setBlocks, weather, setWeather, setTab, ratings, rate }) {
  const c = COLORS;
  const [adding, setAdding] = useState(false);
  const [planMode, setPlanMode] = useState("my");
  const effectivePicked = planMode === "chceme"
    ? new Set([...picked, ...SCR.filter(s => s.day === day && PICKS[s.f] === "yes").map(s => s.id)])
    : picked;
  const items = buildDayItems(day, effectivePicked, blocks);
  const films = items.filter(i => i.kind === "film");
  const totalRuntime = items.reduce((n, i) => n + (i.r || 0), 0);

  let maxGap = 0;
  for (let i = 0; i < items.length - 1; i++) { const g = segInfo(items[i], items[i+1]); if (g.gap > maxGap) maxGap = g.gap; }
  const overbooked = films.length >= 4 && maxGap < 60;
  const conflicts = (() => { let n = 0; for (let i = 0; i < items.length - 1; i++) { if (segInfo(items[i], items[i+1]).gap < 0) n++; } return n; })();

  const removeBlock = (id) => setBlocks(b => b.filter(x => x.id !== id));

  return (
    <div style={{padding:"4px 0 30px"}}>
      <div style={{...S.chipRow, padding:"8px 12px 4px"}}>
        <Chip active={planMode === "my"} label="Můj plán" onClick={() => setPlanMode("my")} c={c} />
        <Chip active={planMode === "chceme"} label="Chceme" dot={c.ok} onClick={() => setPlanMode("chceme")} c={c} />
      </div>
      <div style={{...S.planTop}}>
        <span style={{color:c.muted, fontSize:13}}>
          {items.length ? `${items.length} položek · ${fmtDur(totalRuntime)}` : "Plán je prázdný"}
        </span>
        <button onClick={() => setWeather(weather === "sun" ? "rain" : "sun")} style={{...S.wxBtn, borderColor:c.line, color:c.ink}}>
          {weather === "sun" ? "☀️ slunečno" : "🌧️ déšť"}
        </button>
      </div>

      {(overbooked || conflicts > 0) && (
        <div style={{...S.warnCard, borderColor:c.bad, color:c.ink}}>
          {conflicts > 0 && <div>⚠️ {conflicts}× se ti filmy <b>překrývají</b> — něco nestihneš celé.</div>}
          {overbooked && <div>🍽️ Den je nabitý a nemáš <b>žádnou pauzu na jídlo</b> (max {maxGap} min). Zvaž vynechat jeden film.</div>}
        </div>
      )}

      {items.length === 0 ? (
        <div style={{padding:"36px 22px", textAlign:"center", color:c.muted}}>
          <div style={{fontSize:38, marginBottom:8}}>🎬</div>
          {planMode === "chceme"
            ? <><p style={{margin:0, color:c.ink, fontWeight:600}}>Žádné "Chceme" filmy dnes</p><p style={{marginTop:6}}>Pro tento den nejsou v přípravce žádné tučně vyznačené filmy.</p></>
            : <><p style={{margin:0, color:c.ink, fontWeight:600}}>Zatím tu nic není</p><p style={{marginTop:6}}>Přidej filmy a akce v Programu (<strong style={{color:c.accent}}>+</strong>). Sestaví se ti tu osa dne s přesuny, mezičasem i tipy na jídlo.</p><button onClick={() => setTab("program")} style={{...S.ghostBtn, color:c.accent, borderColor:c.accent}}>Otevřít program</button></>
          }
        </div>
      ) : (
        <ol style={S.timeline}>
          {items.map((it, i) => {
            const sec = SECTIONS[it.sec]; const ven = VENUES[it.v]; const next = items[i+1];
            const tk = it.kind === "film" ? tickets[it.id] : null;
            const seg = next ? segInfo(it, next) : null;
            const bigGap = seg && seg.gap >= 45;
            return (
              <li key={it.id}>
                <div style={{...S.tlCard, background:c.surface, borderColor:c.line, borderLeft:`3px solid ${sec?.color || c.line}`}}>
                  <div style={{...S.tlTime, color:c.accent}}>{it.t}</div>
                  <button style={S.tlBody} onClick={() => it.kind === "film" ? setDetail(it.f) : null}>
                    <div style={S.title}>{it.kind !== "film" ? `${it.kind === "event" ? "🎉" : "📌"} ` : ""}{it.title}</div>
                    <div style={{...S.meta, color:c.muted}}>{it.r ? fmtDur(it.r) : "pásmo"} · konec ~{endTime(it.t, it.r||90)}</div>
                    <div style={S.tagRow}>
                      <span style={{...S.ven, color:c.ink}}>📍 {it.kind === "block" && it.place ? it.place : ven.name}</span>
                      {tk && <span style={{...S.tkTag, color:TICKET[tk].c, borderColor:TICKET[tk].c}}>{TICKET[tk].i} {TICKET[tk].l}</span>}
                    </div>
                  </button>
                  <div style={{display:"flex", flexDirection:"column"}}>
                    {it.kind === "film" && <button onClick={() => cycleTicket(it.id)} style={{...S.tkBtn, color: tk ? TICKET[tk].c : c.muted, borderColor:c.line, flex:1}}>{tk ? TICKET[tk].i : "🎟"}</button>}
                    {(() => {
                      const autoChceme = planMode === "chceme" && it.kind === "film" && PICKS[it.f] === "yes" && !picked.has(it.id);
                      return <button onClick={() => it.kind === "block" ? removeBlock(it.id) : toggle(it.id)}
                        title={autoChceme ? "Přidat i do mého plánu" : "Odebrat z plánu"}
                        style={{...S.addBtn, flex:1, background: autoChceme ? "transparent" : c.accent, color: autoChceme ? c.ok : c.bg, borderColor: autoChceme ? c.ok : c.accent}}>
                        {autoChceme ? "+" : "✓"}
                      </button>;
                    })()}
                  </div>
                </div>
                {seg && bigGap && <GapBlock seg={seg} from={it} weather={weather} c={c} setTab={setTab} />}
                {seg && !bigGap && <PlanTransfer seg={seg} from={it} to={next} c={c} />}
              </li>
            );
          })}
        </ol>
      )}

      {items.length > 0 && !adding &&
        <button onClick={() => setAdding(true)} style={{...S.addBlockBtn, color:c.accent, borderColor:c.line}}>+ Přidat vlastní blok (večeře, sraz, pauza…)</button>}
      {adding && <BlockForm day={day} c={c} onCancel={() => setAdding(false)} onAdd={(b) => { setBlocks(x => [...x, b]); setAdding(false); }} />}

      {films.length > 0 && rate && (
        <div style={{padding:"0 12px 24px"}}>
          <div style={{fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:c.muted, padding:"16px 2px 8px"}}>Jak to bylo?</div>
          {films.map(it => {
            const r = (ratings || {})[it.f] || {};
            return (
              <div key={it.f} style={{display:"flex", alignItems:"center", gap:8, padding:"9px 0", borderBottom:`1px solid ${c.line}`}}>
                <span style={{flex:1, color:c.ink, fontSize:13, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{it.title}</span>
                <div style={{display:"flex", gap:1, flexShrink:0}}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => rate(it.f, r.stars === n ? 0 : n)}
                      style={{background:"none", border:"none", fontSize:22, lineHeight:1, cursor:"pointer", padding:"0 2px", color:(r.stars||0) >= n ? c.accent : c.line}}>★</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PlanTransfer({ seg, from, to, c }) {
  let msg;
  if (seg.gap < 0) msg = `Překryv ${-seg.gap} min`;
  else if (seg.same) msg = `Stejné místo · ${seg.gap} min pauza`;
  else msg = `${VENUES[from.v].short} → ${VENUES[to.v].short} · ~${seg.walk} min pěšky · máš ${seg.gap} min`;
  return (
    <div style={{...S.transfer, color:c.muted}}>
      <span style={{...S.transferDot, background:seg.color}} />
      <span style={{flex:1}}>{msg}</span>
      <span style={{...S.statusPill, color:c.bg, background:seg.color}}>{seg.code}</span>
    </div>
  );
}

function GapBlock({ seg, from, weather, c, setTab }) {
  const mid = toMin(from.t) + (from.r||90) + Math.floor(seg.gap / 2);
  const open = PLACES.filter(p => openAt(p, mid));
  const pick = (groups) => open
    .filter(p => groups.includes(CAT[p.cat].g))
    .map(p => ({ p, w: walkFromVenue(from.v, p) }))
    .sort((a, b) => (weather === "sun" && /zahrádk|teras/i.test(b.p.tag) ? 1 : 0) - (weather === "sun" && /zahrádk|teras/i.test(a.p.tag) ? 1 : 0) || a.w - b.w);
  const food = pick(["jídlo"])[0]; const drink = pick(["pití"])[0];
  return (
    <div style={{...S.gap, borderColor:c.line, background:c.surface}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <span style={{fontWeight:700, color:c.accent}}>🕒 Volný čas · {fmtDur(seg.gap)}</span>
        {!seg.same && <span style={{fontSize:12, color:c.muted}}>přesun ~{seg.walk} min</span>}
      </div>
      <div style={{fontSize:12.5, color:c.muted, margin:"4px 0 8px"}}>U {VENUES[from.v].short}{weather === "sun" ? " · hezky, ber zahrádku" : ""}:</div>
      {food && <div style={S.gapTip}><span>{CAT[food.p.cat].e} <b style={{color:c.ink}}>{food.p.n}</b> — {food.p.tag}</span><span style={{color:c.muted}}>~{food.w}′</span></div>}
      {drink && <div style={S.gapTip}><span>{CAT[drink.p.cat].e} <b style={{color:c.ink}}>{drink.p.n}</b> — {drink.p.tag}</span><span style={{color:c.muted}}>~{drink.w}′</span></div>}
      <button onClick={() => setTab("okoli")} style={{...S.gapMore, color:c.accent}}>Další podniky v Okolí →</button>
    </div>
  );
}

function BlockForm({ day, c, onCancel, onAdd }) {
  const [title, setTitle] = useState(""); const [t, setT] = useState("20:00"); const [len, setLen] = useState(90); const [v, setV] = useState("");
  return (
    <div style={{...S.blockForm, background:c.surface, borderColor:c.line}}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Název (Večeře, Sraz s partou…)"
        style={{...S.search, marginBottom:8, background:c.bg, color:c.ink, borderColor:c.line}} />
      <div style={{display:"flex", gap:8, marginBottom:8}}>
        <input type="time" value={t} onChange={e => setT(e.target.value)} style={{...S.search, marginBottom:0, background:c.bg, color:c.ink, borderColor:c.line}} />
        <input type="number" value={len} onChange={e => setLen(+e.target.value)} min={15} step={15} style={{...S.search, marginBottom:0, width:90, background:c.bg, color:c.ink, borderColor:c.line}} />
      </div>
      <select value={v} onChange={e => setV(e.target.value)} style={{...S.search, marginBottom:10, background:c.bg, color:c.ink, borderColor:c.line}}>
        <option value="">Místo (kvůli přesunu) — nepovinné</option>
        {Object.entries(VENUES).filter(([k]) => k === "T1" || VENUES[k].grp !== "T").map(([k, vn]) => (
          <option key={k} value={k}>{vn.grp === "T" ? "Thermal" : vn.name}</option>
        ))}
      </select>
      <div style={{display:"flex", gap:8}}>
        <button onClick={() => { if (!title.trim()) return; onAdd({ id:`b${Date.now()}`, day, t, r:len, v:v||"T1", title:title.trim(), place: v ? VENUES[v].name : "" }); }}
          style={{...S.primaryBtn, background:c.accent, color:c.bg}}>Přidat do plánu</button>
        <button onClick={onCancel} style={{...S.ghostBtnSm, color:c.muted, borderColor:c.line}}>Zrušit</button>
      </div>
    </div>
  );
}
