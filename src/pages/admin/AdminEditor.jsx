import { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../App';
import { useAutoSave } from '../../hooks/useAutoSave';
import VoiceButton from '../../components/admin/VoiceButton';
import AIPanel from '../../components/admin/AIPanel';
import MediaUpload from '../../components/admin/MediaUpload';
import { Button } from '../../components/ui';

const CATEGORIES = ['Journal', 'Histoire', 'Livre', 'Réflexion politique'];

export default function AdminEditor() {
  const { navigate, notify, editArticle } = useApp();
  const existing = editArticle;

  const [title, setTitle] = useState(existing?.title || '');
  const [category, setCategory] = useState(existing?.category || 'Journal');
  const [tags, setTags] = useState(existing?.tags?.join(', ') || '');
  const [important, setImportant] = useState(existing?.important || false);
  const [imageUrl, setImageUrl] = useState(existing?.image_url || null);
  const [audioUrl, setAudioUrl] = useState(existing?.audio_url || null);
  const [publishing, setPublishing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Commencez à écrire votre texte ici…' }),
    ],
    content: existing?.content || '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
        style: 'min-height:400px; padding:16px; outline:none; font-family:var(--body); font-size:var(--text-lg); line-height:1.9; color:var(--ink);',
      },
    },
  });

  const getData = useCallback(() => ({
    title,
    content: editor?.getHTML() || '',
    category,
    tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    important,
    image_url: imageUrl,
    audio_url: audioUrl,
  }), [title, editor, category, tags, important, imageUrl, audioUrl]);

  const { lastSaved, saving, saveError, saveNow, createdIdRef } = useAutoSave(existing?.id || null, getData);

  const handleVoiceTranscript = useCallback((text) => {
    if (editor) editor.commands.insertContent(text + ' ');
  }, [editor]);

  const getEditorText = useCallback(() =>
    editor ? editor.getText() : '', [editor]);

  const handleAIInsert = useCallback((text) => {
    if (editor) editor.commands.insertContent(text);
  }, [editor]);

  const handleAIReplace = useCallback((text) => {
    if (editor) {
      editor.chain().focus().selectAll().insertContent(text).run();
    }
  }, [editor]);

  const publish = async (status) => {
    setPublishing(true);
    try {
      const data = { ...getData(), status, updated_at: new Date().toISOString() };
      const effectiveId = existing?.id || createdIdRef.current;
      if (effectiveId) {
        const { error } = await supabase.from('articles').update(data).eq('id', effectiveId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('articles').insert(data);
        if (error) throw error;
      }
      notify(status === 'published' ? 'Article publié !' : 'Brouillon enregistré.', 'success');
      navigate('admin');
    } catch (e) {
      notify(e.message || 'Erreur lors de la sauvegarde.', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const saveIndicator = saveError
    ? `⚠ ${saveError}`
    : saving
    ? 'Sauvegarde…'
    : lastSaved
    ? `Sauvegardé à ${lastSaved.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
    : 'Non sauvegardé';

  return (
    <>
      <style>{`
        .tiptap-editor h2 { font-family: var(--serif); font-size: var(--text-xl); margin: 2em 0 0.5em; color: var(--ink); }
        .tiptap-editor h3 { font-family: var(--serif); font-size: var(--text-lg); margin: 1.6em 0 0.4em; color: var(--ink); }
        .tiptap-editor p { margin: 0 0 1.4em 0; line-height: 1.85; }
        .tiptap-editor p:last-child { margin-bottom: 0; }
        .tiptap-editor blockquote { border-left: 3px solid var(--gold); padding: 4px 0 4px 20px; color: var(--ink-light); font-style: italic; margin: 1.6em 0; }
        .tiptap-editor ul, .tiptap-editor ol { padding-left: 1.5em; margin-bottom: 1.4em; }
        .tiptap-editor li { margin-bottom: 0.3em; }
        .tiptap-editor a { color: var(--blue); text-decoration: underline; }
        .tiptap-editor p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--ink-faint); pointer-events: none; float: left; height: 0; }
        .tiptap-editor:focus { outline: none; }
      `}</style>

      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--cream-dark)', borderBottom: '1px solid var(--border)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          type="button"
          onClick={() => navigate('admin')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)', fontFamily: 'var(--ui)', fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span aria-hidden="true">←</span> Retour
        </button>
        <span style={{ flex: 1, fontFamily: 'var(--serif)', fontSize: 'var(--text-base)', color: 'var(--ink-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {title || 'Nouvel écrit'}
        </span>
        <span style={{ fontFamily: 'var(--ui)', fontSize: 12, color: 'var(--ink-faint)', whiteSpace: 'nowrap' }}>
          {saveIndicator}
        </span>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

        {/* Left column — editor */}
        <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', borderRight: '1px solid var(--border)' }}>
          <VoiceButton onTranscript={handleVoiceTranscript} />

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Titre de l'écrit…"
            aria-label="Titre de l'article"
            style={{
              width: '100%',
              border: 'none',
              borderBottom: '1px solid var(--border)',
              background: 'transparent',
              fontFamily: 'var(--serif)',
              fontSize: 'var(--text-2xl)',
              color: 'var(--ink)',
              padding: '0 0 12px 0',
              marginBottom: 20,
              outline: 'none',
            }}
          />

          {/* Tiptap toolbar */}
          {editor && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12, padding: '8px', background: 'var(--cream-dark)', borderRadius: 6, border: '1px solid var(--border)' }}>
              {[
                { label: 'G', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), title: 'Gras' },
                { label: 'I', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), title: 'Italique' },
                { label: 'H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), title: 'Titre 2' },
                { label: 'H3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }), title: 'Titre 3' },
                { label: '❝', action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), title: 'Citation' },
                { label: '≡', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), title: 'Liste' },
              ].map(({ label, action, active, title: t }) => (
                <button
                  key={label}
                  type="button"
                  onClick={action}
                  title={t}
                  aria-label={t}
                  aria-pressed={active}
                  style={{
                    background: active ? 'var(--blue)' : 'transparent',
                    color: active ? '#fff' : 'var(--ink-light)',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 10px',
                    fontFamily: label === 'I' ? 'Georgia, serif' : 'var(--ui)',
                    fontStyle: label === 'I' ? 'italic' : 'normal',
                    fontWeight: label === 'G' ? 700 : 400,
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                    minHeight: 32,
                    minWidth: 36,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Editor area */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 6, background: 'var(--white)', marginBottom: 16 }}>
            <EditorContent editor={editor} />
          </div>

          <MediaUpload
            onImageUrl={setImageUrl}
            onAudioUrl={setAudioUrl}
            imageUrl={imageUrl}
            audioUrl={audioUrl}
          />
        </div>

        {/* Right column — AI + publish */}
        <div style={{ width: 280, padding: '24px 20px', overflowY: 'auto', background: 'var(--cream)', flexShrink: 0 }}>
          <AIPanel
            getContent={getEditorText}
            onInsert={handleAIInsert}
            onReplace={handleAIReplace}
          />

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 8 }}>
            <p style={{ fontFamily: 'var(--ui)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginBottom: 10 }}>
              Publication
            </p>

            {/* Category */}
            <label style={{ fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', color: 'var(--ink-light)', display: 'block', marginBottom: 4 }}>
              Catégorie
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 4, fontFamily: 'var(--body)', fontSize: 'var(--text-base)', color: 'var(--ink)', background: 'var(--white)', marginBottom: 12 }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Tags */}
            <label style={{ fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', color: 'var(--ink-light)', display: 'block', marginBottom: 4 }}>
              Tags (séparés par virgule)
            </label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="mémoire, famille, 1987"
              style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 4, fontFamily: 'var(--body)', fontSize: 'var(--text-base)', color: 'var(--ink)', background: 'var(--white)', marginBottom: 12 }}
            />

            {/* Important checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', color: 'var(--ink-light)', marginBottom: 16, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={important}
                onChange={e => setImportant(e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
              Texte important (épinglé sur l'accueil)
            </label>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button
                variant="primary"
                onClick={() => publish('published')}
                loading={publishing}
                style={{ width: '100%' }}
              >
                Publier
              </Button>
              <Button
                variant="ghost"
                onClick={() => publish('draft')}
                disabled={publishing}
                style={{ width: '100%' }}
              >
                Enregistrer brouillon
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
