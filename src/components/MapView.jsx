import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { VENUES, PLACES, CAT, PICKS, SCR, SECTIONS } from "../data.js";
import { segInfo, buildDayItems } from "../utils.js";
import { COLORS, S } from "../styles.js";
import Chip from "./Chip.jsx";

const MAP_VENUES = ["T1","CAS","DRA","HUS","MD","L3","CIS","PUPP"];
const dispId   = (v) => VENUES[v].grp === "T" ? "T1" : v;
const dispName = (v) => VENUES[v].grp === "T" ? "Hotel Thermal" : VENUES[v].name;

export default function MapView({ day, picked, blocks, setDetail, setTab }) {
  const c = COLORS;
  const [layer, setLayer] = useState("plan");
  const [sel, setSel] = useState(null);
  const [planMode, setPlanMode] = useState("my");
  const elRef = useRef(null), mapRef = useRef(null), groupRef = useRef(null);

  const effectivePicked = planMode === "chceme"
    ? new Set([...picked, ...SCR.filter(s => s.day === day && PICKS[s.f] === "yes").map(s => s.id)])
    : picked;
  const stops = buildDayItems(day, effectivePicked, blocks);
  const orderByVenue = {};
  stops.forEach((s, i) => { const d = dispId(s.v); (orderByVenue[d] = orderByVenue[d] || []).push(i+1); });
  const planVenues = new Set(stops.map(s => dispId(s.v)));
  let totalWalk = 0;
  for (let i = 0; i < stops.length - 1; i++) { const g = segInfo(stops[i], stops[i+1]); if (!g.same) totalWalk += g.walk; }
  const selStops = sel ? stops.filter(s => dispId(s.v) === sel) : [];

  useEffect(() => {
    if (mapRef.current || !elRef.current) return;
    const map = L.map(elRef.current, { zoomControl:true, attributionControl:true, tap:true })
      .setView([50.2265, 12.8795], 14);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:"&copy; OpenStreetMap &copy; CARTO", subdomains:"abcd", maxZoom:19,
    }).addTo(map);
    groupRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 60);
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current, grp = groupRef.current;
    if (!map || !grp) return;
    grp.clearLayers();
    const bounds = [];

    const venueIcon = (vid) => {
      const inPlan = planVenues.has(vid);
      const nums = orderByVenue[vid] || [];
      if (layer === "plan") {
        const label = nums.length ? (nums.length > 2 ? `${nums[0]}+` : nums.join(",")) : "";
        return L.divIcon({ className:"kvic",
          html:`<div style="width:34px;height:34px;border-radius:50%;background:${inPlan ? c.accent : c.surface};color:${inPlan ? c.bg : c.muted};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:${nums.length > 1 ? 11 : 14}px;border:2px solid ${inPlan ? c.accent : c.line};box-shadow:0 2px 10px rgba(0,0,0,.8);font-family:system-ui">${label}</div>`,
          iconSize:[34,34], iconAnchor:[17,17] });
      }
      const faded = !inPlan;
      const cls = `vpin ${inPlan ? "on" : ""} ${faded ? "faded" : ""}`;
      const inner = nums.length ? (nums.length > 2 ? nums[0]+"…" : nums.join(",")) : "";
      return L.divIcon({ className:"kvic",
        html:`<div class="vwrap"><div class="${cls}">${inner}</div><div class="vlbl ${faded ? "faded" : ""}">${vid === "T1" ? "Thermal" : VENUES[vid].short}</div></div>`,
        iconSize:[90,48], iconAnchor:[45,18] });
    };

    MAP_VENUES.forEach(vid => {
      const v = VENUES[vid];
      const m = L.marker([v.lat, v.lng], { icon: venueIcon(vid) }).addTo(grp);
      m.on("click", () => setSel(vid));
      if (layer === "plan" ? planVenues.has(vid) : true) bounds.push([v.lat, v.lng]);
    });

    if (layer === "plan") {
      for (let i = 0; i < stops.length - 1; i++) {
        const a = VENUES[stops[i].v], b = VENUES[stops[i+1].v]; const g = segInfo(stops[i], stops[i+1]);
        if (g.same) continue;
        L.polyline([[a.lat, a.lng], [b.lat, b.lng]], { color:g.color, weight:5, opacity:.9 }).addTo(grp);
        const mid = [(a.lat+b.lat)/2, (a.lng+b.lng)/2];
        L.marker(mid, { interactive:false, icon:L.divIcon({ className:"kvic",
          html:`<div style="background:${c.bg};color:${g.color};border:1.5px solid ${g.color};border-radius:6px;padding:2px 7px;font-size:11px;font-weight:700;font-family:system-ui;white-space:nowrap;box-shadow:0 1px 5px rgba(0,0,0,.6)">${g.walk}′</div>`,
          iconSize:[40,20], iconAnchor:[20,10] }) }).addTo(grp);
      }
    }

    if (layer !== "plan") {
      const want = layer === "food" ? ["jídlo","pití"] : ["praktické"];
      PLACES.filter(p => want.includes(CAT[p.cat].g)).forEach(p => {
        const m = L.marker([p.la, p.ln], { icon:L.divIcon({ className:"kvic",
          html:`<div class="pmk">${CAT[p.cat].e}</div>`, iconSize:[30,30], iconAnchor:[15,15], popupAnchor:[0,-12] }) }).addTo(grp);
        m.bindPopup(`<b>${p.n}</b><br>${p.tag}<br><span style="opacity:.7">${p.o}:00–${(p.c > 24 ? p.c-24 : p.c)}:00${p.price > 0 ? " · "+"₽".repeat(p.price) : ""}</span>`);
        bounds.push([p.la, p.ln]);
      });
    }

    if (bounds.length) map.fitBounds(bounds, { padding:[50,50], maxZoom:16 });
    setTimeout(() => map.invalidateSize(), 30);
  }, [day, picked, blocks, layer, planMode]);

  return (
    <div style={{padding:"6px 0 30px"}}>
      {/* Mode + layer chips */}
      <div style={{display:"flex", gap:6, padding:"6px 12px 6px"}}>
        <Chip active={planMode === "my"} label="Můj plán" onClick={() => setPlanMode("my")} c={c} />
        <Chip active={planMode === "chceme"} label="Chceme" dot={c.ok} onClick={() => setPlanMode("chceme")} c={c} />
        <span style={{flex:1}} />
        {[["plan","Trasa"],["food","Jídlo"],["prakt","Praktické"]].map(([k, l]) => (
          <button key={k} onClick={() => setLayer(k)} style={{...S.miniChip, background:layer === k ? c.accent : "transparent", color:layer === k ? c.bg : c.muted, borderColor:layer === k ? c.accent : c.line, padding:"4px 10px"}}>{l}</button>
        ))}
      </div>

      {/* Map */}
      <div style={{padding:"0 12px 0"}}>
        <div ref={elRef} style={{
          height: layer === "plan" && stops.length > 0 ? "36vh" : "58vh",
          minHeight: 200, borderRadius:14, overflow:"hidden", border:`1px solid ${c.line}`
        }} />
      </div>

      {/* Plan layer — transit timeline */}
      {layer === "plan" && (stops.length === 0 ? (
        <div style={{padding:"28px 20px", textAlign:"center", color:c.muted}}>
          <p style={{margin:0, color:c.ink, fontWeight:600}}>Žádná trasa</p>
          <p style={{marginTop:6}}>Přidej si filmy do plánu a uvidíš je na mapě i jako trasu.</p>
          <button onClick={() => setTab("program")} style={{...S.ghostBtn, color:c.accent, borderColor:c.accent}}>Otevřít program</button>
        </div>
      ) : (
        <div style={{padding:"0 12px 40px"}}>
          {/* Summary bar */}
          <div style={{display:"flex", justifyContent:"space-between", padding:"10px 2px", fontSize:13, borderBottom:`1px solid ${c.line}`, marginBottom:10}}>
            <span style={{color:c.ink, fontWeight:600}}>{stops.length} zastávek</span>
            {totalWalk > 0 && <span style={{color:c.muted}}>~{totalWalk} min chůze celkem</span>}
          </div>

          {stops.map((s, i) => {
            const next = stops[i+1];
            const seg = next ? segInfo(s, next) : null;
            const sec = SECTIONS[s.sec] || {};
            const isSelected = sel === dispId(s.v);
            return (
              <div key={s.id}>
                {/* Stop card */}
                <button
                  onClick={() => {
                    setSel(dispId(s.v));
                    mapRef.current?.flyTo([VENUES[s.v].lat, VENUES[s.v].lng], 16, {animate:true, duration:0.4});
                    if (s.kind === "film") setDetail(s.f);
                  }}
                  style={{display:"flex", alignItems:"center", gap:12, width:"100%", textAlign:"left",
                    background:c.surface, borderRadius:12, padding:"12px 14px",
                    border:`1px solid ${isSelected ? c.accent : c.line}`,
                    boxShadow: isSelected ? `0 0 0 1px ${c.accent}` : "none",
                    cursor:"pointer", outline:"none", marginBottom:0}}
                >
                  {/* Number badge */}
                  <div style={{width:32, height:32, borderRadius:"50%", flexShrink:0,
                    background:c.accent, color:c.bg, fontWeight:700, fontSize:14,
                    display:"flex", alignItems:"center", justifyContent:"center"}}>{i+1}</div>
                  {/* Content */}
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{display:"flex", alignItems:"baseline", gap:8}}>
                      <span style={{fontWeight:700, color:c.accent, fontSize:15, flexShrink:0}}>{s.t}</span>
                      <span style={{fontWeight:600, color:c.ink, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                        {s.kind === "event" ? "🎉 " : s.kind === "block" ? "📌 " : ""}{s.title}
                      </span>
                    </div>
                    <div style={{fontSize:12, color:c.muted, marginTop:3}}>
                      📍 {VENUES[s.v].name}{s.r ? ` · ${s.r} min` : ""}{s.disc ? " · + diskuse" : ""}
                    </div>
                  </div>
                  {/* Section color stripe */}
                  {sec.color && <div style={{width:3, borderRadius:2, background:sec.color, alignSelf:"stretch", flexShrink:0}} />}
                </button>

                {/* Connector between stops */}
                {seg && (
                  <div style={{display:"flex", alignItems:"stretch", minHeight:48}}>
                    {/* Vertical line — aligned with badge center (14px card-padding + 16px half-badge = 30px) */}
                    <div style={{width:30, display:"flex", justifyContent:"center", flexShrink:0}}>
                      <div style={{width:2, background:seg.color, borderRadius:1}} />
                    </div>
                    {/* Walk info */}
                    <div style={{display:"flex", alignItems:"center", gap:6, flex:1, paddingLeft:14, paddingRight:2}}>
                      <span style={{fontSize:13, color:c.muted}}>
                        {seg.same ? "stejné kino" : `🚶 ${seg.walk} min · ${VENUES[s.v].short} → ${VENUES[next.v].short}`}
                      </span>
                      <span style={{marginLeft:"auto", fontSize:11, fontWeight:700, padding:"2px 8px",
                        borderRadius:10, background:seg.color + "30", color:seg.color, flexShrink:0}}>
                        {seg.gap < 0 ? `⚠ překryv ${-seg.gap} min` : `${seg.gap} min`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
