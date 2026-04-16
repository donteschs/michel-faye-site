import { useEffect, useRef } from 'react';
export default function Toast({ message, type='success', onClose }) {
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });
  useEffect(() => {
    const t = setTimeout(() => onCloseRef.current?.(), 5000);
    return () => clearTimeout(t);
  }, []);
  const bg = type === 'error' ? '#A85252' : 'var(--ink)';
  return (
    <div role="status" aria-live="polite" style={{ position:'fixed', bottom:24, right:24, background:bg, color:'#fff', padding:'14px 24px', borderRadius:8, fontSize:'var(--text-base)', fontFamily:'var(--ui)', zIndex:1000, boxShadow:'var(--shadow-lg)', animation:'slideUp .3s ease', maxWidth:340, display:'flex', alignItems:'center' }}>
      <span style={{flex:1}}>{message}</span>
      <button onClick={onClose} aria-label="Fermer" style={{background:'none',border:'none',color:'inherit',cursor:'pointer',fontSize:'1.2em',lineHeight:1,padding:'0 0 0 12px',opacity:0.8}}>×</button>
    </div>
  );
}
