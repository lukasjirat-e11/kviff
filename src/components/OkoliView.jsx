import { useState } from "react";
import { VENUES, PLACES, CAT } from "../data.js";
import { buildDayItems, walkFromVenue, openAt, minToStr } from "../utils.js";
import { COLORS, S } from "../styles.js";
import Chip from "./Chip.jsx";

export default function OkoliView({ day, picked, blocks, favs, toggleFav, weather, setWeather, nowMin, setNowMin }) {
  const c = COLORS;
  const planVenuesToday = buildDayItems(day, picked, blocks).map(i => i.v);
  const defRef = planVenuesToday[0] || "T1";
  const [ref, setRef] = useState(defRef);
  const [group, setGroup] = useState("");
  const [onlyOpen, setOnlyOpen] = useState(true);

  const refVenues = Object.entries(VENUES).filter(([k]) => k === "T1" || VENUES[k].grp !== "T");
  const list = PLACES
    .filter(p => group === "fav" ? favs.has(p.n) : (!group || CAT[p.cat].g === group))
    .filter(p => !onlyOpen || openAt(p, nowMin))
    .map(p => ({ p, w: walkFromVenue(ref, p) }))
    .sort((a, b) => (weather === "sun" && /zahrádk|teras/i.test(b.p.tag) ? 1 : 0) - (weather === "sun" && /zahrádk|teras/i.test(a.p.tag) ? 1 : 0) || a.w - b.w);

  return (
    <div style={{padding:"10px 12px 30px"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
        <span style={{fontSize:13, color:c.muted}}>Od kina:</span>
        <button onClick={() => setWeather(weather === "sun" ? "rain" : "sun")} style={{...S.wxBtn, borderColor:c.line, color:c.ink}}>{weather === "sun" ? "☀️" : "🌧️"}</button>
      </div>
      <div style={{...S.chipRow, marginBottom:8}}>
        {refVenues.map(([k, v]) => (
          <Chip key={k} active={ref === k} label={v.grp === "T" ? "Thermal" : v.short} onClick={() => setRef(k)} c={c} />
        ))}
      </div>

      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10}}>
        <div style={{display:"flex", gap:6}}>
          {[["","Vše"],["jídlo","🍽️ Jídlo"],["pití","☕ Pití"],["praktické","💧 Praktické"],["fav","⭐ Oblíbená"]].map(([k, l]) => (
            <button key={k} onClick={() => setGroup(k)} style={{...S.miniChip, background:group === k ? c.ink : "transparent", color:group === k ? c.bg : c.muted, borderColor:group === k ? c.ink : c.line}}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:10}}>
        <button onClick={() => setOnlyOpen(v => !v)} style={{...S.miniChip, background:onlyOpen ? c.accent : "transparent", color:onlyOpen ? c.bg : c.muted, borderColor:onlyOpen ? c.accent : c.line}}>
          {onlyOpen ? "✓ " : ""}Otevřeno v {minToStr(nowMin)}
        </button>
        <input type="range" min={480} max={1500} step={15} value={nowMin} onChange={e => setNowMin(+e.target.value)} style={{flex:1, accentColor:c.accent}} />
      </div>

      {list.length === 0 && <p style={{color:c.muted, padding:"16px 4px"}}>{group === "fav" ? "Zatím nemáš oblíbená místa — přidej je ⭐." : "Nic otevřeného v tomhle čase."}</p>}
      <ul style={{listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:8}}>
        {list.map(({ p, w }) => {
          const isOpen = openAt(p, nowMin); const fav = favs.has(p.n);
          return (
            <li key={p.n} style={{...S.placeCard, background:c.surface, borderColor:c.line}}>
              <div style={{fontSize:22, width:30, textAlign:"center"}}>{CAT[p.cat].e}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontWeight:700}}>{p.n}</div>
                <div style={{...S.meta, color:c.muted}}>{p.tag}</div>
                <div style={S.tagRow}>
                  <span style={{...S.ven, color:c.ink}}>🚶 ~{w} min</span>
                  <span style={{fontSize:12, color: isOpen ? c.ok : c.bad}}>{isOpen ? "otevřeno" : "zavřeno"}</span>
                  {p.price > 0 && <span style={{fontSize:12, color:c.muted}}>{"₽".repeat(p.price)}</span>}
                </div>
              </div>
              <button onClick={() => toggleFav(p.n)} style={{...S.favStar, color: fav ? c.accent : c.line}}>★</button>
            </li>
          );
        })}
      </ul>
      <p style={{fontSize:11.5, color:c.muted, marginTop:14}}>Vzdálenost je vzdušnou čarou přepočtená na chůzi — orientační. Otevírací doba se může lišit, hlavně v období festivalu.</p>
    </div>
  );
}
