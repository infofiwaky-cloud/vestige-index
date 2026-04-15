import { useState, useEffect, useRef } from 'react'
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { COINGECKO_BASE } from '@/config/constants'

interface CoinRow {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  market_cap_rank: number
}

export function MarketTable() {
  const { t } = useLanguage()
  const [coins, setCoins] = useState<CoinRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(60)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetchCoins()
    intervalRef.current = setInterval(() => {
      fetchCoins()
    }, 60_000)
    const cdInterval = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 60 : c - 1))
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      clearInterval(cdInterval)
    }
  }, [])

  async function fetchCoins() {
    setError(false)
    try {
      const res = await fetch(
        `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`,
        { signal: AbortSignal.timeout(10_000) }
      )
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setCoins(data)
      setLastUpdated(new Date())
      setCountdown(60)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  function fmtPrice(n: number) {
    if (n >= 1000) return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    if (n >= 1) return '$' + n.toFixed(3)
    if (n >= 0.0001) return '$' + n.toFixed(5)
    return '$' + n.toExponential(2)
  }

  function fmtLarge(n: number) {
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T'
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B'
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M'
    return '$' + n.toLocaleString('en-US')
  }

  return (
    <section style={{ padding: '4rem 0' }} id="markets">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
        <div>
          <p className="label" style={{ marginBottom: '0.4rem', color: 'var(--gold)' }}>MARKET INTELLIGENCE</p>
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 600,
              color: 'var(--text)',
              margin: 0,
            }}
          >
            {t('markets.title')}
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'var(--text-2)', marginTop: '0.375rem' }}>
            {t('markets.subtitle')}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {lastUpdated && (
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'var(--text-3)' }}>
              REFRESH IN {countdown}s
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span className="pulse-gold" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--gold)', textTransform: 'uppercase' }}>
              {t('markets.live')}
            </span>
          </div>
          <button
            onClick={fetchCoins}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.375rem 0.75rem',
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: '2px',
              color: 'var(--text-3)',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={10} />
            {t('common.refresh')}
          </button>
        </div>
      </div>

      {/* Table container */}
      <div
        style={{
          background: 'var(--bg-1)',
          border: '1px solid var(--border)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        {loading && (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.78rem', color: 'var(--text-3)' }}>
              {t('markets.loading')}
            </p>
          </div>
        )}

        {error && !loading && (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', color: 'var(--red)', marginBottom: '1rem' }}>
              {t('markets.error')}
            </p>
            <button className="btn-outline" onClick={fetchCoins}>{t('common.retry')}</button>
          </div>
        )}

        {!loading && !error && coins.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '48px' }}>{t('markets.rank')}</th>
                  <th>{t('markets.name')}</th>
                  <th style={{ textAlign: 'right' }}>{t('markets.price')}</th>
                  <th style={{ textAlign: 'right' }}>{t('markets.change_24h')}</th>
                  <th style={{ textAlign: 'right' }} className="hide-mobile">{t('markets.market_cap')}</th>
                  <th style={{ textAlign: 'right' }} className="hide-mobile">{t('markets.volume')}</th>
                </tr>
              </thead>
              <tbody>
                {coins.map((coin) => {
                  const isPos = coin.price_change_percentage_24h >= 0
                  return (
                    <tr key={coin.id}>
                      <td>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: 'var(--text-3)' }}>
                          {coin.market_cap_rank}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <img
                            src={coin.image}
                            alt={coin.name}
                            width={20}
                            height={20}
                            style={{ borderRadius: '50%', flexShrink: 0 }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                          <div>
                            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', color: 'var(--text)', fontWeight: 500 }}>
                              {coin.name}
                            </div>
                            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'var(--text-3)', letterSpacing: '0.08em' }}>
                              {coin.symbol.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.875rem', color: 'var(--text)' }}>
                          {fmtPrice(coin.current_price)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          {isPos ? <TrendingUp size={11} color="var(--green)" /> : <TrendingDown size={11} color="var(--red)" />}
                          <span
                            style={{
                              fontFamily: 'IBM Plex Mono, monospace',
                              fontSize: '0.8rem',
                              color: isPos ? 'var(--green)' : 'var(--red)',
                            }}
                          >
                            {isPos ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2) ?? '0.00'}%
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }} className="hide-mobile">
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: 'var(--text-2)' }}>
                          {fmtLarge(coin.market_cap)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} className="hide-mobile">
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: 'var(--text-2)' }}>
                          {fmtLarge(coin.total_volume)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
