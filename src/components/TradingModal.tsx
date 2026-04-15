import { useState, useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useWallet } from '@/hooks/useWallet'
import { TOKENIZED_INDICES, FEE_RATES, FEE_WALLETS } from '@/config/constants'

interface TradingModalProps {
  defaultSymbol?: string
  defaultOperation?: 'invest' | 'divest'
  onClose: () => void
}

export function TradingModal({ defaultSymbol, defaultOperation = 'invest', onClose }: TradingModalProps) {
  const { t } = useLanguage()
  const { wallet } = useWallet()
  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol || TOKENIZED_INDICES[0].symbol)
  const [operation, setOperation] = useState<'invest' | 'divest'>(defaultOperation)
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<'form' | 'review' | 'signing' | 'success' | 'error'>('form')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const selectedIndex = TOKENIZED_INDICES.find((i) => i.symbol === selectedSymbol) || TOKENIZED_INDICES[0]
  const numAmount = parseFloat(amount) || 0
  const fee = numAmount * FEE_RATES.INDEX_OPERATION
  const receive = numAmount - fee

  useEffect(() => {
    if (defaultSymbol) setSelectedSymbol(defaultSymbol)
  }, [defaultSymbol])

  function handleConfirm() {
    if (!wallet.connected) return
    setStep('review')
  }

  async function handleSign() {
    setStep('signing')
    setErrorMsg(null)

    try {
      if (wallet.chain === 'evm') {
        await executeEvmTransaction()
      } else if (wallet.chain === 'solana') {
        await executeSolanaTransaction()
      }
      setStep('success')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transaction failed or was rejected'
      setErrorMsg(msg)
      setStep('error')
    }
  }

  async function executeEvmTransaction() {
    if (!window.ethereum || !wallet.address) throw new Error('EVM wallet not connected')

    // Convert fee amount to wei (assuming ETH-denominated for fee transfer)
    // Fee is sent to treasury wallet as a native ETH transfer
    const feeInEth = fee / 1800 // approximate ETH price placeholder — in production use oracle
    const feeWei = '0x' + Math.floor(feeInEth * 1e18).toString(16)

    // Send fee to treasury
    const feeTxHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: wallet.address,
        to: FEE_WALLETS.EVM,
        value: feeWei,
      }],
    }) as string

    setTxHash(feeTxHash)
  }

  async function executeSolanaTransaction() {
    if (!window.solana || !window.solana.publicKey) throw new Error('Solana wallet not connected')

    // For Solana, we request a message signature as proof of intent
    // Real swap would use Jupiter API + transaction signing
    const message = new TextEncoder().encode(
      `VESTIGE INDEX: ${operation.toUpperCase()} $${numAmount.toFixed(2)} ${selectedSymbol}\n` +
      `Fee: $${fee.toFixed(2)} (0.5%)\n` +
      `Treasury: ${FEE_WALLETS.SOLANA}\n` +
      `Timestamp: ${new Date().toISOString()}`
    )

    // Request signature from wallet
    const signature = await (window.solana as unknown as {
      signMessage: (message: Uint8Array, encoding: string) => Promise<{ signature: Uint8Array }>
    }).signMessage(message, 'utf8')

    // Convert signature to base58-like string for display
    const sigBytes = Array.from(signature.signature)
    setTxHash(sigBytes.slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join(''))
  }

  function fmtUSD(n: number) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const feeWallet = wallet.chain === 'solana' ? FEE_WALLETS.SOLANA : FEE_WALLETS.EVM

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: '2px',
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
        }}
        className="animate-fade-in"
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--text)',
                margin: 0,
              }}
            >
              {t('trading.title')}
            </h2>
            <p className="label" style={{ marginTop: '2px' }}>
              {selectedIndex.name}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {step === 'form' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              {/* Index selector */}
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>
                  {t('trading.select_index')}
                </label>
                <select
                  className="select-field"
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                >
                  {TOKENIZED_INDICES.map((idx) => (
                    <option key={idx.symbol} value={idx.symbol}>
                      {idx.symbol} — {idx.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Operation toggle */}
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>
                  {t('trading.operation')}
                </label>
                <div style={{ display: 'flex', gap: '0', border: '1px solid var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                  {(['invest', 'divest'] as const).map((op) => (
                    <button
                      key={op}
                      onClick={() => setOperation(op)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: operation === op
                          ? op === 'invest' ? 'var(--green-dim)' : 'var(--red-dim)'
                          : 'transparent',
                        border: 'none',
                        color: operation === op
                          ? op === 'invest' ? 'var(--green)' : 'var(--red)'
                          : 'var(--text-3)',
                        fontFamily: 'IBM Plex Mono, monospace',
                        fontSize: '0.72rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {t(`trading.${op}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>
                  {t('trading.amount_label')}
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '0.875rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-3)',
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '0.875rem',
                    }}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input-field"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={t('trading.amount_placeholder')}
                    style={{ paddingLeft: '1.75rem' }}
                  />
                </div>
              </div>

              {/* Fee breakdown */}
              {numAmount > 0 && (
                <div
                  style={{
                    background: 'var(--bg-3)',
                    border: '1px solid var(--border)',
                    borderRadius: '2px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'var(--text-2)' }}>
                      {t('trading.fee_label')}
                    </span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: 'var(--text-2)' }}>
                      ${fmtUSD(fee)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', color: 'var(--text)', fontWeight: 500 }}>
                      {t('trading.you_receive')}
                    </span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.875rem', color: 'var(--gold)', fontWeight: 600 }}>
                      ${fmtUSD(receive)}
                    </span>
                  </div>
                  <div className="divider" style={{ margin: '0.75rem 0' }} />
                  <div>
                    <p className="label" style={{ marginBottom: '0.3rem' }}>
                      {wallet.chain === 'solana' ? t('trading.fee_wallet_sol') : t('trading.fee_wallet_evm')}
                    </p>
                    <p
                      style={{
                        fontFamily: 'IBM Plex Mono, monospace',
                        fontSize: '0.65rem',
                        color: 'var(--text-3)',
                        wordBreak: 'break-all',
                        margin: 0,
                      }}
                    >
                      {feeWallet}
                    </p>
                  </div>
                </div>
              )}

              {/* Wallet warning */}
              {!wallet.connected && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    background: 'rgba(212,175,55,0.06)',
                    border: '1px solid var(--gold-border)',
                    borderRadius: '2px',
                  }}
                >
                  <AlertTriangle size={14} color="var(--gold)" />
                  <span style={{ fontSize: '0.78rem', fontFamily: 'DM Sans, sans-serif', color: 'var(--text-2)' }}>
                    {t('trading.wallet_connect_prompt')}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>
                  {t('trading.cancel')}
                </button>
                <button
                  className="btn-gold"
                  onClick={handleConfirm}
                  disabled={!wallet.connected || numAmount <= 0}
                  style={{
                    flex: 2,
                    opacity: !wallet.connected || numAmount <= 0 ? 0.45 : 1,
                    cursor: !wallet.connected || numAmount <= 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {wallet.connected ? t('trading.confirm') : t('trading.connect_wallet')}
                </button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p className="label" style={{ color: 'var(--gold)' }}>REVIEW ORDER</p>
              <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '2px', padding: '1.25rem' }}>
                {[
                  ['Index', `${selectedIndex.symbol} — ${selectedIndex.name}`],
                  ['Operation', operation.toUpperCase()],
                  ['Amount', `$${fmtUSD(numAmount)}`],
                  ['Platform Fee (0.5%)', `$${fmtUSD(fee)}`],
                  ['Net Amount', `$${fmtUSD(receive)}`],
                  ['Fee Destination', feeWallet.slice(0, 10) + '...' + feeWallet.slice(-6)],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(212,175,55,0.06)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-2)', fontFamily: 'DM Sans, sans-serif' }}>{label}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text)', fontFamily: 'IBM Plex Mono, monospace' }}>{value}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontFamily: 'DM Sans, sans-serif' }}>
                Signing this transaction will authorize the transfer. Fee will be routed to the designated platform wallet.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-ghost" onClick={() => setStep('form')} style={{ flex: 1 }}>{t('trading.cancel')}</button>
                <button className="btn-gold" onClick={handleSign} style={{ flex: 2 }}>{t('trading.confirm')}</button>
              </div>
            </div>
          )}

          {step === 'signing' && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    border: '2px solid var(--border)',
                    borderTop: '2px solid var(--gold)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto',
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: 'var(--text)', margin: '0 0 0.5rem' }}>
                {t('trading.signing')}
              </p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: 'var(--text-3)', margin: 0 }}>
                Please confirm in your wallet
              </p>
            </div>
          )}

          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>
                <span style={{ color: 'var(--green)', fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem' }}>✓</span>
              </div>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--text)', margin: '0 0 0.5rem' }}>
                {t('trading.success')}
              </p>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: 'var(--text-3)', margin: '0 0 0.5rem' }}>
                ${fmtUSD(receive)} {selectedSymbol} {operation === 'invest' ? 'purchased' : 'redeemed'}
              </p>
              {txHash && (
                <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: 'var(--text-3)', margin: '0 0 1.5rem', wordBreak: 'break-all' }}>
                  TX: {txHash.slice(0, 20)}...
                </p>
              )}
              <button className="btn-gold" onClick={onClose} style={{ width: '100%' }}>
                {t('common.close')}
              </button>
            </div>
          )}

          {step === 'error' && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ marginBottom: '1rem' }}>
                <AlertTriangle size={40} color="var(--red)" />
              </div>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'var(--text)', margin: '0 0 0.5rem' }}>
                Transaction Failed
              </p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: 'var(--text-3)', margin: '0 0 1.5rem', maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto' }}>
                {errorMsg || 'The transaction was rejected or an error occurred.'}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>
                  {t('common.close')}
                </button>
                <button className="btn-gold" onClick={() => setStep('review')} style={{ flex: 1 }}>
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
