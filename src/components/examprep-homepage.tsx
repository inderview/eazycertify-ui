'use client'

import React, { useState } from 'react'

export default function ExamPrepHomepage () {
	const [selectedCategory, setSelectedCategory] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')

	const categories = [
		{ id: 'all', name: 'All Providers', count: 156, icon: '🌐' },
		{ id: 'microsoft', name: 'Microsoft Azure', count: 48, icon: '🔷', color: 'from-blue-500 to-cyan-400' },
		{ id: 'aws', name: 'Amazon AWS', count: 32, icon: '🟠', color: 'from-orange-500 to-yellow-400' },
		{ id: 'google', name: 'Google Cloud', count: 24, icon: '🔴', color: 'from-red-500 to-yellow-400' },
		{ id: 'cisco', name: 'Cisco', count: 18, icon: '🔵', color: 'from-blue-600 to-blue-400' },
		{ id: 'comptia', name: 'CompTIA', count: 22, icon: '🔶', color: 'from-red-600 to-red-400' },
	]

	const popularExams = [
		{ code: 'AZ-900', name: 'Azure Fundamentals', questions: 285, preview: 15, prices: { m3: 19, y1: 29, life: 49 }, category: 'microsoft', hot: true, updated: '2 days ago' },
		{ code: 'AZ-104', name: 'Azure Administrator', questions: 420, preview: 15, prices: { m3: 29, y1: 39, life: 69 }, category: 'microsoft', hot: true, updated: '1 week ago' },
		{ code: 'AZ-204', name: 'Azure Developer Associate', questions: 380, preview: 15, prices: { m3: 29, y1: 39, life: 69 }, category: 'microsoft', updated: '3 days ago' },
		{ code: 'AZ-305', name: 'Azure Solutions Architect', questions: 340, preview: 15, prices: { m3: 29, y1: 39, life: 69 }, category: 'microsoft', updated: '5 days ago' },
		{ code: 'SAA-C03', name: 'Solutions Architect Associate', questions: 520, preview: 15, prices: { m3: 29, y1: 39, life: 69 }, category: 'aws', hot: true, updated: '1 day ago' },
		{ code: 'CLF-C02', name: 'Cloud Practitioner', questions: 380, preview: 15, prices: { m3: 19, y1: 29, life: 49 }, category: 'aws', updated: '4 days ago' },
		{ code: 'DVA-C02', name: 'Developer Associate', questions: 290, preview: 15, prices: { m3: 29, y1: 39, life: 69 }, category: 'aws', updated: '1 week ago' },
		{ code: 'GCP-ACE', name: 'Associate Cloud Engineer', questions: 245, preview: 15, prices: { m3: 29, y1: 39, life: 69 }, category: 'google', hot: true, updated: '2 days ago' },
		{ code: 'GCP-PCA', name: 'Professional Cloud Architect', questions: 312, preview: 15, prices: { m3: 34, y1: 44, life: 79 }, category: 'google', updated: '6 days ago' },
	]

	const filteredExams = popularExams.filter(
		(exam) =>
			(selectedCategory === 'all' || exam.category === selectedCategory) &&
			(exam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
				exam.name.toLowerCase().includes(searchQuery.toLowerCase())),
	)

	const getCategoryColor = (cat: string): string => {
		const c = categories.find((c) => c.id === cat)
		return c?.color || 'from-gray-500 to-gray-400'
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

						{/* Search Bar */}
						<div className="max-w-2xl mx-auto mb-12">
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
								/>
								<button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg">
									Search
								</button>
							</div>
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
								<div className="flex items-center gap-2 mb-3">
									<span className="text-2xl">💎</span>
									<h4 className="font-semibold">Flexible Plans</h4>
								</div>
								<ul className="space-y-2 text-sm text-emerald-50 mb-4">
									<li className="flex items-center gap-2">✓ 3-Month Access</li>
									<li className="flex items-center gap-2">✓ 1-Year Access</li>
									<li className="flex items-center gap-2">✓ Lifetime Access</li>
								</ul>
								<div className="text-xs text-emerald-100 bg-white/10 rounded-lg p-2 text-center">♾️ Unlimited practice exams included</div>
							</div>
						</div>
					</aside>

					{/* Exam Grid */}
					<div className="flex-1">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
							<div>
								<h2 className="text-2xl font-bold text-slate-800">
									{selectedCategory === 'all' ? 'All Exams' : categories.find((c) => c.id === selectedCategory)?.name}
								</h2>
								<p className="text-slate-500 text-sm mt-1">{filteredExams.length} exams available</p>
							</div>
							<select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600">
								<option>Most Popular</option>
								<option>Recently Updated</option>
								<option>Price: Low to High</option>
							</select>
						</div>

						{/* Exam Cards */}
						<div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
							{filteredExams.map((exam, i) => (
								<div
									key={i}
									className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
								>
									<div className={`h-2 bg-gradient-to-r ${getCategoryColor(exam.category)}`}></div>

									<div className="p-5">
										<div className="flex items-start justify-between mb-3">
											<div>
												<div className="flex items-center gap-2 mb-1">
													<span className="font-bold text-lg text-blue-600">{exam.code}</span>
													{exam.hot && (
														<span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">🔥 Hot</span>
													)}
												</div>
												<h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">{exam.name}</h3>
											</div>
										</div>

										<div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-4">
											<span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">📄 {exam.questions} Qs</span>
											<span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg">👁️ {exam.preview} Free</span>
										</div>

										{/* Pricing Row */}
										<div className="flex items-center gap-2 mb-4 p-3 bg-slate-50 rounded-xl">
											<div className="flex-1 text-center border-r border-slate-200">
												<div className="text-xs text-slate-400 mb-0.5">3 Month</div>
												<div className="font-bold text-slate-800">${exam.prices.m3}</div>
											</div>
											<div className="flex-1 text-center border-r border-slate-200">
												<div className="text-xs text-slate-400 mb-0.5">1 Year</div>
												<div className="font-bold text-slate-800">${exam.prices.y1}</div>
											</div>
											<div className="flex-1 text-center">
												<div className="text-xs text-slate-400 mb-0.5">Lifetime</div>
												<div className="font-bold text-blue-600">${exam.prices.life}</div>
											</div>
										</div>

										<div className="flex gap-2">
											<button className="flex-1 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all">Preview</button>
											<button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
												View Exam
											</button>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Load More */}
						<div className="text-center mt-10">
							<button className="bg-white text-slate-700 px-8 py-3 rounded-xl font-semibold border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-lg transition-all">
								Load More Exams →
							</button>
						</div>
					</div>
				</div>

				{/* Features Section */}
				<section className="mt-20">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-slate-800 mb-3">Why Professionals Choose EazyCertify</h2>
						<p className="text-slate-500 max-w-2xl mx-auto">Everything you need to pass your certification on the first attempt</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{[
							{ icon: '🎯', title: 'Realistic Exams', desc: 'Question patterns mirror actual vendor exams including case studies', color: 'from-blue-500 to-cyan-500' },
							{ icon: '♾️', title: 'Unlimited Practice', desc: 'Take as many practice exams as you need during your subscription', color: 'from-purple-500 to-pink-500' },
							{ icon: '🔒', title: 'Secure Access', desc: 'Single-device activation ensures your purchase is protected', color: 'from-emerald-500 to-teal-500' },
							{ icon: '📊', title: 'Progress Tracking', desc: 'Detailed analytics help you identify and improve weak areas', color: 'from-orange-500 to-red-500' },
						].map((feat, i) => (
							<div
								key={i}
								className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
							>
								<div
									className={`w-14 h-14 bg-gradient-to-br ${feat.color} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}
								>
									{feat.icon}
								</div>
								<h3 className="font-bold text-slate-800 mb-2 text-lg">{feat.title}</h3>
								<p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
							</div>
						))}
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="bg-slate-900 text-slate-400 py-12 mt-16">
				<div className="max-w-7xl mx-auto px-4 lg:px-8">
					<div className="grid md:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center gap-3 mb-4">
								<div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
									<span className="text-white font-bold">E</span>
								</div>
								<span className="font-bold text-white text-lg">EazyCertify</span>
							</div>
							<p className="text-sm">The trusted platform for cloud certification practice exams.</p>
						</div>
						<div>
							<h4 className="font-semibold text-white mb-4">Exams</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<a href="#" className="hover:text-white transition-colors">
										Microsoft Azure
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition-colors">
										Amazon AWS
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition-colors">
										Google Cloud
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition-colors">
										All Providers
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold text-white mb-4">Company</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<a href="#" className="hover:text-white transition-colors">
										About Us
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition-colors">
										Pricing
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition-colors">
										Contact
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition-colors">
										Blog
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold text-white mb-4">Support</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<a href="#" className="hover:text-white transition-colors">
										Help Center
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition-colors">
										Terms of Service
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition-colors">
										Privacy Policy
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition-colors">
										Device Transfer
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-slate-800 mt-10 pt-8 text-sm text-center">© 2025 EazyCertify. All rights reserved.</div>
				</div>
			</footer>
		</div>
	)
}

