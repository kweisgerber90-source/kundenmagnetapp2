// /app/app/qr/page.tsx
import { QrCode } from 'lucide-react'

export default function QRPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
          <QrCode className="h-8 w-8 text-indigo-600" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">QR-Codes</h2>
        <p className="mt-2 text-gray-600">Wird in Schritt 3I implementiert</p>
      </div>
    </div>
  )
}
