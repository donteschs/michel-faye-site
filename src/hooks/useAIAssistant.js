import { useState, useRef, useCallback, useEffect } from 'react';
import { openai, AI_PROMPTS } from '../lib/openai';

export function useAIAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const run = useCallback(async (key, content) => {
    if (!content.trim()) return null;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const res = await openai.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 1000,
        temperature: 0.7,
        messages: [
          { role: 'system', content: AI_PROMPTS[key].system },
          { role: 'user', content },
        ],
      });
      if (controller.signal.aborted) return null;
      return res.choices[0].message.content.trim();
    } catch (e) {
      if (controller.signal.aborted) return null;
      setError(e.message || 'Erreur OpenAI');
      return null;
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  return { run, loading, error };
}
