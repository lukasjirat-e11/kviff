import { useState } from "react";
import { VENUES, TICKET, FILMS } from "../data.js";
import { COLORS, S } from "../styles.js";

export default function ViceView({ ratings, rate, setDetail, people, setPeople, expenses, setExpenses }) {
  const c = COLORS;
  const [sub, setSub] = useState("utraty");

  return (
    <div style={{padding:"12px 14px 36px"}}>
      <div style={{display:"flex", gap:6, marginBottom:14}}>
        {[["utraty","Útraty"],["listky","Vstupenky"],["prakt","Praktické"],["denik","Deník"]].map(([k, l]) => (
          <button key={k} onClick={() => setSub(k)} style={{...S.miniChip, flex:1, background:sub === k ? c.accent : "transparent", color:sub === k ? c.bg : c.muted, borderColor:sub === k ? c.accent : c.line}}>{l}</button>
        ))}
      </div>

      {sub === "utraty" && <Expenses c={c} people={people} setPeople={setPeople} expenses={expenses} setExpenses={setExpenses} />}

      {sub === "listky" && (
        <div>
          <h3 style={{...S.h3, marginTop:0}}>Hlídání vstupenek</h3>
          <div style={{...S.reminderCard, background:c.surface, borderColor:c.accent}}>
            <div style={{fontWeight:700, marginBottom:4}}>⏰ Prodej na další den</div>
            <div style={{color:c.muted, fontSize:13.5}}>Vstupenky se obvykle uvolňují <b style={{color:c.ink}}>v 7:00 ráno</b> na následující festivalový den. Měj přihlášený účet a vybrané filmy připravené.</div>
          </div>
          <div style={{...S.reminderCard, background:c.surface, borderColor:c.line}}>
            <div style={{fontWeight:700, marginBottom:4}}>🎟️ Vyzvednutí rezervace</div>
            <div style={{color:c.muted, fontSize:13.5}}>Rezervované lístky je nutné vyzvednout <b style={{color:c.ink}}>nejpozději 60 minut před</b> začátkem projekce, jinak propadnou.</div>
          </div>
          <div style={{...S.showsHead, color:c.muted, marginTop:18}}>Co znamenají stavy</div>
          {Object.entries(TICKET).map(([k, v]) => (
            <div key={k} style={{display:"flex", gap:10, alignItems:"center", padding:"6px 0", color:c.ink}}>
              <span style={{color:v.c, fontSize:18, width:24, textAlign:"center"}}>{v.i}</span> {v.l}
            </div>
          ))}
          <p style={{fontSize:12, color:c.muted, marginTop:10}}>Stav vstupenky si přepínáš ťuknutím na ikonu 🎟 u filmu nebo v jeho detailu.</p>
        </div>
      )}

      {sub === "prakt" && <InfoView c={c} />}
      {sub === "denik" && <Denik c={c} ratings={ratings} setDetail={setDetail} />}
    </div>
  );
}

