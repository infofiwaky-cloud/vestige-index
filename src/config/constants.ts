export const FEE_RATES = {
  INDEX_OPERATION: 0.005, // 0.5%
  CRYPTO_SWAP: 0.003,     // 0.3%
} as const

export const FEE_WALLETS = {
  EVM: '0xa1131edb7a6d5e816bf8548078a88a6bf3d91c7f',
  SOLANA: 'BpazU34aCvMo1oyhhoxj6u3rnWkXjD8j81rKEFJ2oNLt',
} as const

export const TOKENIZED_INDICES = [
  {
    symbol: 'DPI',
    name: 'DeFi Pulse Index',
    description: 'Top DeFi protocol tokens weighted by market cap',
    coingeckoId: 'defipulse-index',
    color: '#4f8ef7',
  },
  {
    symbol: 'MVI',
    name: 'Metaverse Index',
    description: 'Metaverse, gaming, and virtual world ecosystems',
    coingeckoId: 'metaverse-index',
    color: '#9b5de5',
  },
  {
    symbol: 'DATA',
    name: 'Data Economy Index',
    description: 'Data infrastructure and decentralized oracle networks',
    coingeckoId: 'streamr-xdata',
    color: '#00b4d8',
  },
  {
    symbol: 'SNX',
    name: 'Synthetix',
    description: 'Synthetic asset issuance and derivatives protocol',
    coingeckoId: 'havven',
    color: '#00d9b1',
  },
  {
    symbol: 'MKR',
    name: 'Maker',
    description: 'Decentralized governance and DAI stablecoin system',
    coingeckoId: 'maker',
    color: '#1aab9b',
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    description: 'Decentralized oracle network for smart contracts',
    coingeckoId: 'chainlink',
    color: '#2a5ada',
  },
] as const

export const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

export const SITE = {
  name: 'VESTIGE INDEX',
  url: 'www.vestigeindex.com',
  copyright: '2025 VESTIGE INDEX. All rights reserved.',
}
