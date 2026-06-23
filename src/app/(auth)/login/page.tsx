'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setLoading(false)
      setError('Email o contraseña incorrectos.')
      return
    }
    router.push('/feed')
    router.refresh()
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Logo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.25rem' }}>
        <Logo size="lg" href="/" />
      </div>

      {/* Card */}
      <div style={{
        background: '#0f1728',
        border: '1px solid rgba(148,163,184,0.12)',
        borderRadius: 24,
        padding: '2.25rem 2rem',
        boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-outfit)',
          fontSize: '1.6rem', fontWeight: 800,
          letterSpacing: '-0.03em', marginBottom: '0.4rem',
          color: '#f1f5ff',
        }}>
          Bienvenido de vuelta
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          Ingresá a tu cuenta para seguir explorando.
        </p>

        {/* Google */}
        <button onClick={handleGoogle} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, padding: '11px 16px', borderRadius: 12, cursor: 'pointer',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148,163,184,0.15)',
          color: '#f1f5ff', fontSize: '0.9rem', fontWeight: 500,
          fontFamily: 'var(--font-dm-sans)', marginBottom: '1.25rem',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}>
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.159 17.64 11.88 17.64 9.2z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continuar con Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(148,163,184,0.12)' }} />
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>o ingresá con tu email</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(148,163,184,0.12)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 500, color: '#94a3b8' }}>Email</label>
            <input
              type="email" placeholder="juan@ejemplo.com"
              value={email} onChange={e => setEmail(e.target.value)}
              autoComplete="email" required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(148,163,184,0.12)',
                color: '#f1f5ff', fontSize: '0.9375rem', outline: 'none',
                fontFamily: 'var(--font-dm-sans)',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(56,189,248,0.45)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.12)')}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 500, color: '#94a3b8' }}>Contraseña</label>
              <button type="button" style={{ fontSize: '0.78rem', color: '#38bdf8', background: 'none', border: 'none', cursor: 'pointer' }}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'} placeholder="Tu contraseña"
                value={password} onChange={e => setPassword(e.target.value)}
                autoComplete="current-password" required
                style={{
                  width: '100%', padding: '12px 44px 12px 16px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(148,163,184,0.12)',
                  color: '#f1f5ff', fontSize: '0.9375rem', outline: 'none',
                  fontFamily: 'var(--font-dm-sans)',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(56,189,248,0.45)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(148,163,184,0.12)')}
              />
              <button type="button" tabIndex={-1} onClick={() => setShowPwd(v => !v)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex',
                }}>
                {showPwd
                  ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                  : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                }
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 12, fontSize: '0.875rem', color: '#f87171',
              background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', marginTop: '0.5rem', padding: '14px',
            background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
            color: '#fff', fontSize: '0.9375rem', fontWeight: 600,
            fontFamily: 'var(--font-dm-sans)', border: 'none', borderRadius: 14,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 32px rgba(56,189,248,0.2)',
            opacity: loading ? 0.6 : 1,
            letterSpacing: '0.01em',
          }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
        ¿No tenés cuenta?{' '}
        <Link href="/registro" style={{ color: '#38bdf8', fontWeight: 500, textDecoration: 'none' }}>
          Creá una acá
        </Link>
      </p>
    </div>
  )
}
