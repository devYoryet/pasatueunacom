import type { MetadataRoute } from 'next'

const baseUrl = 'https://eunacomgo.cl'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  const routes = [
    '',
    '/login',
    '/register',
    '/eunacom/que-es',
    '/eunacom/fechas-y-modalidades',
    '/eunacom/guia-estudio',
    '/eunacom/normativa-2026',
  ]

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }))
}

