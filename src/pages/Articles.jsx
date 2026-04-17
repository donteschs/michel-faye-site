import { useState, useEffect, useRef } from 'react';
import { useApp } from '../App';
import { supabase } from '../lib/supabase';
import ArticleCard from '../components/public/ArticleCard';

const CATEGORIES = ['Tous', 'Journal', 'Histoire', 'Livre', 'Réflexion politique'];
const CATEGORY_ICONS = { Tous: '✦', Journal: '📔', Histoire: '📖', Livre: '📚', 'Réflexion politique': '✍️' };

export default function Articles() {
  const { navigate, navData } = useApp();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);

  // Lire la catégorie ou recherche passée via navigate
  useEffect(() => {
    if (navData?.category) setActiveCategory(navData.category);
    if (navData?.search) { setSearch(navData.search); setActiveCategory('Tous'); }
  }, [navData]);

  useEffect(() => {
    let cancelled = false;
    supabase.from('articles').select('*').eq('status', 'published').order('date', { ascending: false })
      .then(({ data }) => {
        if (!cancelled) { setArticles(data || []); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, []);

  const q = search.trim().toLowerCase();
  const filtered = articles.filter(a => {
    const matchCat = activeCategory === 'Tous' || a.category === activeCategory;
    const matchSearch = !q
      || a.title?.toLowerCase().includes(q)
      || a.content?.replace(/<[^>]*>/g, '').toLowerCase().includes(q)
      || a.excerpt?.toLowerCase().includes(q)
      || a.tags?.some(t => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const clearSearch = () => { setSearch(''); searchRef.current?.focus(); };

  return (
    <div>
      {/* Header */}
      <section style={{ background: 'var(--cream-dark)', borderBottom: '1px solid var(--border)', padding: '40px 64px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--ink)', fontWeight: 700, lineHeight: 1.2, marginBottom: 4 }}>
                Tous les écrits
              </h1>
              {!loading && (
                <p style={{ fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', color: 'var(--ink-faint)' }}>
                  {filtered.length} texte{filtered.length > 1 ? 's' : ''}{q ? ` pour "${search}"` : ''} · par Michel Faye
                </p>
              )}
            </div>

            {/* Barre de recherche */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--ink-faint)', fontSize: 16, pointerEvents: 'none',
              }}>🔍</span>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un écrit…"
                aria-label="Rechercher un article"
                style={{
                  padding: '10px 36px 10px 36px',
                  border: `1px solid ${q ? 'var(--gold)' : 'var(--border)'}`,
                  borderRadius: 8, background: 'var(--white)',
                  fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)',
                  color: 'var(--ink)', outline: 'none', width: 260,
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                onBlur={e => e.currentTarget.style.borderColor = q ? 'var(--gold)' : 'var(--border)'}
              />
              {q && (
                <button
                  onClick={clearSearch}
                  aria-label="Effacer la recherche"
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--ink-faint)', fontSize: 16, lineHeight: 1, padding: 2,
                  }}
                >×</button>
              )}
            </div>
          </div>

          {/* Filtres catégories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map(cat => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={active}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: active ? 'var(--ink)' : 'var(--white)',
                    color: active ? 'var(--cream)' : 'var(--ink-light)',
                    border: `1px solid ${active ? 'var(--ink)' : 'var(--border)'}`,
                    borderRadius: 100, padding: '7px 16px',
                    fontSize: 'var(--text-sm)', fontFamily: 'var(--ui)',
                    fontWeight: active ? 600 : 400,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <span>{CATEGORY_ICONS[cat]}</span>
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grille */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 80px' }}>
        {loading ? (
          <div className="articles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} style={{ background: 'var(--white)', borderRadius: 12, height: 200, border: '1px solid var(--border)', opacity: 0.4 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 'var(--text-xl)', color: 'var(--ink-faint)', fontStyle: 'italic', marginBottom: 16 }}>
              {q ? `Aucun résultat pour "${search}".` : 'Aucun texte dans cette catégorie.'}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              {q && (
                <button onClick={clearSearch} style={{ background: 'none', border: 'none', color: 'var(--blue)', fontFamily: 'var(--ui)', fontSize: 'var(--text-base)', cursor: 'pointer' }}>
                  Effacer la recherche
                </button>
              )}
              {activeCategory !== 'Tous' && (
                <button onClick={() => setActiveCategory('Tous')} style={{ background: 'none', border: 'none', color: 'var(--blue)', fontFamily: 'var(--ui)', fontSize: 'var(--text-base)', cursor: 'pointer' }}>
                  ← Voir tous les écrits
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="articles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {filtered.map(article => <ArticleCard key={article.id} article={article} />)}
          </div>
        )}
      </div>
    </div>
  );
}
