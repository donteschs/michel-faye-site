const presets = {
  gold:    { background: 'var(--gold-light)',  color: 'var(--ink)',       border: '1px solid var(--gold)' },
  blue:    { background: 'var(--blue-light)',  color: 'var(--blue-deep)', border: '1px solid var(--blue)' },
  rose:    { background: '#FDECEA',            color: '#7A2020',          border: '1px solid var(--rose)' },
  neutral: { background: 'var(--cream-dark)',  color: 'var(--ink)',       border: '1px solid var(--border)' },
};
export default function Badge({ children, preset='gold', style={} }) {
  return (
    <span style={{ ...presets[preset], display:'inline-block', padding:'3px 10px', borderRadius:100, fontSize:'var(--text-sm)', fontFamily:'var(--ui)', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', ...style }}>
      {children}
    </span>
  );
}
