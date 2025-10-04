// app/pricing/page.tsx (updated with better design)
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BRAND } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="bg-gradient-to-b from-white via-blue-50/20 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold">Einfache, transparente Preise</h1>
          <p className="mb-12 text-lg text-gray-600">
            Wählen Sie den Plan, der zu Ihrem Unternehmen passt. Jederzeit kündbar.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {Object.entries(BRAND.plans).map(([key, plan]) => (
            <Card
              key={key}
              className={cn(
                'relative overflow-hidden transition-all hover:scale-105',
                key === 'pro' && 'border-2 border-blue-500 shadow-xl',
              )}
            >
              {key === 'pro' && (
                <div className="absolute -right-8 top-6 rotate-45 bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-1 text-xs font-semibold text-white shadow-sm">
                  BELIEBT
                </div>
              )}
              <CardHeader
                className={key === 'pro' ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : ''}
              >
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  {key === 'starter' && 'Perfekt für kleine Unternehmen'}
                  {key === 'pro' && 'Für wachsende Unternehmen'}
                  {key === 'business' && 'Für größere Teams'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-2xl">{plan.currency}</span>
                  <span className="text-gray-600">/Monat</span>
                </div>
                <ul className="space-y-3">
                  {key === 'starter' && (
                    <>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm">Bis zu 3 Kampagnen</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm">50 Testimonials/Monat</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm">Standard Widget</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm">E-Mail Support</span>
                      </li>
                    </>
                  )}
                  {key === 'pro' && (
                    <>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm">Bis zu 10 Kampagnen</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm">200 Testimonials/Monat</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm">Anpassbares Widget</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm">QR-Code Generator</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm">Priority Support</span>
                      </li>
                    </>
                  )}
                  {key === 'business' && (
                    <>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm">Unbegrenzte Kampagnen</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm">Unbegrenzte Testimonials</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm">White-Label Widget</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm">Erweiterte Analytics</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm">API-Zugriff</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm">Dedizierter Support</span>
                      </li>
                    </>
                  )}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={cn(
                    'w-full',
                    key === 'pro'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                      : 'hover:shadow-md',
                  )}
                  variant={key === 'pro' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/register">
                    {key === 'pro' && <Sparkles className="mr-2 h-4 w-4" />}
                    Jetzt starten
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
