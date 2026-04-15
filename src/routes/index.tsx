import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { IndicesSection } from '@/components/IndicesSection'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const stats = [
    { label: t('hero.stat_1_label'), value: '$2.47B', suffix: '' },
    { label: t('hero.stat_2_label'), value: '6', suffix: '' },
    { label: t('hero.stat_3_label'), value: '+18.3', suffix: '%' },
  ]

  const pillars = [
    {
      icon: Shield,
      title: 'Non-Custodial',
      desc: 'Assets remain in your wallet. No third-party custody. No counterparty risk.',
    },
    {
      icon: TrendingUp,
      title: 'Precision Weighting',
      desc: 'Indices rebalanced algorithmically using liquidity-adjusted market cap methodology.',
    },
    {
      icon: Zap,
      title: 'On-Chain Execution',
      desc: 'All operations executed directly on-chain via audited smart contract infrastructure.',
    },
  ]

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
      {/* Hero */}
      <section
        style={{
          padding: 'clamp(4rem, 10vw, 8rem) 0 clamp(3rem, 6vw, 5rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid decoration */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            pointerEvents: 'none',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: '820px' }}>
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.3rem 0.875rem',
              border: '1px solid var(--gold-border)',
              borderRadius: '2px',
              marginBottom: '2rem',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.5s, transform 0.5s',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--gold)' }} className="pulse-gold" />
            <span
              style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                color: 'var(--gold)',
                textTransform: 'uppercase',
              }}
            >
              {t('hero.eyebrow')}
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(3rem, 8vw, 6.5rem)',
              fontWeight: 600,
              lineHeight: 1.05,
              color: 'var(--text)',
              margin: '0 0 1.5rem',
              whiteSpace: 'pre-line',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s 0.1s, transform 0.6s 0.1s',
            }}
          >
            {t('hero.title').split('\n').map((line, i) =>
              i === 0 ? (
                <span key={i}>
                  {line.split(' ').map((word, j) =>
                    j === 0 ? <span key={j} className="text-gradient-gold">{word} </span> : <span key={j}>{word}</span>
                  )}
                  {'\n'}
                </span>
              ) : (
                <span key={i}>{line}</span>
              )
            )}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
              color: 'var(--text-2)',
              lineHeight: 1.7,
              maxWidth: '620px',
              margin: '0 0 2.5rem',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s 0.2s, transform 0.6s 0.2s',
            }}
          >
            {t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              gap: '0.875rem',
              flexWrap: 'wrap',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s 0.3s, transform 0.6s 0.3s',
            }}
          >
            <a
              href="#indices"
              className="btn-gold"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                fontSize: '0.8rem',
                padding: '0.625rem 1.5rem',
              }}
            >
              {t('hero.cta_primary')}
              <ArrowRight size={14} />
            </a>
            <Link
              to="/markets"
              className="btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                fontSize: '0.8rem',
                padding: '0.625rem 1.5rem',
              }}
            >
              {t('hero.cta_secondary')}
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: 'flex',
            gap: '0',
            marginTop: 'clamp(3rem, 6vw, 5rem)',
            background: 'var(--bg-1)',
            border: '1px solid var(--border)',
            borderRadius: '2px',
            overflow: 'hidden',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.8s 0.5s',
          }}
        >
          {stats.map(({ label, value, suffix }, i) => (
            <div
              key={label}
              style={{
                flex: 1,
                padding: '1.25rem 1.5rem',
                borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <p className="label" style={{ marginBottom: '0.375rem' }}>{label}</p>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 'clamp(1.25rem, 3vw, 1.625rem)', fontWeight: 600, color: 'var(--gold)', margin: 0 }}>
                {value}<span style={{ fontSize: '0.875em' }}>{suffix}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Value pillars */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1px',
            background: 'var(--border)',
            border: '1px solid var(--border)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          {pillars.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ background: 'var(--bg-1)', padding: '2rem 1.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  border: '1px solid var(--gold-border)',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.125rem',
                }}
              >
                <Icon size={16} color="var(--gold)" />
              </div>
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                  margin: '0 0 0.625rem',
                }}
              >
                {title}
              </h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.825rem', color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Indices Section */}
      <IndicesSection />
    </div>
  )
}
