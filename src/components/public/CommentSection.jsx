import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../App';
import { supabase } from '../../lib/supabase';

function CommentForm({ onSubmit, placeholder = 'Répondre…', compact = false }) {
  const [text, setText] = useState('');
  return (
    <form
      onSubmit={e => { e.preventDefault(); if (text.trim()) { onSubmit(text); setText(''); } }}
      style={{ marginBottom: compact ? 0 : 24 }}
    >
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={placeholder}
        rows={compact ? 2 : 3}
        style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 6, padding: 12, fontFamily: 'var(--body)', fontSize: 'var(--text-base)', color: 'var(--ink)', resize: 'vertical', background: 'var(--white)', lineHeight: 1.6, boxSizing: 'border-box' }}
      />
      <button
        type="submit"
        style={{ marginTop: 8, background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontFamily: 'var(--ui)', fontSize: 'var(--text-base)', cursor: 'pointer', minHeight: 44 }}
      >
        Publier
      </button>
    </form>
  );
}

function CommentCard({ comment, authorName, hasLiked, onLike, onDelete, onReply, replies, profiles, userLikes, onLikeReply, onDeleteReply }) {
  const [showReply, setShowReply] = useState(false);
  const dateStr = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(comment.created_at));

  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, padding: 20 }}>
      {/* Author + date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)' }}>{authorName}</span>
        <span style={{ fontFamily: 'var(--ui)', fontSize: 12, color: 'var(--ink-faint)' }}>{dateStr}</span>
      </div>
      {/* Content */}
      <p style={{ fontFamily: 'var(--body)', fontSize: 'var(--text-base)', color: 'var(--ink-light)', lineHeight: 1.7, marginBottom: 12 }}>
        {comment.content}
      </p>
      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          type="button"
          onClick={onLike}
          aria-pressed={hasLiked}
          aria-label={`${hasLiked ? 'Retirer le like' : 'Liker'} — ${comment.likes_count} like${comment.likes_count !== 1 ? 's' : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: hasLiked ? 'var(--rose)' : 'var(--ink-faint)', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', padding: '4px 0', minHeight: 36 }}
        >
          {hasLiked ? '♥' : '♡'} {comment.likes_count}
        </button>
        {onReply && (
          <button
            type="button"
            onClick={() => setShowReply(r => !r)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', padding: '4px 0', minHeight: 36 }}
          >
            Répondre
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rose)', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', padding: '4px 0', marginLeft: 'auto', minHeight: 36 }}
          >
            Supprimer
          </button>
        )}
      </div>
      {/* Reply form */}
      {showReply && onReply && (
        <div style={{ marginTop: 12, paddingLeft: 16, borderLeft: '2px solid var(--border)' }}>
          <CommentForm onSubmit={(text) => { onReply(text); setShowReply(false); }} compact />
        </div>
      )}
      {/* Replies */}
      {replies.length > 0 && (
        <div style={{ marginTop: 16, paddingLeft: 16, borderLeft: '2px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {replies.map(reply => {
            const replyAuthor = profiles[reply.user_id] || 'Utilisateur';
            const replyDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(reply.created_at));
            const replyLiked = userLikes.has(reply.id);
            const canDeleteReply = onDeleteReply(reply.id, reply.user_id);
            return (
              <div key={reply.id} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 6, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)' }}>{replyAuthor}</span>
                  <span style={{ fontFamily: 'var(--ui)', fontSize: 12, color: 'var(--ink-faint)' }}>{replyDate}</span>
                </div>
                <p style={{ fontFamily: 'var(--body)', fontSize: 'var(--text-base)', color: 'var(--ink-light)', lineHeight: 1.7, marginBottom: 10 }}>
                  {reply.content}
                </p>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => onLikeReply(reply.id)}
                    aria-pressed={replyLiked}
                    aria-label={`${replyLiked ? 'Retirer le like' : 'Liker'} — ${reply.likes_count} like${reply.likes_count !== 1 ? 's' : ''}`}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: replyLiked ? 'var(--rose)' : 'var(--ink-faint)', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', padding: '4px 0', minHeight: 36 }}
                  >
                    {replyLiked ? '♥' : '♡'} {reply.likes_count}
                  </button>
                  {canDeleteReply && (
                    <button
                      type="button"
                      onClick={canDeleteReply}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rose)', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', padding: '4px 0', marginLeft: 'auto', minHeight: 36 }}
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CommentSection({ articleId }) {
  const { navigate, notify, user, isAdmin, isAuthenticated } = useApp();
  const [comments, setComments] = useState([]);
  const [userLikes, setUserLikes] = useState(new Set());
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    let cancelled = false;

    const { data: commentsData } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: true });

    if (cancelled) return;
    const loadedComments = commentsData || [];
    setComments(loadedComments);

    // Load profiles for all unique user_ids
    const userIds = [...new Set(loadedComments.map(c => c.user_id))];
    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, display_name, email')
        .in('id', userIds);
      if (!cancelled) {
        const map = {};
        (profilesData || []).forEach(p => { map[p.id] = p.display_name || p.email || 'Utilisateur'; });
        setProfiles(map);
      }
    }

    // Load user's likes if authenticated
    if (user && !cancelled) {
      const { data: likesData } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('user_id', user.id);
      if (!cancelled) setUserLikes(new Set((likesData || []).map(l => l.comment_id)));
    }

    if (!cancelled) setLoading(false);
    return () => { cancelled = true; };
  }, [articleId, user]);

  useEffect(() => { load(); }, [load]);

  const roots = comments.filter(c => !c.parent_id);
  const getReplies = (parentId) => comments.filter(c => c.parent_id === parentId);

  const toggleLike = async (commentId) => {
    if (!isAuthenticated) { navigate('login'); return; }
    const hasLiked = userLikes.has(commentId);
    // Optimistic update
    setUserLikes(prev => {
      const next = new Set(prev);
      hasLiked ? next.delete(commentId) : next.add(commentId);
      return next;
    });
    setComments(prev => prev.map(c =>
      c.id === commentId ? { ...c, likes_count: c.likes_count + (hasLiked ? -1 : 1) } : c
    ));
    // Persist
    if (hasLiked) {
      await supabase.from('comment_likes').delete().match({ comment_id: commentId, user_id: user.id });
    } else {
      await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: user.id });
    }
  };

  const postComment = async (content, parentId = null) => {
    if (!content.trim()) return;
    const { error } = await supabase.from('comments').insert({
      article_id: articleId,
      user_id: user.id,
      parent_id: parentId || null,
      content: content.trim(),
    });
    if (error) { notify('Erreur lors de la publication.', 'error'); return; }
    load();
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return;
    await supabase.from('comments').delete().eq('id', commentId);
    load();
  };

  return (
    <div style={{ marginTop: 48, borderTop: '2px solid var(--border)', paddingTop: 32 }}>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'var(--text-xl)', color: 'var(--ink)', marginBottom: 24 }}>
        Commentaires ({comments.length})
      </h2>

      {/* New comment form (if authenticated) */}
      {isAuthenticated ? (
        <CommentForm onSubmit={(text) => postComment(text)} placeholder="Votre commentaire…" />
      ) : (
        <div style={{ background: 'var(--cream-dark)', border: '1px solid var(--border)', borderRadius: 8, padding: 20, marginBottom: 24, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--body)', fontSize: 'var(--text-base)', color: 'var(--ink-light)', marginBottom: 12 }}>
            Connectez-vous pour laisser un commentaire.
          </p>
          <button
            type="button"
            onClick={() => navigate('login')}
            style={{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontFamily: 'var(--ui)', fontSize: 'var(--text-base)', cursor: 'pointer', minHeight: 44 }}
          >
            Se connecter
          </button>
        </div>
      )}

      {/* Comment list */}
      {loading ? (
        <p style={{ color: 'var(--ink-faint)', fontFamily: 'var(--ui)' }}>Chargement…</p>
      ) : roots.length === 0 ? (
        <p style={{ color: 'var(--ink-faint)', fontFamily: 'var(--ui)', fontStyle: 'italic' }}>Aucun commentaire pour l'instant. Soyez le premier !</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {roots.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              authorName={profiles[comment.user_id] || 'Utilisateur'}
              hasLiked={userLikes.has(comment.id)}
              onLike={() => toggleLike(comment.id)}
              onDelete={isAdmin || comment.user_id === user?.id ? () => deleteComment(comment.id) : null}
              onReply={isAuthenticated ? (text) => postComment(text, comment.id) : null}
              replies={getReplies(comment.id)}
              profiles={profiles}
              userLikes={userLikes}
              onLikeReply={(id) => toggleLike(id)}
              onDeleteReply={(id, userId) => (isAdmin || userId === user?.id) ? deleteComment(id) : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
