// /app/app/einstellungen/page.tsx
import { Settings } from 'lucide-react'

export default function EinstellungenPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Settings className="h-8 w-8 text-gray-600" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">Einstellungen</h2>
        <p className="mt-2 text-gray-600">Profil & Präferenzen (später)</p>
      </div>
    </div>
  )
}
