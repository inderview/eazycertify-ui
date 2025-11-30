'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PaymentCancelPage() {
	const router = useRouter()

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
				{/* Cancel Icon */}
				<div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</div>

				<h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Cancelled</h1>
				<p className="text-slate-600 mb-8">
					Your payment was cancelled. No charges have been made to your account.
				</p>

				{/* Info Box */}
				<div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
					<h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
						<span className="text-blue-600">💡</span>
						Still interested?
					</h3>
					<p className="text-sm text-slate-700">
						You can return to browse our exams and complete your purchase anytime. 
						Your selected exam will be waiting for you.
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col gap-3">
					<button
						onClick={() => router.back()}
						className="w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
					>
						Try Again
					</button>
					<Link
						href="/exams"
						className="w-full bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors inline-block"
					>
						Browse Exams
					</Link>
					<Link
						href="/"
						className="text-slate-500 hover:text-slate-700 text-sm mt-2"
					>
						Return to Homepage
					</Link>
				</div>

				{/* Support Note */}
				<p className="text-sm text-slate-500 mt-6">
					Need help? Contact us at <a href="mailto:support@eazycertify.com" className="text-blue-600 hover:underline">support@eazycertify.com</a>
				</p>
			</div>
		</div>
	)
}
