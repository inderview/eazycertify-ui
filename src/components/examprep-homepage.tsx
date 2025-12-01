'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import ExamTile from './exam-tile'
import { Footer } from './footer'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'

interface Provider {
	id: number
	name: string
	logoUrl?: string
	status: string
	sortOrder: number
}

interface Exam {
	id: number
	code: string
	title: string
	version: string
	status: string
	timeLimitMinutes: number
	passingScorePercent: number
	totalQuestionsInBank: number
	questionsPerMockTest: number
	price?: number
	purchasable: boolean
	sortOrder: number
	imageUrl?: string
	createdAt: string
	updatedAt?: string
	providerId: number
	providerName: string
	providerLogoUrl?: string
}

export default function ExamPrepHomepage() {
	const [selectedCategory, setSelectedCategory] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')
	const [providers, setProviders] = useState<Provider[]>([])
	const [exams, setExams] = useState<Exam[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [showSuggestions, setShowSuggestions] = useState(false)
	const [suggestions, setSuggestions] = useState<Exam[]>([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				setError(null)

				const [providersRes, examsRes] = await Promise.all([
					fetch(`${API_BASE}/providers`),
					fetch(`${API_BASE}/exams`),
				])

				if (!providersRes.ok || !examsRes.ok) {
					throw new Error('Failed to fetch data')
				}

				const providersData = await providersRes.json()
				const examsData = await examsRes.json()

				setProviders(providersData)
				setExams(examsData)
			} catch (err) {
				console.error('Error fetching data:', err)
				setError('Failed to load exam data. Please try again later.')
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	// Update suggestions when search query changes
	useEffect(() => {
		if (searchQuery.trim().length > 0) {
			const filtered = exams.filter((exam) =>
				exam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
				exam.title.toLowerCase().includes(searchQuery.toLowerCase())
			).slice(0, 5) // Limit to 5 suggestions
			setSuggestions(filtered)
			setShowSuggestions(true)
		} else {
			setSuggestions([])
			setShowSuggestions(false)
		}
	}, [searchQuery, exams])

	const handleSearch = () => {
		if (searchQuery.trim()) {
			// Navigate to exams page with search query
			window.location.href = `/exams?search=${encodeURIComponent(searchQuery)}`
		}
	}

	const handleSuggestionClick = (examCode: string) => {
		setSearchQuery(examCode)
		setShowSuggestions(false)
		window.location.href = `/exams?search=${encodeURIComponent(examCode)}`
	}

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	// Map provider names to category IDs
	const providerToCategory: Record<string, string> = {
		'Microsoft Azure': 'microsoft',
		'Amazon AWS': 'aws',
		'Google Cloud': 'google',
		'Cisco': 'cisco',
		'CompTIA': 'comptia',
	}

	// Calculate exam counts per provider
	const getCategoryCount = (providerName: string): number => {
		const categoryId = providerToCategory[providerName]
		return exams.filter(exam => providerToCategory[exam.providerName] === categoryId).length
	}

	// Build categories dynamically from providers
	const categories = [
		{ id: 'all', name: 'All Providers', count: exams.length, icon: '🌐', color: 'from-blue-600 to-indigo-600' },
		...providers.map(provider => {
			const categoryId = providerToCategory[provider.name] || provider.name.toLowerCase().replace(/\s+/g, '')
			return {
				id: categoryId,
				name: provider.name,
				count: getCategoryCount(provider.name),
				icon: categoryId === 'microsoft' ? '🔷' : 
					   categoryId === 'aws' ? '🟠' :
					   categoryId === 'google' ? '🔴' :
					   categoryId === 'cisco' ? '🔵' :
					   categoryId === 'comptia' ? '🔶' : '📦',
				color: categoryId === 'microsoft' ? 'from-blue-500 to-cyan-400' :
					   categoryId === 'aws' ? 'from-orange-500 to-yellow-400' :
					   categoryId === 'google' ? 'from-red-500 to-yellow-400' :
					   categoryId === 'cisco' ? 'from-blue-600 to-blue-400' :
					   categoryId === 'comptia' ? 'from-red-600 to-red-400' : 'from-gray-500 to-gray-400',
			}
		}),
	]

	// Filter exams based on selected category and search query
	const filteredExams = exams.filter((exam) => {
		const categoryId = providerToCategory[exam.providerName]
		const matchesCategory = selectedCategory === 'all' || categoryId === selectedCategory
		const matchesSearch = 
			exam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
			exam.title.toLowerCase().includes(searchQuery.toLowerCase())
		
		return matchesCategory && matchesSearch
	})

	const getCategoryColor = (cat: string): string => {
		const c = categories.find((c) => c.id === cat)
		return c?.color || 'from-gray-500 to-gray-400'
	}

	// Determine if exam should be marked as "hot" based on code
	const isHotExam = (code: string): boolean => {
		return ['AZ-900', 'AZ-104', 'SAA-C03', 'GCP-ACE'].includes(code)
	}

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Hero Section */}
			<section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
				<div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
				<div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-20"></div>

				<div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
					<div className="text-center max-w-4xl mx-auto">
						<div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
							<span className="w-2 h-2 bg-green-400 rounded-full"></span>
							<span className="text-blue-200 text-sm font-medium">Over 45,000+ verified practice questions</span>
						</div>

						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
							Ace Your Certification
							<span className="block text-cyan-400">With Confidence</span>
						</h1>

						{/* Search Bar with Autosuggest */}
						<div className="max-w-2xl mx-auto mb-12 relative">
							<div className="bg-white rounded-2xl p-2 flex items-center shadow-2xl">
								<div className="pl-4 pr-2">
									<svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
								</div>
								<input
									type="text"
									placeholder="Search by exam code or name (e.g., AZ-900)"
									className="flex-1 px-3 py-3 text-slate-700 outline-none text-base"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyPress={handleKeyPress}
									onFocus={() => searchQuery && setShowSuggestions(true)}
									onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
								/>
								<button 
									onClick={handleSearch}
									className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
								>
									Search
								</button>
							</div>

							{/* Autosuggest Dropdown */}
							{showSuggestions && suggestions.length > 0 && (
								<div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
									{suggestions.map((exam) => (
										<button
											key={exam.id}
											onClick={() => handleSuggestionClick(exam.code)}
											className="w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
										>
											<div className="font-semibold text-slate-900">{exam.code}</div>
											<div className="text-sm text-slate-600 truncate">{exam.title}</div>
										</button>
									))}
								</div>
							)}
						</div>

						{/* Stats */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
							{[
								{ value: '156+', label: 'Practice Exams', icon: '📚' },
								{ value: '45K+', label: 'Questions', icon: '❓' },
								{ value: '120K+', label: 'Happy Users', icon: '👥' },
								{ value: '95%', label: 'Pass Rate', icon: '🏆' },
							].map((stat, i) => (
								<div key={i} className="bg-white/10 border border-white/10 rounded-2xl p-4 hover:bg-white/15">
									<div className="text-2xl mb-1">{stat.icon}</div>
									<div className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
									<div className="text-slate-400 text-sm">{stat.label}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Category Pills */}
			<section className="bg-white border-b border-slate-200 sticky top-16 z-40">
				<div className="max-w-7xl mx-auto px-4 lg:px-8">
					<div className="flex items-center gap-3 py-4 overflow-x-auto">
						{categories.map((cat) => (
							<button
								key={cat.id}
								onClick={() => setSelectedCategory(cat.id)}
								className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
									selectedCategory === cat.id
										? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
										: 'bg-slate-100 text-slate-600 hover:bg-slate-200'
								}`}
							>
								<span>{cat.icon}</span>
								<span>{cat.name}</span>
								<span
									className={`text-xs px-2 py-0.5 rounded-full ${
										selectedCategory === cat.id ? 'bg-white/20' : 'bg-slate-200'
									}`}
								>
									{cat.count}
								</span>
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
				<div className="flex flex-col xl:flex-row gap-8">
					{/* Sidebar */}
					<aside className="hidden xl:block w-72 flex-shrink-0">
						<div className="sticky top-40 space-y-6">
							{/* Quick Filters */}
							<div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
								<h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
									<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
										/>
									</svg>
									Quick Filters
								</h3>
								<div className="space-y-2">
									{['Recently Updated', 'Most Popular', 'Beginner Friendly', 'Advanced Level'].map((filter, i) => (
										<label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
											<input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600" />
											<span className="text-sm text-slate-600">{filter}</span>
										</label>
									))}
								</div>
							</div>

							{/* Pricing Card */}
							<div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
								<h3 className="font-semibold text-lg mb-2">🎯 Unlimited Access</h3>
								<p className="text-white/90 text-sm mb-4">
									Get full access to all practice exams and questions
								</p>
								<button className="w-full bg-white text-emerald-600 font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
									View Plans
								</button>
							</div>
						</div>
					</aside>

					{/* Exam Grid */}
					<div className="flex-1">
						{/* Loading State */}
						{loading && (
							<div className="flex items-center justify-center py-20">
								<div className="text-center">
									<div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
									<p className="text-slate-600">Loading exams...</p>
								</div>
							</div>
						)}

						{/* Error State */}
						{error && (
							<div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
								<div className="text-red-600 text-4xl mb-2">⚠️</div>
								<h3 className="text-red-800 font-semibold mb-2">Error Loading Exams</h3>
								<p className="text-red-600 text-sm">{error}</p>
							</div>
						)}

						{/* Exams Grid */}
						{!loading && !error && (
							<>
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-2xl font-bold text-slate-800">
										{selectedCategory === 'all' ? 'All Exams' : `${categories.find(c => c.id === selectedCategory)?.name} Exams`}
									</h2>
									<span className="text-slate-600 text-sm">
										{filteredExams.length} {filteredExams.length === 1 ? 'exam' : 'exams'} found
									</span>
								</div>

								{filteredExams.length === 0 ? (
									<div className="bg-slate-100 rounded-xl p-12 text-center">
										<div className="text-6xl mb-4">🔍</div>
										<h3 className="text-xl font-semibold text-slate-700 mb-2">No exams found</h3>
										<p className="text-slate-600">Try adjusting your search or filter criteria</p>
									</div>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{filteredExams.map((exam) => (
											<ExamTile
												key={exam.id}
												code={exam.code}
												title={exam.title}
												providerName={exam.providerName}
												totalQuestions={exam.totalQuestionsInBank}
												imageUrl={exam.imageUrl}
												hot={isHotExam(exam.code)}
											/>
										))}
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</main>

			{/* Footer */}
			<Footer />
		</div>
	)
}
