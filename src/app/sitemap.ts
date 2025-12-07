import { MetadataRoute } from 'next'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const BASE_URL = 'https://eazycertify.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/exams`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Fetch exams for dynamic routes
  let examRoutes: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${API_BASE}/exams`, { cache: 'no-store' })
    if (res.ok) {
      const exams = await res.json()
      examRoutes = exams.map((exam: any) => ({
        url: `${BASE_URL}/exams/${exam.code}`,
        lastModified: new Date(exam.updatedAt || exam.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

      // Add exam details pages
      const detailRoutes = exams.map((exam: any) => ({
        url: `${BASE_URL}/exams/${exam.code}/details`,
        lastModified: new Date(exam.updatedAt || exam.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))

      examRoutes = [...examRoutes, ...detailRoutes]
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return [...staticRoutes, ...examRoutes]
}
