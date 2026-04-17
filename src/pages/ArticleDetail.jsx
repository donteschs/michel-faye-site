import DOMPurify from 'dompurify';
import { useApp } from '../App';
import { Badge, Button } from '../components/ui';
import CommentSection from '../components/public/CommentSection';

const CATEGORY_PRESET = { Journal: 'gold', Histoire: 'blue', Livre: 'neutral' };

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  const days = Math.floor(diff / 86400);
  if (days === 1) return 'hier';
  if (days < 30) return `il y a ${days} jours`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `il y a ${months} mois`;
  }
  const years = Math.floor(days / 365);
  return `il y a ${years} an${years > 1 ? 's' : ''}`;
}

export default function ArticleDetail() {
  const { selectedArticle: article, navigate, notify, isAdmin } = useApp();

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
  const relative = timeAgo(article.updated_at || article.date);
  const safeContent = DOMPurify.sanitize(article.content || '');

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '32px 48px 80px' }}>
      <style>{`
        .article-body { font-family: var(--body); font-size: var(--text-lg); line-height: 1.9; color: var(--ink); }
        .article-body > * { display: block; }
        .article-body p { margin: 0 0 1.5em 0; }
        .article-body p:last-child { margin-bottom: 0; }
        .article-body h1,
        .article-body h2,
        .article-body h3,
        .article-body h4 {
          display: block;
          font-family: var(--serif);
          color: var(--ink);
          font-weight: 700;
          line-height: 1.25;
          margin: 2.2em 0 0.7em;
          clear: both;
        }
        .article-body h1 { font-size: var(--text-2xl); }
        .article-body h2 { font-size: var(--text-xl); padding-bottom: 0.3em; border-bottom: 1px solid var(--border); }
        .article-body h3 { font-size: var(--text-lg); }
        .article-body h4 { font-size: var(--text-base); text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-light); }
        .article-body blockquote {
          display: block;
          border-left: 3px solid var(--gold);
          padding: 8px 0 8px 24px;
          color: var(--ink-light);
          font-style: italic;
          font-size: 1.1em;
          margin: 2em 0;
          background: var(--cream-dark);
          border-radius: 0 6px 6px 0;
        }
        .article-body ul, .article-body ol {
          display: block;
          padding-left: 1.8em;
          margin: 0 0 1.5em 0;
        }
        .article-body li { margin-bottom: 0.4em; }
        .article-body a { color: var(--blue); text-decoration: underline; }
        .article-body strong { font-weight: 700; color: var(--ink); }
        .article-body em { font-style: italic; }
        .article-body img { display: block; max-width: 100%; border-radius: 8px; margin: 1.8em auto; }
        .article-body hr { display: block; border: none; border-top: 2px solid var(--border); margin: 2.5em 0; }
        .article-body > p:first-of-type::first-letter {
          font-family: var(--serif);
          font-size: 3.6em;
          line-height: 0.75;
          float: left;
          margin: 0.05em 0.1em 0 0;
          color: var(--gold);
          font-weight: 700;
        }
      `}</style>

      {/* Barre de navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
        <button
          type="button"
          onClick={() => navigate('articles')}
          style={{
            background: 'transparent', border: 'none', color: 'var(--ink-light)',
            fontSize: 'var(--text-base)', fontFamily: 'var(--ui)', cursor: 'pointer',
            padding: 0, display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span aria-hidden="true">←</span> Retour aux écrits
        </button>
        {isAdmin && (
          <Button variant="ghost" size="sm" onClick={() => navigate('editor', article)}>
            Modifier l'article
          </Button>
        )}
      </div>

      {/* En-tête */}
      <header style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Badge preset={preset}>{article.category}</Badge>
          {article.important && (
            <span style={{ color: 'var(--gold)', fontSize: 16 }} aria-label="Article important">●</span>
          )}
        </div>

        <h1 style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: 'var(--ink)', lineHeight: 1.15,
          marginBottom: 28, fontWeight: 700,
        }}>
          {article.title}
        </h1>

        {/* Auteur + date */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
          paddingBottom: 24, borderBottom: '2px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--gold), var(--rose))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--serif)', fontSize: 17, color: '#fff', fontWeight: 700, flexShrink: 0,
            }}>
              M
            </div>
            <div>
              <div style={{ fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)' }}>
                Michel Faye
              </div>
              <div style={{ fontFamily: 'var(--ui)', fontSize: 11, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Auteure
              </div>
            </div>
          </div>

          <div style={{ height: 24, width: 1, background: 'var(--border)' }} aria-hidden="true" />

          <div>
            <div style={{ fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', color: 'var(--ink)', fontWeight: 500 }}>
              {dateStr}
            </div>
            <div style={{ fontFamily: 'var(--ui)', fontSize: 11, color: 'var(--ink-faint)' }}>
              Mis à jour {relative}
            </div>
          </div>

          {article.tags?.length > 0 && (
            <>
              <div style={{ height: 24, width: 1, background: 'var(--border)' }} aria-hidden="true" />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {article.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: 'var(--ui)', fontSize: 11, color: 'var(--ink-faint)',
                    background: 'var(--cream-dark)', borderRadius: 20, padding: '3px 10px',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Image de couverture */}
      {article.image_url && (
        <img
          src={article.image_url}
          alt=""
          style={{ width: '100%', borderRadius: 10, marginBottom: 48, maxHeight: 460, objectFit: 'cover' }}
        />
      )}

      {/* Audio */}
      {article.audio_url && (
        <div style={{ background: 'var(--cream-dark)', borderRadius: 8, padding: '14px 18px', marginBottom: 48, border: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', color: 'var(--ink-faint)', marginBottom: 10 }}>
            Écouter cet écrit
          </p>
          <audio controls style={{ width: '100%' }}>
            <source src={article.audio_url} type="audio/mpeg" />
            Votre navigateur ne supporte pas la lecture audio.
          </audio>
        </div>
      )}

      {/* Contenu */}
      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />

      {/* Footer */}
      <div style={{
        marginTop: 64, paddingTop: 28, borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--gold), var(--rose))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--serif)', fontSize: 14, color: '#fff', fontWeight: 700,
          }}>M</div>
          <span style={{ fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', color: 'var(--ink-light)' }}>
            Écrit par <strong style={{ color: 'var(--ink)' }}>Michel Faye</strong>
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {isAdmin && (
            <Button variant="ghost" size="sm" onClick={() => navigate('editor', article)}>
              Modifier
            </Button>
          )}
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href)
                  .then(() => notify('Lien copié !'))
                  .catch(() => notify('Impossible de copier le lien.', 'error'));
              }
            }}
            style={{
              background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 6,
              padding: '8px 16px', fontSize: 'var(--text-sm)', fontFamily: 'var(--ui)',
              cursor: 'pointer', color: 'var(--ink-light)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            Copier le lien
          </button>
        </div>
      </div>

      <CommentSection articleId={article.id} />
    </div>
  );
}
