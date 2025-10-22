// /app/app/abrechnung/page.tsx
import { CreditCard } from 'lucide-react'

export default function AbrechnungPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
          <CreditCard className="h-8 w-8 text-yellow-600" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">Abrechnung</h2>
        <p className="mt-2 text-gray-600">Wird in Schritt 4B implementiert</p>
      </div>
    </div>
  )
}
