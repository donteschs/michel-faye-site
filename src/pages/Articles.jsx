import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ArticleCard from '../components/public/ArticleCard';

const CATEGORIES = ['Tous', 'Journal', 'Histoire', 'Livre', 'Réflexion politique'];

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tous');

  useEffect(() => {
    supabase.from('articles').select('*').eq('status', 'published').order('date', { ascending: false })
      .then(({ data }) => { setArticles(data || []); setLoading(false); });
  }, []);

  const filtered = activeCategory === 'Tous' ? articles : articles.filter(a => a.category === activeCategory);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 48px' }}>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'var(--text-3xl)', color: 'var(--ink)', marginBottom: 32 }}>
        Tous les écrits
      </h1>

      {/* Category filter pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
        {CATEGORIES.map(cat => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: active ? 'var(--blue)' : 'var(--white)',
                color: active ? 'var(--white)' : 'var(--ink-light)',
                border: `1px solid ${active ? 'var(--blue)' : 'var(--border)'}`,
                borderRadius: 100,
                padding: '8px 18px',
                fontSize: 'var(--text-base)',
                fontFamily: 'var(--ui)',
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Articles grid */}
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--ink-faint)', fontSize: 'var(--text-base)', padding: '48px 0' }}>Chargement…</p>
      ) : filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--ink-faint)', fontSize: 'var(--text-base)', padding: '48px 0' }}>
          Aucun article dans cette catégorie.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {filtered.map(article => <ArticleCard key={article.id} article={article} />)}
        </div>
      )}
    </div>
  );
}
