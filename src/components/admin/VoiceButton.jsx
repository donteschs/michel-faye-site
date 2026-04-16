import { useVoiceDictation } from '../../hooks/useVoiceDictation';
import Loader from '../ui/Loader';

export default function VoiceButton({ onTranscript }) {
  const { listening, supported, toggle } = useVoiceDictation(onTranscript);

  if (!supported) {
    return (
      <div style={{ background: 'var(--cream-dark)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 16px', marginBottom: 16, fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', color: 'var(--ink-faint)' }}>
        Dictée vocale non disponible — utilisez Chrome ou Edge.
      </div>
    );
  }

  return (
    <div style={{
      background: listening ? 'var(--rose-light)' : 'var(--cream-dark)',
      border: `1px solid ${listening ? 'var(--rose)' : 'var(--border)'}`,
      borderRadius: 6,
      padding: '10px 16px',
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      transition: 'background 0.2s, border-color 0.2s',
    }}>
      <span style={{ fontSize: 20 }} aria-hidden="true">🎤</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', fontWeight: 600, color: listening ? 'var(--rose)' : 'var(--ink)', margin: 0 }}>
          Dictée vocale
        </p>
        <p style={{ fontFamily: 'var(--ui)', fontSize: 12, color: 'var(--ink-faint)', margin: 0 }}>
          {listening ? "J'écoute… parlez maintenant" : 'Parlez, le texte s\'écrit tout seul'}
        </p>
      </div>
      {listening && <Loader size={16} color="var(--rose)" />}
      <button
        onClick={toggle}
        aria-label={listening ? 'Arrêter la dictée' : 'Démarrer la dictée'}
        style={{
          background: listening ? 'var(--rose)' : 'var(--ink)',
          color: '#fff',
          border: 'none',
          borderRadius: 20,
          padding: '6px 14px',
          fontFamily: 'var(--ui)',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          cursor: 'pointer',
          minHeight: 44,
          whiteSpace: 'nowrap',
        }}
      >
        {listening ? '⏹ Arrêter' : '▶ Démarrer'}
      </button>
    </div>
  );
}
