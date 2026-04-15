import { useState, useEffect } from 'react'
import { useLanguage } from '@/hooks/useLanguage'

interface NewsItem {
  id: string
  title: string
  source: string
  published_on: number
}

const FALLBACK_NEWS: NewsItem[] = [
  { id: '1', title: 'Bitcoin surpasses $95,000 as institutional demand accelerates', source: 'CoinDesk', published_on: Date.now() },
  { id: '2', title: 'DeFi total value locked reaches new quarterly high amid protocol upgrades', source: 'The Block', published_on: Date.now() },
  { id: '3', title: 'Ethereum layer-2 ecosystems record $12B in daily transaction volume', source: 'Decrypt', published_on: Date.now() },
  { id: '4', title: 'Chainlink CCIP adoption expands to 15 new blockchain networks', source: 'CryptoCompare', published_on: Date.now() },
  { id: '5', title: 'MakerDAO governance approves expanded collateral types for DAI', source: 'Blockworks', published_on: Date.now() },
  { id: '6', title: 'Synthetix V3 migration sees $800M in synth positions transferred', source: 'DeFi Llama', published_on: Date.now() },
  { id: '7', title: 'Metaverse index constituents gain amid gaming sector momentum', source: 'CoinTelegraph', published_on: Date.now() },
  { id: '8', title: 'On-chain data economy platforms register 40% user growth this quarter', source: 'Messari', published_on: Date.now() },
]

export function NewsTicker() {
  const { t } = useLanguage()
  const [news, setNews] = useState<NewsItem[]>(FALLBACK_NEWS)

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, 5 * 60 * 1000) // 5 min refresh
    return () => clearInterval(interval)
  }, [])

  async function fetchNews() {
    try {
      const res = await fetch(
        'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest',
        { signal: AbortSignal.timeout(5000) }
      )
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      if (data.Data && Array.isArray(data.Data) && data.Data.length > 0) {
        setNews(
          data.Data.slice(0, 20).map((item: { id: string; title: string; source_info?: { name?: string }; published_on: number }) => ({
            id: item.id,
            title: item.title,
            source: item.source_info?.name || 'CryptoCompare',
            published_on: item.published_on,
          }))
        )
      }
    } catch {
      // Keep fallback news on error
    }
  }

  const doubled = [...news, ...news]

  return (
    <div
      style={{
        background: 'var(--bg-1)',
        borderBottom: '1px solid var(--border)',
        overflow: 'hidden',
        height: '34px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Live label */}
      <div
        style={{
          flexShrink: 0,
          padding: '0 0.875rem',
          borderRight: '1px solid var(--border)',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'var(--bg-2)',
          zIndex: 1,
        }}
      >
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: 'var(--gold)',
          }}
          className="pulse-gold"
        />
        <span
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            color: 'var(--gold)',
            textTransform: 'uppercase',
          }}
        >
          NEWS
        </span>
      </div>

      {/* Scrolling ticker */}
      <div style={{ overflow: 'hidden', flex: 1, position: 'relative' }}>
        <div className="ticker-track" style={{ paddingLeft: '1rem' }}>
          {doubled.map((item, i) => (
            <span
              key={`${item.id}-${i}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginRight: '3rem',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.78rem',
                color: 'var(--text-2)',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ color: 'var(--gold)', fontSize: '0.65rem', fontFamily: 'IBM Plex Mono, monospace' }}>
                {item.source.toUpperCase()}
              </span>
              <span>{item.title}</span>
              <span style={{ color: 'var(--text-4)', margin: '0 0.75rem' }}>|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
