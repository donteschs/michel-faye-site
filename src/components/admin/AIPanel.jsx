import { useState } from 'react';
import { useAIAssistant } from '../../hooks/useAIAssistant';
import { AI_PROMPTS } from '../../lib/openai';
import Loader from '../ui/Loader';

export default function AIPanel({ getContent, onInsert, onReplace }) {
  const { run, loading, error } = useAIAssistant();
  const [result, setResult] = useState(null);
  const [activeKey, setActiveKey] = useState(null);

  const handleRun = async (key) => {
    const content = getContent();
    if (!content.trim()) return;
    setActiveKey(key);
    setResult(null);
    const text = await run(key, content);
    setResult(text);
    setActiveKey(null);
  };

  return (
    <div>
      <p style={{ fontFamily: 'var(--ui)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginBottom: 10 }}>
        Assistant IA
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {Object.entries(AI_PROMPTS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => handleRun(key)}
            disabled={loading}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderRadius: 4,
              padding: '8px 12px',
              fontFamily: 'var(--ui)',
              fontSize: 'var(--text-sm)',
              color: 'var(--ink)',
              cursor: loading ? 'not-allowed' : 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: loading ? 0.6 : 1,
              minHeight: 44,
            }}
          >
            {activeKey === key ? <Loader size={14} /> : null}
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p style={{ color: 'var(--rose)', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', marginBottom: 12 }}>
          {error}
        </p>
      )}

      {result && (
        <div style={{ background: 'var(--blue-light)', border: '1px solid var(--blue)', borderRadius: 6, padding: 12, marginBottom: 12 }}>
          <p style={{ fontFamily: 'var(--body)', fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.6, marginBottom: 10, maxHeight: 120, overflowY: 'auto' }}>
            {result}
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => { onInsert(result); setResult(null); }}
              style={{ flex: 1, background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 0', fontFamily: 'var(--ui)', fontSize: 12, cursor: 'pointer', minHeight: 44 }}
            >
              Insérer
            </button>
            <button
              onClick={() => { onReplace(result); setResult(null); }}
              style={{ flex: 1, background: 'var(--blue-deep)', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 0', fontFamily: 'var(--ui)', fontSize: 12, cursor: 'pointer', minHeight: 44 }}
            >
              Remplacer
            </button>
            <button
              onClick={() => setResult(null)}
              style={{ background: 'var(--cream-dark)', border: '1px solid var(--border)', borderRadius: 4, padding: '6px 10px', fontFamily: 'var(--ui)', fontSize: 12, cursor: 'pointer', color: 'var(--ink-faint)', minHeight: 44 }}
              aria-label="Ignorer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
