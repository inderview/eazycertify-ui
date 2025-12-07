import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import Link from 'next/link'
import { Metadata } from 'next'
import { generateSEOMetadata } from '@/components/seo/seo-head'
import { StructuredData, schemas } from '@/components/seo/structured-data'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function getExam(code: string) {
	const { data: exam, error } = await supabase
		.from('exam')
		.select(`
			*,
			provider (name, logo_url)
		`)
		.eq('code', code)
		.single()

	if (error || !exam) {
		return null
	}

	return exam
}

async function getQuestionCount(examId: number) {
	const { count, error } = await supabase
		.from('question')
		.select('*', { count: 'exact', head: true })
		.eq('exam_id', examId)
		.eq('status', 'published')

	if (error) {
		console.error('Error fetching question count:', error)
		return 0
	}

	return count || 0
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
	const { code } = await params
	const exam = await getExam(code)

	if (!exam) {
		return generateSEOMetadata({
			title: 'Exam Not Found',
			description: 'The requested exam could not be found.',
			noindex: true,
		})
	}

	return generateSEOMetadata({
		title: `${exam.code}: ${exam.title} - Practice Exam & Study Guide`,
		description: `Master ${exam.code} ${exam.title} with our comprehensive practice exam. Premium questions, detailed explanations, and a 98% pass rate. Start your certification journey today!`,
		keywords: [
			exam.code,
			exam.title,
			`${exam.code} practice exam`,
			`${exam.code} certification`,
			exam.provider?.name || '',
			'practice test',
			'exam prep',
		],
		canonical: `https://eazycertify.com/exams/${exam.code}/details`,
		ogImage: exam.imageUrl || 'https://eazycertify.com/og-exam.png',
	})
}

