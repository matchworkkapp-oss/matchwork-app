'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Home() {
  const [phase, setPhase] = useState<'splash' | 'landing'>('splash')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Logo fade in
    const t1 = setTimeout(() => setVisible(true), 100)
    // After 2.5s transition to landing
    const t2 = setTimeout(() => setPhase('landing'), 2600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: phase === 'splash' ? 'center' : 'flex-start',
      padding: phase === 'splash' ? '2rem' : '0',
      background: 'radial-gradient(ellipse 120% 100% at 50% -10%, #1a2340 0%, #0c0f28 55%)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'justify-content 0.6s ease, padding 0.6s ease',
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

      {/* ── SPLASH ── */}
      {phase === 'splash' && (
        <div style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}>
          <Logo size="lg" />
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i === 0 ? '#38bdf8' : 'rgba(148,163,184,0.3)',
                animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ── LANDING ── */}
      {phase === 'landing' && (
        <div style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: 500,
          display: 'flex', flexDirection: 'column',
          minHeight: '100vh',
          padding: '3rem 1.5rem 2.5rem',
          animation: 'fadeUp 0.6s ease forwards',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
            <Logo size="lg" />
          </div>

          {/* Tagline */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: '2rem', fontWeight: 800,
              letterSpacing: '-0.04em', color: '#f1f5ff',
              lineHeight: 1.15, marginBottom: '0.75rem',
            }}>
              El trabajo que buscás,<br />a un swipe de distancia.
            </h1>
            <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1.5 }}>
              ¿Cómo querés usar MatchWork?
            </p>
          </div>

          {/* Role cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 'auto' }}>

            {/* Candidato */}
            <Link href="/registro?rol=candidato" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '1.25rem 1.5rem',
                background: '#0f1728',
                border: '1px solid rgba(56,189,248,0.2)',
                borderRadius: 20,
                display: 'flex', alignItems: 'center', gap: 16,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 24px rgba(56,189,248,0.05)',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(56,189,248,0.5)'
                  e.currentTarget.style.background = 'rgba(56,189,248,0.06)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(56,189,248,0.2)'
                  e.currentTarget.style.background = '#0f1728'
                }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: 'rgba(56,189,248,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="24" height="24" fill="none" stroke="#38bdf8" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5ff', marginBottom: 2 }}>
                    Soy candidato
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Buscá tu próximo trabajo
                  </div>
                </div>
                <svg width="18" height="18" fill="none" stroke="#38bdf8" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </Link>

            {/* Empresa */}
            <Link href="/registro?rol=empresa" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '1.25rem 1.5rem',
                background: '#0f1728',
                border: '1px solid rgba(168,85,247,0.2)',
                borderRadius: 20,
                display: 'flex', alignItems: 'center', gap: 16,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 24px rgba(168,85,247,0.05)',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'
                  e.currentTarget.style.background = 'rgba(168,85,247,0.06)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(168,85,247,0.2)'
                  e.currentTarget.style.background = '#0f1728'
                }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: 'rgba(168,85,247,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="24" height="24" fill="none" stroke="#a855f7" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5ff', marginBottom: 2 }}>
                    Soy empresa
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Encontrá el talento que encaja
                  </div>
                </div>
                <svg width="18" height="18" fill="none" stroke="#a855f7" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </Link>
          </div>

          {/* Ya tengo cuenta */}
          <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
            <Link href="/login" style={{
              fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'none',
            }}>
              ¿Ya tenés cuenta?{' '}
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>Iniciá sesión</span>
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}
