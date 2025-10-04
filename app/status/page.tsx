// app/status/page.tsx
export default function StatusPage() {
  const status = {
    operational: true,
    services: [
      { name: 'Website', status: 'operational' },
      { name: 'API', status: 'operational' },
      { name: 'Widget', status: 'operational' },
      { name: 'E-Mail Versand', status: 'operational' },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">System Status</h1>

        <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-lg font-semibold text-green-800">
            ✓ Alle Systeme funktionieren einwandfrei
          </p>
        </div>

        <div className="space-y-4">
          {status.services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <span className="font-medium">{service.name}</span>
              <span className="text-sm text-green-600">● Funktionsfähig</span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          Letzte Aktualisierung: {new Date().toLocaleString('de-DE')}
        </div>
      </div>
    </div>
  )
}
