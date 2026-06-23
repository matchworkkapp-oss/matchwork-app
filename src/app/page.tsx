'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

const HINTS = ['Preparando experiencia', 'Sincronizando preferencias', 'Listo para conectar']

export default function Home() {
  const [phase, setPhase] = useState<'splash' | 'landing'>('splash')
  const [hint, setHint] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t0 = setTimeout(() => setVisible(true), 80)
    const t1 = setInterval(() => setHint(h => (h + 1) % HINTS.length), 1600)
    const t2 = setTimeout(() => { clearInterval(t1); setPhase('landing') }, 3200)
    return () => { clearTimeout(t0); clearInterval(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'splash') return <Splash visible={visible} hint={HINTS[hint]} />
  return <Landing />
}

function Splash({ visible, hint }: { visible: boolean; hint: string }) {
  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse 120% 100% at 50% 0%, #121832 0%, #0c0f28 45%, #070b18 100%)',
      overflow: 'hidden', position: 'relative',
    }}>
      <Orbs />
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '1.35rem', textAlign: 'center', padding: '2rem 1.5rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(10px)',
        transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <Logo size="lg" />
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', maxWidth: 280, lineHeight: 1.55 }}>
          Tu perfil y la vacante se entienden antes del primer mensaje.
        </p>
        <p style={{ fontSize: '0.72rem', color: '#64748b', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
          {hint}
          <span style={{ display: 'inline-flex', gap: 4 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 4, height: 4, borderRadius: '50%', background: '#38bdf8', display: 'inline-block',
                animation: `blink 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </span>
        </p>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:0.2;transform:translateY(0)}50%{opacity:1;transform:translateY(-2px)}}`}</style>
    </main>
  )
}

function Landing() {
  return (
    <main style={{
      minHeight: '100vh', background: '#0c0f28', color: '#f1f5ff',
      fontFamily: 'var(--font-dm-sans)', overflowX: 'hidden',
      animation: 'fadeIn 0.6s ease forwards',
    }}>
      <Orbs />

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        background: 'rgba(12,15,40,0.78)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(148,163,184,0.08)',
      }}>
        <Logo size="sm" href="/" />
        <Link href="/login" style={{
          padding: '8px 18px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 500,
          border: '1px solid rgba(56,189,248,0.35)', color: '#38bdf8',
          textDecoration: 'none',
        }}>
          Ingresar
        </Link>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative', zIndex: 5, minHeight: 'calc(100vh - 57px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        padding: '3rem 1.5rem',
      }}>
        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: '#38bdf8', marginBottom: '1.25rem',
          padding: '6px 14px', borderRadius: 999,
          background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 12px #38bdf8', display: 'inline-block', animation: 'pulse-dot 2s ease infinite' }} />
          Match inteligente
        </div>

        <h1 style={{
          fontFamily: 'var(--font-outfit)',
          fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
          fontWeight: 800, lineHeight: 1.08,
          letterSpacing: '-0.03em', marginBottom: '1rem', maxWidth: 640,
        }}>
          Solo lo que<br />
          <span style={{ background: 'linear-gradient(115deg, #38bdf8 0%, #818cf8 45%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            realmente te aplica.
          </span>
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: 1.65, maxWidth: '26rem', marginBottom: '2.25rem' }}>
          Conectamos personas y empresas por compatibilidad real.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Link href="/registro?rol=candidato" style={{
            padding: '14px 28px', borderRadius: 14, fontSize: '1rem', fontWeight: 600,
            background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)', color: '#fff',
            textDecoration: 'none', boxShadow: '0 12px 40px rgba(56,189,248,0.22)',
            letterSpacing: '0.01em',
          }}>
            Soy candidato
          </Link>
          <Link href="/registro?rol=empresa" style={{
            padding: '14px 28px', borderRadius: 14, fontSize: '1rem', fontWeight: 600,
            background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: '#fff',
            textDecoration: 'none', boxShadow: '0 12px 40px rgba(168,85,247,0.22)',
            letterSpacing: '0.01em',
          }}>
            Soy empresa
          </Link>
        </div>

        <Link href="/login" style={{ fontSize: '0.9rem', color: '#64748b', textDecoration: 'none' }}>
          ¿Ya tenés cuenta?{' '}
          <span style={{ color: '#38bdf8', fontWeight: 600 }}>Iniciá sesión</span>
        </Link>
      </section>

      <footer style={{
        position: 'relative', zIndex: 5, textAlign: 'center',
        padding: '1.5rem', borderTop: '1px solid rgba(148,163,184,0.08)',
        color: '#64748b', fontSize: '0.8125rem',
      }}>
        Hecho con intención · <span style={{ color: '#38bdf8', fontWeight: 500 }}>MatchWork</span> © 2026
      </footer>

      <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse-dot{50%{opacity:0.35}}
      `}</style>
    </main>
  )
}

function Orbs() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      <div style={{ position: 'absolute', borderRadius: '50%', width: 'min(90vw,420px)', height: 'min(90vw,420px)', top: '-18%', left: '-15%', background: 'rgba(87,144,255,0.12)', filter: 'blur(100px)' }} />
      <div style={{ position: 'absolute', borderRadius: '50%', width: 'min(70vw,320px)', height: 'min(70vw,320px)', bottom: '-8%', right: '-12%', background: 'rgba(157,82,255,0.1)', filter: 'blur(100px)' }} />
    </div>
  )
}