function Denik({ c, ratings, setDetail }) {
  const entries = Object.entries(ratings || {})
    .filter(([, r]) => r.stars > 0 || (r.note && r.note.trim()))
    .map(([fid, r]) => ({ fid, film: FILMS[fid], stars: r.stars || 0, note: r.note || "" }))
    .filter(e => e.film)
    .sort((a, b) => b.stars - a.stars || a.film.t.localeCompare(b.film.t, "cs"));
  const best = entries.filter(e => e.stars === 5);

  if (entries.length === 0) {
    return (
      <div style={{padding:"8px 2px 24px", textAlign:"center", color:c.muted}}>
        <div style={{fontSize:38, marginBottom:8}}>📔</div>
        <p style={{margin:0, color:c.ink, fontWeight:600}}>Zatím žádná hodnocení</p>
        <p style={{marginTop:6}}>Hvězdičky přidáš v detailu filmu nebo v Plánu po projekci — objeví se tu.</p>
      </div>
    );
  }

  return (
    <div>
      {best.length > 0 && <>
        <h3 style={{...S.h3, marginTop:0}}>🏆 Nejlepší</h3>
        {best.map(e => (
          <div key={e.fid} style={{...S.bestCard, background:c.surface, borderColor:c.accent}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:8}}>
              <b style={{color:c.ink}}>{e.film.t}</b>
              <span style={{color:c.accent, flexShrink:0}}>{"★".repeat(e.stars)}</span>
            </div>
            {e.note && <div style={{color:c.muted, marginTop:4}}>{e.note}</div>}
          </div>
        ))}
      </>}

      <h3 style={S.h3}>📔 Deník</h3>
      {entries.map(e => (
        <button key={e.fid} onClick={() => setDetail(e.fid)} style={{...S.denikRow, borderColor:c.line, color:c.ink, marginBottom:8}}>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{e.film.t}</div>
            {e.note && <div style={{fontSize:12.5, color:c.muted, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{e.note}</div>}
          </div>
          <span style={{color: e.stars > 0 ? c.accent : c.line, flexShrink:0, fontSize:15}}>{e.stars > 0 ? "★".repeat(e.stars) : "—"}</span>
        </button>
      ))}
    </div>
  );
}

function Expenses({ c, people, setPeople, expenses, setExpenses }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState(""); const [amt, setAmt] = useState(""); const [payer, setPayer] = useState(0);
  const total = expenses.reduce((n, e) => n + e.amt, 0);
  const share = people.length ? total / people.length : 0;
  const paid = people.map((_, i) => expenses.filter(e => e.payer === i).reduce((n, e) => n + e.amt, 0));
  return (
    <div>
      <h3 style={{...S.h3, marginTop:0}}>Rozúčtování útrat v partě</h3>
      <div style={{display:"flex", gap:8, marginBottom:10}}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Přidat jméno"
          style={{...S.search, marginBottom:0, background:c.surface, color:c.ink, borderColor:c.line}} />
        <button onClick={() => { if (name.trim()) { setPeople(p => [...p, name.trim()]); setName(""); } }} style={{...S.primaryBtn, background:c.accent, color:c.bg}}>+</button>
      </div>
      <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:14}}>
        {people.map((p, i) => (<span key={i} style={{...S.personPill, background:c.surface, borderColor:c.line, color:c.ink}}>{p}</span>))}
        {people.length === 0 && <span style={{color:c.muted, fontSize:13}}>Přidej členy party…</span>}
      </div>

      {people.length > 0 && <>
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Co (pivo, večeře…)"
          style={{...S.search, marginBottom:8, background:c.surface, color:c.ink, borderColor:c.line}} />
        <div style={{display:"flex", gap:8, marginBottom:10}}>
          <input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="Kč"
            style={{...S.search, marginBottom:0, width:90, background:c.surface, color:c.ink, borderColor:c.line}} />
          <select value={payer} onChange={e => setPayer(+e.target.value)} style={{...S.search, marginBottom:0, flex:1, background:c.surface, color:c.ink, borderColor:c.line}}>
            {people.map((p, i) => (<option key={i} value={i}>platil: {p}</option>))}
          </select>
          <button onClick={() => { const a = parseFloat(amt); if (a > 0) { setExpenses(x => [...x, {desc:desc||"útrata", amt:a, payer}]); setDesc(""); setAmt(""); } }} style={{...S.primaryBtn, background:c.accent, color:c.bg}}>+</button>
        </div>

        {expenses.length > 0 && <ul style={{listStyle:"none", margin:"6px 0 14px", padding:0}}>
          {expenses.map((e, i) => (
            <li key={i} style={{display:"flex", justifyContent:"space-between", padding:"7px 10px", borderBottom:`1px solid ${c.line}`, color:c.ink, fontSize:14}}>
              <span>{e.desc} <span style={{color:c.muted}}>· {people[e.payer]}</span></span>
              <span style={{display:"flex", gap:10}}>{Math.round(e.amt)} Kč
                <button onClick={() => setExpenses(x => x.filter((_, j) => j !== i))} style={{background:"none", border:"none", color:c.muted, cursor:"pointer"}}>✕</button></span>
            </li>
          ))}
        </ul>}

        <div style={{...S.settle, background:c.surface, borderColor:c.line}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:6}}><b>Celkem</b><b>{Math.round(total)} Kč</b></div>
          <div style={{color:c.muted, fontSize:13, marginBottom:8}}>Na osobu: {Math.round(share)} Kč</div>
          {people.map((p, i) => { const bal = paid[i] - share; return (
            <div key={i} style={{display:"flex", justifyContent:"space-between", fontSize:14, padding:"3px 0", color:c.ink}}>
              <span>{p}</span>
              <span style={{color: bal >= 0 ? c.ok : c.bad}}>{bal >= 0 ? `dostane ${Math.round(bal)}` : `dluží ${Math.round(-bal)}`} Kč</span>
            </div>
          );})}
        </div>
      </>}
    </div>
  );
}

function InfoView({ c }) {
  return (
    <div style={{padding:"16px 18px 40px", lineHeight:1.55}}>
      <h3 style={S.h3}>Jak to funguje</h3>
      <p style={{color:c.ink}}>V <strong>Programu</strong> klepni na film pro detail, nebo na <strong style={{color:c.accent}}>+</strong> pro přidání do plánu. Filmy často hrají vícekrát — v detailu si vybereš termín, který ti sedne.</p>
      <p style={{color:c.ink}}>V <strong>Mém plánu</strong> se z vybraných projekcí sestaví časová osa daného dne a mezi filmy se spočítá přesun.</p>

      <h3 style={S.h3}>Barvy přesunů</h3>
      <ul style={{color:c.ink, paddingLeft:18}}>
        <li><b style={{color:c.ok}}>ok</b> — stihneš v klidu</li>
        <li><b style={{color:c.warn}}>těsné</b> — stihneš, ale bez rezervy</li>
        <li><b style={{color:c.bad}}>nestihneš</b> — pauza je kratší než přesun</li>
        <li><b style={{color:c.bad}}>překryv</b> — filmy se časově překrývají</li>
      </ul>

      <h3 style={S.h3}>Pár věcí na rovinu</h3>
      <p style={{color:c.muted}}>Minuty přesunu mezi kiny jsou <b>orientační odhad pěšky</b>. Čtyři sály v Thermalu (Velký, Malý, Kongresový, Kinosál B) jsou v jedné budově (~3 min). Pupp a Císařské lázně jsou na opačném konci lázní (~20 min od Thermalu).</p>
      <p style={{color:c.muted}}>Časy, sály, délky a sekce jsou z oficiálního programu kviff.com. Anotace u premiér 2026 nemusí být úplné — plný popis je vždy přes odkaz v detailu.</p>

      <h3 style={S.h3}>Festivalová kina</h3>
      <ul style={{color:c.ink, paddingLeft:18}}>
        {Object.values(VENUES).map(v => (
          <li key={v.name}>{v.name}{v.sub ? ` (${v.sub})` : ""} — ~{v.pos} min od Thermalu pěšky</li>
        ))}
      </ul>
    </div>
  );
}
