// /app/app/widget/page.tsx
import { Code2 } from 'lucide-react'

export default function WidgetPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
          <Code2 className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">Widget</h2>
        <p className="mt-2 text-gray-600">Wird in Schritt 3E implementiert</p>
      </div>
    </div>
  )
}
