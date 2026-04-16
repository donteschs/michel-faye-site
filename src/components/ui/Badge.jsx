const presets = {
  gold:    { background:'var(--gold-light)', color:'var(--gold)' },
  blue:    { background:'var(--blue-light)', color:'var(--blue)' },
  rose:    { background:'var(--rose-light)', color:'var(--rose)' },
  neutral: { background:'var(--cream-dark)', color:'var(--ink-faint)' },
};
export default function Badge({ children, preset='gold', style={} }) {
  return (
    <span style={{ ...presets[preset], display:'inline-block', padding:'3px 10px', borderRadius:100, fontSize:'var(--text-xs)', fontFamily:'var(--ui)', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', ...style }}>
      {children}
    </span>
  );
}
