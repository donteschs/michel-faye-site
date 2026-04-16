import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../App';
import { Button, Badge, Loader } from '../../components/ui';
import AdminArticleList from '../../components/admin/AdminArticleList';

export default function AdminDashboard() {
  const { navigate, isAdmin } = useApp();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(async (signal) => {
    setLoading(true);
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
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

  if (!isAdmin) return null;

  const published = articles.filter(a => a.status === 'published').length;
  const drafts = articles.filter(a => a.status === 'draft').length;

  return (
    <div style={{ padding:'40px 48px', maxWidth:900, margin:'0 auto' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <h1 style={{ fontFamily:'var(--serif)', fontSize:'var(--text-2xl)', color:'var(--ink)' }}>
            Espace de publication
          </h1>
          <Badge preset="gold">Admin</Badge>
        </div>
        <Button variant="primary" onClick={() => navigate('editor', null)}>
          + Nouvel écrit
        </Button>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:16, marginBottom:32 }}>
        {[
          { label: 'Publiés', count: published, preset: 'blue' },
          { label: 'Brouillons', count: drafts, preset: 'neutral' },
          { label: 'Total', count: articles.length, preset: 'gold' },
        ].map(({ label, count, preset }) => (
          <div key={label} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:8, padding:'16px 24px', flex:1, textAlign:'center' }}>
            <p style={{ fontFamily:'var(--serif)', fontSize:'var(--text-2xl)', fontWeight:600, color:'var(--ink)', marginBottom:4 }}>{count}</p>
            <Badge preset={preset}>{label}</Badge>
          </div>
        ))}
      </div>

      {/* Article list */}
      {loading
        ? <div style={{ textAlign:'center', padding:48 }}><Loader size={24} /></div>
        : <AdminArticleList articles={articles} onRefresh={fetchArticles} />
      }
    </div>
  );
}
