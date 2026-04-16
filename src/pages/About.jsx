export default function About() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 48px' }}>
      <h1 style={{
        fontFamily: 'var(--serif)',
        fontSize: 'var(--text-3xl)',
        color: 'var(--ink)',
        lineHeight: 1.2,
        marginBottom: 32,
      }}>
        À propos
      </h1>

      {/* MF Avatar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--cream-dark), var(--gold-light))',
          border: '2px solid var(--gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--serif)',
          fontSize: 'var(--text-2xl)',
          color: 'var(--ink)',
          fontWeight: 700,
        }}>
          MF
        </div>
      </div>

      {/* Intro paragraph */}
      <p style={{
        fontSize: 18,
        fontFamily: 'var(--body)',
        color: 'var(--ink)',
        lineHeight: 1.8,
        marginBottom: 32,
      }}>
        Michelle Faye consacre son écriture à préserver les fragments du temps vécu — souvenirs d'enfance, histoires familiales et reflets d'une époque révolue. Sa démarche est celle d'une femme convaincue que les mots sont le seul antidote à l'oubli. À travers ses récits, elle tisse un pont entre les générations pour que rien d'essentiel ne se perde.
      </p>

      {/* Gold citation blockquote */}
      <blockquote style={{
        borderLeft: '4px solid var(--gold)',
        background: 'var(--gold-light)',
        padding: '20px',
        borderRadius: '0 8px 8px 0',
        fontStyle: 'italic',
        fontSize: 18,
        fontFamily: 'var(--body)',
        color: 'var(--ink)',
        lineHeight: 1.8,
        margin: '0 0 40px 0',
      }}>
        « Chaque écrit est un fil tendu vers ceux qui viendront après nous. »
      </blockquote>

      {/* Section 1 */}
      <h2 style={{
        fontFamily: 'var(--serif)',
        fontSize: 'var(--text-2xl)',
        color: 'var(--ink)',
        marginBottom: 16,
      }}>
        Un engagement au quotidien
      </h2>
      <p style={{
        fontSize: 18,
        fontFamily: 'var(--body)',
        color: 'var(--ink)',
        lineHeight: 1.8,
        marginBottom: 40,
      }}>
        Chaque jour, Michelle Faye prend la plume pour capturer ce que la mémoire risque de laisser glisser entre ses doigts. Cette discipline quotidienne est pour elle un acte d'amour envers les siens et envers elle-même.
      </p>

      {/* Section 2 */}
      <h2 style={{
        fontFamily: 'var(--serif)',
        fontSize: 'var(--text-2xl)',
        color: 'var(--ink)',
        marginBottom: 16,
      }}>
        L'écriture comme héritage
      </h2>
      <p style={{
        fontSize: 18,
        fontFamily: 'var(--body)',
        color: 'var(--ink)',
        lineHeight: 1.8,
      }}>
        Les textes de Michelle Faye ne sont pas seulement des souvenirs — ils sont un legs vivant destiné aux enfants, aux petits-enfants, à tous ceux qui chercheront un jour à comprendre d'où ils viennent. Écrire, pour elle, c'est offrir aux générations futures la matière même de leur identité.
      </p>
    </div>
  );
}
