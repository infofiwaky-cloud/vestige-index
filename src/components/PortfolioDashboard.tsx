import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useWallet } from '@/hooks/useWallet'
import { TradingModal } from '@/components/TradingModal'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler)

interface Position {
  symbol: string
  name: string
  units: number
  avgCost: number
  currentPrice: number
  color: string
}

const MOCK_POSITIONS: Position[] = [
  { symbol: 'DPI', name: 'DeFi Pulse Index', units: 21.7, avgCost: 88.40, currentPrice: 94.37, color: '#4f8ef7' },
  { symbol: 'LINK', name: 'Chainlink', units: 418.3, avgCost: 10.21, currentPrice: 13.48, color: '#2a5ada' },
  { symbol: 'MKR', name: 'Maker', units: 3.14, avgCost: 1180.00, currentPrice: 1342.18, color: '#1aab9b' },
  { symbol: 'SNX', name: 'Synthetix', units: 912.5, avgCost: 2.12, currentPrice: 1.87, color: '#00d9b1' },
]

function generatePnlData() {
  const labels: string[] = []
  const data: number[] = []
  let base = 22_400
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    base += (Math.random() - 0.42) * 800
    data.push(Math.round(base))
  }
  return { labels, data }
}

const { labels: pnlLabels, data: pnlData } = generatePnlData()

