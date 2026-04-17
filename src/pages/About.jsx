import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULTS = {
  about_intro: 'Michel Faye consacre son écriture à préserver les fragments du temps vécu.',
  about_quote: '« Chaque écrit est un fil tendu vers ceux qui viendront après nous. »',
  about_section1_title: 'Un engagement au quotidien',
  about_section1_body: 'Chaque jour, Michel Faye prend la plume pour capturer ce que la mémoire risque de laisser glisser entre ses doigts.',
  about_section2_title: "L'écriture comme héritage",
  about_section2_body: "Les textes de Michel Faye ne sont pas seulement des souvenirs — ils sont un legs vivant destiné aux générations futures.",
};

export default function About() {
  const [content, setContent] = useState(DEFAULTS);

  useEffect(() => {
    supabase.from('site_content').select('key, value').like('key', 'about_%').then(({ data }) => {
      if (!data?.length) return;
      const map = { ...DEFAULTS };
      data.forEach(r => { map[r.key] = r.value; });
      setContent(map);
    });
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 48px' }}>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'var(--text-3xl)', color: 'var(--ink)', lineHeight: 1.2, marginBottom: 32 }}>
        À propos
      </h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--cream-dark), var(--gold-light))',
          border: '2px solid var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--serif)', fontSize: 'var(--text-2xl)', color: 'var(--ink)', fontWeight: 700,
        }}>MF</div>
      </div>

      <p style={{ fontSize: 18, fontFamily: 'var(--body)', color: 'var(--ink)', lineHeight: 1.8, marginBottom: 32 }}>
        {content.about_intro}
      </p>

      <blockquote style={{
        borderLeft: '4px solid var(--gold)', background: 'var(--gold-light)',
        padding: '20px', borderRadius: '0 8px 8px 0',
        fontStyle: 'italic', fontSize: 18, fontFamily: 'var(--body)',
        color: 'var(--ink)', lineHeight: 1.8, margin: '0 0 40px 0',
      }}>
        {content.about_quote}
      </blockquote>

      <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'var(--text-2xl)', color: 'var(--ink)', marginBottom: 16 }}>
        {content.about_section1_title}
      </h2>
      <p style={{ fontSize: 18, fontFamily: 'var(--body)', color: 'var(--ink)', lineHeight: 1.8, marginBottom: 40 }}>
        {content.about_section1_body}
      </p>

      <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'var(--text-2xl)', color: 'var(--ink)', marginBottom: 16 }}>
        {content.about_section2_title}
      </h2>
      <p style={{ fontSize: 18, fontFamily: 'var(--body)', color: 'var(--ink)', lineHeight: 1.8 }}>
        {content.about_section2_body}
      </p>
    </div>
  );
}
