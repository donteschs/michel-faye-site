import { useState } from 'react';
import { useApp } from '../../App';

const NAV_ITEMS = [
  { label: 'Accueil',        page: 'home' },
  { label: 'Tous les écrits', page: 'articles' },
  { label: 'À propos',       page: 'about' },
  { label: 'Contact',        page: 'contact' },
];

const CATEGORIES = [
  { label: '📔 Journaux',              value: 'Journal' },
  { label: '📖 Histoires',             value: 'Histoire' },
  { label: '📚 Livres',                value: 'Livre' },
  { label: '✍️ Réflexions politiques', value: 'Réflexion politique' },
];

export default function MobileHeader({ open, onToggle }) {
  const { page, navigate, isAdmin, isAuthenticated, signOut } = useApp();

  const go = (dest, data) => {
    navigate(dest, data);
    if (open) onToggle();
  };

  return (
    <>
      <style>{`@media(min-width:769px){.mob-header{display:none!important}}`}</style>

      {/* Fixed top bar */}
      <header
        className="mob-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          background: 'var(--cream-dark)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <button
          onClick={() => go('home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <span style={{ fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--ink)', fontWeight: 600 }}>
            Michelle <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Faye</em>
          </span>
        </button>

        {/* Burger */}
        <button
          onClick={onToggle}
          aria-label="Menu"
          aria-expanded={open}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 22,
            color: 'var(--ink)',
            padding: '4px 8px',
            lineHeight: 1,
          }}
        >
          {open ? '✕' : '☰'}
        </button>
      </header>

      {/* Dropdown overlay */}
      {open && (
        <div
          role="dialog"
          aria-label="Menu de navigation"
          aria-modal="true"
          className="mob-header"
          style={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--cream-dark)',
            zIndex: 99,
            overflowY: 'auto',
            padding: '16px 0',
          }}
        >
          {/* Main nav */}
          {NAV_ITEMS.map(({ label, page: p }) => (
            <button
              key={p}
              onClick={() => go(p)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '12px 24px',
                background: page === p ? 'rgba(196,149,90,0.10)' : 'transparent',
                borderLeft: page === p ? '3px solid var(--gold)' : '3px solid transparent',
                border: 'none',
                color: page === p ? 'var(--gold)' : 'var(--ink-light)',
                fontFamily: 'var(--ui)',
                fontSize: 'var(--text-base)',
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}

          {/* Categories */}
          <div style={{ padding: '16px 24px 8px', fontFamily: 'var(--ui)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--ink-faint)', textTransform: 'uppercase' }}>
            Catégories
          </div>
          {CATEGORIES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => go('articles', { category: value })}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px 24px',
                background: 'transparent',
                border: 'none',
                borderLeft: '3px solid transparent',
                color: 'var(--ink-light)',
                fontFamily: 'var(--ui)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}

          {/* Auth actions */}
          <div style={{ borderTop: '1px solid var(--border)', margin: '12px 0 0', padding: '12px 24px' }}>
            {isAdmin && (
              <>
                <button
                  onClick={() => go('editor')}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--gold)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 5,
                    fontFamily: 'var(--ui)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: 8,
                    textAlign: 'center',
                  }}
                >
                  Publier
                </button>
                <button onClick={() => { signOut(); onToggle(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', padding: '5px 0' }}>
                  Déconnexion
                </button>
              </>
            )}
            {!isAdmin && isAuthenticated && (
              <button onClick={() => { signOut(); onToggle(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', padding: '5px 0' }}>
                Déconnexion
              </button>
            )}
            {!isAuthenticated && (
              <button onClick={() => go('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)', fontFamily: 'var(--ui)', fontSize: 'var(--text-sm)', padding: '5px 0' }}>
                Espace admin
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
