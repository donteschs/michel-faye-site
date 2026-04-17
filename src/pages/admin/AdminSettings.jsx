import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../App';
import { Button } from '../../components/ui';

const FIELDS = [
  {
    section: 'Page À propos',
    fields: [
      { key: 'about_intro', label: 'Introduction', multiline: true, rows: 5 },
      { key: 'about_quote', label: 'Citation mise en avant', multiline: true, rows: 3 },
      { key: 'about_section1_title', label: 'Titre section 1', multiline: false },
      { key: 'about_section1_body', label: 'Texte section 1', multiline: true, rows: 4 },
      { key: 'about_section2_title', label: 'Titre section 2', multiline: false },
      { key: 'about_section2_body', label: 'Texte section 2', multiline: true, rows: 4 },
    ],
  },
  {
    section: 'Page Contact',
    fields: [
      { key: 'contact_intro', label: 'Texte d\'introduction', multiline: true, rows: 3 },
    ],
  },
];

export default function AdminSettings() {
  const { navigate, notify, isAdmin } = useApp();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    supabase.from('site_content').select('key, value').then(({ data }) => {
      const map = {};
      (data || []).forEach(r => { map[r.key] = r.value; });
      setValues(map);
      setLoading(false);
    });
  }, [isAdmin]);

  const handleSave = async () => {
    setSaving(true);
    const rows = Object.entries(values).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
    const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'key' });
    setSaving(false);
    if (error) { notify('Erreur lors de la sauvegarde.', 'error'); return; }
    notify('Modifications enregistrées !', 'success');
  };

  if (!isAdmin) return null;

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 48px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <button
            onClick={() => navigate('admin')}
            style={{ background: 'none', border: 'none', color: 'var(--ink-light)', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', cursor: 'pointer', padding: 0, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            ← Retour
          </button>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'var(--text-2xl)', color: 'var(--ink)', fontWeight: 700 }}>
            Paramètres du site
          </h1>
          <p style={{ fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', color: 'var(--ink-faint)', marginTop: 4 }}>
            Modifiez le contenu des pages À propos et Contact.
          </p>
        </div>
        <Button variant="primary" onClick={handleSave} loading={saving}>
          Enregistrer
        </Button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--ink-faint)', fontFamily: 'var(--ui)' }}>Chargement…</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {FIELDS.map(({ section, fields }) => (
            <div key={section}>
              <h2 style={{
                fontFamily: 'var(--ui)', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--gold)', marginBottom: 20, paddingBottom: 10,
                borderBottom: '1px solid var(--border)',
              }}>
                {section}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {fields.map(({ key, label, multiline, rows }) => (
                  <div key={key}>
                    <label style={{ fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', color: 'var(--ink-light)', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                      {label}
                    </label>
                    {multiline ? (
                      <textarea
                        value={values[key] || ''}
                        onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                        rows={rows || 4}
                        style={{
                          width: '100%', padding: '10px 12px',
                          border: '1px solid var(--border)', borderRadius: 6,
                          fontFamily: 'var(--body)', fontSize: 'var(--text-base)',
                          color: 'var(--ink)', background: 'var(--white)',
                          lineHeight: 1.7, resize: 'vertical', boxSizing: 'border-box',
                          outline: 'none',
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                      />
                    ) : (
                      <input
                        type="text"
                        value={values[key] || ''}
                        onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                        style={{
                          width: '100%', padding: '10px 12px',
                          border: '1px solid var(--border)', borderRadius: 6,
                          fontFamily: 'var(--body)', fontSize: 'var(--text-base)',
                          color: 'var(--ink)', background: 'var(--white)',
                          boxSizing: 'border-box', outline: 'none',
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
        <Button variant="primary" onClick={handleSave} loading={saving} style={{ width: '100%' }}>
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
}
