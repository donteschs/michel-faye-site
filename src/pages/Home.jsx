import { useState, useEffect } from 'react';
import { useApp } from '../App';
import { supabase } from '../lib/supabase';
import ArticleCard from '../components/public/ArticleCard';

function SectionTitle({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'var(--text-2xl)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>{children}</h2>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
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

  const important = articles.filter(a => a.important).slice(0, 3);
  const latest = articles.slice(0, 4);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 48px' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', marginBottom: 64 }}>
        <div style={{
          width: 96, height: 96,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--cream-dark), var(--gold-light))',
          border: '2px solid var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
          fontFamily: 'var(--serif)', fontSize: 'var(--text-2xl)', color: 'var(--ink)', fontWeight: 700,
        }}>
          MF
        </div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'var(--text-3xl)', color: 'var(--ink)', lineHeight: 1.2, marginBottom: 20 }}>
          La mémoire est une{' '}
          <em style={{ color: 'var(--blue)', fontStyle: 'italic' }}>lumière</em>
        </h1>
        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-light)', lineHeight: 1.8, maxWidth: 560, margin: '0 auto 32px' }}>
          Bienvenue dans l'espace d'écriture de Michelle Faye — carnets de vie, récits d'histoire et réflexions sur le temps qui passe.
        </p>
        <button
          onClick={() => navigate('articles')}
          style={{
            background: 'var(--blue)', color: 'var(--white)',
            border: 'none', borderRadius: 6, padding: '14px 32px',
            fontSize: 'var(--text-base)', fontFamily: 'var(--ui)', fontWeight: 600,
            cursor: 'pointer', transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Lire les écrits
        </button>
      </section>

      {/* Important articles */}
      {!loading && important.length > 0 && (
        <section style={{ marginBottom: 56 }}>
          <SectionTitle>Textes importants</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {important.map(article => (
              <div
                key={article.id}
                onClick={() => navigate('article', article)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate('article', article)}
                tabIndex={0}
                role="button"
                aria-label={`Lire l'article : ${article.title}`}
                style={{
                  borderLeft: '4px solid var(--gold)',
                  background: 'var(--white)',
                  borderRadius: '0 8px 8px 0',
                  padding: '16px 20px',
                  cursor: 'pointer',
                }}
              >
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: 6 }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-light)', lineHeight: 1.6 }}>
                  {article.excerpt || article.content?.replace(/<[^>]*>/g, '').slice(0, 120)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest articles */}
      <section>
        <SectionTitle>Derniers écrits</SectionTitle>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--ink-faint)', fontSize: 'var(--text-base)' }}>Chargement…</p>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>
              {latest.map(article => <ArticleCard key={article.id} article={article} />)}
            </div>
            {articles.length > 4 && (
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => navigate('articles')}
                  style={{
                    background: 'transparent', color: 'var(--blue)',
                    border: '1px solid var(--blue)', borderRadius: 6,
                    padding: '12px 28px', fontSize: 'var(--text-base)',
                    fontFamily: 'var(--ui)', fontWeight: 600, cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue)'; e.currentTarget.style.color = 'var(--white)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--blue)'; }}
                >
                  Voir tous les écrits
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
