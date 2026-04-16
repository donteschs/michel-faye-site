import { useState } from 'react';
import { useApp } from '../App';
import { Button, Input } from '../components/ui';

export default function Contact() {
  const { notify } = useApp();
  const [form, setForm] = useState({ nom: '', email: '', message: '' });
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.nom.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Veuillez remplir tous les champs avant d\'envoyer.');
      return;
    }

    notify('Votre message a bien été envoyé !', 'success');
    setForm({ nom: '', email: '', message: '' });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 48px' }}>
      <h1 style={{
        fontFamily: 'var(--serif)',
        fontSize: 'var(--text-3xl)',
        color: 'var(--ink)',
        lineHeight: 1.2,
        marginBottom: 8,
      }}>
        Contact
      </h1>
      <p style={{
        fontSize: 18,
        fontFamily: 'var(--body)',
        color: 'var(--ink-light)',
        lineHeight: 1.8,
        marginBottom: 36,
      }}>
        Vous souhaitez laisser un message à Michelle Faye ? N'hésitez pas à écrire.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Nom"
          id="nom"
          value={form.nom}
          onChange={set('nom')}
          placeholder="Votre nom"
          required
        />
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
          label="Message"
          id="message"
          multiline
          rows={5}
          value={form.message}
          onChange={set('message')}
          placeholder="Votre message…"
          required
        />

        {error && (
          <p role="alert" style={{
            color: 'var(--rose)',
            fontSize: 'var(--text-sm)',
            marginBottom: 16,
            fontFamily: 'var(--ui)',
          }}>
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" size="md">
          Envoyer le message
        </Button>
      </form>
    </div>
  );
}
