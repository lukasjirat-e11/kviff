import { S } from "../styles.js";

export default function Chip({ active, label, dot, onClick, c }) {
  return (
    <button onClick={onClick}
      style={{...S.chip, background: active ? c.ink : "transparent", color: active ? c.bg : c.muted,
              borderColor: active ? c.ink : c.line}}>
      {dot && <span style={{width:8, height:8, borderRadius:4, background:dot, display:"inline-block", marginRight:6}} />}
      {label}
    </button>
  );
}
