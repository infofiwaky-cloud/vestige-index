import { createFileRoute } from '@tanstack/react-router'
import { useLanguage } from '@/hooks/useLanguage'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
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

function PrivacyPage() {
  const { t } = useLanguage()
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <p className="label" style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>LEGAL</p>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 600, color: 'var(--text)', margin: '0 0 0.5rem' }}>
        {t('privacy.title')}
      </h1>
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: 'var(--text-3)', marginBottom: '3rem' }}>
        {t('privacy.last_updated')}
      </p>

      <Section title="1. Introduction">
        <p>VESTIGE INDEX ("we", "us", or "our") operates the website located at www.vestigeindex.com and provides institutional tokenized index investment infrastructure. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
        <p>By accessing our platform, you consent to the data practices described in this policy.</p>
      </Section>

      <Section title="2. Information We Collect">
        <p><strong style={{ color: 'var(--text)' }}>Information You Provide:</strong> When you contact us or use our platform, we may collect your name, email address, and any other information you voluntarily provide through our contact forms or communications.</p>
        <p><strong style={{ color: 'var(--text)' }}>On-Chain Data:</strong> Wallet addresses, transaction histories, and portfolio compositions are recorded on public blockchains. This data is publicly accessible by design and is not collected or controlled by VESTIGE INDEX.</p>
        <p><strong style={{ color: 'var(--text)' }}>Usage Data:</strong> We may collect technical information such as browser type, operating system, pages visited, and time spent on the platform for analytical purposes.</p>
        <p><strong style={{ color: 'var(--text)' }}>Cookies and Local Storage:</strong> We use browser local storage to persist language preferences and, with your consent, wallet connection state. No tracking cookies are used.</p>
      </Section>

      <Section title="3. How We Use Your Information">
        <p>We use collected information solely to:</p>
        <ul style={{ paddingLeft: '1.25rem' }}>
          <li>Respond to your inquiries and support requests</li>
          <li>Improve the functionality and user experience of our platform</li>
          <li>Comply with applicable legal obligations</li>
          <li>Detect and prevent fraud or misuse</li>
        </ul>
        <p>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
      </Section>

      <Section title="4. Data Storage and Retention">
        <p>Personal data submitted through contact forms is retained only as long as necessary to respond to your inquiry and for a reasonable period thereafter for record-keeping purposes. You may request deletion of your data at any time by contacting us through our official contact page.</p>
      </Section>

      <Section title="5. Third-Party Services">
        <p>Our platform may interface with third-party services including:</p>
        <ul style={{ paddingLeft: '1.25rem' }}>
          <li><strong style={{ color: 'var(--text)' }}>CoinGecko API:</strong> Market price data is fetched from CoinGecko. No personal data is transmitted.</li>
          <li><strong style={{ color: 'var(--text)' }}>CryptoCompare API:</strong> News data is fetched from CryptoCompare. No personal data is transmitted.</li>
          <li><strong style={{ color: 'var(--text)' }}>Netlify:</strong> Our platform is hosted on Netlify, which may collect standard web server logs.</li>
        </ul>
        <p>We are not responsible for the privacy practices of these third-party services.</p>
      </Section>

      <Section title="6. Blockchain and Wallet Data">
        <p>VESTIGE INDEX does not custody, control, or have access to your private keys or wallet credentials. All on-chain operations are executed directly by you through your connected wallet. Blockchain transactions are immutable and publicly visible — we have no ability to modify or delete on-chain data.</p>
      </Section>

      <Section title="7. Security">
        <p>We implement reasonable technical and organizational measures to protect information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or method of electronic storage is 100% secure.</p>
      </Section>

      <Section title="8. Your Rights">
        <p>Depending on your jurisdiction, you may have the right to access, correct, delete, or restrict the processing of your personal data. To exercise these rights, contact us through our official contact page. We will respond within 30 days.</p>
      </Section>

      <Section title="9. Children's Privacy">
        <p>Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected information from a minor, please contact us immediately.</p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>We may update this Privacy Policy periodically. Changes will be posted on this page with an updated revision date. Continued use of our platform following changes constitutes acceptance of the updated policy.</p>
      </Section>

      <Section title="11. Contact">
        <p>For privacy-related inquiries, please use our official <a href="/contact" style={{ color: 'var(--gold)', textDecoration: 'none' }}>contact form</a>. We will respond within 2 business days.</p>
      </Section>
    </div>
  )
}
