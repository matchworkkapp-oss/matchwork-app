export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      <div className="text-center">
        <h1
          className="text-5xl font-extrabold tracking-tight mb-3"
          style={{
            fontFamily: 'var(--font-outfit)',
            background: 'linear-gradient(135deg, #38bdf8, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          MatchWork
        </h1>
        <p className="text-[#94a3b8] text-lg">
          El proyecto está corriendo. Vamos a construir algo grande.
        </p>
      </div>

      <div
        className="rounded-2xl border px-6 py-4 text-sm text-[#94a3b8]"
        style={{ background: '#0f1728', borderColor: 'rgba(148,163,184,0.1)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse inline-block" />
          <span className="text-[#4ade80] font-medium">Fase 1 en progreso</span>
        </div>
        <p>Next.js · Tailwind · Supabase</p>
      </div>
    </main>
  )
}