export function PortfolioDashboard() {
  const { t } = useLanguage()
  const { wallet } = useWallet()
  const [mounted, setMounted] = useState(false)
  const [modal, setModal] = useState<{ symbol: string; op: 'invest' | 'divest' } | null>(null)

  useEffect(() => setMounted(true), [])

  const totalValue = MOCK_POSITIONS.reduce(
    (sum, p) => sum + p.units * p.currentPrice,
    0
  )
  const totalCost = MOCK_POSITIONS.reduce(
    (sum, p) => sum + p.units * p.avgCost,
    0
  )
  const totalPnl = totalValue - totalCost
  const pnlPct = (totalPnl / totalCost) * 100

  function fmtUSD(n: number) {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
  }

  const distributionData = {
    labels: MOCK_POSITIONS.map((p) => p.symbol),
    datasets: [
      {
        data: MOCK_POSITIONS.map((p) => p.units * p.currentPrice),
        backgroundColor: MOCK_POSITIONS.map((p) => p.color),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  }

  const lineData = {
    labels: pnlLabels,
    datasets: [
      {
        label: 'Portfolio Value',
        data: pnlData,
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212,175,55,0.07)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 1.5,
      },
    ],
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#141310',
        borderColor: 'rgba(212,175,55,0.2)',
        borderWidth: 1,
        titleColor: '#9a9080',
        bodyColor: '#e8dfc8',
        titleFont: { family: 'IBM Plex Mono', size: 10 },
        bodyFont: { family: 'IBM Plex Mono', size: 12 },
        callbacks: {
          label: (ctx: { raw: unknown }) => ' $' + Number(ctx.raw).toLocaleString('en-US', { minimumFractionDigits: 0 }),
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(212,175,55,0.05)' },
        ticks: {
          color: '#5a5040',
          font: { family: 'IBM Plex Mono', size: 9 },
          maxTicksLimit: 6,
        },
        border: { color: 'rgba(212,175,55,0.1)' },
      },
      y: {
        grid: { color: 'rgba(212,175,55,0.05)' },
        ticks: {
          color: '#5a5040',
          font: { family: 'IBM Plex Mono', size: 9 },
          callback: (v: number | string) => '$' + Number(v).toLocaleString('en-US', { notation: 'compact' }),
        },
        border: { color: 'rgba(212,175,55,0.1)' },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#9a9080',
          font: { family: 'IBM Plex Mono', size: 10 },
          boxWidth: 10,
          padding: 12,
        },
      },
    },
  }

  if (!wallet.connected) {
    return (
      <section style={{ padding: '4rem 0' }} id="dashboard">
        <p className="label" style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>PORTFOLIO</p>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--text)', margin: '0 0 2rem' }}>
          {t('dashboard.title')}
        </h2>
        <div
          style={{
            background: 'var(--bg-1)',
            border: '1px solid var(--border)',
            borderRadius: '2px',
            padding: '4rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--text-2)', marginBottom: '1rem' }}>
            {t('dashboard.connect_prompt')}
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', color: 'var(--text-3)', margin: 0 }}>
            Connect your EVM or Solana wallet using the button in the navigation bar.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section style={{ padding: '4rem 0' }} id="dashboard">
      <div style={{ marginBottom: '2rem' }}>
        <p className="label" style={{ color: 'var(--gold)', marginBottom: '0.4rem' }}>PORTFOLIO OVERVIEW</p>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--text)', margin: 0 }}>
          {t('dashboard.title')}
        </h2>
      </div>

      {/* Top stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1px',
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '1px',
        }}
      >
        {[
          { label: t('dashboard.total_value'), value: fmtUSD(totalValue), sub: null, color: 'var(--text)' },
          {
            label: t('dashboard.pnl_30d'),
            value: (totalPnl >= 0 ? '+' : '') + fmtUSD(totalPnl),
            sub: (pnlPct >= 0 ? '+' : '') + pnlPct.toFixed(2) + '%',
            color: totalPnl >= 0 ? 'var(--green)' : 'var(--red)',
          },
          { label: t('dashboard.active_positions'), value: MOCK_POSITIONS.length.toString(), sub: 'indices', color: 'var(--text)' },
          { label: 'Cost Basis', value: fmtUSD(totalCost), sub: null, color: 'var(--text-2)' },
        ].map(({ label, value, sub, color }) => (
          <div
            key={label}
            style={{ background: 'var(--bg-1)', padding: '1.5rem 1.25rem' }}
          >
            <p className="label" style={{ marginBottom: '0.5rem' }}>{label}</p>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.375rem', fontWeight: 600, color, margin: 0 }}>
              {value}
            </p>
            {sub && (
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color, opacity: 0.75, marginTop: '2px' }}>
                {sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1px',
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '1px',
        }}
      >
        {/* Line chart */}
        <div style={{ background: 'var(--bg-1)', padding: '1.5rem' }}>
          <p className="label" style={{ marginBottom: '1rem' }}>{t('dashboard.chart_title')}</p>
          {mounted && (
            <div style={{ height: '220px' }}>
              <Line data={lineData} options={lineOptions as Parameters<typeof Line>[0]['options']} />
            </div>
          )}
        </div>
        {/* Doughnut */}
        <div style={{ background: 'var(--bg-1)', padding: '1.5rem' }}>
          <p className="label" style={{ marginBottom: '1rem' }}>{t('dashboard.distribution')}</p>
          {mounted && (
            <div style={{ height: '220px' }}>
              <Doughnut data={distributionData} options={doughnutOptions} />
            </div>
          )}
        </div>
      </div>

      {/* Positions table */}
      <div
        style={{
          background: 'var(--bg-1)',
          border: '1px solid var(--border)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="label" style={{ margin: 0 }}>{t('dashboard.active_positions')}</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('dashboard.index')}</th>
                <th style={{ textAlign: 'right' }}>{t('dashboard.units')}</th>
                <th style={{ textAlign: 'right' }} className="hide-mobile">{t('dashboard.avg_cost')}</th>
                <th style={{ textAlign: 'right' }} className="hide-mobile">{t('dashboard.current')}</th>
                <th style={{ textAlign: 'right' }}>{t('dashboard.value')}</th>
                <th style={{ textAlign: 'right' }}>{t('dashboard.pnl')}</th>
                <th style={{ textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_POSITIONS.map((pos) => {
                const value = pos.units * pos.currentPrice
                const cost = pos.units * pos.avgCost
                const pnl = value - cost
                const pct = ((pnl / cost) * 100)
                const isPos = pnl >= 0
                return (
                  <tr key={pos.symbol}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: pos.color, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: 'var(--text)', fontWeight: 500 }}>
                            {pos.symbol}
                          </div>
                          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', color: 'var(--text-3)' }}>
                            {pos.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: 'var(--text-2)' }}>
                        {pos.units.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} className="hide-mobile">
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: 'var(--text-2)' }}>
                        ${pos.avgCost.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} className="hide-mobile">
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: 'var(--text)' }}>
                        ${pos.currentPrice.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: 'var(--text)' }}>
                        {fmtUSD(value)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {isPos ? <TrendingUp size={10} color="var(--green)" /> : <TrendingDown size={10} color="var(--red)" />}
                          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: isPos ? 'var(--green)' : 'var(--red)' }}>
                            {isPos ? '+' : ''}{pct.toFixed(2)}%
                          </span>
                        </div>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', color: isPos ? 'var(--green)' : 'var(--red)', opacity: 0.75 }}>
                          {isPos ? '+' : ''}{fmtUSD(pnl)}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-outline"
                        onClick={() => setModal({ symbol: pos.symbol, op: 'divest' })}
                        style={{ fontSize: '0.65rem', padding: '0.3rem 0.6rem' }}
                      >
                        {t('indices.divest')}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

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
