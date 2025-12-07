import Script from 'next/script'

interface StructuredDataProps {
  data: any
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Schema generators
export const schemas = {
  // Organization schema for the site
  organization: () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EazyCertify',
    url: 'https://eazycertify.com',
    logo: 'https://eazycertify.com/logo.png',
    description: 'Premium certification exam practice platform for cloud professionals',
    sameAs: [
      'https://twitter.com/eazycertify',
      'https://linkedin.com/company/eazycertify',
    ],
  }),

  // Course schema for exams
  course: (exam: any) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${exam.code}: ${exam.title}`,
    description: `Practice exam for ${exam.title}. Master ${exam.code} certification with ${exam.totalQuestionsInBank} practice questions.`,
    provider: {
      '@type': 'Organization',
      name: 'EazyCertify',
      url: 'https://eazycertify.com',
    },
    educationalLevel: 'Professional',
    courseCode: exam.code,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${exam.timeLimitMinutes}M`,
    },
  }),

  // BreadcrumbList schema
  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  // Product schema for paid exams
  product: (exam: any) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${exam.code} Practice Exam`,
    description: `Complete practice exam for ${exam.title} with ${exam.totalQuestionsInBank} questions`,
    image: exam.imageUrl,
    brand: {
      '@type': 'Brand',
      name: exam.providerName,
    },
    offers: {
      '@type': 'Offer',
      price: exam.price || '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://eazycertify.com/exams/${exam.code}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '250',
    },
  }),
}
