import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../App';
import { Badge, Button } from '../ui';

export default function AdminArticleList({ articles, onRefresh }) {
  const { navigate } = useApp();
  const [actionId, setActionId] = useState(null); // which article is loading

  const toggleStatus = async (article) => {
    setActionId(article.id);
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    await supabase.from('articles').update({ status: newStatus }).eq('id', article.id);
    setActionId(null);
    onRefresh();
  };

  const deleteArticle = async (article) => {
    if (!window.confirm(`Supprimer "${article.title}" ?`)) return;
    setActionId(article.id);
    await supabase.from('articles').delete().eq('id', article.id);
    setActionId(null);
    onRefresh();
  };

  if (!articles.length) {
    return (
      <div style={{ textAlign:'center', padding:'48px 0', color:'var(--ink-faint)', fontFamily:'var(--ui)' }}>
        Aucun article. Créez votre premier écrit !
      </div>
    );
  }

  return (
    <div style={{ background:'var(--white)', borderRadius:8, border:'1px solid var(--border)', overflow:'hidden' }}>
      {articles.map((a, i) => {
        const dateStr = a.date
          ? new Intl.DateTimeFormat('fr-FR', { day:'numeric', month:'short', year:'numeric' }).format(new Date(a.date))
          : '';
        const isLoading = actionId === a.id;
        return (
          <div
            key={a.id}
            style={{
              display:'flex', alignItems:'center', gap:16, padding:'16px 20px',
              borderBottom: i < articles.length - 1 ? '1px solid var(--border)' : 'none',
              background:'var(--white)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--white)'}
          >
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontFamily:'var(--serif)', fontSize:'var(--text-base)', fontWeight:600, color:'var(--ink)', marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {a.title}
              </p>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <Badge preset={a.status === 'published' ? 'blue' : 'neutral'}>
                  {a.status === 'published' ? 'Publié' : 'Brouillon'}
                </Badge>
                <span style={{ fontSize:'var(--text-sm)', color:'var(--ink-faint)', fontFamily:'var(--ui)' }}>{a.category}</span>
                <span style={{ fontSize:'var(--text-sm)', color:'var(--ink-faint)', fontFamily:'var(--ui)' }}>·</span>
                <span style={{ fontSize:'var(--text-sm)', color:'var(--ink-faint)', fontFamily:'var(--ui)' }}>{dateStr}</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
              <Button size="sm" variant="ghost" onClick={() => navigate('editor', a)} disabled={isLoading}>Modifier</Button>
              <Button size="sm" variant={a.status === 'published' ? 'ghost' : 'secondary'} onClick={() => toggleStatus(a)} loading={isLoading}>
                {a.status === 'published' ? 'Dépublier' : 'Publier'}
              </Button>
              <Button size="sm" variant="danger" onClick={() => deleteArticle(a)} disabled={isLoading}>Supprimer</Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
