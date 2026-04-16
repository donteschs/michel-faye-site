import { useState } from 'react';
import { useApp } from '../../App';
import { Badge } from '../ui';

const CATEGORY_PRESET = { Journal: 'gold', Histoire: 'blue', Livre: 'neutral' };

export default function ArticleCard({ article }) {
  const { navigate } = useApp();
  const [hovered, setHovered] = useState(false);
  const preset = CATEGORY_PRESET[article.category] || 'rose';
  const dateStr = article.date
    ? new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(article.date))
    : '';

  return (
    <article
      onClick={() => navigate('article', article)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate('article', article)}
      tabIndex={0}
      role="button"
      aria-label={`Lire l'article : ${article.title}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--white)',
        border: `1px solid ${hovered ? 'var(--gold)' : 'var(--border)'}`,
        borderRadius: 8,
        padding: 20,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Badge preset={preset}>{article.category}</Badge>
        {article.important && (
          <span style={{ color: 'var(--gold)', fontSize: 18, lineHeight: 1 }} aria-label="Article important">●</span>
        )}
      </div>
      <h3 style={{ fontFamily: 'var(--serif)', fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: 8, lineHeight: 1.3 }}>
        {article.title}
      </h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-faint)', marginBottom: 8 }}>{dateStr}</p>
      <p style={{
        fontSize: 'var(--text-base)',
        color: 'var(--ink-light)',
        lineHeight: 1.7,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
      }}>
        {article.excerpt || article.content?.replace(/<[^>]*>/g, '').slice(0, 200)}
      </p>
    </article>
  );
}
