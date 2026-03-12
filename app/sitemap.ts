import type { MetadataRoute } from 'next'

const baseUrl = 'https://eunacomgo.cl'

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

interface SitemapRoute {
  path: string
  changeFrequency: ChangeFrequency
  priority: number
}

const publicRoutes: SitemapRoute[] = [
  // Landing page — highest priority
  { path: '', changeFrequency: 'weekly', priority: 1.0 },

  // Auth pages
  { path: '/login', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/register', changeFrequency: 'monthly', priority: 0.5 },

  // EUNACOM content hub — high SEO value
  { path: '/eunacom/que-es', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/eunacom/fechas-y-modalidades', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/eunacom/guia-estudio', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/eunacom/normativa-2026', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/eunacom/especialidades', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/eunacom/preguntas-frecuentes', changeFrequency: 'monthly', priority: 0.85 },

  // Specialty pages — long-tail keyword targets
  { path: '/eunacom/especialidades/medicina-interna', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/eunacom/especialidades/pediatria', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/eunacom/especialidades/cirugia', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/eunacom/especialidades/obstetricia-ginecologia', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/eunacom/especialidades/salud-publica', changeFrequency: 'monthly', priority: 0.75 },
  { path: '/eunacom/especialidades/psiquiatria', changeFrequency: 'monthly', priority: 0.75 },
  { path: '/eunacom/especialidades/traumatologia', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/eunacom/especialidades/oftalmologia', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/eunacom/especialidades/otorrinolaringologia', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/eunacom/especialidades/dermatologia', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/eunacom/especialidades/urologia', changeFrequency: 'monthly', priority: 0.7 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  return publicRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
