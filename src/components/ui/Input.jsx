export default function Input({ label, type='text', value, onChange, placeholder, error, required, multiline=false, rows=4, style={} }) {
  const base = { width:'100%', padding:'12px 16px', border:`1px solid ${error?'var(--rose)':'var(--border)'}`, borderRadius:8, fontSize:'var(--text-base)', fontFamily:'var(--body)', color:'var(--ink)', background:'var(--white)', outline:'none', transition:'var(--transition)', lineHeight:'var(--leading-relaxed)' };
  return (
    <div style={{ marginBottom:20, ...style }}>
      {label && <label style={{ display:'block', fontSize:'var(--text-sm)', fontFamily:'var(--ui)', fontWeight:600, color:'var(--ink)', marginBottom:6 }}>{label}{required&&<span style={{color:'var(--rose)',marginLeft:4}}>*</span>}</label>}
      {multiline
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{ ...base, resize:'vertical', minHeight:rows*28 }} />
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={base} />}
      {error && <p style={{ color:'var(--rose)', fontSize:'var(--text-sm)', marginTop:6 }}>{error}</p>}
    </div>
  );
}
