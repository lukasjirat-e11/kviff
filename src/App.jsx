import React, { useState, useEffect, useMemo } from "react";
import { DAYS } from "./data.js";
import { buildDayItems, segInfo } from "./utils.js";
import { COLORS, S, CSS } from "./styles.js";
import ProgramView from "./components/ProgramView.jsx";
import PlanView    from "./components/PlanView.jsx";
import MapView     from "./components/MapView.jsx";
import OkoliView   from "./components/OkoliView.jsx";
import ViceView    from "./components/ViceView.jsx";
import Detail      from "./components/Detail.jsx";

const TABS = [
  ["program", "Program", "🎬"],
  ["plan",    "Plán",    "📋"],
  ["mapa",    "Mapa",    "🗺️"],
  ["okoli",   "Okolí",   "🍽️"],
  ["vice",    "Více",    "···"],
];

export default function App() {
  const [tab, setTab]         = useState("program");
  const [day, setDay]         = useState(8);
  const [picked, setPicked]   = useState(() => new Set());
  const [detail, setDetail]   = useState(null);
  const [q, setQ]             = useState("");
  const [secFilter, setSecFilter] = useState("");
  const [tickets, setTickets] = useState({});
  const [ratings, setRatings] = useState({});
  const [favs, setFavs]       = useState(() => new Set());
  const [blocks, setBlocks]   = useState([]);
  const [people, setPeople]   = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [weather, setWeather] = useState("sun");
  const [nowMin, setNowMin]   = useState(() => { const d = new Date(); return d.getHours()*60 + d.getMinutes(); });

  // localStorage persistence
  const loaded = React.useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("kviff_state");
      if (raw) {
        const d = JSON.parse(raw);
        if (d.picked)   setPicked(new Set(d.picked));
        if (d.tickets)  setTickets(d.tickets);
        if (d.ratings)  setRatings(d.ratings);
        if (d.favs)     setFavs(new Set(d.favs));
        if (d.blocks)   setBlocks(d.blocks);
        if (d.people)   setPeople(d.people);
        if (d.expenses) setExpenses(d.expenses);
        if (d.weather)  setWeather(d.weather);
      }
    } catch {} finally { loaded.current = true; }
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem("kviff_state", JSON.stringify({
        picked:[...picked], tickets, ratings, favs:[...favs], blocks, people, expenses, weather,
      }));
    } catch {}
  }, [picked, tickets, ratings, favs, blocks, people, expenses, weather]);

  const toggle      = (id) => setPicked(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const cycleTicket = (id) => setTickets(t => {
    const order = { undefined:"want", want:"have", have:"sold", sold:undefined };
    const nv = order[t[id]]; const n = {...t}; if (nv) n[id] = nv; else delete n[id]; return n;
  });
  const rate        = (fid, stars, note) => setRatings(r => ({...r, [fid]: { stars, note: note ?? (r[fid]?.note||"") }}));
  const toggleFav   = (name) => setFavs(f => { const n = new Set(f); n.has(name) ? n.delete(name) : n.add(name); return n; });

  const c = COLORS;

  const planConflicts = useMemo(() => {
    let n = 0;
    DAYS.forEach(({ d }) => {
      const its = buildDayItems(d, picked, blocks);
      for (let i = 0; i < its.length - 1; i++) { if (segInfo(its[i], its[i+1]).gap < 0) n++; }
    });
    return n;
  }, [picked, blocks]);

  return (
    <div style={{...S.app, background:c.bg, color:c.ink}}>
      <style>{CSS}</style>

      <header style={{...S.header, background:c.bg, borderBottom:`1px solid ${c.line}`}}>
        <div style={S.brandRow}>
          <span style={S.brandMark}>KVIFF<span style={{color:c.accent}}>60</span></span>
          <span style={S.brandSub}>festivalový parťák · 8.–11. 7.</span>
        </div>
        {tab !== "vice" && (
          <div style={{display:"flex"}}>
            {DAYS.map(D => (
              <button key={D.d} onClick={() => setDay(D.d)}
                style={{...S.dayBtn, color: day === D.d ? c.accent : c.muted,
                        borderBottom: day === D.d ? `2px solid ${c.accent}` : "2px solid transparent"}}>{D.label}</button>
            ))}
          </div>
        )}
      </header>

      <main style={{...S.main, paddingBottom:80}}>
        {tab === "program" && <ProgramView day={day} q={q} setQ={setQ} secFilter={secFilter} setSecFilter={setSecFilter}
          picked={picked} toggle={toggle} setDetail={setDetail} tickets={tickets} cycleTicket={cycleTicket} nowMin={nowMin} setNowMin={setNowMin} />}
        {tab === "plan"    && <PlanView day={day} picked={picked} toggle={toggle} setDetail={setDetail}
          tickets={tickets} cycleTicket={cycleTicket} blocks={blocks} setBlocks={setBlocks} weather={weather} setWeather={setWeather} setTab={setTab} ratings={ratings} rate={rate} />}
        {tab === "mapa"    && <MapView day={day} picked={picked} blocks={blocks} setDetail={setDetail} setTab={setTab} />}
        {tab === "okoli"   && <OkoliView day={day} picked={picked} blocks={blocks} favs={favs} toggleFav={toggleFav}
          weather={weather} setWeather={setWeather} nowMin={nowMin} setNowMin={setNowMin} />}
        {tab === "vice"    && <ViceView ratings={ratings} rate={rate} setDetail={setDetail}
          people={people} setPeople={setPeople} expenses={expenses} setExpenses={setExpenses} />}
      </main>

      <nav style={{...S.bottomNav, background:c.bg, borderTop:`1px solid ${c.line}`, paddingBottom:"env(safe-area-inset-bottom, 0px)"}}>
        {TABS.map(([k, l, icon]) => {
          const isPlan = k === "plan";
          const showConflict = isPlan && planConflicts > 0;
          const showCount    = isPlan && !showConflict && picked.size > 0;
          return (
            <button key={k} onClick={() => setTab(k)} style={{...S.bottomTab, color: tab === k ? c.accent : c.muted}}>
              <span style={{position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center"}}>
                <span style={{fontSize:20, lineHeight:1}}>{icon}</span>
                {showConflict && <span style={{...S.navBadge, background:c.bad, color:"#fff"}}>!</span>}
                {showCount    && <span style={{...S.navBadge, background:c.accent, color:c.bg}}>{picked.size}</span>}
              </span>
              <span style={{fontSize:10, fontWeight:600, marginTop:2}}>{l}</span>
            </button>
          );
        })}
      </nav>

      {detail && <Detail key={detail} filmId={detail} onClose={() => setDetail(null)} picked={picked} toggle={toggle}
        setDay={setDay} setTab={setTab} tickets={tickets} cycleTicket={cycleTicket} ratings={ratings} rate={rate} />}
    </div>
  );
}
