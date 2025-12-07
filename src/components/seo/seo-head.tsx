import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  keywords?: string[]
  noindex?: boolean
}

export function generateSEOMetadata({
  title,
  description,
  canonical,
  ogImage = 'https://eazycertify.com/og-image.png',
  ogType = 'website',
  keywords = [],
  noindex = false,
}: SEOProps): Metadata {
  const siteName = 'EazyCertify'
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`
  const baseUrl = 'https://eazycertify.com'
  const canonicalUrl = canonical || baseUrl

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'EazyCertify' }],
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: ogType,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@EazyCertify',
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}
