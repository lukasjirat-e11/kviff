import { useState, useMemo } from "react";
import { SECTIONS, VENUES, EVENTS, EVENT_EMOJI, FILMS, SCR, BADGE_LABELS, TICKET, TIME_GROUPS } from "../data.js";
import { toMin, minToStr, badgeColor } from "../utils.js";
import { COLORS, S } from "../styles.js";
import Chip from "./Chip.jsx";

export default function ProgramView({ day, q, setQ, secFilter, setSecFilter, picked, toggle, setDetail, tickets, cycleTicket, nowMin, setNowMin }) {
  const c = COLORS;
  const [nowOn, setNowOn] = useState(false);
  const [badgeFilter, setBadgeFilter] = useState("");

  const items = useMemo(() => {
    const films = SCR.filter(s => s.day === day).map(s => {
      const f = FILMS[s.f];
      return { id:s.id, t:s.t, v:s.v, kind:"film", f:s.f, title:f.t, dir:f.d, sec:f.s, r:f.r, badge:f.b, disc:s.disc };
    });
    const evs = EVENTS.filter(e => e.day === day).map(e => (
      { id:e.id, t:e.t, v:e.v, kind:"event", title:e.title, sec:"AKCE", r:e.r, ecat:e.cat }
    ));
    return [...films, ...evs]
      .filter(it => !secFilter || it.sec === secFilter)
      .filter(it => !badgeFilter || it.badge === badgeFilter)
      .filter(it => { if (!q) return true; const k = q.toLowerCase(); return it.title.toLowerCase().includes(k) || (it.dir||"").toLowerCase().includes(k); })
      .sort((a, b) => toMin(a.t) - toMin(b.t));
  }, [day, q, secFilter, badgeFilter]);

  const soon = items.filter(it => { const m = toMin(it.t); return m >= nowMin && m <= nowMin + 90; });
  const grouped = TIME_GROUPS
    .map(g => ({ label:g.label, items: items.filter(it => { const m = toMin(it.t); return m >= g.from && m < g.to; }) }))
    .filter(g => g.items.length > 0);

  const renderCard = (it) => {
    const sec = SECTIONS[it.sec]; const ven = VENUES[it.v]; const on = picked.has(it.id);
    const tk = tickets[it.id];
    return (
      <li key={it.id} style={{...S.card, background:c.surface,
          borderTop:`1px solid ${on ? c.accent : c.line}`, borderRight:`1px solid ${on ? c.accent : c.line}`,
          borderBottom:`1px solid ${on ? c.accent : c.line}`, borderLeft:`4px solid ${sec.color}`}}>
        <button style={S.cardMain} onClick={() => it.kind === "film" ? setDetail(it.f) : toggle(it.id)}>
          <div style={S.cardTime}>
            <span style={S.timeBig}>{it.t}</span>
            <span style={{...S.runtime, color:c.muted}}>{it.r ? `${it.r}′` : "pásmo"}</span>
          </div>
          <div style={S.cardBody}>
            <div style={S.titleRow}>
              <span style={S.title}>{it.kind === "event" ? `${EVENT_EMOJI[it.ecat]} ` : ""}{it.title}</span>
              {it.badge && <span style={{...S.badge, background:badgeColor(it.badge), color:"#14110F"}}>{BADGE_LABELS[it.badge]}</span>}
            </div>
            {it.dir && <div style={{...S.meta, color:c.muted}}>{it.dir}</div>}
            <div style={S.tagRow}>
              <span style={{...S.sec, color:sec.color, borderColor:sec.color}}>{sec.name}</span>
              <span style={{...S.ven, color:c.ink}}>📍 {ven.name}</span>
              {it.disc && <span style={{...S.disc, color:c.muted}}>+ diskuse</span>}
              {tk && <span style={{...S.tkTag, color:TICKET[tk].c, borderColor:TICKET[tk].c}}>{TICKET[tk].i} {TICKET[tk].l}</span>}
            </div>
          </div>
        </button>
        <div style={{display:"flex", flexDirection:"column"}}>
          <button onClick={() => toggle(it.id)} style={{...S.addBtn, flex:1, background: on ? c.accent : "transparent", color: on ? c.bg : c.accent, borderColor:c.accent}}>{on ? "✓" : "+"}</button>
          {it.kind === "film" && <button onClick={() => cycleTicket(it.id)} title="Vstupenka"
            style={{...S.tkBtn, color: tk ? TICKET[tk].c : c.muted, borderColor:c.line}}>{tk ? TICKET[tk].i : "🎟"}</button>}
        </div>
      </li>
    );
  };

  return (
    <div>
      <div style={S.filters}>
        <div style={{display:"flex", gap:8, marginBottom:10}}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Hledat film, režii, akci…"
            style={{...S.search, flex:1, marginBottom:0, background:c.surface, color:c.ink, borderColor:c.line}} />
          <button onClick={() => setNowOn(v => !v)} style={{...S.nowToggle, background: nowOn ? c.accent : c.surface,
            color: nowOn ? c.bg : c.ink, borderColor: nowOn ? c.accent : c.line}}>Teď</button>
        </div>

        {nowOn && (
          <div style={{...S.nowPanel, background:c.surface, borderColor:c.line}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6}}>
              <span style={{fontWeight:700}}>Teď a tady</span>
              <span style={{color:c.accent, fontWeight:700}}>{minToStr(nowMin)}</span>
            </div>
            <input type="range" min={480} max={1500} step={15} value={nowMin}
              onChange={e => setNowMin(+e.target.value)} style={{width:"100%", accentColor:c.accent}} />
            <div style={{fontSize:12.5, color:c.muted, margin:"4px 0 8px"}}>Co začíná v příštích 90 minutách:</div>
            {soon.length === 0
              ? <div style={{color:c.muted, fontSize:13}}>Nic v tomhle okně. Posuň čas nebo zajdi na pivo.</div>
              : soon.slice(0, 6).map(it => (
                  <button key={it.id} onClick={() => it.kind === "film" ? setDetail(it.f) : toggle(it.id)} style={{...S.soonRow, color:c.ink}}>
                    <b style={{color:c.accent}}>{it.t}</b> {it.kind === "event" ? `${EVENT_EMOJI[it.ecat]} ` : ""}{it.title}
                    <span style={{color:c.muted}}> · {VENUES[it.v].short}</span>
                    {tickets[it.id] && <span style={{marginLeft:6}}>{TICKET[tickets[it.id]].i}</span>}
                  </button>
                ))}
          </div>
        )}

        <div style={{...S.chipRow, marginBottom:8}}>
          <Chip active={!badgeFilter} label="Vše" onClick={() => setBadgeFilter("")} c={c} />
          {Object.entries(BADGE_LABELS).map(([k, v]) => (
            <Chip key={k} active={badgeFilter === k} label={v} dot={badgeColor(k)} onClick={() => setBadgeFilter(badgeFilter === k ? "" : k)} c={c} />
          ))}
        </div>

        <div style={S.chipRow}>
          <Chip active={!secFilter} label="Vše" onClick={() => setSecFilter("")} c={c} />
          {Object.entries(SECTIONS).map(([k, v]) => (
            <Chip key={k} active={secFilter === k} label={v.name} dot={v.color} onClick={() => setSecFilter(secFilter === k ? "" : k)} c={c} />
          ))}
        </div>
      </div>

      {items.length === 0 && <p style={{color:c.muted, padding:"24px 16px"}}>Nic neodpovídá filtru.</p>}

      {grouped.map(g => (
        <div key={g.label}>
          <div style={{...S.timeGroupHeader, color:c.muted}}>{g.label}</div>
          <ul style={S.list}>{g.items.map(it => renderCard(it))}</ul>
        </div>
      ))}
    </div>
  );
}
