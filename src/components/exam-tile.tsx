'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ExamTileProps {
	code: string
	title: string
	providerName: string
	totalQuestions: number
	freeQuestions?: number
	imageUrl?: string
	updatedAt?: string
	hot?: boolean
}

export default function ExamTile({
	code,
	title,
	providerName,
	totalQuestions,
	freeQuestions = 15,
	imageUrl,
	updatedAt,
	hot = false,
}: ExamTileProps) {
	return (
		<div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
			{/* Top accent bar */}
			<div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

			<div className="p-6">
				{/* Badge/Logo Section */}
				<Link href={`/exams/${code}/details`} className="block mb-4">
					<div className="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
						{imageUrl ? (
							<Image
								src={imageUrl}
								alt={`${code} certification badge`}
								fill
								className="object-contain p-4"
							/>
						) : (
							<div className="text-center p-4">
								<div className="w-24 h-24 mx-auto mb-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
									<div className="text-center">
										<div className="text-xs text-blue-200 font-semibold mb-1">{providerName}</div>
										<div className="text-white font-bold text-sm">CERTIFIED</div>
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
						<Link href={`/exams/${code}/details`} className="font-bold text-xl text-blue-600 hover:underline">
							{code}
						</Link>
						{hot && (
							<span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
								🔥 Hot
							</span>
						)}
					</div>
					<Link href={`/exams/${code}/details`}>
						<h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
							{title}
						</h3>
					</Link>
				</div>

				{/* Stats */}
				<div className="flex items-center gap-3 mb-4">
					<div className="flex items-center gap-1.5 text-sm text-slate-600">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						<span className="font-medium">{totalQuestions} Qs</span>
					</div>
					<div className="flex items-center gap-1.5 text-sm text-emerald-600">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
						</svg>
						<span className="font-medium">{freeQuestions} Free</span>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-2">
					<button className="flex-1 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all">
						Preview
					</button>
					<Link
						href={`/exams/${code}/details`}
						className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all text-center"
					>
						View Exam
					</Link>
				</div>
			</div>
		</div>
	)
}
