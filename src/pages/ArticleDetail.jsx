import DOMPurify from 'dompurify';
import { useApp } from '../App';
import { Badge } from '../components/ui';

const CATEGORY_PRESET = { Journal: 'gold', Histoire: 'blue', Livre: 'neutral' };

export default function ArticleDetail() {
  const { selectedArticle: article, navigate, notify } = useApp();

  if (!article) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 48px', textAlign: 'center' }}>
        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-faint)', marginBottom: 24 }}>Article introuvable.</p>
        <button
          onClick={() => navigate('articles')}
          style={{
            background: 'transparent', color: 'var(--blue)',
            border: '1px solid var(--blue)', borderRadius: 6,
            padding: '10px 24px', fontSize: 'var(--text-base)',
            fontFamily: 'var(--ui)', cursor: 'pointer',
          }}
        >
          ← Retour aux écrits
        </button>
      </div>
    );
  }

  const preset = CATEGORY_PRESET[article.category] || 'rose';
  const dateStr = article.date
    ? new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(article.date))
    : '';

  // DOMPurify sanitizes all HTML content before rendering to prevent XSS
  const safeContent = DOMPurify.sanitize(article.content || '');

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 48px' }}>
      <style>{`
        .article-body h2 { font-family: var(--serif); font-size: var(--text-xl); color: var(--ink); margin: 32px 0 16px; }
        .article-body h3 { font-family: var(--serif); font-size: var(--text-lg); color: var(--ink); margin: 24px 0 12px; }
        .article-body p { margin-bottom: 16px; }
        .article-body blockquote { border-left: 3px solid var(--gold); padding-left: 16px; color: var(--ink-light); font-style: italic; margin: 24px 0; }
        .article-body ul, .article-body ol { padding-left: 24px; margin-bottom: 16px; }
        .article-body a { color: var(--blue); }
      `}</style>

      <button
        onClick={() => navigate('articles')}
        style={{
          background: 'transparent', border: 'none', color: 'var(--ink-light)',
          fontSize: 'var(--text-base)', fontFamily: 'var(--ui)', cursor: 'pointer',
          padding: 0, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        ← Retour aux écrits
      </button>

      <header style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Badge preset={preset}>{article.category}</Badge>
          {article.important && (
            <span style={{ color: 'var(--gold)', fontSize: 18 }} aria-label="Article important">●</span>
          )}
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: 'var(--text-3xl)',
          color: 'var(--ink)', lineHeight: 1.2, marginBottom: 12,
        }}>
          {article.title}
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-faint)' }}>{dateStr}</p>
      </header>

      {article.audio_url && (
        <audio controls style={{ width: '100%', marginBottom: 24 }}>
          <source src={article.audio_url} />
          Votre navigateur ne supporte pas la lecture audio.
        </audio>
      )}

      <div
        className="article-body"
        style={{ fontSize: 'var(--text-lg)', lineHeight: 1.9, color: 'var(--ink)', maxWidth: 720, margin: '0 auto' }}
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink-faint)' }}>Partager :</span>
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href).then(() => notify('Lien copié !'))}
          style={{
            background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 6,
            padding: '8px 16px', fontSize: 'var(--text-base)', fontFamily: 'var(--ui)',
            cursor: 'pointer', color: 'var(--ink-light)', transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          Copier le lien
        </button>
      </div>

      <div style={{ marginTop: 48 }}>
        <p style={{ color: 'var(--ink-faint)', fontSize: 'var(--text-base)' }}>Commentaires — disponible bientôt</p>
      </div>
    </div>
  );
}
