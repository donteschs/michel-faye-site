import { useState } from 'react';
import { openai, AI_PROMPTS } from '../lib/openai';

export function useAIAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async (key, content) => {
    if (!content.trim()) return null;
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
      return res.choices[0].message.content.trim();
    } catch (e) {
      setError(e.message || 'Erreur OpenAI');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { run, loading, error };
}
