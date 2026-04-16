import { useEffect } from 'react';
export default function Toast({ message, type='success', onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div role="status" aria-live="polite" style={{ position:'fixed', bottom:24, right:24, background:type==='error'?'var(--rose)':'var(--ink)', color:'#fff', padding:'14px 24px', borderRadius:8, fontSize:'var(--text-sm)', fontFamily:'var(--ui)', zIndex:1000, boxShadow:'var(--shadow-lg)', animation:'slideUp .3s ease', maxWidth:340 }}>
      {message}
      <style>{`@keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}
