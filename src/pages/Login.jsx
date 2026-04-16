import { useState } from 'react';
import { useApp } from '../App';
import { Button, Input } from '../components/ui';
import { supabase } from '../lib/supabase';

const ADMIN_EMAIL = 'michele.fay@sfr.fr';

export default function Login() {
  const { navigate, notify } = useApp();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [form, setForm] = useState({ email: '', password: '', nom: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { data, error: err } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (err) throw err;
        if (data.user?.email === ADMIN_EMAIL) navigate('admin');
        else navigate('home');
      } else {
        const { error: err } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { display_name: form.nom } },
        });
        if (err) throw err;
        notify('Compte créé ! Vérifiez votre email pour confirmer.', 'success');
        setMode('signin');
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
    setError('');
    setForm({ email: '', password: '', nom: '' });
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '60px 24px',
      minHeight: 'calc(100vh - 80px)',
    }}>
      <div style={{
        background: 'var(--white)',
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        padding: 48,
        maxWidth: 420,
        width: '100%',
      }}>
        <h1 style={{
          fontFamily: 'var(--serif)',
          fontSize: 'var(--text-2xl)',
          color: 'var(--ink)',
          marginBottom: 8,
          lineHeight: 1.2,
        }}>
          {mode === 'signin' ? 'Connexion' : 'Créer un compte'}
        </h1>

        {/* Mode toggle */}
        <p style={{
          fontSize: 'var(--text-sm)',
          fontFamily: 'var(--ui)',
          color: 'var(--ink-light)',
          marginBottom: 28,
        }}>
          {mode === 'signin' ? (
            <>Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={toggleMode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--blue)',
                  fontFamily: 'var(--ui)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Créer un compte
              </button>
            </>
          ) : (
            <>Déjà un compte ?{' '}
              <button
                type="button"
                onClick={toggleMode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--blue)',
                  fontFamily: 'var(--ui)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Se connecter
              </button>
            </>
          )}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {mode === 'signup' && (
            <Input
              label="Prénom et nom"
              id="nom"
              value={form.nom}
              onChange={set('nom')}
              placeholder="Michelle Faye"
              required
            />
          )}

          <Input
            label="Email"
            id="email"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="votre@email.fr"
            required
          />

          <Input
            label="Mot de passe"
            id="password"
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder="••••••••"
            required
          />

          {error && (
            <p role="alert" style={{
              color: 'var(--rose)',
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--ui)',
              marginBottom: 16,
              lineHeight: 1.5,
            }}>
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {mode === 'signin' ? 'Se connecter' : 'Créer mon compte'}
          </Button>
        </form>
      </div>
    </div>
  );
}
