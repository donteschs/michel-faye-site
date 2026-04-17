import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../App';

const QUOTES = [
  "Écrire, c'est donner une voix à ceux qui n'en ont plus.",
  "La mémoire est une lumière qui refuse de s'éteindre.",
  "Chaque mot écrit est une victoire sur l'oubli.",
];

const CATEGORIES = [
  { label: '📔 Journaux',              value: 'Journal' },
  { label: '📖 Histoires',             value: 'Histoire' },
  { label: '📚 Livres',                value: 'Livre' },
  { label: '✍️ Réflexions politiques', value: 'Réflexion politique' },
];

const NAV_ITEMS = [
  { label: 'Accueil',        page: 'home' },
  { label: 'Tous les écrits', page: 'articles' },
];

function NavItem({ label, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '9px 16px',
        background: active ? 'rgba(196,149,90,0.10)' : hovered ? 'rgba(196,149,90,0.06)' : 'transparent',
        borderLeft: active ? '3px solid var(--gold)' : '3px solid transparent',
        color: active ? 'var(--gold)' : 'var(--ink-light)',
        fontFamily: 'var(--ui)',
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s, color 0.15s',
        borderRadius: '0 4px 4px 0',
      }}
    >
      {label}
    </button>
  );
}

export default function Sidebar() {
  const { page, navigate, isAdmin, isAuthenticated, signOut } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const debounceRef = useRef(null);

  // Rotate quotes every 12 seconds
  useEffect(() => {
    const id = setInterval(() => setQuoteIndex(i => (i + 1) % QUOTES.length), 12000);
    return () => clearInterval(id);
  }, []);

  // Debounced search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim()) {
      debounceRef.current = setTimeout(() => {
        navigate('articles', { search: query.trim() });
      }, 300);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      navigate('articles', { search: searchQuery.trim() });
    }
  };

  return (
    <>
      <style>{`@media(max-width:768px){.sidebar{display:none!important}}`}</style>
      <nav
        className="sidebar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 240,
          height: '100vh',
          background: 'var(--cream-dark)',
          borderRight: '1px solid var(--border)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <button
          onClick={() => navigate('home')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '28px 20px 20px',
            textAlign: 'left',
          }}
        >
          <div style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--ink)', fontWeight: 600, lineHeight: 1.2 }}>
            Michel{' '}
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Faye</em>
          </div>
          <div style={{ fontFamily: 'var(--ui)', fontSize: 'var(--text-xs)', color: 'var(--ink-faint)', marginTop: 4, letterSpacing: '0.05em' }}>
            Écrits &amp; Mémoires
          </div>
        </button>

        {/* Search */}
        <div style={{ padding: '0 16px 20px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="Rechercher…"
            aria-label="Rechercher dans les articles"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--border)',
              borderRadius: 6,
              background: 'var(--cream)',
              color: 'var(--ink)',
              fontFamily: 'var(--ui)',
              fontSize: 'var(--text-sm)',
              outline: 'none',
            }}
          />
        </div>

        {/* Main nav */}
        <div style={{ marginBottom: 8 }}>
          {NAV_ITEMS.map(({ label, page: p }) => (
            <NavItem
              key={p}
              label={label}
              active={page === p}
              onClick={() => navigate(p)}
            />
          ))}
        </div>

        {/* Categories */}
        <div style={{ padding: '0 16px 8px' }}>
          <div style={{
            fontFamily: 'var(--ui)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'var(--ink-faint)',
            textTransform: 'uppercase',
            marginBottom: 6,
            padding: '0 0 0 3px',
          }}>
            Catégories
          </div>
          {CATEGORIES.map(({ label, value }) => (
            <NavItem
              key={value}
              label={label}
              active={false}
              onClick={() => navigate('articles', { category: value })}
            />
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Citation block */}
        <div style={{
          margin: '12px 16px',
          padding: '12px 14px',
          borderLeft: '2px solid var(--gold)',
          background: 'rgba(196,149,90,0.06)',
          borderRadius: '0 4px 4px 0',
        }}>
          <p style={{
            fontFamily: 'var(--serif)',
            fontStyle: 'italic',
            fontSize: 'var(--text-sm)',
            color: 'var(--ink-light)',
            lineHeight: 1.6,
            margin: 0,
          }}>
            "{QUOTES[quoteIndex]}"
          </p>
        </div>

        {/* Footer nav */}
        <div style={{ padding: '12px 16px 24px', borderTop: '1px solid var(--border)' }}>
          <button onClick={() => navigate('about')} style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', padding: '5px 0', width: '100%', textAlign: 'left' }}>
            À propos
          </button>
          <button onClick={() => navigate('contact')} style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', padding: '5px 0', width: '100%', textAlign: 'left' }}>
            Contact
          </button>

          {isAdmin && (
            <>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button
                  onClick={() => navigate('admin')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '8px 12px',
                    background: page === 'admin' ? 'rgba(196,149,90,0.15)' : 'var(--white)',
                    border: '1px solid var(--border)', borderRadius: 6,
                    fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)',
                    color: 'var(--ink)', cursor: 'pointer', fontWeight: 500,
                  }}
                >
                  <span>📋</span> Mes publications
                </button>
                <button
                  onClick={() => navigate('settings')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '8px 12px',
                    background: page === 'settings' ? 'rgba(196,149,90,0.15)' : 'var(--white)',
                    border: '1px solid var(--border)', borderRadius: 6,
                    fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)',
                    color: 'var(--ink)', cursor: 'pointer', fontWeight: 500,
                  }}
                >
                  <span>⚙️</span> Paramètres
                </button>
                <button
                  onClick={() => navigate('editor', null)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    width: '100%', padding: '8px 12px',
                    background: 'var(--gold)', border: 'none', borderRadius: 6,
                    fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)',
                    color: '#fff', cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  + Nouvel écrit
                </button>
              </div>
              <button onClick={signOut} style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', padding: '5px 0', width: '100%', textAlign: 'left', marginTop: 6 }}>
                Déconnexion
              </button>
            </>
          )}

          {!isAdmin && isAuthenticated && (
            <button onClick={signOut} style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', padding: '5px 0', width: '100%', textAlign: 'left', marginTop: 4 }}>
              Déconnexion
            </button>
          )}

        </div>
      </nav>
    </>
  );
}
