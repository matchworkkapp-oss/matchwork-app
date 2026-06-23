'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

// ── Splash → Landing after 3.2s ─────────────────────────────────────────────

const HINTS = ['Preparando experiencia', 'Sincronizando preferencias', 'Listo para conectar']

export default function Home() {
  const [phase, setPhase] = useState<'splash' | 'landing'>('splash')
  const [hint, setHint] = useState(0)
  const [logoVisible, setLogoVisible] = useState(false)

  useEffect(() => {
    const t0 = setTimeout(() => setLogoVisible(true), 80)
    const t1 = setInterval(() => setHint(h => (h + 1) % HINTS.length), 1600)
    const t2 = setTimeout(() => { clearInterval(t1); setPhase('landing') }, 3200)
    return () => { clearTimeout(t0); clearInterval(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'splash') return <Splash logoVisible={logoVisible} hint={HINTS[hint]} />
  return <Landing />
}

// ── Splash ───────────────────────────────────────────────────────────────────

function Splash({ logoVisible, hint }: { logoVisible: boolean; hint: string }) {
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
        opacity: logoVisible ? 1 : 0,
        transform: logoVisible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(10px)',
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
                width: 4, height: 4, borderRadius: '50%', background: '#38bdf8',
                display: 'inline-block',
                animation: `blink 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </span>
        </p>
      </div>
      <style>{`
        @keyframes blink { 0%,100%{opacity:0.2;transform:translateY(0)} 50%{opacity:1;transform:translateY(-2px)} }
      `}</style>
    </main>
  )
}

// ── Landing ──────────────────────────────────────────────────────────────────

function Landing() {
  return (
    <main style={{
      minHeight: '100vh', background: '#0c0f28',
      color: '#f1f5ff', fontFamily: 'var(--font-dm-sans)',
      overflowX: 'hidden',
      animation: 'fadeIn 0.6s ease forwards',
    }}>
      <Orbs />

      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(56,189,248,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.035) 1px,transparent 1px)',
        backgroundSize: '56px 56px',
        maskImage: 'radial-gradient(ellipse 100% 80% at 50% -10%, black 40%, transparent 75%)',
      }} />

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        background: 'rgba(12,15,40,0.78)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(148,163,184,0.08)',
      }}>
        <Logo size="sm" href="/" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/login" style={{
            padding: '8px 18px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 500,
            border: '1px solid rgba(56,189,248,0.35)', color: '#38bdf8',
            textDecoration: 'none', background: 'transparent',
          }}>
            Ingresar
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative', zIndex: 5,
        maxWidth: 1120, margin: '0 auto',
        padding: '2.5rem 1.5rem 3rem',
        display: 'grid', gap: '2.5rem', alignItems: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#38bdf8', marginBottom: '1.25rem',
            padding: '6px 14px', borderRadius: 999,
            background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 12px #38bdf8', animation: 'pulse-dot 2s ease infinite', display: 'inline-block' }} />
            Match inteligente
          </div>

          <h1 style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: 'clamp(2.15rem, 5.5vw, 3.25rem)',
            fontWeight: 800, lineHeight: 1.08,
            letterSpacing: '-0.03em', marginBottom: '1.1rem',
          }}>
            Solo lo que<br />
            <span style={{
              background: 'linear-gradient(115deg, #38bdf8 0%, #818cf8 45%, #a855f7 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              realmente te aplica.
            </span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#7c8798', lineHeight: 1.65, maxWidth: '28rem', margin: '0 auto 1.75rem' }}>
            Conectamos personas y empresas por compatibilidad real. Sin postulaciones a ciegas, sin formularios eternos, sin ghosting.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'stretch', maxWidth: 360, margin: '0 auto' }}>
            <Link href="/registro?rol=candidato" style={{
              padding: '14px 22px', borderRadius: 12, fontSize: '0.9375rem', fontWeight: 500,
              background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)', color: '#fff',
              textDecoration: 'none', textAlign: 'center',
              boxShadow: '0 12px 40px rgba(56,189,248,0.22)',
            }}>
              Soy candidato
            </Link>
            <Link href="/registro?rol=empresa" style={{
              padding: '14px 22px', borderRadius: 12, fontSize: '0.9375rem', fontWeight: 500,
              background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: '#fff',
              textDecoration: 'none', textAlign: 'center',
              boxShadow: '0 12px 40px rgba(168,85,247,0.22)',
            }}>
              Soy empresa
            </Link>
          </div>

          <p style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: '#64748b' }}>
            PWA · Sin tienda de apps · Tus datos con control y transparencia
          </p>
        </div>

        {/* Device mockup */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '100%', maxWidth: 300,
            background: 'linear-gradient(165deg, #131a24, #0f1419)',
            border: '1px solid rgba(56,189,248,0.12)',
            borderRadius: 28, padding: 14,
            boxShadow: '0 0 0 1px rgba(56,189,248,0.05) inset, 0 32px 80px rgba(0,0,0,0.45)',
          }}>
            <div style={{
              background: 'rgba(8,12,22,0.85)', borderRadius: 18, padding: 18,
              border: '1px solid rgba(148,163,184,0.1)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #38bdf8, #a855f7)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'linear-gradient(135deg, #38bdf8, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-outfit)', fontWeight: 800, fontSize: 13, color: '#fff',
                }}>TC</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>Data Engineer Sr</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>TechCorp · Remoto · USD 3.500</div>
                </div>
                <div style={{
                  background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)',
                  borderRadius: 20, padding: '6px 11px', fontSize: 13, fontWeight: 700,
                  fontFamily: 'var(--font-outfit)', color: '#38bdf8',
                }}>87%</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {['SQL', 'Python', 'Linux'].map(s => (
                  <span key={s} style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 100, padding: '4px 10px', fontSize: 11, color: '#38bdf8' }}>{s}</span>
                ))}
                {['Airflow', 'dbt'].map(s => (
                  <span key={s} style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 100, padding: '4px 10px', fontSize: 11, color: '#c4b5fd' }}>{s}</span>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 5, marginBottom: 14, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '87%', background: 'linear-gradient(90deg, #38bdf8, #a855f7)', borderRadius: 4 }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ flex: 1, padding: 10, borderRadius: 10, border: 'none', fontSize: 13, background: 'rgba(255,255,255,0.06)', color: '#64748b', fontFamily: 'var(--font-dm-sans)' }}>Pasar</button>
                <button style={{ flex: 1, padding: 10, borderRadius: 10, border: 'none', fontSize: 13, background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)', color: '#fff', fontFamily: 'var(--font-dm-sans)', fontWeight: 500 }}>Postularme</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section style={{ position: 'relative', zIndex: 5, padding: '4rem 1.5rem', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.18em', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>Cómo funciona</div>
        <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(1.65rem, 4vw, 2.35rem)', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.15, letterSpacing: '-0.03em' }}>
          Compatibilidad que se entiende a primera vista
        </h2>
        <p style={{ color: '#7c8798', fontSize: '0.98rem', lineHeight: 1.65, maxWidth: '32rem', marginBottom: '2.25rem' }}>
          El porcentaje resume alineación de skills y requisitos. El resto es conversación humana.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {[
            { icon: '%', bg: 'rgba(56,189,248,0.1)', title: 'Match visible desde el feed', desc: 'Ves el encaje antes de postularte. Sabés qué suma y qué te falta para ese rol.' },
            { icon: '◇', bg: 'rgba(168,85,247,0.1)', title: 'Chat con contexto', desc: 'Cuando hay match, el mensaje arranca con información útil, no con plantillas vacías.' },
            { icon: '→', bg: 'rgba(34,211,238,0.08)', title: 'Estado claro del proceso', desc: 'Si no avanza, sabés por qué. Respeto por el tiempo de candidatos y equipos.' },
            { icon: '+', bg: 'rgba(52,211,153,0.1)', title: 'Crecimiento con cada búsqueda', desc: 'Skills faltantes enlazan a micro-aprendizaje cuando encaja con tu roadmap.' },
          ].map(f => (
            <div key={f.title} style={{
              background: '#0f1419', border: '1px solid rgba(148,163,184,0.1)',
              borderRadius: 16, padding: '1.35rem',
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: '0.85rem' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.95rem', fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: '0.8125rem', color: '#7c8798', lineHeight: 1.55 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Role cards */}
      <section style={{ position: 'relative', zIndex: 5, padding: '0 1.5rem 4.5rem', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
          <div style={{ background: '#0f1419', border: '1px solid rgba(56,189,248,0.22)', borderRadius: 20, padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
            <span style={{ display: 'inline-block', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 999, marginBottom: '0.85rem', fontWeight: 600, width: 'fit-content', background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)' }}>Candidatos</span>
            <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Tu perfil habla por vos</h3>
            <p style={{ fontSize: '0.8125rem', color: '#7c8798', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>Skills, experiencia y tono laboral en un solo flujo. Oportunidades ordenadas por compatibilidad, no por ruido de keywords.</p>
            <Link href="/registro?rol=candidato" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 12, fontSize: '0.875rem', fontWeight: 500, background: 'linear-gradient(135deg, #38bdf8, #6366f1)', color: '#fff', textDecoration: 'none' }}>
              Empezar como candidato
            </Link>
          </div>
          <div style={{ background: '#0f1419', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 20, padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
            <span style={{ display: 'inline-block', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 999, marginBottom: '0.85rem', fontWeight: 600, width: 'fit-content', background: 'rgba(168,85,247,0.1)', color: '#c4b5fd', border: '1px solid rgba(168,85,247,0.22)' }}>Empresas</span>
            <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Vacantes que atraen al perfil correcto</h3>
            <p style={{ fontSize: '0.8125rem', color: '#7c8798', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>Definí el rol, los must-have y el fit cultural. Los candidatos llegan rankeados por score, no por azar.</p>
            <Link href="/registro?rol=empresa" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 12, fontSize: '0.875rem', fontWeight: 500, background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: '#fff', textDecoration: 'none' }}>
              Empezar como empresa
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '1.75rem 1.5rem', borderTop: '1px solid rgba(148,163,184,0.08)', color: '#64748b', fontSize: '0.8125rem' }}>
        Hecho con intención · <span style={{ color: '#38bdf8', fontWeight: 500 }}>MatchWork</span> © 2026
      </footer>

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulse-dot { 50%{opacity:0.35} }
      `}</style>
    </main>
  )
}

// ── Shared ───────────────────────────────────────────────────────────────────

function Orbs() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      <div style={{ position: 'absolute', borderRadius: '50%', width: 'min(90vw,420px)', height: 'min(90vw,420px)', top: '-18%', left: '-15%', background: 'rgba(87,144,255,0.12)', filter: 'blur(100px)' }} />
      <div style={{ position: 'absolute', borderRadius: '50%', width: 'min(70vw,320px)', height: 'min(70vw,320px)', bottom: '-8%', right: '-12%', background: 'rgba(157,82,255,0.1)', filter: 'blur(100px)' }} />
    </div>
  )
}
