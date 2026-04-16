import Loader from './Loader';
const variants = {
  primary:   { background:'var(--blue)', color:'#fff', border:'none' },
  secondary: { background:'transparent', color:'var(--blue)', border:'1px solid var(--blue)' },
  ghost:     { background:'transparent', color:'var(--ink-light)', border:'1px solid var(--border)' },
  danger:    { background:'transparent', color:'var(--rose)', border:'1px solid var(--rose)' },
};
const sizes = {
  sm: { padding:'6px 14px', fontSize:'var(--text-sm)' },
  md: { padding:'10px 24px', fontSize:'var(--text-base)' },
  lg: { padding:'14px 36px', fontSize:'var(--text-lg)' },
};
export default function Button({ children, variant='primary', size='md', disabled=false, loading=false, onClick, type='button', style={} }) {
  return (
    <button type={type} disabled={disabled||loading} onClick={onClick}
      style={{ ...variants[variant], ...sizes[size], borderRadius:6, fontFamily:'var(--ui)', fontWeight:600, letterSpacing:'0.02em', cursor:disabled||loading?'not-allowed':'pointer', opacity:disabled?.5:1, transition:'var(--transition)', display:'inline-flex', alignItems:'center', gap:8, ...style }}>
      {loading ? <Loader size={16} color={variant==='primary'?'#fff':'var(--ink-faint)'} /> : children}
    </button>
  );
}
