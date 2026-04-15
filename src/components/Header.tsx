import { useState, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Menu, X, Copy, Check, LogOut, Sun, Moon } from 'lucide-react'
import { useLanguage, LANGUAGES, type Language } from '@/hooks/useLanguage'
import { useWallet } from '@/hooks/useWallet'
import { useTheme } from '@/hooks/useTheme'
import { SITE } from '@/config/constants'

export function Header() {
  const { t, lang, setLang } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { wallet, connect, disconnect, error: walletError } = useWallet()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const location = useLocation()

  // Auto-close wallet modal on successful connection
  useEffect(() => {
    if (wallet.connected && walletModalOpen) {
      setWalletModalOpen(false)
    }
  }, [wallet.connected])

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/dashboard', label: t('nav.dashboard') },
    { to: '/markets', label: t('nav.markets') },
    { to: '/contact', label: t('nav.contact') },
  ]

  function truncateAddress(addr: string) {
    if (!addr) return ''
    return addr.slice(0, 6) + '...' + addr.slice(-4)
  }

  function copyAddress() {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <header
        style={{
          background: theme === 'dark' ? 'rgba(0,0,0,0.96)' : 'rgba(255,255,255,0.96)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {/* Logo placeholder — replace src with actual logo asset */}
            <div
              style={{
                width: '28px',
                height: '28px',
                border: '1px solid var(--gold-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px',
              }}
            >
              <span style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '1rem', lineHeight: 1 }}>V</span>
            </div>
            <span
              style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontWeight: 600,
                fontSize: '0.8rem',
                letterSpacing: '0.18em',
                color: 'var(--text)',
                textTransform: 'uppercase',
              }}
            >
              {SITE.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hide-mobile" style={{ display: 'flex', gap: '0.25rem' }}>
            {navLinks.map((link) => {
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '0.78rem',
                    fontWeight: active ? 500 : 400,
                    letterSpacing: '0.05em',
                    color: active ? 'var(--gold)' : 'var(--text-2)',
                    textDecoration: 'none',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '2px',
                    transition: 'color 0.15s',
                    borderBottom: active ? '1px solid var(--gold)' : '1px solid transparent',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn-ghost"
              style={{ padding: '0.3rem 0.5rem', display: 'flex', alignItems: 'center' }}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Language selector */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn-ghost"
                onClick={() => setLangOpen(!langOpen)}
                style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em' }}
              >
                {lang.toUpperCase()}
              </button>
              {langOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'var(--bg-2)',
                    border: '1px solid var(--border)',
                    borderRadius: '2px',
                    minWidth: '120px',
                    zIndex: 60,
                    overflow: 'hidden',
                  }}
                  onMouseLeave={() => setLangOpen(false)}
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code as Language); setLangOpen(false) }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 0.875rem',
                        fontSize: '0.78rem',
                        fontFamily: 'DM Sans, sans-serif',
                        color: lang === l.code ? 'var(--gold)' : 'var(--text-2)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-3)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      {l.native} — {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wallet */}
            {wallet.connected ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <button
                  onClick={copyAddress}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.3rem 0.75rem',
                    background: 'var(--gold-dim)',
                    border: '1px solid var(--gold-border)',
                    borderRadius: '2px',
                    color: 'var(--gold)',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    letterSpacing: '0.05em',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--green)',
                      flexShrink: 0,
                    }}
                  />
                  {truncateAddress(wallet.address || '')}
                  {copied ? <Check size={10} /> : <Copy size={10} />}
                </button>
                <button
                  onClick={disconnect}
                  style={{
                    padding: '0.3rem',
                    background: 'none',
                    border: '1px solid var(--bg-3)',
                    borderRadius: '2px',
                    color: 'var(--text-3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button className="btn-gold" onClick={() => setWalletModalOpen(true)} style={{ fontSize: '0.72rem', padding: '0.35rem 1rem' }}>
                {t('wallet.connect')}
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              className="hide-desktop btn-ghost"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ padding: '0.3rem', display: 'flex', alignItems: 'center' }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div
            style={{
              background: 'var(--bg-1)',
              borderTop: '1px solid var(--border)',
              padding: '0.75rem 1.5rem 1rem',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  padding: '0.6rem 0',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.875rem',
                  color: location.pathname === link.to ? 'var(--gold)' : 'var(--text-2)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Wallet Modal */}
      {walletModalOpen && (
        <div className="modal-overlay" onClick={() => setWalletModalOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              borderRadius: '2px',
              padding: '2rem',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--text)', margin: 0 }}>
                Connect Wallet
              </h3>
              <button onClick={() => setWalletModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {walletError && (
              <div style={{ padding: '0.625rem 0.875rem', marginBottom: '0.75rem', background: 'var(--red-dim)', border: '1px solid var(--red)', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'var(--red)' }}>
                {walletError}
              </div>
            )}

            <p className="label" style={{ marginBottom: '0.75rem' }}>{t('wallet.evm')}</p>
            {(['MetaMask', 'Coinbase Wallet', 'WalletConnect'] as const).map((name) => (
              <button
                key={name}
                onClick={async () => { await connect('evm', name) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-3)',
                  border: '1px solid var(--border)',
                  borderRadius: '2px',
                  color: 'var(--text)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  marginBottom: '0.5rem',
                  transition: 'border-color 0.15s',
                  gap: '0.75rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gold-border)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <span style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'var(--bg-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--gold)', fontFamily: 'IBM Plex Mono, monospace' }}>
                  {name.slice(0, 2).toUpperCase()}
                </span>
                {name}
              </button>
            ))}

            <p className="label" style={{ margin: '1.25rem 0 0.75rem' }}>{t('wallet.solana')}</p>
            {(['Phantom', 'Solflare'] as const).map((name) => (
              <button
                key={name}
                onClick={async () => { await connect('solana', name) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-3)',
                  border: '1px solid var(--border)',
                  borderRadius: '2px',
                  color: 'var(--text)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  marginBottom: '0.5rem',
                  transition: 'border-color 0.15s',
                  gap: '0.75rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gold-border)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <span style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'var(--bg-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--gold)', fontFamily: 'IBM Plex Mono, monospace' }}>
                  {name.slice(0, 2).toUpperCase()}
                </span>
                {name}
              </button>
            ))}

            <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '1.25rem', fontFamily: 'DM Sans, sans-serif' }}>
              By connecting a wallet you accept our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
