import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const AI_PROMPTS = {
  improve: {
    label: '✨ Améliorer le style',
    system: "Tu es un éditeur littéraire francophone. Améliore le style de ce texte en conservant la voix et les idées de l'auteure. Retourne uniquement le texte amélioré.",
  },
  correct: {
    label: '✓ Corriger',
    system: "Corrige l'orthographe et la grammaire de ce texte français sans changer le style ni les idées. Retourne uniquement le texte corrigé.",
  },
  emotion: {
    label: '💛 Réécrire avec émotion',
    system: "Réécris ce texte avec plus de profondeur émotionnelle et de sensibilité poétique, en gardant la première personne et les faits. Retourne uniquement le texte réécrit.",
  },
  story: {
    label: '📖 Transformer en histoire',
    system: "Transforme ce texte en récit narratif vivant à la première personne, avec des détails sensoriels et une progression dramatique. Retourne uniquement le récit.",
  },
  summary: {
    label: '📋 Résumé automatique',
    system: "Génère un résumé de 2-3 phrases de ce texte en français. Retourne uniquement le résumé.",
  },
};
