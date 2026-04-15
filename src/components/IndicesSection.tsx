import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { TOKENIZED_INDICES, COINGECKO_BASE } from '@/config/constants'
import { TradingModal } from '@/components/TradingModal'

interface IndexPrice {
  symbol: string
  price: number
  change24h: number
  marketCap: number
}

const MOCK_PRICES: Record<string, IndexPrice> = {
  DPI: { symbol: 'DPI', price: 94.37, change24h: 2.14, marketCap: 18_420_000 },
  MVI: { symbol: 'MVI', price: 22.81, change24h: -1.08, marketCap: 4_850_000 },
  DATA: { symbol: 'DATA', price: 0.0419, change24h: 5.33, marketCap: 2_310_000 },
  SNX: { symbol: 'SNX', price: 1.87, change24h: -0.72, marketCap: 574_000_000 },
  MKR: { symbol: 'MKR', price: 1342.18, change24h: 1.56, marketCap: 1_234_000_000 },
  LINK: { symbol: 'LINK', price: 13.48, change24h: 3.21, marketCap: 8_190_000_000 },
}

export function IndicesSection() {
  const { t } = useLanguage()
  const [prices, setPrices] = useState<Record<string, IndexPrice>>(MOCK_PRICES)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ symbol: string; op: 'invest' | 'divest' } | null>(null)

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 60_000)
    return () => clearInterval(interval)
  }, [])

  async function fetchPrices() {
    setLoading(true)
    try {
      const ids = TOKENIZED_INDICES.map((i) => i.coingeckoId).join(',')
      const res = await fetch(
        `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=10&page=1&price_change_percentage=24h`,
        { signal: AbortSignal.timeout(8000) }
      )
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      const updated: Record<string, IndexPrice> = { ...MOCK_PRICES }
      for (const item of data) {
        const idx = TOKENIZED_INDICES.find((i) => i.coingeckoId === item.id)
        if (idx) {
          updated[idx.symbol] = {
            symbol: idx.symbol,
            price: item.current_price ?? MOCK_PRICES[idx.symbol]?.price ?? 0,
            change24h: item.price_change_percentage_24h ?? 0,
            marketCap: item.market_cap ?? 0,
          }
        }
      }
      setPrices(updated)
    } catch {
      // Keep mock prices on error
    } finally {
      setLoading(false)
    }
  }

  function fmtPrice(n: number) {
    if (n >= 1000) return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    if (n >= 1) return '$' + n.toFixed(2)
    return '$' + n.toFixed(4)
  }

  function fmtMCap(n: number) {
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B'
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M'
    return '$' + n.toLocaleString('en-US')
  }

  return (
    <section style={{ padding: '4rem 0' }} id="indices">
      {/* Section header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p className="label" style={{ marginBottom: '0.5rem', color: 'var(--gold)' }}>
          VESTIGE INDEX — TOKENIZED PRODUCTS
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 600,
                color: 'var(--text)',
                margin: '0 0 0.5rem',
                lineHeight: 1.15,
              }}
            >
              {t('indices.title')}
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', color: 'var(--text-2)', margin: 0 }}>
              {t('indices.subtitle')}
            </p>
          </div>
          <button
            onClick={fetchPrices}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.4rem 0.875rem',
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: '2px',
              color: 'var(--text-3)',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'color 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            <RefreshCw size={11} />
            REFRESH
          </button>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1px',
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
        className="stagger"
      >
        {TOKENIZED_INDICES.map((idx) => {
          const price = prices[idx.symbol]
          const isPositive = (price?.change24h ?? 0) >= 0

          return (
            <div
              key={idx.symbol}
              style={{
                background: 'var(--bg-1)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'background 0.15s',
                position: 'relative',
                overflow: 'hidden',
              }}
              className="animate-fade-up"
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-1)')}
            >
              {/* Color accent bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '3px',
                  height: '100%',
                  background: idx.color,
                  opacity: 0.6,
                }}
              />

              {/* Symbol + name */}
              <div style={{ paddingLeft: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.3rem' }}>
                  <span
                    style={{
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {idx.symbol}
                  </span>
                  {loading && (
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)', opacity: 0.5 }} className="pulse-gold" />
                  )}
                </div>
                <p
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '0.78rem',
                    color: 'var(--text-2)',
                    margin: 0,
                  }}
                >
                  {idx.name}
                </p>
              </div>

              {/* Price + change */}
              <div style={{ paddingLeft: '0.5rem' }}>
                <div
                  style={{
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '1.375rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                    marginBottom: '0.25rem',
                  }}
                >
                  {price ? fmtPrice(price.price) : '—'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  {isPositive ? (
                    <TrendingUp size={12} color="var(--green)" />
                  ) : (
                    <TrendingDown size={12} color="var(--red)" />
                  )}
                  <span
                    style={{
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '0.78rem',
                      color: isPositive ? 'var(--green)' : 'var(--red)',
                      fontWeight: 500,
                    }}
                  >
                    {isPositive ? '+' : ''}{price?.change24h.toFixed(2) ?? '0.00'}%
                  </span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'var(--text-3)' }}>
                    24h
                  </span>
                </div>
              </div>

              {/* Market cap */}
              <div
                style={{
                  paddingLeft: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p className="label" style={{ marginBottom: '2px' }}>MCap</p>
                  <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.78rem', color: 'var(--text-2)', margin: 0 }}>
                    {price ? fmtMCap(price.marketCap) : '—'}
                  </p>
                </div>
                <div>
                  <p className="label" style={{ marginBottom: '2px', textAlign: 'right' }}>Fee</p>
                  <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.78rem', color: 'var(--text-3)', margin: 0 }}>
                    0.50%
                  </p>
                </div>
              </div>

              {/* Description */}
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.75rem',
                  color: 'var(--text-3)',
                  paddingLeft: '0.5rem',
                  margin: 0,
                  lineHeight: 1.5,
                  borderTop: '1px solid rgba(212,175,55,0.07)',
                  paddingTop: '0.875rem',
                }}
              >
                {idx.description}
              </p>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', paddingLeft: '0.5rem' }}>
                <button
                  className="btn-gold"
                  onClick={() => setModal({ symbol: idx.symbol, op: 'invest' })}
                  style={{ flex: 1 }}
                >
                  {t('indices.invest')}
                </button>
                <button
                  className="btn-outline"
                  onClick={() => setModal({ symbol: idx.symbol, op: 'divest' })}
                  style={{ flex: 1 }}
                >
                  {t('indices.divest')}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '1rem', textAlign: 'right' }}>
        {t('indices.fee_note')} · Prices via CoinGecko
      </p>

      {/* Trading modal */}
      {modal && (
        <TradingModal
          defaultSymbol={modal.symbol}
          defaultOperation={modal.op}
          onClose={() => setModal(null)}
        />
      )}
    </section>
  )
}
