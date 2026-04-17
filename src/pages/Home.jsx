import { useState, useEffect } from 'react';
import { useApp } from '../App';
import { supabase } from '../lib/supabase';
import ArticleCard from '../components/public/ArticleCard';

const CATEGORY_COLORS = {
  Journal: { bg: 'rgba(196,149,90,0.10)', border: 'var(--gold)', text: 'var(--gold)' },
  Histoire: { bg: 'rgba(74,111,165,0.10)', border: 'var(--blue)', text: 'var(--blue)' },
  Livre: { bg: 'rgba(90,90,90,0.08)', border: 'var(--ink-faint)', text: 'var(--ink-light)' },
  'Réflexion politique': { bg: 'rgba(185,100,100,0.10)', border: 'var(--rose)', text: 'var(--rose)' },
};

function PinnedCard({ article, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      onClick={onClick}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}
      tabIndex={0}
      role="button"
      aria-label={`Lire : ${article.title}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        background: hovered ? 'var(--white)' : 'transparent',
        borderRadius: 8, padding: '14px 16px',
        cursor: 'pointer', transition: 'background 0.15s',
        borderLeft: '3px solid var(--gold)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--ui)', fontSize: 11, color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
          {article.category}
        </div>
        <h3 style={{
          fontFamily: 'var(--serif)', fontSize: 'var(--text-base)',
          color: 'var(--ink)', fontWeight: 600, lineHeight: 1.4,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {article.title}
        </h3>
      </div>
      <span style={{ color: hovered ? 'var(--gold)' : 'var(--ink-faint)', fontSize: 18, flexShrink: 0, transition: 'color 0.15s' }}>→</span>
    </article>
  );
}

export default function Home() {
  const { navigate } = useApp();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase.from('articles').select('*').eq('status', 'published').order('date', { ascending: false })
      .then(({ data }) => {
        if (!cancelled) { setArticles(data || []); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, []);

  const pinned = articles.filter(a => a.important);
  const latest = articles.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, var(--cream-dark) 0%, var(--cream) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '72px 64px 64px',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(196,149,90,0.12)', borderRadius: 20,
            padding: '5px 14px', marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)' }} />
            <span style={{ fontFamily: 'var(--ui)', fontSize: 12, color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Écrits & Mémoires
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            color: 'var(--ink)', lineHeight: 1.15,
            marginBottom: 24, fontWeight: 700,
          }}>
            La mémoire est une{' '}
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>lumière</em>
            <br />qui refuse de s'éteindre.
          </h1>

          <p style={{
            fontFamily: 'var(--body)', fontSize: 'var(--text-lg)',
            color: 'var(--ink-light)', lineHeight: 1.8,
            maxWidth: 520, marginBottom: 36,
          }}>
            Carnets de vie, récits d'histoire et réflexions sur le temps qui passe — par Michel Faye.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('articles')}
              style={{
                background: 'var(--ink)', color: 'var(--cream)',
                border: 'none', borderRadius: 8, padding: '13px 28px',
                fontSize: 'var(--text-base)', fontFamily: 'var(--ui)', fontWeight: 600,
                cursor: 'pointer', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Lire les écrits
            </button>
            <button
              onClick={() => navigate('about')}
              style={{
                background: 'transparent', color: 'var(--ink-light)',
                border: '1px solid var(--border)', borderRadius: 8, padding: '13px 28px',
                fontSize: 'var(--text-base)', fontFamily: 'var(--ui)',
                cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink-light)'; e.currentTarget.style.color = 'var(--ink)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--ink-light)'; }}
            >
              À propos
            </button>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 40px 80px' }}>

        {/* Textes épinglés */}
        {!loading && pinned.length > 0 && (
          <section style={{ marginBottom: 60 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ color: 'var(--gold)', fontSize: 16 }}>★</span>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'var(--text-xl)', color: 'var(--ink)', fontWeight: 700 }}>
                À lire absolument
              </h2>
            </div>
            <div style={{ background: 'var(--cream-dark)', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
              {pinned.map((a, i) => (
                <div key={a.id} style={{ borderBottom: i < pinned.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <PinnedCard article={a} onClick={() => navigate('article', a)} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Derniers écrits */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'var(--text-xl)', color: 'var(--ink)', fontWeight: 700 }}>
              Derniers écrits
            </h2>
            {articles.length > 6 && (
              <button
                onClick={() => navigate('articles')}
                style={{ background: 'none', border: 'none', color: 'var(--blue)', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', cursor: 'pointer', fontWeight: 500 }}
              >
                Voir tout →
              </button>
            )}
          </div>

          {loading ? (
            <div className="articles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ background: 'var(--white)', borderRadius: 12, height: 260, border: '1px solid var(--border)', opacity: 0.5 }} />
              ))}
            </div>
          ) : latest.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--ink-faint)', fontFamily: 'var(--body)', fontStyle: 'italic', fontSize: 'var(--text-lg)' }}>
              Les premiers textes arrivent bientôt…
            </div>
          ) : (
            <div className="articles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {latest.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
          )}
        </section>

        {/* Catégories */}
        {!loading && articles.length > 0 && (
          <section style={{ marginTop: 64, paddingTop: 48, borderTop: '1px solid var(--border)' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'var(--text-xl)', color: 'var(--ink)', fontWeight: 700, marginBottom: 20 }}>
              Explorer par thème
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {Object.entries(CATEGORY_COLORS).map(([cat, colors]) => {
                const count = articles.filter(a => a.category === cat).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat}
                    onClick={() => navigate('articles', { category: cat })}
                    style={{
                      background: colors.bg, border: `1px solid ${colors.border}`,
                      borderRadius: 10, padding: '18px 20px', textAlign: 'left',
                      cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 'var(--text-base)', color: 'var(--ink)', fontWeight: 600, marginBottom: 4 }}>{cat}</div>
                    <div style={{ fontFamily: 'var(--ui)', fontSize: 12, color: colors.text }}>{count} écrit{count > 1 ? 's' : ''}</div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
