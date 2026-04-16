export default function Loader({ size = 20, color = 'var(--ink-faint)' }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:3, height:size }} aria-label="Chargement">
      {[0, 0.2, 0.4].map((delay, i) => (
        <span key={i} style={{ width:size/4, height:size/4, borderRadius:'50%', background:color, display:'inline-block', animation:`pulse 1.4s ${delay}s infinite ease-in-out` }} />
      ))}
      <style>{`@keyframes pulse{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
    </span>
  );
}
