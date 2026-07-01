import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { VENUES, PLACES, CAT } from "../data.js";
import { segInfo, buildDayItems } from "../utils.js";
import { COLORS, S } from "../styles.js";

const MAP_VENUES = ["T1","CAS","DRA","HUS","MD","L3","CIS","PUPP"];
const dispId   = (v) => VENUES[v].grp === "T" ? "T1" : v;
const dispName = (v) => VENUES[v].grp === "T" ? "Hotel Thermal" : VENUES[v].name;

export default function MapView({ day, picked, blocks, setDetail, setTab }) {
  const c = COLORS;
  const [layer, setLayer] = useState("plan");
  const [sel, setSel] = useState(null);
  const elRef = useRef(null), mapRef = useRef(null), groupRef = useRef(null);

  const stops = buildDayItems(day, picked, blocks);
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
      const faded = layer !== "plan" && !inPlan;
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
        L.polyline([[a.lat, a.lng], [b.lat, b.lng]], { color:g.color, weight:4, opacity:.9 }).addTo(grp);
        const mid = [(a.lat+b.lat)/2, (a.lng+b.lng)/2];
        L.marker(mid, { interactive:false, icon:L.divIcon({ className:"kvic",
          html:`<div class="mlbl" style="color:${g.color};border-color:${g.color}">${g.walk}′</div>`,
          iconSize:[36,18], iconAnchor:[18,9] }) }).addTo(grp);
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
  }, [day, picked, blocks, layer]);

  return (
    <div style={{padding:"6px 0 30px"}}>
      <div style={{padding:"0 12px 8px", display:"flex", gap:6}}>
        {[["plan","🎬 Plán"],["food","🍽️ Jídlo & pití"],["prakt","💧 Praktické"]].map(([k, l]) => (
          <button key={k} onClick={() => setLayer(k)} style={{...S.miniChip, flex:1, background:layer === k ? c.accent : "transparent", color:layer === k ? c.bg : c.muted, borderColor:layer === k ? c.accent : c.line}}>{l}</button>
        ))}
      </div>

      <div style={{padding:"0 12px"}}>
        <div ref={elRef} style={{ height:"58vh", minHeight:320, borderRadius:14, overflow:"hidden", border:`1px solid ${c.line}` }} />
      </div>

      {layer === "plan" && (
        <div style={{...S.planSummary, color:c.muted, display:"flex", justifyContent:"space-between"}}>
          <span>Trasa dne</span>{stops.length > 1 && <span>~{totalWalk} min chůze celkem</span>}
        </div>
      )}

      {sel && (
        <div style={{...S.mapSel, background:c.surface, borderColor:c.line}}>
          <div style={{fontWeight:700}}>{dispName(sel)}</div>
          {selStops.length > 0
            ? selStops.map(s => (
                <button key={s.id} onClick={() => s.kind === "film" ? setDetail(s.f) : null} style={{...S.mapSelRow, color:c.ink}}>
                  <b style={{color:c.accent}}>{s.t}</b> {s.kind === "event" ? "🎉 " : s.kind === "block" ? "📌 " : ""}{s.title} <span style={{color:c.muted}}>· {VENUES[s.v].name}</span>
                </button>))
            : <div style={{color:c.muted, fontSize:13, marginTop:4}}>Tady dnes nic v plánu nemáš.</div>}
        </div>
      )}

      {layer === "plan" && (stops.length === 0 ? (
        <div style={{padding:"18px 20px", textAlign:"center", color:c.muted}}>
          <p style={{margin:0, color:c.ink, fontWeight:600}}>Žádná trasa</p>
          <p style={{marginTop:6}}>Přidej si filmy do plánu a uvidíš je na mapě i jako trasu.</p>
          <button onClick={() => setTab("program")} style={{...S.ghostBtn, color:c.accent, borderColor:c.accent}}>Otevřít program</button>
        </div>
      ) : (
        <ol style={S.routeList}>
          {stops.map((s, i) => {
            const n = stops[i+1]; const g = n ? segInfo(s, n) : null;
            return (
              <li key={s.id}>
                <button style={{...S.routeStop, background:c.surface, borderColor:c.line}} onClick={() => { setSel(dispId(s.v)); if (s.kind === "film") setDetail(s.f); }}>
                  <span style={{...S.routeNum, background:c.accent, color:c.bg}}>{i+1}</span>
                  <span style={{flex:1, minWidth:0}}>
                    <span style={{fontWeight:600}}>{s.t}</span> · {s.kind === "event" ? "🎉 " : s.kind === "block" ? "📌 " : ""}{s.title}
                    <span style={{display:"block", fontSize:12, color:c.muted}}>📍 {VENUES[s.v].name}</span>
                  </span>
                </button>
                {g && !g.same && (
                  <div style={{...S.routeMove, color:c.muted}}>
                    <span style={{...S.transferDot, background:g.color}} />
                    {VENUES[s.v].short} → {VENUES[n.v].short} · ~{g.walk} min pěšky · {g.gap < 0 ? `překryv ${-g.gap} min` : `máš ${g.gap} min`}
                  </div>
                )}
                {g && g.same && (<div style={{...S.routeMove, color:c.muted}}><span style={{...S.transferDot, background:c.ok}} /> stejné místo · {g.gap} min pauza</div>)}
              </li>
            );
          })}
        </ol>
      ))}
    </div>
  );
}
