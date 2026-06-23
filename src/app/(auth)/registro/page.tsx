'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Logo from '@/components/Logo'
import { createClient } from '@/lib/supabase/client'

type Role = 'candidate' | 'recruiter'
type Step = 1 | 2 | 'verify'

const PWD_RULES = [
  { id: 'len',     label: 'Mínimo 8 caracteres',          test: (v: string) => v.length >= 8 },
  { id: 'upper',   label: 'Al menos una mayúscula',        test: (v: string) => /[A-Z]/.test(v) },
  { id: 'num',     label: 'Al menos un número',            test: (v: string) => /[0-9]/.test(v) },
  { id: 'special', label: 'Al menos un carácter especial', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
]

const card: React.CSSProperties = {
  background: '#0f1728',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: 24,
  padding: '2rem 1.75rem',
  boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
}
const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '11px 16px',
  borderRadius: 12,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(148,163,184,0.12)',
  color: '#f1f5ff',
  fontSize: '0.9375rem',
  outline: 'none',
  fontFamily: 'var(--font-dm-sans)',
}
const inputErr: React.CSSProperties = { border: '1px solid rgba(248,113,113,0.45)' }
const lbl: React.CSSProperties = { fontSize: '0.82rem', fontWeight: 500, color: '#94a3b8', display: 'block', marginBottom: 5 }
const ferr: React.CSSProperties = { fontSize: '0.78rem', color: '#f87171', marginTop: 3 }

const EyeOff = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>
  </svg>
)
const EyeOn = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
)

