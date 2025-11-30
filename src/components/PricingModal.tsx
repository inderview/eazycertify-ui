'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

interface PricingModalProps {
	examId: number
	examCode: string
	examTitle: string
	onClose: () => void
}

export default function PricingModal({ examId, examCode, examTitle, onClose }: PricingModalProps) {
	const [selectedDuration, setSelectedDuration] = useState<'1month' | '3months' | '1year'>('3months')
	const [withAI, setWithAI] = useState(false)
	const [loading, setLoading] = useState(false)
    const supabase = createSupabaseBrowserClient()

	const pricing = {
		'1month': { base: 9.99, withAI: 19.99, label: '1 Month', popular: false },
		'3months': { base: 19.99, withAI: 39.99, label: '3 Months', popular: true },
		'1year': { base: 199.99, withAI: 399.99, label: '1 Year (Unlimited)', popular: false },
	}

	const currentPrice = withAI ? pricing[selectedDuration].withAI : pricing[selectedDuration].base

	const handleCheckout = async () => {
		setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        const userId = session?.user?.id

		try {
			const response = await fetch(`${API_BASE}/stripe/create-checkout-session`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					examId,
					examCode,
					examTitle,
					duration: selectedDuration,
					withAI,
                    userId,
				}),
			})

			const { url } = await response.json()
			window.location.href = url
		} catch (error) {
			console.error('Error creating checkout session:', error)
			alert('Failed to initiate checkout. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
				{/* Header */}
				<div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold">{examCode} - Contributor Access</h2>
							<p className="text-blue-100 mt-1">{examTitle}</p>
						</div>
						<button
							onClick={onClose}
							className="text-white/80 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
						>
							×
						</button>
					</div>
				</div>

				{/* Pricing Cards */}
				<div className="p-6 grid md:grid-cols-3 gap-4">
					{(Object.keys(pricing) as Array<keyof typeof pricing>).map((duration) => {
						const plan = pricing[duration]
						const isSelected = selectedDuration === duration
						const price = withAI ? plan.withAI : plan.base

						return (
							<div
								key={duration}
								onClick={() => setSelectedDuration(duration)}
								className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all ${
									isSelected
										? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
										: 'border-gray-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700'
								}`}
							>
								{plan.popular && (
									<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
										<span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
											MOST POPULAR
										</span>
									</div>
								)}

								<div className="text-center">
									<div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{plan.label}</div>
									<div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
										${price.toFixed(2)}
									</div>
									<div className="text-xs text-gray-500 dark:text-gray-400">One-Time Payment</div>
								</div>

								<div className="mt-6 space-y-3">
									<div className="flex items-center gap-2 text-sm">
										<span className="text-green-600">✓</span>
										<span className="text-gray-700 dark:text-gray-300">All Questions for 1 Exam</span>
									</div>
									<div className="flex items-center gap-2 text-sm">
										<span className="text-green-600">✓</span>
										<span className="text-gray-700 dark:text-gray-300">Community Discussions</span>
									</div>
									<div className="flex items-center gap-2 text-sm">
										<span className="text-green-600">✓</span>
										<span className="text-gray-700 dark:text-gray-300">No Captcha / Robot Checks</span>
									</div>
									<div className="flex items-center gap-2 text-sm">
										<span className="text-green-600">✓</span>
										<span className="text-gray-700 dark:text-gray-300">Includes New Updates</span>
									</div>
								</div>
							</div>
						)
					})}
				</div>

				{/* AI Assistant Toggle */}
				<div className="px-6 pb-4">
					<div
						onClick={() => setWithAI(!withAI)}
						className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
							withAI
								? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
								: 'border-gray-200 dark:border-zinc-700 hover:border-purple-300'
						}`}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<input
									type="checkbox"
									checked={withAI}
									onChange={(e) => setWithAI(e.target.checked)}
									className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
								/>
								<div>
									<div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
										🤖 AI Assistant
										<span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs px-2 py-0.5 rounded-full">
											Premium
										</span>
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
										Get instant explanations and personalized study guidance
									</div>
								</div>
							</div>
							<div className="text-right">
								<div className="text-sm text-gray-500 dark:text-gray-400">+${(currentPrice - (withAI ? currentPrice / 2 : 0)).toFixed(2)}</div>
							</div>
						</div>
					</div>
				</div>

				{/* Checkout Button */}
				<div className="px-6 pb-6">
					<button
						onClick={handleCheckout}
						disabled={loading}
						className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? (
							<span className="flex items-center justify-center gap-2">
								<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
								</svg>
								Processing...
							</span>
						) : (
							`Get ${pricing[selectedDuration].label} Access - $${currentPrice.toFixed(2)}`
						)}
					</button>
					<p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
						Secure checkout powered by Stripe • One-Time Payment
					</p>
				</div>
			</div>
		</div>
	)
}
