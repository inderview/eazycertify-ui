import Image from 'next/image'
import ExamPrepHomepage from '../components/examprep-homepage'
import { Header } from '../components/header'
import { generateSEOMetadata } from '@/components/seo/seo-head'
import { StructuredData, schemas } from '@/components/seo/structured-data'

export const metadata = generateSEOMetadata({
  title: 'EazyCertify - Premium Certification Exam Practice Platform',
  description: 'Master cloud certifications with EazyCertify. Practice exams for Azure, AWS, Google Cloud, and more. Realistic questions, detailed explanations, and pass guarantees.',
  keywords: [
    'certification practice exams',
    'azure certification',
    'aws certification',
    'cloud certification',
    'exam preparation',
    'practice tests',
    'AZ-305',
    'AZ-104',
    'Azure Solutions Architect',
  ],
  ogImage: 'https://eazycertify.com/og-home.png',
})

export default function Home () {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StructuredData data={schemas.organization()} />
      <Header />
      <ExamPrepHomepage />
    </div>
  )
}
