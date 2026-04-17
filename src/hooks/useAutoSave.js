import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useAutoSave(articleId, getData, intervalMs = 30000) {
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const getDataRef = useRef(getData);
  const createdIdRef = useRef(null);
  useEffect(() => { getDataRef.current = getData; });

  const save = useCallback(async () => {
    const data = getDataRef.current();
    if (!data.title && !data.content) return;
    setSaving(true);
    setSaveError(null);
    try {
      const effectiveId = articleId || createdIdRef.current;
      if (effectiveId) {
        await supabase.from('articles').update({ ...data, updated_at: new Date().toISOString() }).eq('id', effectiveId);
      } else {
        const { data: row, error } = await supabase
          .from('articles').insert({ ...data, status: 'draft' }).select('id').single();
        if (error) throw error;
        if (row?.id) createdIdRef.current = row.id;
      }
      setLastSaved(new Date());
    } catch (e) {
      console.error('Auto-save failed:', e);
      setSaveError(e.message || 'Sauvegarde échouée');
    } finally {
      setSaving(false);
    }
  }, [articleId]);

  useEffect(() => {
    const t = setInterval(save, intervalMs);
    return () => clearInterval(t);
  }, [save, intervalMs]);

  return { lastSaved, saving, saveError, saveNow: save, createdIdRef };
}
