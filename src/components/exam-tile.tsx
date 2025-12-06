'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PricingModal from './PricingModal'

interface ExamTileProps {
	examId: number
	code: string
	title: string
	providerName: string
	totalQuestions: number
	freeQuestions?: number
	imageUrl?: string
	updatedAt?: string
	hot?: boolean
	expiresAt?: string
}

export default function ExamTile({
	examId,
	code,
	title,
	providerName,
	totalQuestions,
	freeQuestions = 15,
	imageUrl,
	updatedAt,
	hot = false,
	expiresAt,
}: ExamTileProps) {
	const [showPricingModal, setShowPricingModal] = useState(false)

	return (
		<>
			<div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-1">
				{/* Top accent bar - changed to dark slate */}
				<div className="h-1.5 bg-slate-800"></div>

				<div className="p-6">
					{/* Badge/Logo Section */}
					<Link href={`/exams/${code}/details`} className="block mb-4">
						<div className="relative w-full aspect-[4/3] bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden group-hover:bg-slate-100 transition-colors duration-300">
							{imageUrl ? (
								<Image
									src={imageUrl}
									alt={`${code} certification badge`}
									fill
									className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
								/>
							) : (
								<div className="text-center p-4">
									<div className="w-24 h-24 mx-auto mb-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
										<div className="text-center">
											<div className="text-xs text-slate-500 font-semibold mb-1">{providerName}</div>
											<div className="text-slate-900 font-bold text-sm">CERTIFIED</div>
										</div>
									</div>
									<div className="text-slate-600 font-semibold text-sm">{title}</div>
								</div>
							)}
						</div>
					</Link>

					{/* Exam Info */}
					<div className="mb-4">
						<div className="flex items-center gap-2 mb-2">
							<Link href={`/exams/${code}/details`} className="font-bold text-xl text-slate-800 hover:text-blue-600 transition-colors">
								{code}
							</Link>
							{hot && (
								<span className="bg-orange-100 text-orange-700 border border-orange-200 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
									<span>🔥</span> Hot
								</span>
							)}
						</div>
						<Link href={`/exams/${code}/details`}>
							<h3 className="font-semibold text-slate-600 group-hover:text-slate-900 transition-colors leading-tight line-clamp-2">
								{title}
							</h3>
						</Link>
					</div>

					{/* Stats */}
					<div className="flex items-center gap-4 mb-6 border-t border-slate-100 pt-4">
						<div className="flex items-center gap-1.5 text-sm text-slate-500">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							<span className="font-medium">{totalQuestions} Qs</span>
						</div>
						<div className="flex items-center gap-1.5 text-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
							<span className="font-medium">{freeQuestions} Free</span>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-3">
						<Link
							href={`/exams/${code}/details`}
							className="flex-1 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all text-center flex items-center justify-center"
						>
							View Exam
						</Link>
						{expiresAt ? null : (
							<button 
								onClick={() => setShowPricingModal(true)}
								className="flex-1 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 hover:shadow-lg transition-all flex items-center justify-center gap-2"
							>
								<span>Buy</span>
								<svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
								</svg>
							</button>
						)}
					</div>
				</div>
			</div>
			
			{/* Pricing Modal */}
			{showPricingModal && (
				<PricingModal
					examId={examId}
					examCode={code}
					examTitle={title}
					onClose={() => setShowPricingModal(false)}
				/>
			)}
		</>
	)
}
