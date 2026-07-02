import { useState, useRef } from "react";
import { FILMS, SECTIONS, SCR, DAYS, VENUES, TICKET } from "../data.js";
import { toMin, fmtDur } from "../utils.js";
import { COLORS, S } from "../styles.js";

export default function Detail({ filmId, onClose, picked, toggle, setDay, setTab, tickets, cycleTicket, ratings, rate }) {
  const c = COLORS; const f = FILMS[filmId]; const sec = SECTIONS[f.s];
  const shows = SCR.filter(s => s.f === filmId).sort((a, b) => a.day - b.day || toMin(a.t) - toMin(b.t));
  const r = ratings[filmId] || {};
  const [dragY, setDragY] = useState(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; isDragging.current = true; };
  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) setDragY(delta);
  };
  const handleTouchEnd = () => {
    isDragging.current = false;
    if (dragY > 120) { onClose(); } else { setDragY(0); }
  };

  return (
    <div style={S.sheetWrap} onClick={onClose}>
      <div style={{...S.sheet, background:c.bg, borderColor:c.line,
                   transform:`translateY(${dragY}px)`, transition:dragY === 0 ? "transform 0.25s ease" : "none"}}
           onClick={e => e.stopPropagation()}
           onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div style={S.sheetGrip} />
        <button style={{...S.close, color:c.muted}} onClick={onClose}>✕</button>

        <div style={{...S.sec, color:sec.color, borderColor:sec.color, alignSelf:"flex-start"}}>{sec.name}</div>
        <h2 style={S.detailTitle}>{f.t}</h2>
        <div style={{...S.meta, color:c.muted, marginBottom:14}}>
          {f.d}<br/>{f.c}{f.y ? ` · ${f.y}` : ""}{f.r ? ` · ${fmtDur(f.r)}` : " · pásmo"}
        </div>

        {f.syn
          ? <p style={{...S.synopsis, color:c.ink}}>{f.syn}</p>
          : <p style={{...S.synopsis, color:c.muted}}>Anotace tu zatím není. Oficiální popis najdeš na kviff.com.</p>}
        {f.u && <a href={`https://www.kviff.com/cs/program/film/84/${f.u}`} target="_blank" rel="noreferrer"
            style={{...S.link, color:c.accent}}>Oficiální anotace na kviff.com →</a>}

        <div style={{...S.rateBox, background:c.surface, borderColor:c.line}}>
          <div style={{...S.showsHead, color:c.muted, marginBottom:6}}>Moje hodnocení (divácká cena)</div>
          <div style={{display:"flex", gap:4, marginBottom:8}}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => rate(filmId, r.stars === n ? 0 : n, r.note)}
                style={{...S.star, color: (r.stars||0) >= n ? c.accent : c.line}}>★</button>
            ))}
            {r.stars > 0 && <span style={{color:c.muted, fontSize:13, alignSelf:"center", marginLeft:6}}>{r.stars}/5</span>}
          </div>
          <input value={r.note || ""} onChange={e => rate(filmId, r.stars||0, e.target.value)}
            placeholder="Poznámka po projekci…" style={{...S.search, marginBottom:0, background:c.bg, color:c.ink, borderColor:c.line}} />
        </div>

        <div style={{...S.showsHead, color:c.muted}}>Kdy a kde hraje</div>
        <ul style={S.showsList}>
          {shows.map(s => {
            const on = picked.has(s.id); const D = DAYS.find(d => d.d === s.day); const tk = tickets[s.id];
            return (
              <li key={s.id} style={{...S.showRow, background:c.surface, borderColor: on ? c.accent : c.line}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600}}>{D.label} · {s.t}</div>
                  <div style={{...S.meta, color:c.muted}}>📍 {VENUES[s.v].name}{s.disc ? " · + diskuse" : ""}</div>
                </div>
                <button onClick={() => cycleTicket(s.id)} title="Vstupenka"
                  style={{...S.tkBtnSm, color: tk ? TICKET[tk].c : c.muted, borderColor: tk ? TICKET[tk].c : c.line}}>{tk ? TICKET[tk].i : "🎟"}</button>
                <button onClick={() => toggle(s.id)}
                  style={{...S.showBtn, background:on ? c.accent : "transparent", color:on ? c.bg : c.accent, borderColor:c.accent}}>
                  {on ? "✓" : "+"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
