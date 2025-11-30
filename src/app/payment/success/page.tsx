'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

interface SessionDetails {
	examCode: string
	examTitle: string
	duration: string
	withAI: boolean
	amount: number
	expiresAt: string
}

export default function PaymentSuccessPage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const sessionId = searchParams.get('session_id')
	
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null)

	useEffect(() => {
		if (!sessionId) {
			setError('No session ID provided')
			setLoading(false)
			return
		}

		// Fetch session details from backend
		fetch(`${API_BASE}/stripe/session/${sessionId}`)
			.then(res => {
				if (!res.ok) throw new Error('Failed to fetch session details')
				return res.json()
			})
			.then(data => {
				setSessionDetails(data)
				setLoading(false)
			})
			.catch(err => {
				console.error('Error fetching session:', err)
				setError('Failed to load payment details')
				setLoading(false)
			})
	}, [sessionId])

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-slate-600">Processing your payment...</p>
				</div>
			</div>
		)
	}

	if (error || !sessionDetails) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</div>
					<h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Error</h1>
					<p className="text-slate-600 mb-6">{error || 'Something went wrong'}</p>
					<Link
						href="/"
						className="inline-block bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
					>
						Return Home
					</Link>
				</div>
			</div>
		)
	}

	const durationLabels: Record<string, string> = {
		'1month': '1 Month',
		'3months': '3 Months',
		'1year': '1 Year'
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
				{/* Success Icon */}
				<div className="text-center mb-8">
					<div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
						<svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
					<p className="text-slate-600">Thank you for your purchase. Your access has been activated.</p>
				</div>

				{/* Purchase Details */}
				<div className="bg-slate-50 rounded-xl p-6 mb-6">
					<h2 className="text-lg font-semibold text-slate-900 mb-4">Purchase Details</h2>
					
					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<span className="text-slate-600">Exam:</span>
							<span className="font-semibold text-slate-900">{sessionDetails.examCode}</span>
						</div>
						
						<div className="flex justify-between items-start">
							<span className="text-slate-600">Title:</span>
							<span className="font-semibold text-slate-900 text-right max-w-xs">{sessionDetails.examTitle}</span>
						</div>
						
						<div className="flex justify-between items-center">
							<span className="text-slate-600">Duration:</span>
							<span className="font-semibold text-slate-900">{durationLabels[sessionDetails.duration] || sessionDetails.duration}</span>
						</div>
						
						{sessionDetails.withAI && (
							<div className="flex justify-between items-center">
								<span className="text-slate-600">AI Assistant:</span>
								<span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
									<span>🤖</span> Included
								</span>
							</div>
						)}
						
						<div className="flex justify-between items-center pt-3 border-t border-slate-200">
							<span className="text-slate-600">Amount Paid:</span>
							<span className="text-2xl font-bold text-emerald-600">${sessionDetails.amount.toFixed(2)}</span>
						</div>
						
						<div className="flex justify-between items-center">
							<span className="text-slate-600">Access Until:</span>
							<span className="font-semibold text-slate-900">
								{new Date(sessionDetails.expiresAt).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</span>
						</div>
					</div>
				</div>

				{/* What's Next */}
				<div className="bg-blue-50 rounded-xl p-6 mb-6">
					<h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
						<span className="text-blue-600">✨</span>
						What's Next?
					</h3>
					<ul className="space-y-2 text-sm text-slate-700">
						<li className="flex items-start gap-2">
							<span className="text-emerald-600 mt-0.5">✓</span>
							<span>Your exam access has been activated immediately</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-emerald-600 mt-0.5">✓</span>
							<span>You can start practicing questions right away</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-emerald-600 mt-0.5">✓</span>
							<span>A confirmation email has been sent to your inbox</span>
						</li>
						{sessionDetails.withAI && (
							<li className="flex items-start gap-2">
								<span className="text-purple-600 mt-0.5">🤖</span>
								<span>AI Assistant is ready to help you with explanations</span>
							</li>
						)}
					</ul>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-3">
					<Link
						href={`/exams/${sessionDetails.examCode}`}
						className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors text-center"
					>
						Start Practicing Now
					</Link>
					<Link
						href="/exams"
						className="flex-1 bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors text-center"
					>
						Browse More Exams
					</Link>
				</div>

				{/* Support Note */}
				<p className="text-center text-sm text-slate-500 mt-6">
					Need help? Contact us at <a href="mailto:support@eazycertify.com" className="text-blue-600 hover:underline">support@eazycertify.com</a>
				</p>
			</div>
		</div>
	)
}
