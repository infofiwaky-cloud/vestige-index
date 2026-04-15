import { createFileRoute } from '@tanstack/react-router'
import { useLanguage } from '@/hooks/useLanguage'
import { AlertTriangle } from 'lucide-react'

export const Route = createFileRoute('/disclaimer')({
  component: DisclaimerPage,
})

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.375rem',
          fontWeight: 600,
          color: 'var(--text)',
          margin: '0 0 1rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.875rem',
          color: 'var(--text-2)',
          lineHeight: 1.8,
        }}
      >
        {children}
      </div>
    </div>
  )
}

function DisclaimerPage() {
  const { t } = useLanguage()
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <p className="label" style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>LEGAL</p>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 600, color: 'var(--text)', margin: '0 0 0.5rem' }}>
        {t('disclaimer.title')}
      </h1>
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: 'var(--text-3)', marginBottom: '2rem' }}>
        {t('disclaimer.last_updated')}
      </p>

      {/* Risk warning banner */}
      <div
        style={{
          display: 'flex',
          gap: '0.875rem',
          padding: '1.25rem',
          background: 'rgba(184,56,48,0.08)',
          border: '1px solid rgba(184,56,48,0.25)',
          borderRadius: '2px',
          marginBottom: '2.5rem',
        }}
      >
        <AlertTriangle size={18} color="var(--red)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
          <strong style={{ color: 'var(--text)' }}>Risk Warning:</strong> Digital assets and tokenized indices involve substantial risk of loss. You may lose all or a significant portion of your invested capital. This platform is not suitable for all investors. Only invest what you can afford to lose.
        </p>
      </div>

      <Section title="1. No Financial Advice">
        <p>Nothing published by VESTIGE INDEX constitutes financial advice, investment advice, trading advice, or any other form of advice. The content on this platform — including index prices, portfolio analytics, market data, and news — is provided for informational purposes only.</p>
        <p>VESTIGE INDEX is not a registered investment adviser, broker-dealer, or financial institution. You should consult a qualified financial professional before making any investment decision.</p>
      </Section>

      <Section title="2. Investment Risk Acknowledgment">
        <p>By using this platform, you acknowledge and agree that:</p>
        <ul style={{ paddingLeft: '1.25rem' }}>
          <li>Digital asset markets are highly volatile and can experience rapid, unpredictable price movements</li>
          <li>Past performance of any index, token, or strategy does not guarantee future results</li>
          <li>Tokenized index products carry smart contract risk, liquidity risk, regulatory risk, and market risk</li>
          <li>The value of your investments may decrease to zero</li>
          <li>DeFi protocols underlying index constituents may be exploited, hacked, or become insolvent</li>
        </ul>
      </Section>

      <Section title="3. No Warranties">
        <p>VESTIGE INDEX provides this platform on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not warrant that:</p>
        <ul style={{ paddingLeft: '1.25rem' }}>
          <li>The platform will be uninterrupted, error-free, or secure</li>
          <li>Market data or pricing information is accurate, complete, or current</li>
          <li>The platform will meet your requirements or expectations</li>
          <li>Any defects or errors will be corrected</li>
        </ul>
      </Section>

      <Section title="4. Limitation of Liability">
        <p>To the fullest extent permitted by applicable law, VESTIGE INDEX, its officers, directors, employees, contractors, agents, affiliates, and successors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:</p>
        <ul style={{ paddingLeft: '1.25rem' }}>
          <li>Loss of investment capital or profits</li>
          <li>Loss of data or information</li>
          <li>Business interruption</li>
          <li>Smart contract failures or exploits</li>
          <li>Regulatory actions against digital assets</li>
          <li>Third-party service failures (oracles, DEX protocols, APIs)</li>
        </ul>
        <p>In no event shall VESTIGE INDEX's aggregate liability exceed the amount of fees actually paid by you to VESTIGE INDEX in the 30 days preceding the claim.</p>
      </Section>

      <Section title="5. Regulatory Compliance">
        <p>VESTIGE INDEX does not offer services to residents or citizens of jurisdictions where such services are restricted or prohibited by law, including but not limited to jurisdictions subject to OFAC sanctions. It is your sole responsibility to ensure compliance with all applicable laws and regulations in your jurisdiction before using this platform.</p>
        <p>This platform is not registered with or licensed by any financial regulatory authority. Users in regulated jurisdictions are responsible for their own regulatory compliance.</p>
      </Section>

      <Section title="6. Fee Disclosure">
        <p>VESTIGE INDEX charges platform fees on all executed operations:</p>
        <ul style={{ paddingLeft: '1.25rem' }}>
          <li><strong style={{ color: 'var(--text)' }}>Tokenized Index Operations:</strong> 0.50% of transaction value</li>
          <li><strong style={{ color: 'var(--text)' }}>Base Crypto Swaps:</strong> 0.30% of transaction value</li>
        </ul>
        <p>All fees are clearly displayed before transaction confirmation. Fee rates may be updated at any time with reasonable notice.</p>
      </Section>

      <Section title="7. Third-Party Protocols">
        <p>Index constituents and swap execution may rely on third-party DeFi protocols (including 1inch, Jupiter, Synthetix, MakerDAO, and others). VESTIGE INDEX has no control over and accepts no liability for the operation, security, or continuity of these third-party protocols.</p>
      </Section>

      <Section title="8. Changes to Disclaimer">
        <p>This disclaimer may be updated at any time. Continued use of the platform following any update constitutes acceptance of the revised disclaimer. We recommend reviewing this page periodically.</p>
      </Section>

      <Section title="9. Governing Law">
        <p>This disclaimer shall be governed by and construed in accordance with applicable law. Any disputes arising from use of this platform shall be resolved through binding arbitration or as otherwise required by applicable law.</p>
      </Section>
    </div>
  )
}
