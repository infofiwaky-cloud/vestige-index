import { createFileRoute } from '@tanstack/react-router'
import { MarketTable } from '@/components/MarketTable'

export const Route = createFileRoute('/markets')({
  component: MarketsPage,
})

function MarketsPage() {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
      <MarketTable />
    </div>
  )
}
