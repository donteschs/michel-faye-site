import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useAutoSave(articleId, getData, intervalMs = 30000) {
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  const getDataRef = useRef(getData);
  useEffect(() => { getDataRef.current = getData; });

  const save = useCallback(async () => {
    const data = getDataRef.current();
    if (!data.title && !data.content) return;
    setSaving(true);
    try {
      if (articleId) {
        await supabase.from('articles').update({ ...data, updated_at: new Date().toISOString() }).eq('id', articleId);
      } else {
        await supabase.from('articles').insert({ ...data, status: 'draft' });
      }
      setLastSaved(new Date());
    } catch (e) {
      console.error('Auto-save failed:', e);
    } finally {
      setSaving(false);
    }
  }, [articleId]);

  useEffect(() => {
    const t = setInterval(save, intervalMs);
    return () => clearInterval(t);
  }, [save, intervalMs]);

  return { lastSaved, saving, saveNow: save };
}
