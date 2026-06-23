import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      background: 'radial-gradient(ellipse 120% 100% at 50% -10%, #1a2340 0%, #0c0f28 55%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', borderRadius: '50%',
          width: 500, height: 500, top: '-10%', left: '-10%',
          background: 'rgba(56,189,248,0.07)', filter: 'blur(130px)',
        }} />
        <div style={{
          position: 'absolute', borderRadius: '50%',
          width: 420, height: 420, bottom: '-5%', right: '-8%',
          background: 'rgba(168,85,247,0.07)', filter: 'blur(130px)',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', textAlign: 'center', maxWidth: 480, width: '100%' }}>
        <Logo size="lg" href="/" />

        <div>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.6 }}>
            El trabajo que buscás, a un swipe de distancia.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <Link href="/registro" style={{
            display: 'block', width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
            color: '#fff', fontSize: '0.9375rem', fontWeight: 600,
            fontFamily: 'var(--font-dm-sans)', borderRadius: 14, textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(56,189,248,0.2)',
            letterSpacing: '0.01em',
          }}>
            Empezar gratis
          </Link>
          <Link href="/login" style={{
            display: 'block', width: '100%', padding: '14px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(148,163,184,0.15)',
            color: '#f1f5ff', fontSize: '0.9375rem', fontWeight: 500,
            fontFamily: 'var(--font-dm-sans)', borderRadius: 14, textDecoration: 'none',
          }}>
            Iniciar sesión
          </Link>
        </div>
      </div>
    </main>
  )
}
