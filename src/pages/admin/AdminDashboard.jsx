import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../App';
import { Button, Badge, Loader } from '../../components/ui';

const CATEGORY_PRESET = { Journal: 'gold', Histoire: 'blue', Livre: 'neutral', 'Réflexion politique': 'rose' };

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (days === 0) return "aujourd'hui";
  if (days === 1) return 'hier';
  if (days < 30) return `il y a ${days} j`;
  if (days < 365) return `il y a ${Math.floor(days / 30)} mois`;
  return `il y a ${Math.floor(days / 365)} an`;
}

export default function AdminDashboard() {
  const { navigate, isAdmin } = useApp();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [filter, setFilter] = useState('all');

  const setRowLoading = (id, on) =>
    setLoadingIds(prev => { const next = new Set(prev); on ? next.add(id) : next.delete(id); return next; });

  const fetchArticles = useCallback(async (signal) => {
    setLoading(true);
    const { data } = await supabase.from('articles').select('*').order('updated_at', { ascending: false });
    if (signal?.aborted) return;
    setArticles(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    const controller = new AbortController();
    fetchArticles(controller.signal);
    return () => controller.abort();
  }, [isAdmin, fetchArticles]);

  const toggleStatus = async (article) => {
    setRowLoading(article.id, true);
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    await supabase.from('articles').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', article.id);
    setRowLoading(article.id, false);
    fetchArticles();
  };

  const deleteArticle = async (article) => {
    if (!window.confirm(`Supprimer "${article.title}" ?`)) return;
    setRowLoading(article.id, true);
    await supabase.from('articles').delete().eq('id', article.id);
    setRowLoading(article.id, false);
    fetchArticles();
  };

  if (!isAdmin) return null;

  const published = articles.filter(a => a.status === 'published');
  const drafts = articles.filter(a => a.status === 'draft');
  const filtered = filter === 'published' ? published : filter === 'draft' ? drafts : articles;

  return (
    <div style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'var(--text-2xl)', color: 'var(--ink)', marginBottom: 4 }}>
            Mes publications
          </h1>
          <p style={{ fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', color: 'var(--ink-faint)' }}>
            {published.length} publié{published.length > 1 ? 's' : ''} · {drafts.length} brouillon{drafts.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('editor', null)}>
          + Nouvel écrit
        </Button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Tous', value: 'all', count: articles.length },
          { label: 'Publiés', value: 'published', count: published.length },
          { label: 'Brouillons', value: 'draft', count: drafts.length },
        ].map(({ label, value, count }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            style={{
              padding: '8px 20px', borderRadius: 20, cursor: 'pointer',
              fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', fontWeight: 500,
              border: filter === value ? '2px solid var(--gold)' : '1px solid var(--border)',
              background: filter === value ? 'rgba(196,149,90,0.10)' : 'var(--white)',
              color: filter === value ? 'var(--gold)' : 'var(--ink-light)',
              transition: 'all 0.15s',
            }}
          >
            {label} <span style={{ opacity: 0.6 }}>({count})</span>
          </button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 64 }}><Loader size={28} /></div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--ink-faint)', fontFamily: 'var(--ui)' }}>
          {filter === 'draft' ? 'Aucun brouillon.' : filter === 'published' ? 'Aucun article publié.' : 'Aucun article. Créez votre premier écrit !'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(a => {
            const isLoading = loadingIds.has(a.id);
            const preset = CATEGORY_PRESET[a.category] || 'rose';
            return (
              <div
                key={a.id}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'box-shadow 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                {/* Statut indicator */}
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: a.status === 'published' ? '#22c55e' : 'var(--ink-faint)',
                }} title={a.status === 'published' ? 'Publié' : 'Brouillon'} />

                {/* Infos */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: 'var(--serif)', fontSize: 'var(--text-base)',
                    fontWeight: 600, color: 'var(--ink)', marginBottom: 6,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {a.title}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <Badge preset={a.status === 'published' ? 'blue' : 'neutral'}>
                      {a.status === 'published' ? 'Publié' : 'Brouillon'}
                    </Badge>
                    <Badge preset={preset}>{a.category}</Badge>
                    <span style={{ fontSize: 12, color: 'var(--ink-faint)', fontFamily: 'var(--ui)' }}>
                      {timeAgo(a.updated_at)}
                    </span>
                    {a.important && (
                      <span style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'var(--ui)', fontWeight: 600 }}>
                        ★ épinglé
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                  <Button size="sm" variant="ghost" onClick={() => navigate('editor', a)} disabled={isLoading}>
                    ✏️ Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant={a.status === 'published' ? 'ghost' : 'primary'}
                    onClick={() => toggleStatus(a)}
                    loading={isLoading}
                  >
                    {a.status === 'published' ? 'Dépublier' : '✓ Publier'}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => deleteArticle(a)} disabled={isLoading}>
                    Supprimer
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
