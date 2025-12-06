'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

type AttemptAnswer = {
	id: number
	questionId: number
	selectedAnswer?: any
	isMarkedForReview: boolean
	isCorrect?: boolean
	timeSpentSeconds?: number
}

type Question = {
	id: number
	type: string
	text: string
	explanation?: string
	referenceUrl?: string
	question_option?: Array<{
		id: number
		text: string
		isCorrect: boolean
	}>
}

type Attempt = {
	id: number
	examId: number
	score: number
	totalQuestions: number
	correctAnswers: number
	status: string
	completedAt: string
}

export default function ResultsPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const attemptId = searchParams.get('attemptId')
	const supabase = createSupabaseBrowserClient()

	const [attempt, setAttempt] = useState<Attempt | null>(null)
	const [questions, setQuestions] = useState<Question[]>([])
	const [answers, setAnswers] = useState<AttemptAnswer[]>([])
	const [loading, setLoading] = useState(true)
	const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all')
	const [userId, setUserId] = useState<string | null>(null)

	useEffect(() => {
		const loadUser = async () => {
			const { data: { session } } = await supabase.auth.getSession()
			if (!session?.user?.id) {
				router.push('/login')
				return
			}
			setUserId(session.user.id)
		}
		loadUser()
	}, [])

	useEffect(() => {
		if (!attemptId) {
			router.push('/')
			return
		}
		if (userId) {
			loadResults(userId)
		}
	}, [attemptId, userId])

	async function loadResults(resolvedUserId: string) {
		try {
			const res = await fetch(`${API_BASE}/attempts/${attemptId}?userId=${resolvedUserId}`)
			if (!res.ok) throw new Error('Failed to load results')
			const data = await res.json()
			setAttempt(data.attempt)
			setQuestions(data.questions)
			setAnswers(data.answers)
			setLoading(false)
		} catch (e) {
			console.error(e)
			alert('Failed to load results')
			router.push('/')
		}
	}

	if (loading || !attempt) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg">Loading results...</div>
			</div>
		)
	}

	const passed = attempt.score >= 70 // Adjust pass threshold as needed
	const filteredQuestions = questions.filter((q) => {
		const answer = answers.find(a => a.questionId === q.id)
		if (filter === 'correct') return answer?.isCorrect === true
		if (filter === 'incorrect') return answer?.isCorrect === false
		return true
	})

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<div className="max-w-5xl mx-auto px-6 py-8">
				{/* Score Card */}
				<div className={`rounded-lg shadow-lg p-8 mb-8 ${passed ? 'bg-gradient-to-r from-green-600 to-green-500' : 'bg-gradient-to-r from-red-600 to-red-500'} text-white`}>
					<div className="text-center">
						<h1 className="text-4xl font-bold mb-2">
							{passed ? '🎉 Congratulations!' : '😔 Keep Practicing!'}
						</h1>
						<p className="text-xl mb-6">
							{passed ? 'You passed the exam!' : 'You did not pass this time.'}
						</p>
						<div className="flex justify-center items-center gap-12 mb-6">
							<div>
								<div className="text-6xl font-bold">{attempt.score}%</div>
								<div className="text-sm opacity-90">Your Score</div>
							</div>
							<div>
								<div className="text-4xl font-bold">{attempt.correctAnswers}/{attempt.totalQuestions}</div>
								<div className="text-sm opacity-90">Correct Answers</div>
							</div>
						</div>
						<button
							onClick={() => router.push('/exams')}
							className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
						>
							Back to Exams
						</button>
					</div>
				</div>

				{/* Filter Tabs */}
				<div className="bg-white rounded-lg shadow mb-6">
					<div className="flex border-b">
						<button
							onClick={() => setFilter('all')}
							className={`flex-1 px-6 py-3 font-medium ${filter === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
						>
							All Questions ({questions.length})
						</button>
						<button
							onClick={() => setFilter('correct')}
							className={`flex-1 px-6 py-3 font-medium ${filter === 'correct' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
						>
							Correct ({attempt.correctAnswers})
						</button>
						<button
							onClick={() => setFilter('incorrect')}
							className={`flex-1 px-6 py-3 font-medium ${filter === 'incorrect' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600 hover:text-gray-900'}`}
						>
							Incorrect ({attempt.totalQuestions - attempt.correctAnswers})
						</button>
					</div>
				</div>

				{/* Questions Review */}
				<div className="space-y-6">
					{filteredQuestions.map((question, index) => {
						const answer = answers.find(a => a.questionId === question.id)
						const isCorrect = answer?.isCorrect
						const correctOptions = question.question_option?.filter(o => o.isCorrect) || []
						const userSelectedIds = Array.isArray(answer?.selectedAnswer) 
							? answer.selectedAnswer 
							: answer?.selectedAnswer ? [answer.selectedAnswer] : []

						return (
							<div key={question.id} className="bg-white rounded-lg shadow-md p-6">
								{/* Question Header */}
								<div className="flex items-start justify-between mb-4">
									<div className="flex items-center gap-3">
										<span className={`px-3 py-1 rounded-full text-sm font-bold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
											{isCorrect ? '✓ Correct' : '✗ Incorrect'}
										</span>
										<span className="text-sm text-gray-500">Question {index + 1}</span>
									</div>
									<span className="text-xs text-gray-400 uppercase">{question.type}</span>
								</div>

								{/* Question Text */}
								<div className="mb-4">
									<div 
										className="text-lg leading-relaxed text-gray-900"
										dangerouslySetInnerHTML={{ __html: question.text }}
									/>
								</div>

								{/* Options */}
								<div className="space-y-2 mb-4">
									{question.question_option?.map(option => {
										const isUserSelected = userSelectedIds.includes(option.id)
										const isThisCorrect = option.isCorrect

										let bgClass = 'bg-gray-50'
										let borderClass = 'border-gray-200'
										let textClass = 'text-gray-900'

										if (isThisCorrect && isUserSelected) {
											// User selected and it's correct
											bgClass = 'bg-green-50'
											borderClass = 'border-green-500'
											textClass = 'text-green-900'
										} else if (isThisCorrect && !isUserSelected) {
											// Correct answer but user didn't select
											bgClass = 'bg-blue-50'
											borderClass = 'border-blue-400 border-dashed'
											textClass = 'text-blue-900'
										} else if (!isThisCorrect && isUserSelected) {
											// User selected but it's wrong
											bgClass = 'bg-red-50'
											borderClass = 'border-red-500'
											textClass = 'text-red-900'
										}

										return (
											<div
												key={option.id}
												className={`flex items-start gap-3 p-3 border-2 rounded-lg ${bgClass} ${borderClass}`}
											>
												<div className="mt-1">
													{isUserSelected && (
														isThisCorrect ? (
															<span className="text-green-600">✓</span>
														) : (
															<span className="text-red-600">✗</span>
														)
													)}
													{!isUserSelected && isThisCorrect && (
														<span className="text-blue-600">→</span>
													)}
												</div>
												<span className={`flex-1 ${textClass}`}>{option.text}</span>
											</div>
										)
									})}
								</div>

								{/* Explanation */}
								{question.explanation && (
									<div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
										<div className="font-semibold text-blue-900 mb-1">Explanation:</div>
										<div className="text-blue-800 text-sm">{question.explanation}</div>
									</div>
								)}

								{/* Reference URL */}
								{question.referenceUrl && (
									<div className="mt-3">
										<a
											href={question.referenceUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm text-blue-600 hover:underline"
										>
											📚 Learn More →
										</a>
									</div>
								)}
							</div>
						)
					})}
				</div>

				{filteredQuestions.length === 0 && (
					<div className="bg-white rounded-lg shadow p-12 text-center">
						<p className="text-gray-500">No questions match the selected filter.</p>
					</div>
				)}
			</div>
		</div>
	)
}
