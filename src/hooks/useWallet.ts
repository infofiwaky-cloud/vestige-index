import { useState, useEffect, useCallback } from 'react'

export interface WalletState {
  connected: boolean
  address: string | null
  chain: 'evm' | 'solana' | null
  walletName: string | null
}

const STORAGE_KEY = 'vestige_wallet'

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      isCoinbaseWallet?: boolean
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on?: (event: string, handler: (...args: unknown[]) => void) => void
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
    }
    solana?: {
      isPhantom?: boolean
      isSolflare?: boolean
      connect: () => Promise<{ publicKey: { toString: () => string } }>
      disconnect: () => Promise<void>
      publicKey?: { toString: () => string }
      isConnected?: boolean
      on?: (event: string, handler: (...args: unknown[]) => void) => void
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
    }
  }
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    chain: null,
    walletName: null,
  })
  const [error, setError] = useState<string | null>(null)

  // On mount, try to restore session from provider (not localStorage mock)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return
    try {
      const prev = JSON.parse(stored) as WalletState
      if (!prev.connected || !prev.chain) return
      // Verify the wallet is still connected via the provider
      if (prev.chain === 'evm' && window.ethereum) {
        window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
          const accs = accounts as string[]
          if (accs && accs.length > 0) {
            const state: WalletState = { connected: true, address: accs[0], chain: 'evm', walletName: prev.walletName }
            setWallet(state)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
          } else {
            localStorage.removeItem(STORAGE_KEY)
          }
        }).catch(() => {
          localStorage.removeItem(STORAGE_KEY)
        })
      } else if (prev.chain === 'solana' && window.solana) {
        if (window.solana.isConnected && window.solana.publicKey) {
          const state: WalletState = { connected: true, address: window.solana.publicKey.toString(), chain: 'solana', walletName: prev.walletName }
          setWallet(state)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  // Listen for account/chain changes on EVM
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return
    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[]
      if (!accounts || accounts.length === 0) {
        // User disconnected
        setWallet({ connected: false, address: null, chain: null, walletName: null })
        localStorage.removeItem(STORAGE_KEY)
      } else if (wallet.chain === 'evm') {
        const state: WalletState = { ...wallet, address: accounts[0] }
        setWallet(state)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      }
    }
    window.ethereum.on?.('accountsChanged', handleAccountsChanged)
    return () => {
      window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged)
    }
  }, [wallet])

  const connect = useCallback(async (chain: 'evm' | 'solana', walletName: string) => {
    setError(null)
    try {
      if (chain === 'evm') {
        if (!window.ethereum) {
          setError(`${walletName} not detected. Please install the ${walletName} extension.`)
          return
        }
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
        if (accounts && accounts.length > 0) {
          const state: WalletState = { connected: true, address: accounts[0], chain: 'evm', walletName }
          setWallet(state)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        } else {
          setError('No accounts returned. Please unlock your wallet.')
        }
      } else if (chain === 'solana') {
        if (!window.solana) {
          setError(`${walletName} not detected. Please install the ${walletName} extension.`)
          return
        }
        const resp = await window.solana.connect()
        const address = resp.publicKey.toString()
        if (address) {
          const state: WalletState = { connected: true, address, chain: 'solana', walletName }
          setWallet(state)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection rejected or failed'
      setError(msg)
    }
  }, [])

  const disconnect = useCallback(async () => {
    if (wallet.chain === 'solana' && window.solana) {
      try { await window.solana.disconnect() } catch { /* ignore */ }
    }
    const state: WalletState = { connected: false, address: null, chain: null, walletName: null }
    setWallet(state)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    setError(null)
  }, [wallet.chain])

  return { wallet, connect, disconnect, error }
}
