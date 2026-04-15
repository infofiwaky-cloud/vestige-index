import { createFileRoute } from '@tanstack/react-router'
import { useLanguage } from '@/hooks/useLanguage'
import { PortfolioDashboard } from '@/components/PortfolioDashboard'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { t } = useLanguage()
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
      <PortfolioDashboard />
    </div>
  )
}
