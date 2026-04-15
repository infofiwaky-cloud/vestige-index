import { createRootRoute, HeadContent, Scripts, Outlet } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { NewsTicker } from '@/components/NewsTicker'
import { SITE } from '@/config/constants'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: SITE.name + ' — Institutional Tokenized Index Platform' },
      { name: 'description', content: 'Precision-weighted tokenized index funds across DeFi, Metaverse, and Data Economy sectors. Institutional infrastructure, non-custodial execution.' },
      { name: 'theme-color', content: '#000000' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=IBM+Plex+Mono:wght@300;400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-1)',
        padding: '3rem 0 2rem',
        marginTop: '4rem',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <div style={{ width: '22px', height: '22px', border: '1px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px' }}>
                <span style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: '0.875rem' }}>V</span>
              </div>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.18em', color: 'var(--text)', textTransform: 'uppercase' }}>
                VESTIGE INDEX
              </span>
            </div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: 'var(--text-3)', lineHeight: 1.6, margin: 0 }}>
              Institutional tokenized index infrastructure.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="label" style={{ marginBottom: '0.875rem' }}>Navigation</p>
            {[
              { to: '/', label: 'Home' },
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/markets', label: 'Markets' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label }) => (
              <a
                key={to}
                href={to}
                style={{
                  display: 'block',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.8rem',
                  color: 'var(--text-3)',
                  textDecoration: 'none',
                  padding: '0.2rem 0',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = 'var(--text-2)')}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = 'var(--text-3)')}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div>
            <p className="label" style={{ marginBottom: '0.875rem' }}>Legal</p>
            {[
              { to: '/privacy', label: 'Privacy Policy' },
              { to: '/disclaimer', label: 'Disclaimer' },
            ].map(({ to, label }) => (
              <a
                key={to}
                href={to}
                style={{
                  display: 'block',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.8rem',
                  color: 'var(--text-3)',
                  textDecoration: 'none',
                  padding: '0.2rem 0',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = 'var(--text-2)')}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = 'var(--text-3)')}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Contact info */}
          <div>
            <p className="label" style={{ marginBottom: '0.875rem' }}>Contact</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'var(--text-3)', margin: '0 0 0.5rem' }}>
              For institutional inquiries and support.
            </p>
            <a
              href="/contact"
              style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.72rem',
                color: 'var(--gold)',
                textDecoration: 'none',
                letterSpacing: '0.08em',
              }}
            >
              {SITE.url}
            </a>
          </div>
        </div>

        <div className="divider" style={{ marginBottom: '1.5rem' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--text-3)', margin: 0 }}>
            © {SITE.copyright}
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', color: 'var(--text-3)', margin: 0, maxWidth: '560px', textAlign: 'right', lineHeight: 1.5 }}>
            Digital assets involve significant risk. Past performance does not guarantee future results. VESTIGE INDEX does not provide financial, legal, or tax advice.
          </p>
        </div>
      </div>
    </footer>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('vestige_theme');if(t==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}})()` }} />
      </head>
      <body className="grain">
        <Header />
        <NewsTicker />
        <main style={{ minHeight: 'calc(100vh - 90px)' }}>
          {children}
        </main>
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
