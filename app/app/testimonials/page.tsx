// /app/app/testimonials/page.tsx
import { MessageSquare } from 'lucide-react'

export default function TestimonialsPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <MessageSquare className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">Testimonials</h2>
        <p className="mt-2 text-gray-600">Wird in Schritt 3D implementiert</p>
      </div>
    </div>
  )
}
