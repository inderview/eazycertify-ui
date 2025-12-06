'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-12 text-white">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Empowering Your Certification Journey</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We bridge the gap between learning and certification with realistic, high-quality practice exams designed by industry experts.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-slate-600">
                  <p>
                    Founded in 2022, EazyCertify emerged from a simple observation: while there were many resources to learn technology, there were few that truly prepared professionals for the rigors of certification exams.
                  </p>
                  <p>
                    What started as a small project by a group of certified cloud architects has grown into a comprehensive platform trusted by thousands of professionals worldwide. We've spent the last few years refining our question banks, perfecting our simulation engine, and building a community of learners.
                  </p>
                  <p>
                    Today, we are proud to be a go-to resource for certifications across Microsoft Azure, AWS, Google Cloud, and more, helping individuals advance their careers and organizations upskill their workforce.
                  </p>
                </div>
              </div>
              <div className="relative h-80 bg-slate-100 rounded-2xl overflow-hidden shadow-lg">
                {/* Placeholder for an office or team image */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400">
                   <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                   </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission & Values</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Our purpose is simple: to make certification success accessible to everyone. We are guided by a core set of values that define everything we do.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Quality First',
                  description: 'We believe in quality over quantity. Every question is rigorously reviewed by subject matter experts to ensure accuracy and relevance.',
                  icon: (
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: 'Accessibility',
                  description: 'Education should be accessible. We strive to keep our platform affordable and easy to use on any device, anywhere in the world.',
                  icon: (
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  )
                },
                {
                  title: 'Continuous Innovation',
                  description: 'The tech landscape never stops evolving, and neither do we. We constantly update our content and platform features to stay ahead.',
                  icon: (
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                }
              ].map((value, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">3+</div>
                <div className="text-slate-400">Years of Experience</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">45K+</div>
                <div className="text-slate-400">Practice Questions</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">120K+</div>
                <div className="text-slate-400">Users Helped</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">95%</div>
                <div className="text-slate-400">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Roles & Responsibility */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Commitment</h2>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <p className="text-slate-600 mb-6">
                At EazyCertify, we take our role in your career journey seriously. Our responsibilities extend beyond just providing questions:
              </p>
              <ul className="space-y-4">
                {[
                  "To provide the most accurate and up-to-date exam simulations possible.",
                  "To maintain a secure and reliable platform for your studies.",
                  "To listen to user feedback and continuously improve our offerings.",
                  "To support our community with responsive customer service.",
                  "To operate with transparency and integrity in all our business practices."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <svg className="w-6 h-6 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
