import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
}

const widths = { sm: 160, md: 200, lg: 260 }

export default function Logo({ size = 'md', href = '/', className = '' }: LogoProps) {
  const w = widths[size]
  const h = Math.round(w * (160 / 850))

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-wordmark.svg"
      alt="MatchWork"
      width={w}
      height={h}
      className={className}
      style={{ filter: 'drop-shadow(0 4px 20px rgba(56,189,248,0.2))', display: 'block' }}
    />
  )

  if (!href) return img

  return (
    <Link href={href} className="inline-flex items-center">
      {img}
    </Link>
  )
}