function RegistroContent() {
  const params = useSearchParams()
  const supabase = createClient()

  const initialRole: Role = params.get('rol') === 'empresa' ? 'recruiter' : 'candidate'
  const [role, setRole] = useState<Role>(initialRole)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirmPassword: '',
    birthdate: '', terms: false,
  })
  const [pwdFocus, setPwdFocus] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const isCandidate = role === 'candidate'
  const accent = isCandidate ? '#38bdf8' : '#a855f7'

  function setField(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
    setFieldErrors(e => ({ ...e, [field]: '' }))
  }

  function validateStep1() {
    const errs: Record<string, string> = {}
    if (!form.firstName.trim()) errs.firstName = 'Ingresá tu nombre'
    if (!form.lastName.trim()) errs.lastName = 'Ingresá tu apellido'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email inválido'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  function validateStep2() {
    const errs: Record<string, string> = {}
    if (!PWD_RULES.every(r => r.test(form.password))) errs.password = 'La contraseña no cumple los requisitos'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden'
    if (!form.birthdate) {
      errs.birthdate = 'Ingresá tu fecha de nacimiento'
    } else {
      const birth = new Date(form.birthdate)
      const cutoff = new Date()
      cutoff.setFullYear(cutoff.getFullYear() - 18)
      if (birth > cutoff) errs.birthdate = 'Tenés que ser mayor de 18 años'
    }
    if (!form.terms) errs.terms = 'Aceptá los términos para continuar'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    if (validateStep1()) { setError(''); setStep(2) }
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault()
    if (!validateStep2()) return
    setLoading(true)
    setError('')
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: `${form.firstName.trim()} ${form.lastName.trim()}`, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)
    if (signUpError) {
      setError(signUpError.message.includes('already registered')
        ? 'Ya existe una cuenta con ese email.'
        : signUpError.message)
      return
    }
    setStep('verify')
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { role },
      },
    })
  }

  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() - 18)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  // ── Shared header ────────────────────────────────────────────────────────────
  const Header = () => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.25rem' }}>
      <Logo size="lg" href="/" />
    </div>
  )

  const RoleBadge = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 11px', borderRadius: 999,
        fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
        background: isCandidate ? 'rgba(56,189,248,0.1)' : 'rgba(168,85,247,0.1)',
        border: `1px solid ${isCandidate ? 'rgba(56,189,248,0.25)' : 'rgba(168,85,247,0.25)'}`,
        color: accent,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, boxShadow: `0 0 8px ${accent}` }} />
        {isCandidate ? 'Candidato' : 'Empresa'}
      </span>
      <button onClick={() => setShowRoleModal(true)}
        style={{ fontSize: '0.78rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-dm-sans)' }}>
        {isCandidate ? '¿Sos empresa? →' : '¿Sos candidato? →'}
      </button>
    </div>
  )

  const GoogleBtn = () => (
    <button onClick={handleGoogle} style={{
      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 10, padding: '11px 16px', borderRadius: 12, cursor: 'pointer',
      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148,163,184,0.15)',
      color: '#f1f5ff', fontSize: '0.9rem', fontWeight: 500,
      fontFamily: 'var(--font-dm-sans)', marginBottom: '1.1rem',
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
  )

  const Divider = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.1rem' }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(148,163,184,0.12)' }} />
      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>o registrate con tu email</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(148,163,184,0.12)' }} />
    </div>
  )

  const ProgressDots = ({ current }: { current: 1 | 2 }) => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: '0.9rem' }}>
      {[1, 2].map(n => (
        <div key={n} style={{
          width: n === current ? 20 : 6, height: 6, borderRadius: 999,
          background: n === current ? accent : 'rgba(148,163,184,0.2)',
          transition: 'all 0.3s',
        }} />
      ))}
    </div>
  )

  // ── VERIFY SCREEN ────────────────────────────────────────────────────────────
  if (step === 'verify') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <Header />
        <div style={{ ...card, textAlign: 'center' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', margin: '0 auto 1.1rem',
            background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)',
          }}>✉️</div>
          <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.4rem', color: '#f1f5ff' }}>
            Revisá tu mail
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Te enviamos un link a <strong style={{ color: '#f1f5ff' }}>{form.email}</strong>.<br />
            Hacé click en el link para activar tu cuenta.
          </p>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
            ¿No llegó?{' '}
            <button
              style={{ color: '#38bdf8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-dm-sans)' }}
              onClick={() => supabase.auth.resend({ type: 'signup', email: form.email })}>
              Reenviar
            </button>
          </p>
        </div>
      </div>
    )
  }

  // ── STEP 1: Datos básicos ────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Header />
        <div style={card}>
          <RoleBadge />
          <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.3rem', color: '#f1f5ff' }}>
            {isCandidate ? 'Creá tu cuenta' : 'Creá la cuenta de tu empresa'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            {isCandidate ? 'Tu próxima oportunidad te está esperando.' : 'Empezá a encontrar el talento que encaja con tu equipo.'}
          </p>

          <GoogleBtn />
          <Divider />

          <form onSubmit={handleStep1} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Nombre + Apellido */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={lbl}>Nombre <span style={{ color: accent }}>*</span></label>
                <input
                  placeholder="Juan" value={form.firstName}
                  onChange={e => setField('firstName', e.target.value)}
                  autoComplete="given-name"
                  style={{ ...inputBase, ...(fieldErrors.firstName ? inputErr : {}) }}
                  onFocus={e => { if (!fieldErrors.firstName) e.target.style.borderColor = 'rgba(56,189,248,0.45)' }}
                  onBlur={e => { if (!fieldErrors.firstName) e.target.style.borderColor = 'rgba(148,163,184,0.12)' }}
                />
                {fieldErrors.firstName && <p style={ferr}>{fieldErrors.firstName}</p>}
              </div>
              <div>
                <label style={lbl}>Apellido <span style={{ color: accent }}>*</span></label>
                <input
                  placeholder="García" value={form.lastName}
                  onChange={e => setField('lastName', e.target.value)}
                  autoComplete="family-name"
                  style={{ ...inputBase, ...(fieldErrors.lastName ? inputErr : {}) }}
                  onFocus={e => { if (!fieldErrors.lastName) e.target.style.borderColor = 'rgba(56,189,248,0.45)' }}
                  onBlur={e => { if (!fieldErrors.lastName) e.target.style.borderColor = 'rgba(148,163,184,0.12)' }}
                />
                {fieldErrors.lastName && <p style={ferr}>{fieldErrors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={lbl}>Email <span style={{ color: accent }}>*</span></label>
              <input
                type="email" placeholder="juan@ejemplo.com"
                value={form.email} onChange={e => setField('email', e.target.value)}
                autoComplete="email"
                style={{ ...inputBase, ...(fieldErrors.email ? inputErr : {}) }}
                onFocus={e => { if (!fieldErrors.email) e.target.style.borderColor = 'rgba(56,189,248,0.45)' }}
                onBlur={e => { if (!fieldErrors.email) e.target.style.borderColor = 'rgba(148,163,184,0.12)' }}
              />
              {fieldErrors.email && <p style={ferr}>{fieldErrors.email}</p>}
            </div>

            <button type="submit" style={{
              width: '100%', marginTop: '0.25rem', padding: '13px',
              background: isCandidate ? 'linear-gradient(135deg, #38bdf8, #8b5cf6)' : 'linear-gradient(135deg, #a855f7, #6366f1)',
              color: '#fff', fontSize: '0.9375rem', fontWeight: 600,
              fontFamily: 'var(--font-dm-sans)', border: 'none', borderRadius: 14, cursor: 'pointer',
              boxShadow: isCandidate ? '0 8px 32px rgba(56,189,248,0.2)' : '0 8px 32px rgba(168,85,247,0.2)',
              letterSpacing: '0.01em',
            }}>
              Continuar →
            </button>

            <ProgressDots current={1} />
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" style={{ color: accent, fontWeight: 500, textDecoration: 'none' }}>Ingresá acá</Link>
        </p>

        <RoleModal />
      </div>
    )
  }

  // ── STEP 2: Contraseña + Fecha + Términos ────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Header />
      <div style={card}>
        {/* Back + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.1rem' }}>
          <button onClick={() => { setStep(1); setError('') }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148,163,184,0.12)',
              color: '#94a3b8', cursor: 'pointer',
            }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <div>
            <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#f1f5ff', lineHeight: 1.1 }}>
              Casi listo
            </h1>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>
              Hola, <strong style={{ color: '#94a3b8' }}>{form.firstName}</strong> · {form.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleStep2} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

          {/* Contraseña */}
          <div>
            <label style={lbl}>Contraseña <span style={{ color: accent }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="Creá una contraseña segura"
                value={form.password} onChange={e => setField('password', e.target.value)}
                onFocus={() => setPwdFocus(true)}
                autoComplete="new-password"
                style={{ ...inputBase, paddingRight: 44, ...(fieldErrors.password ? inputErr : {}) }}
              />
              <button type="button" tabIndex={-1} onClick={() => setShowPwd(v => !v)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
                {showPwd ? <EyeOff /> : <EyeOn />}
              </button>
            </div>
            {(pwdFocus || form.password) && (
              <div style={{
                marginTop: 6, padding: '8px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148,163,184,0.08)',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px',
              }}>
                {PWD_RULES.map(rule => {
                  const ok = rule.test(form.password)
                  return (
                    <div key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: ok ? '#34d399' : '#64748b' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{ok ? '✓' : '·'}</span>
                      {rule.label}
                    </div>
                  )
                })}
              </div>
            )}
            {fieldErrors.password && <p style={ferr}>{fieldErrors.password}</p>}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label style={lbl}>Confirmá tu contraseña <span style={{ color: accent }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPwd ? 'text' : 'password'}
                placeholder="Repetí tu contraseña"
                value={form.confirmPassword} onChange={e => setField('confirmPassword', e.target.value)}
                autoComplete="new-password"
                style={{ ...inputBase, paddingRight: 44, ...(fieldErrors.confirmPassword ? inputErr : {}) }}
              />
              <button type="button" tabIndex={-1} onClick={() => setShowConfirmPwd(v => !v)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
                {showConfirmPwd ? <EyeOff /> : <EyeOn />}
              </button>
            </div>
            {fieldErrors.confirmPassword && <p style={ferr}>{fieldErrors.confirmPassword}</p>}
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label style={lbl}>Fecha de nacimiento <span style={{ color: accent }}>*</span></label>
            <input
              type="date" max={maxDateStr}
              value={form.birthdate} onChange={e => setField('birthdate', e.target.value)}
              style={{ ...inputBase, colorScheme: 'dark', ...(fieldErrors.birthdate ? inputErr : {}) }}
            />
            {fieldErrors.birthdate
              ? <p style={ferr}>{fieldErrors.birthdate}</p>
              : <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 3 }}>Tenés que ser mayor de 18 años.</p>
            }
          </div>

          {/* Términos */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <input
              type="checkbox" id="terms" checked={form.terms}
              onChange={e => setField('terms', e.target.checked)}
              style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0, accentColor: accent, cursor: 'pointer' }}
            />
            <label htmlFor="terms" style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, cursor: 'pointer' }}>
              Acepto los{' '}
              <a href="#" style={{ color: accent, textDecoration: 'none' }}>Términos y condiciones</a>
              {' '}y la{' '}
              <a href="#" style={{ color: accent, textDecoration: 'none' }}>Política de privacidad</a>.
            </label>
          </div>
          {fieldErrors.terms && <p style={{ ...ferr, marginTop: -4 }}>{fieldErrors.terms}</p>}

          {error && (
            <div style={{
              padding: '11px 16px', borderRadius: 12, fontSize: '0.875rem', color: '#f87171',
              background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', marginTop: '0.25rem', padding: '13px',
            background: isCandidate ? 'linear-gradient(135deg, #38bdf8, #8b5cf6)' : 'linear-gradient(135deg, #a855f7, #6366f1)',
            color: '#fff', fontSize: '0.9375rem', fontWeight: 600,
            fontFamily: 'var(--font-dm-sans)', border: 'none', borderRadius: 14,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: isCandidate ? '0 8px 32px rgba(56,189,248,0.2)' : '0 8px 32px rgba(168,85,247,0.2)',
            opacity: loading ? 0.6 : 1, letterSpacing: '0.01em',
          }}>
            {loading ? 'Creando cuenta...' : isCandidate ? 'Crear mi cuenta' : 'Crear cuenta de empresa'}
          </button>

          <ProgressDots current={2} />
        </form>
      </div>

      <RoleModal />
    </div>
  )

  // ── Role modal ───────────────────────────────────────────────────────────────
  function RoleModal() {
    if (!showRoleModal) return null
    return (
      <div
        onClick={() => setShowRoleModal(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
          background: 'rgba(8,12,26,0.85)', backdropFilter: 'blur(8px)',
        }}>
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 340, borderRadius: 24, padding: '1.75rem',
            background: '#111827', border: '1px solid rgba(148,163,184,0.15)',
            textAlign: 'center',
          }}>
          <div style={{ fontSize: '2.25rem', marginBottom: '0.65rem' }}>🙈</div>
          <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', color: '#f1f5ff' }}>
            ¡Casi! Te fuiste de rol
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            ¿Querés cambiar a <strong style={{ color: '#f1f5ff' }}>{isCandidate ? 'Empresa' : 'Candidato'}</strong> o seguís como vas?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={() => { setRole(isCandidate ? 'recruiter' : 'candidate'); setShowRoleModal(false) }}
              style={{
                padding: '12px', borderRadius: 12, fontWeight: 600, color: '#fff', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
                fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem',
              }}>
              Cambiar a {isCandidate ? 'Empresa' : 'Candidato'}
            </button>
            <button
              onClick={() => setShowRoleModal(false)}
              style={{
                padding: '12px', borderRadius: 12, fontSize: '0.875rem', color: '#94a3b8', cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(148,163,184,0.12)',
                fontFamily: 'var(--font-dm-sans)',
              }}>
              No, estoy bien acá 👍
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default function RegistroPage() {
  return (
    <Suspense fallback={null}>
      <RegistroContent />
    </Suspense>
  )
}
