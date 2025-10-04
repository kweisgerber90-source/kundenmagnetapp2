// app/robots.ts
import { BRAND } from '@/lib/constants'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = `https://${BRAND.domain}`

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/app/', '/api/', '/login', '/register'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/api/widget', '/widget/'],
        disallow: ['/app/', '/api/', '/login', '/register'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
