import { useState } from 'react';
import { useApp } from '../../App';

const CATEGORY_COLORS = {
  Journal: { top: 'var(--gold)', bg: 'rgba(196,149,90,0.10)', text: '#a07830' },
  Histoire: { top: 'var(--blue)', bg: 'rgba(74,111,165,0.10)', text: '#3a5a9a' },
  Livre: { top: '#888', bg: 'rgba(90,90,90,0.07)', text: '#666' },
  'Réflexion politique': { top: 'var(--rose)', bg: 'rgba(185,100,100,0.10)', text: '#b05050' },
};

function readingTime(content) {
  const words = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

export default function ArticleCard({ article }) {
  const { navigate } = useApp();
  const [hovered, setHovered] = useState(false);
  const colors = CATEGORY_COLORS[article.category] || CATEGORY_COLORS['Journal'];
  const dateStr = article.date
    ? new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(article.date))
    : '';
  const excerpt = article.excerpt || article.content?.replace(/<[^>]*>/g, '').slice(0, 160) || '';

  return (
    <article
      onClick={() => navigate('article', article)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate('article', article)}
      tabIndex={0}
      role="button"
      aria-label={`Lire : ${article.title}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--white)',
        borderRadius: 10,
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--border)',
        borderTop: `3px solid ${hovered ? colors.top : 'transparent'}`,
        boxShadow: hovered ? '0 6px 24px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.05)',
        transition: 'all 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Image fixe 140px */}
      <div style={{ height: 140, flexShrink: 0, background: 'var(--cream-dark)', overflow: 'hidden' }}>
        {article.image_url ? (
          <img
            src={article.image_url} alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 32, opacity: 0.3 }}>
              {article.category === 'Journal' ? '📔' : article.category === 'Histoire' ? '📖' : article.category === 'Livre' ? '📚' : '✍️'}
            </span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Badge catégorie */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{
            fontFamily: 'var(--ui)', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.07em', textTransform: 'uppercase',
            color: colors.text, background: colors.bg,
            padding: '2px 8px', borderRadius: 20,
          }}>
            {article.category}
          </span>
          {article.important && <span style={{ color: 'var(--gold)', fontSize: 12 }}>★</span>}
        </div>

        {/* Titre — 2 lignes max */}
        <h3 style={{
          fontFamily: 'var(--serif)', fontSize: 15,
          color: 'var(--ink)', lineHeight: 1.35,
          fontWeight: 700, marginBottom: 8,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          minHeight: '2.7em',
        }}>
          {article.title}
        </h3>

        {/* Extrait — 3 lignes max */}
        <p style={{
          fontFamily: 'var(--body)', fontSize: 13,
          color: 'var(--ink-light)', lineHeight: 1.65,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
          flex: 1, marginBottom: 12,
        }}>
          {excerpt}
        </p>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 'auto',
        }}>
          <span style={{ fontFamily: 'var(--ui)', fontSize: 11, color: 'var(--ink-faint)' }}>{dateStr}</span>
          <span style={{
            fontFamily: 'var(--ui)', fontSize: 11,
            color: hovered ? colors.text : 'var(--ink-faint)',
            transition: 'color 0.2s', fontWeight: hovered ? 600 : 400,
          }}>
            {readingTime(article.content)} min →
          </span>
        </div>
      </div>
    </article>
  );
}
