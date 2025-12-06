'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

type AttemptAnswer = {
	id: number
	questionId: number
	selectedAnswer?: any
	isMarkedForReview: boolean
	isCorrect?: boolean
}

type QuestionOption = {
	id: number
	text: string
	isCorrect?: boolean
	optionOrder?: number
	groupId?: number
}

type QuestionGroup = {
	id: number
	label: string
	mode: string
	groupOrder?: number
}

type Question = {
	id: number
	type: string
	text: string
	attachments?: string
	explanation?: string
	question_option?: QuestionOption[]
	question_group?: QuestionGroup[]
}

type Attempt = {
	id: number
	examId: number
	questionIds: number[]
	totalQuestions: number
	expiresAt: string
	status: string
}

export default function SimulatorPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const attemptId = searchParams.get('attemptId')
	const supabase = createSupabaseBrowserClient()
	
	const [attempt, setAttempt] = useState<Attempt | null>(null)
	const [questions, setQuestions] = useState<Question[]>([])
	const [answers, setAnswers] = useState<AttemptAnswer[]>([])
	const [currentIndex, setCurrentIndex] = useState(0)
	const [timeRemaining, setTimeRemaining] = useState(0)
	const [loading, setLoading] = useState(true)
	const [showInstructions, setShowInstructions] = useState(false)
	const [userId, setUserId] = useState<string | null>(null)
	const [examMetadata, setExamMetadata] = useState<{ title: string; code: string; total: number } | null>(null)

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
			loadAttempt(userId)
		}
	}, [attemptId, userId])

	useEffect(() => {
		if (!attempt) return
		
		const interval = setInterval(() => {
			const now = new Date().getTime()
			const expiry = new Date(attempt.expiresAt).getTime()
			const diff = Math.max(0, expiry - now)
			setTimeRemaining(Math.floor(diff / 1000))

			if (diff <= 0) {
				handleSubmit()
			}
		}, 1000)

		return () => clearInterval(interval)
	}, [attempt])

	async function loadAttempt(resolvedUserId: string) {
		try {
			const res = await fetch(`${API_BASE}/attempts/${attemptId}?userId=${resolvedUserId}`)
			if (!res.ok) throw new Error('Failed to load attempt')
			const data = await res.json()
			setAttempt(data.attempt)
			setQuestions(data.questions)
			setAnswers(data.answers || [])
			if (data.exam) {
				setExamMetadata({
					title: data.exam.title,
					code: data.exam.code,
					total: data.exam.questionsPerMockTest ?? data.questions?.length ?? data.attempt?.totalQuestions ?? 0,
				})
			} else {
				setExamMetadata({
					title: `Exam #${data.attempt.examId}`,
					code: '',
					total: data.questions?.length ?? data.attempt?.totalQuestions ?? 0,
				})
			}
			setLoading(false)
		} catch (e) {
			console.error(e)
			alert('Failed to load exam')
			router.push('/')
		}
	}

	async function saveAnswer(questionId: number, selectedAnswer: any, isMarked: boolean = false) {
		if (!userId) return
		try {
			await fetch(`${API_BASE}/attempts/answer`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					attemptId: parseInt(attemptId!),
					userId,
					questionId,
					selectedAnswer,
					isMarkedForReview: isMarked,
				}),
			})

			// Update local state
			setAnswers(prev => {
				const existing = prev.find(a => a.questionId === questionId)
				if (existing) {
					return prev.map(a =>
						a.questionId === questionId
							? { ...a, selectedAnswer, isMarkedForReview: isMarked }
							: a
					)
				} else {
					return [...prev, { id: 0, questionId, selectedAnswer, isMarkedForReview: isMarked }]
				}
			})
		} catch (e) {
			console.error('Failed to save answer:', e)
		}
	}

	async function handleSubmit() {
		if (!userId) return
		const confirmed = confirm('Submit answers? This is your final submission and you cannot make changes afterward.')
		if (!confirmed) return

		try {
			await fetch(`${API_BASE}/attempts/${attemptId}/submit`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId }),
			})
			router.push(`/simulator/results?attemptId=${attemptId}`)
		} catch (e) {
			alert('Failed to submit exam')
		}
	}

	const currentQuestion = questions[currentIndex]
	const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id)

	const renderedOptions = useMemo(() => {
		if (!currentQuestion) {
			return null
		}

		const isMulti = currentQuestion.type === 'multi'

		return currentQuestion.question_option?.map(option => {
			const selected = isMulti
				? Array.isArray(currentAnswer?.selectedAnswer) && currentAnswer?.selectedAnswer?.includes(option.id)
				: currentAnswer?.selectedAnswer === option.id

			return (
				<label
					key={option.id}
					className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
						selected ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
					}`}
				>
					<input
						type={isMulti ? 'checkbox' : 'radio'}
						name={`question-${currentQuestion.id}`}
						checked={selected}
						onChange={(e) => {
							if (isMulti) {
								const currentSelection: number[] = Array.isArray(currentAnswer?.selectedAnswer)
									? currentAnswer?.selectedAnswer
									: []
								const newValue = e.target.checked
									? [...currentSelection, option.id]
									: currentSelection.filter(id => id !== option.id)
								handleSelect(newValue)
							} else {
								handleSelect(option.id)
							}
						}}
						className="mt-1"
					/>
					<span className="text-sm text-slate-700 flex-1" dangerouslySetInnerHTML={{ __html: option.text }} />
				</label>
			)
		})
	}, [currentQuestion, currentAnswer])

	if (loading || !attempt) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg">Loading exam...</div>
			</div>
		)
	}

	const answeredCount = answers.filter(a => a.selectedAnswer != null).length
	const markedCount = answers.filter(a => a.isMarkedForReview).length

	const hours = Math.floor(timeRemaining / 3600)
	const minutes = Math.floor((timeRemaining % 3600) / 60)
	const seconds = timeRemaining % 60
	const isTimeWarning = timeRemaining < 300 // Less than 5 minutes

	function handlePrevious() {
		if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
	}

	function handleNext() {
		if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1)
	}

	function handleSelect(value: any) {
		saveAnswer(currentQuestion.id, value, currentAnswer?.isMarkedForReview || false)
	}

	function handleMarkToggle() {
		const newMarked = !currentAnswer?.isMarkedForReview
		saveAnswer(currentQuestion.id, currentAnswer?.selectedAnswer, newMarked)
	}

	return (
		<div className="flex flex-col h-screen bg-white">
			{/* Top Bar */}
			<div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-3 flex items-center justify-between shadow-md">
				<div className="flex items-center gap-4">
					<span className="font-semibold text-lg">EazyCertify Exam Simulator</span>
				</div>
				<div className="flex items-center gap-6">
					<div className="text-center">
						<div className="text-xs opacity-90">Question</div>
						<div className="font-bold text-xl">{currentIndex + 1}</div>
					</div>
					<div className="text-center">
						<div className="text-xs opacity-90">of {questions.length}</div>
					</div>
					<button
						onClick={() => setShowInstructions(!showInstructions)}
						className="text-sm underline hover:opacity-80"
					>
						Instructions
					</button>
				</div>
			</div>

			{/* Timer and Progress */}
			<div className="bg-gray-100 px-6 py-2 flex items-center justify-between border-b">
				<div className="flex items-center gap-4">
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={currentAnswer?.isMarkedForReview || false}
							onChange={handleMarkToggle}
							className="w-4 h-4"
						/>
						<span className="text-sm font-medium">Mark for Review</span>
					</label>
				</div>
				<div className="flex items-center gap-6">
					<div className="text-sm">
						<span className="font-medium">Answered:</span> {answeredCount}/{questions.length}
					</div>
					<div className="text-sm">
						<span className="font-medium">Marked:</span> {markedCount}
					</div>
					<div className={`text-lg font-bold tabular-nums ${isTimeWarning ? 'text-red-600' : 'text-gray-900'}`}>
						{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
					</div>
				</div>
			</div>

			{/* Main Content */}
	<div className="flex-1 overflow-auto px-8 py-6">
				{currentQuestion && (
					<div className="max-w-4xl">
							<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
								<div className="flex items-center justify-between bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-3">
									<div>
										<h3 className="text-lg font-semibold">
											Question {currentIndex + 1} of {questions.length}
										</h3>
										{currentQuestion.topic && (
											<p className="text-sm text-blue-100">Topic {currentQuestion.topic}</p>
										)}
									</div>
									<label className="flex items-center gap-2 text-sm">
										<input
											type="checkbox"
											checked={currentAnswer?.isMarkedForReview || false}
											onChange={handleMarkToggle}
											className="accent-yellow-400 w-4 h-4"
										/>
										<span>Mark for Review</span>
									</label>
								</div>

								<div className="p-6">
									<div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
										{currentQuestion.type}
									</div>
									<div className="prose prose-slate max-w-none mb-6" dangerouslySetInnerHTML={{ __html: currentQuestion.text }} />

									{currentQuestion.question_option && currentQuestion.question_option.length > 0 ? (
										<div className="space-y-3">
											{renderedOptions}
										</div>
									) : (
										<div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
											This question type is currently view-only. Please review the scenario and proceed to the next question.
										</div>
									)}
								</div>
							</div>
					</div>
				)}
			</div>

			{/* Bottom Controls */}
			<div className="bg-gray-100 px-6 py-4 flex items-center justify-between border-t">
				<div className="flex gap-3">
					<button
						onClick={handlePrevious}
						disabled={currentIndex === 0}
						className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
					>
						Previous
					</button>
					<button
						onClick={handleNext}
						disabled={currentIndex === questions.length - 1}
						className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
					>
						Next
					</button>
				</div>
				<div className="flex gap-3">
					<button className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800">
						Save Session
					</button>
					<button
						onClick={handleSubmit}
						className="px-6 py-2 bg-red-700 text-white rounded hover:bg-red-800"
					>
						Submit Exam
					</button>
				</div>
			</div>

			{/* Instructions Modal */}
			{showInstructions && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
						<h2 className="text-2xl font-bold mb-4">Exam Instructions</h2>
						<div className="space-y-3 text-sm">
							<p>• Use Previous and Next buttons to navigate between questions.</p>
							<p>• Mark questions for review by checking the "Mark for Review" box.</p>
							<p>• Your answers are saved automatically as you proceed.</p>
							<p>• The timer shows time remaining. When it reaches 0, the exam will auto-submit.</p>
							<p>• Click "End Exam" when you're ready to submit.</p>
						</div>
						<button
							onClick={() => setShowInstructions(false)}
							className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
