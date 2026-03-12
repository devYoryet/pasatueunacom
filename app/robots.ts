import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/app/', '/api/'],
      },
    ],
    sitemap: 'https://eunacomgo.cl/sitemap.xml',
    host: 'https://eunacomgo.cl',
  }
}