export default async function ExamDetailsPage({ params }: { params: { code: string } }) {
	const { code } = await params
	const exam = await getExam(code)

	if (!exam) {
		notFound()
	}

	const questionCount = await getQuestionCount(exam.id)

	// Prepare structured data
	const breadcrumbItems = [
		{ name: 'Home', url: 'https://eazycertify.com' },
		{ name: 'Exams', url: 'https://eazycertify.com/exams' },
		{ name: exam.code, url: `https://eazycertify.com/exams/${exam.code}/details` },
	]

	const examData = {
		...exam,
		totalQuestionsInBank: questionCount,
		providerName: exam.provider?.name,
	}

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			<StructuredData data={schemas.breadcrumb(breadcrumbItems)} />
			<StructuredData data={schemas.course(examData)} />
			{exam.price && <StructuredData data={schemas.product(examData)} />}
			<Header />

			{/* Hero Section */}
			<div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-12">
				<div className="container mx-auto px-4 max-w-6xl">
					{/* Breadcrumb */}
					<div className="flex items-center gap-2 text-sm text-blue-200 mb-6">
						<Link href="/" className="hover:text-white transition-colors">Home</Link>
						<span>/</span>
						<Link href="/exams" className="hover:text-white transition-colors">Exams</Link>
						<span>/</span>
						<span className="text-white font-medium">{exam.code}</span>
					</div>

					<div className="flex flex-col md:flex-row gap-8 items-start justify-between">
						<div>
							<div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1 mb-4 backdrop-blur-sm">
								<span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
								<span className="text-xs font-medium text-blue-100 uppercase tracking-wide">Verified Exam</span>
							</div>
							<h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
								{exam.code}: {exam.title}
							</h1>
							<p className="text-blue-100 text-lg max-w-2xl">
								Master the {exam.title} with our comprehensive practice questions and detailed explanations.
							</p>
						</div>
						
						<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[200px] text-center">
							<div className="text-sm text-blue-200 mb-1">Success Rate</div>
							<div className="text-3xl font-bold text-white">98.5%</div>
							<div className="text-xs text-blue-200 mt-1">Based on user feedback</div>
						</div>
					</div>
				</div>
			</div>

			<main className="flex-1 container mx-auto px-4 max-w-6xl -mt-10 mb-20 relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column: Exam Details */}
					<div className="lg:col-span-2 space-y-8">
						{/* Main Info Card */}
						<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
							<div className="p-6 border-b border-slate-100">
								<h2 className="text-xl font-bold text-slate-900">Exam Information</h2>
							</div>
							<div className="p-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
									<div>
										<div className="text-sm text-slate-500 mb-1">Vendor</div>
										<Link href={`/?provider=${exam.provider_id}`} className="text-blue-600 font-semibold hover:underline flex items-center gap-2">
											{exam.provider?.name || 'Unknown'}
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
											</svg>
										</Link>
									</div>
									<div>
										<div className="text-sm text-slate-500 mb-1">Exam Code</div>
										<div className="font-semibold text-slate-900">{exam.code}</div>
									</div>
									<div>
										<div className="text-sm text-slate-500 mb-1">Total Questions</div>
										<div className="font-semibold text-slate-900 flex items-center gap-2">
											{questionCount}
											<span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Premium Quality</span>
										</div>
									</div>
									<div>
										<div className="text-sm text-slate-500 mb-1">Last Updated</div>
										<div className="font-semibold text-slate-900">
											{new Date(exam.updated_at || exam.created_at).toLocaleDateString('en-US', { 
												month: 'long', 
												day: 'numeric',
												year: 'numeric'
											})}
										</div>
									</div>
								</div>

								<div className="mt-8 pt-8 border-t border-slate-100">
									<Link
										href={`/exams/${exam.code}`}
										className="w-full block bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
									>
										<span>Start Practicing Now</span>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
										</svg>
									</Link>
									<p className="text-center text-sm text-slate-500 mt-3">
										Instant access • 100% Money-back guarantee • Secure checkout
									</p>
								</div>
							</div>
						</div>

						{/* Features Section */}
						<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
							<h3 className="text-lg font-bold text-slate-900 mb-6">Why Choose Our Practice Exams?</h3>
							<div className="grid md:grid-cols-2 gap-6">
								{[
									{ title: 'Real Exam Simulation', desc: 'Experience the actual exam environment before test day.', icon: '🎯' },
									{ title: 'Detailed Explanations', desc: 'Understand the "why" behind every answer.', icon: '💡' },
									{ title: 'Always Up-to-Date', desc: 'Content regularly updated to match the latest exam objectives.', icon: '🔄' },
									{ title: 'Performance Tracking', desc: 'Identify your weak areas and focus your study time.', icon: 'bar_chart' }
								].map((feature, i) => (
									<div key={i} className="flex gap-4">
										<div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-xl shrink-0">
											{feature.icon === 'bar_chart' ? (
												<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
												</svg>
											) : feature.icon}
										</div>
										<div>
											<h4 className="font-semibold text-slate-900">{feature.title}</h4>
											<p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Right Column: Stats & Trust */}
					<div className="space-y-6">
						{/* Trust Score Card */}
						<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
							<h3 className="font-bold text-slate-900 mb-4">Community Feedback</h3>
							<div className="space-y-4">
								<div className="bg-slate-50 rounded-xl p-4">
									<div className="flex justify-between items-end mb-2">
										<span className="text-slate-600 font-medium">Question Similarity</span>
										<span className="text-green-600 font-bold">94%</span>
									</div>
									<div className="w-full bg-slate-200 rounded-full h-2">
										<div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
									</div>
								</div>
								<div className="bg-slate-50 rounded-xl p-4">
									<div className="flex justify-between items-end mb-2">
										<span className="text-slate-600 font-medium">Pass Rate</span>
										<span className="text-blue-600 font-bold">97%</span>
									</div>
									<div className="w-full bg-slate-200 rounded-full h-2">
										<div className="bg-blue-500 h-2 rounded-full" style={{ width: '97%' }}></div>
									</div>
								</div>
								<div className="bg-slate-50 rounded-xl p-4">
									<div className="flex justify-between items-end mb-2">
										<span className="text-slate-600 font-medium">Satisfaction</span>
										<span className="text-purple-600 font-bold">98%</span>
									</div>
									<div className="w-full bg-slate-200 rounded-full h-2">
										<div className="bg-purple-500 h-2 rounded-full" style={{ width: '98%' }}></div>
									</div>
								</div>
							</div>
						</div>

						{/* Guarantee Card */}
						<div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-6 text-white text-center">
							<div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
							</div>
							<h3 className="font-bold text-lg mb-2">Pass Guarantee</h3>
							<p className="text-slate-300 text-sm mb-4">
								We are so confident in our material that we offer a full refund if you don't pass your exam.
							</p>
							<Link href="/terms" className="text-blue-300 text-sm hover:text-white underline">
								View terms & conditions
							</Link>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
