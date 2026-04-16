export default function Input({ id, label, type='text', value, onChange, placeholder, error, required, multiline=false, rows=4, style={} }) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const s = {
    wrap: { marginBottom:20, ...style },
    label: { display:'block', fontSize:'var(--text-sm)', fontFamily:'var(--ui)', fontWeight:600, color:'var(--ink)', marginBottom:6 },
    input: { width:'100%', padding:'12px 16px', border:`1px solid ${error?'var(--rose)':'var(--border)'}`, borderRadius:8, fontSize:'var(--text-base)', fontFamily:'var(--body)', color:'var(--ink)', background:'var(--white)', outline:'none', transition:'var(--transition)', lineHeight:'var(--leading-relaxed)' },
    textarea: { width:'100%', padding:'12px 16px', border:`1px solid ${error?'var(--rose)':'var(--border)'}`, borderRadius:8, fontSize:'var(--text-base)', fontFamily:'var(--body)', color:'var(--ink)', background:'var(--white)', outline:'none', transition:'var(--transition)', lineHeight:'var(--leading-relaxed)', resize:'vertical', minHeight:rows*28 },
    error: { color:'var(--rose)', fontSize:'var(--text-sm)', marginTop:6 },
  };
  return (
    <div style={s.wrap}>
      {label && (
        <label htmlFor={inputId} style={s.label}>
          {label}
          {required && <span style={{color:'var(--rose)',marginLeft:3}} aria-hidden="true">*</span>}
        </label>
      )}
      {multiline
        ? <textarea id={inputId} value={value} onChange={onChange} placeholder={placeholder} rows={rows} required={required} aria-required={required || undefined} aria-invalid={!!error || undefined} aria-describedby={error ? `${inputId}-error` : undefined} style={s.textarea} />
        : <input id={inputId} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} aria-required={required || undefined} aria-invalid={!!error || undefined} aria-describedby={error ? `${inputId}-error` : undefined} style={s.input} />}
      {error && <p id={`${inputId}-error`} role="alert" style={s.error}>{error}</p>}
    </div>
  );
}
