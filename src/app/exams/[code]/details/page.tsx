import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import Link from 'next/link'

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

export default async function ExamDetailsPage({ params }: { params: { code: string } }) {
	const { code } = await params
	const exam = await getExam(code)

	if (!exam) {
		notFound()
	}

	const questionCount = await getQuestionCount(exam.id)

	return (
		<div className="min-h-screen bg-slate-50">
			<Header />

			<main className="mx-auto max-w-4xl px-4 py-10">
				{/* Breadcrumb */}
				<div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
					<Link href="/" className="hover:text-blue-600">Home</Link>
					<span>/</span>
					<Link href="/" className="hover:text-blue-600">Exams</Link>
					<span>/</span>
					<span className="text-slate-900 font-medium">{exam.code}</span>
				</div>

				{/* Main Card */}
				<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
					{/* Header */}
					<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 px-8 py-6">
						<h1 className="text-2xl font-bold text-slate-900 mb-2">
							{exam.code} - {exam.title}
						</h1>
						<p className="text-sm text-slate-600">
							Last updated on {new Date(exam.updated_at || exam.created_at).toLocaleDateString('en-US', { 
								year: 'numeric', 
								month: 'short', 
								day: '2-digit' 
							})}
						</p>
					</div>

					{/* Exam Details Table */}
					<div className="px-8 py-6">
						<div className="space-y-4 mb-6">
							<div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-slate-100">
								<div className="font-semibold text-slate-700">Vendor:</div>
								<div className="text-blue-600 font-medium">
									<Link href={`/?provider=${exam.provider_id}`} className="hover:underline">
										{exam.provider?.name || 'Unknown'}
									</Link>
								</div>
							</div>

							<div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-slate-100">
								<div className="font-semibold text-slate-700">Exam Code:</div>
								<div className="text-slate-900">{exam.code}</div>
							</div>

							<div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-slate-100">
								<div className="font-semibold text-slate-700">Exam Name:</div>
								<div className="text-slate-900">{exam.title}</div>
							</div>

							<div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-slate-100">
								<div className="font-semibold text-slate-700">Exam Questions:</div>
								<div className="text-slate-900">{questionCount}</div>
							</div>

							<div className="grid grid-cols-[140px_1fr] gap-4 py-3">
								<div className="font-semibold text-slate-700">Last Updated:</div>
								<div className="text-slate-900">
									{new Date(exam.updated_at || exam.created_at).toLocaleDateString('en-US', { 
										month: 'short', 
										day: '2-digit',
										year: 'numeric'
									})}
								</div>
							</div>
						</div>

						{/* Action Button */}
						<div className="mb-6">
							<Link
								href={`/exams/${exam.code}`}
								className="w-full block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all text-center"
							>
								Go to {exam.code} Questions
							</Link>
						</div>

						{/* Success Statistics */}
						<div className="flex items-center gap-2 bg-slate-50 rounded-xl p-4">
							<div className="flex -space-x-2">
								<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white"></div>
								<div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-white"></div>
								<div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 border-2 border-white"></div>
							</div>
							<p className="text-sm text-slate-700 flex-1">
								<span className="font-semibold">94%</span> student found the test questions almost same
							</p>
						</div>
					</div>
				</div>

				{/* Statistics Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
					<div className="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-lg transition-all">
						<div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
							94%
						</div>
						<h3 className="font-semibold text-slate-900 mb-2">Said the test questions were almost same</h3>
						<p className="text-sm text-slate-500">Based on student feedback</p>
					</div>

					<div className="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-lg transition-all">
						<div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
							97%
						</div>
						<h3 className="font-semibold text-slate-900 mb-2">Passed the exams with the material</h3>
						<p className="text-sm text-slate-500">Success rate from our users</p>
					</div>

					<div className="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-lg transition-all">
						<div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
							98%
						</div>
						<h3 className="font-semibold text-slate-900 mb-2">Found the study guides effective and helpful</h3>
						<p className="text-sm text-slate-500">Positive user reviews</p>
					</div>
				</div>
			</main>
		</div>
	)
}
