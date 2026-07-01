export const COLORS = {
  bg:      "#14110F",
  surface: "#1F1B18",
  ink:     "#F4EFE7",
  muted:   "#A89D8E",
  line:    "#332D27",
  accent:  "#E02D3C",
  ok:      "#6FB36F",
  warn:    "#E8A33D",
  bad:     "#E06A4E",
};

export const S = {
  app:       { minHeight:"100vh", maxWidth:540, margin:"0 auto", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", paddingLeft:"env(safe-area-inset-left, 0px)", paddingRight:"env(safe-area-inset-right, 0px)" },
  header:    { position:"sticky", top:0, zIndex:20, padding:"10px 16px 6px", paddingTop:"calc(env(safe-area-inset-top, 0px) + 10px)" },
  brandRow:  { display:"flex", alignItems:"baseline", gap:10, marginBottom:6 },
  brandMark: { fontSize:22, fontWeight:800, letterSpacing:"-0.5px" },
  brandSub:  { fontSize:12, color:"#A89D8E", letterSpacing:"0.04em", textTransform:"uppercase" },
  dayBtn:    { flex:1, padding:"10px 4px", background:"transparent", border:"none", fontSize:14, fontWeight:600, cursor:"pointer" },
  main:      { },
  // bottom nav
  bottomNav:  { position:"fixed", bottom:0, left:0, right:0, maxWidth:540, margin:"0 auto", display:"flex", height:56, zIndex:20 },
  bottomTab:  { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"transparent", border:"none", cursor:"pointer", padding:"6px 0" },
  navBadge:   { position:"absolute", top:-4, right:-8, minWidth:16, height:16, borderRadius:8, fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 3px" },
  // program
  timeGroupHeader: { fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", padding:"14px 16px 2px" },
  filters:   { padding:"12px 16px 6px" },
  search:    { width:"100%", boxSizing:"border-box", padding:"10px 12px", borderRadius:10, border:"1px solid", fontSize:14, outline:"none", marginBottom:10 },
  chipRow:   { display:"flex", gap:6, overflowX:"auto", paddingBottom:4 },
  chip:      { whiteSpace:"nowrap", padding:"6px 11px", borderRadius:999, border:"1px solid", fontSize:12, fontWeight:600, cursor:"pointer" },
  list:      { listStyle:"none", margin:0, padding:"6px 12px 24px", display:"flex", flexDirection:"column", gap:8 },
  card:      { display:"flex", alignItems:"stretch", borderRadius:12, border:"1px solid", overflow:"hidden" },
  cardMain:  { flex:1, display:"flex", gap:12, padding:"12px", background:"transparent", border:"none", textAlign:"left", cursor:"pointer", color:"inherit" },
  cardTime:  { display:"flex", flexDirection:"column", alignItems:"center", minWidth:46 },
  timeBig:   { fontSize:16, fontWeight:700 },
  runtime:   { fontSize:11, marginTop:2 },
  cardBody:  { flex:1, minWidth:0 },
  titleRow:  { display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" },
  title:     { fontSize:15, fontWeight:700, lineHeight:1.25 },
  badge:     { fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:999, textTransform:"uppercase", letterSpacing:"0.03em" },
  meta:      { fontSize:12.5, marginTop:3 },
  tagRow:    { display:"flex", gap:8, flexWrap:"wrap", marginTop:7, alignItems:"center" },
  sec:       { fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:6, border:"1px solid" },
  ven:       { fontSize:12 },
  disc:      { fontSize:11 },
  addBtn:    { width:46, flexShrink:0, border:"none", borderLeft:"1px solid", fontSize:20, fontWeight:700, cursor:"pointer" },
  // plan
  planSummary: { padding:"10px 18px 4px", fontSize:13 },
  timeline:  { listStyle:"none", margin:0, padding:"4px 12px" },
  tlCard:    { display:"flex", alignItems:"stretch", borderRadius:12, border:"1px solid", overflow:"hidden" },
  tlTime:    { minWidth:52, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:700 },
  tlBody:    { flex:1, padding:"12px 10px", background:"transparent", border:"none", borderLeft:"1px solid #332D27", textAlign:"left", cursor:"pointer", color:"inherit", minWidth:0 },
  transfer:  { display:"flex", alignItems:"center", gap:8, padding:"8px 14px 8px 18px", fontSize:12.5 },
  transferDot: { width:8, height:8, borderRadius:4, flexShrink:0 },
  statusPill:  { fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:999, textTransform:"uppercase" },
  planTop:   { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 16px 6px" },
  wxBtn:     { padding:"6px 12px", borderRadius:999, border:"1px solid", background:"transparent", fontSize:13, fontWeight:600, cursor:"pointer" },
  warnCard:  { margin:"4px 12px 8px", padding:"10px 14px", borderRadius:12, border:"1px solid", fontSize:13.5, lineHeight:1.5, display:"flex", flexDirection:"column", gap:4 },
  gap:       { margin:"8px 12px 8px 18px", padding:"11px 14px", borderRadius:12, border:"1px dashed" },
  gapTip:    { display:"flex", justifyContent:"space-between", gap:10, fontSize:13, padding:"3px 0" },
  gapMore:   { background:"none", border:"none", padding:"6px 0 0", fontSize:13, fontWeight:600, cursor:"pointer" },
  addBlockBtn: { display:"block", width:"calc(100% - 24px)", margin:"4px 12px", padding:"12px", borderRadius:12, border:"1px dashed", background:"transparent", fontSize:13.5, fontWeight:600, cursor:"pointer" },
  blockForm: { margin:"4px 12px", padding:"14px", borderRadius:12, border:"1px solid" },
  primaryBtn:  { padding:"10px 16px", borderRadius:10, border:"none", fontSize:14, fontWeight:700, cursor:"pointer" },
  ghostBtn:    { marginTop:14, padding:"9px 16px", borderRadius:10, border:"1px solid", background:"transparent", fontSize:14, fontWeight:600, cursor:"pointer" },
  ghostBtnSm:  { padding:"10px 16px", borderRadius:10, border:"1px solid", background:"transparent", fontSize:14, fontWeight:600, cursor:"pointer" },
  // sheet (detail)
  sheetWrap:   { position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50 },
  sheet:       { width:"100%", maxWidth:540, maxHeight:"88vh", overflowY:"auto", borderRadius:"18px 18px 0 0", border:"1px solid", borderBottom:"none", padding:"10px 18px 30px", display:"flex", flexDirection:"column", position:"relative" },
  sheetGrip:   { width:40, height:4, borderRadius:2, background:"#4A423B", margin:"4px auto 14px" },
  close:       { position:"absolute", top:14, right:16, background:"none", border:"none", fontSize:18, cursor:"pointer" },
  detailTitle: { fontSize:22, fontWeight:800, margin:"10px 0 6px", lineHeight:1.15 },
  synopsis:    { fontSize:14.5, lineHeight:1.55, margin:"6px 0 10px" },
  link:        { fontSize:13.5, fontWeight:600, textDecoration:"none", marginBottom:18, display:"inline-block" },
  showsHead:   { fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 },
  showsList:   { listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:8 },
  showRow:     { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", borderRadius:10, border:"1px solid" },
  showBtn:     { padding:"7px 12px", borderRadius:8, border:"1px solid", fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" },
  rateBox:     { borderRadius:12, border:"1px solid", padding:"12px 14px", margin:"4px 0 18px" },
  star:        { background:"none", border:"none", fontSize:28, lineHeight:1, cursor:"pointer", padding:0 },
  tkTag:       { fontSize:11, fontWeight:700, padding:"2px 7px", borderRadius:6, border:"1px solid" },
  tkBtn:       { width:46, border:"none", borderLeft:"1px solid", borderTop:"1px solid", background:"transparent", fontSize:15, cursor:"pointer" },
  tkBtnSm:     { width:40, height:40, borderRadius:10, border:"1px solid", background:"transparent", fontSize:16, cursor:"pointer" },
  // map
  mapSel:      { margin:"12px 12px 0", padding:"12px 14px", borderRadius:12, border:"1px solid" },
  mapSelRow:   { display:"block", width:"100%", textAlign:"left", background:"transparent", border:"none", padding:"6px 0 0", fontSize:13.5, cursor:"pointer" },
  routeList:   { listStyle:"none", margin:0, padding:"14px 12px 0" },
  routeStop:   { display:"flex", alignItems:"center", gap:10, width:"100%", textAlign:"left", padding:"11px 12px", borderRadius:12, border:"1px solid", background:"transparent", cursor:"pointer", color:"inherit" },
  routeNum:    { width:24, height:24, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, flexShrink:0 },
  routeMove:   { display:"flex", alignItems:"center", gap:8, padding:"8px 14px 8px 20px", fontSize:12.5 },
  miniChip:    { whiteSpace:"nowrap", padding:"7px 10px", borderRadius:999, border:"1px solid", fontSize:12.5, fontWeight:600, cursor:"pointer" },
  // okolí
  placeCard:   { display:"flex", alignItems:"center", gap:10, padding:"11px 12px", borderRadius:12, border:"1px solid" },
  favStar:     { background:"none", border:"none", fontSize:24, cursor:"pointer", padding:"0 4px" },
  nowToggle:   { padding:"0 16px", borderRadius:10, border:"1px solid", fontSize:14, fontWeight:700, cursor:"pointer" },
  nowPanel:    { borderRadius:12, border:"1px solid", padding:"12px 14px", marginBottom:10 },
  soonRow:     { display:"block", width:"100%", textAlign:"left", background:"transparent", border:"none", padding:"5px 0", fontSize:13.5, cursor:"pointer", color:"inherit" },
  // více
  h3:          { fontSize:15, fontWeight:700, margin:"22px 0 6px" },
  bestCard:    { padding:"11px 14px", borderRadius:12, border:"1px solid", marginBottom:12, fontSize:14 },
  denikRow:    { display:"flex", alignItems:"center", gap:10, width:"100%", textAlign:"left", padding:"11px 12px", borderRadius:12, border:"1px solid", background:"transparent", cursor:"pointer" },
  reminderCard:{ padding:"12px 14px", borderRadius:12, border:"1px solid", marginBottom:10 },
  personPill:  { padding:"5px 11px", borderRadius:999, border:"1px solid", fontSize:13 },
  settle:      { padding:"12px 14px", borderRadius:12, border:"1px solid", marginTop:6 },
};

export const CSS = `
  *{ -webkit-tap-highlight-color: transparent; }
  ::-webkit-scrollbar{ height:0; width:0; }
  button:focus-visible{ outline:2px solid #E8A33D; outline-offset:2px; }
  a:focus-visible{ outline:2px solid #E8A33D; }
  .leaflet-container{ background:#14110F; font-family:inherit; }
  .leaflet-control-attribution{ background:rgba(20,17,15,.7)!important; color:#A89D8E!important; font-size:9px; }
  .leaflet-control-attribution a{ color:#A89D8E!important; }
  .leaflet-bar a{ background:#1F1B18; color:#F4EFE7; border-color:#332D27; }
  .leaflet-bar a:hover{ background:#2A2420; }
  .vwrap{ position:relative; width:90px; display:flex; flex-direction:column; align-items:center; }
  .vpin{ width:16px; height:16px; border-radius:50%; background:#1F1B18; border:2px solid #A89D8E;
    display:flex; align-items:center; justify-content:center; color:#14110F; font-weight:800; font-size:11px; box-shadow:0 1px 4px rgba(0,0,0,.5); }
  .vpin.on{ width:24px; height:24px; background:#E8A33D; border-color:#E8A33D; }
  .vpin.faded{ opacity:.45; }
  .vlbl{ margin-top:3px; font-size:10px; font-weight:700; color:#F4EFE7; white-space:nowrap;
    text-shadow:0 1px 3px #000, 0 0 2px #000; }
  .vlbl.faded{ opacity:.5; font-weight:400; }
  .mlbl{ background:#14110F; border:1px solid; border-radius:9px; font-size:10px; font-weight:800;
    padding:1px 6px; text-align:center; white-space:nowrap; }
  .pmk{ width:30px; height:30px; border-radius:50%; background:#1F1B18; border:1px solid #332D27;
    display:flex; align-items:center; justify-content:center; font-size:16px; box-shadow:0 1px 4px rgba(0,0,0,.5); }
  .leaflet-popup-content-wrapper{ background:#1F1B18; color:#F4EFE7; border-radius:10px; }
  .leaflet-popup-tip{ background:#1F1B18; }
`;
