export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start overflow-x-hidden"
      style={{
        background: 'radial-gradient(ellipse 120% 100% at 50% -10%, #1a2340 0%, #0c0f28 55%)',
        padding: '2.5rem 1.25rem 4rem',
      }}
    >
      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
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

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 500 }}>
        {children}
      </div>
    </div>
  )
}
