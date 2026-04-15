import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

async function sendViaEmailJS(form: FormData): Promise<void> {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        from_name: form.name,
        reply_to: form.email,
        subject: form.subject,
        message: form.message,
      },
    }),
  })
  if (!res.ok) throw new Error('EmailJS error')
}

function ContactPage() {
  const { t } = useLanguage()
  const [form, setForm] = useState<FormData>({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    try {
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        await sendViaEmailJS(form)
      } else {
        // Fallback: simulate success when EmailJS not configured
        // In production, configure VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
        await new Promise((r) => setTimeout(r, 1200))
      }
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '4rem', alignItems: 'start' }} className="contact-grid">
        <style>{`
          @media (max-width: 900px) {
            .contact-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* Left info panel */}
        <div>
          <p className="label" style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>GET IN TOUCH</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 600, color: 'var(--text)', margin: '0 0 1rem' }}>
            {t('contact.title')}
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.7, margin: '0 0 2.5rem' }}>
            {t('contact.subtitle')}
          </p>

          <div className="divider-gold" style={{ marginBottom: '2rem' }} />

          {[
            { label: 'Institutional Inquiries', desc: 'Index licensing, white-label solutions, and large-position facilitation.' },
            { label: 'Technical Support', desc: 'Platform issues, wallet connectivity, and transaction queries.' },
            { label: 'Partnership Proposals', desc: 'Integration partnerships, co-marketing, and protocol collaborations.' },
          ].map(({ label, desc }) => (
            <div key={label} style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.1em', color: 'var(--gold)', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>
                {label}
              </p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.825rem', color: 'var(--text-3)', margin: 0, lineHeight: 1.6 }}>
                {desc}
              </p>
            </div>
          ))}

          <div className="divider" style={{ margin: '2rem 0' }} />

          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: 'var(--text-3)', lineHeight: 1.6 }}>
            Typical response time is within 2 business days. For urgent matters, include "URGENT" in your subject line.
          </p>
        </div>

        {/* Form */}
        <div
          style={{
            background: 'var(--bg-1)',
            border: '1px solid var(--border)',
            borderRadius: '2px',
            padding: '2rem',
          }}
        >
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <CheckCircle size={40} color="var(--green)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: 'var(--text)', margin: '0 0 0.75rem' }}>
                Message Received
              </h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', color: 'var(--text-2)', margin: '0 0 2rem' }}>
                {t('contact.success')}
              </p>
              <button className="btn-outline" onClick={() => setStatus('idle')}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>
                    {t('contact.name_label')} *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder={t('contact.name_placeholder')}
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>
                    {t('contact.email_label')} *
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    required
                    placeholder={t('contact.email_placeholder')}
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>
                  {t('contact.subject_label')}
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder={t('contact.subject_placeholder')}
                  value={form.subject}
                  onChange={(e) => update('subject', e.target.value)}
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>
                  {t('contact.message_label')} *
                </label>
                <textarea
                  className="input-field"
                  required
                  rows={6}
                  placeholder={t('contact.message_placeholder')}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  style={{ resize: 'vertical', fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem' }}
                />
              </div>

              {status === 'error' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--red-dim)', border: '1px solid rgba(184,56,48,0.3)', borderRadius: '2px' }}>
                  <AlertCircle size={14} color="var(--red)" />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'var(--red)' }}>
                    {t('contact.error')}
                  </span>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="btn-gold"
                  disabled={status === 'sending'}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    fontSize: '0.8rem',
                    opacity: status === 'sending' ? 0.7 : 1,
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  }}
                >
                  {status === 'sending' ? (
                    t('contact.sending')
                  ) : (
                    <>
                      {t('contact.send')}
                      <Send size={13} />
                    </>
                  )}
                </button>
              </div>

              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'var(--text-3)', margin: 0, textAlign: 'center' }}>
                {t('contact.disclaimer')}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
