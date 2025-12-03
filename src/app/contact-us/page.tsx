'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { submitContact } from '@/lib/api'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

type Reason = 'bug' | 'suggestion' | 'feature_request' | 'support' | 'billing' | 'partnership' | 'other'

interface ContactFormValues {
  name: string
  email: string
  subject: string
  reason: Reason
  reasonOther?: string
  message: string
}

export default function ContactUsPage() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm<ContactFormValues>({
    defaultValues: { reason: 'support' }
  })
  const reason = watch('reason')
  const [serverError, setServerError] = React.useState<string>('')
  const [successId, setSuccessId] = React.useState<string>('')

  const onSubmit = async (values: ContactFormValues) => {
    setServerError('')
    setSuccessId('')
    try {
      const pageUrl = typeof window !== 'undefined' ? window.location.href : undefined
      const sanitized = {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        subject: values.subject.trim(),
        reason: values.reason,
        reasonOther: values.reason === 'other' && values.reasonOther ? values.reasonOther.trim() : undefined,
        message: values.message.trim(),
        pageUrl,
      }
      const res = await submitContact(sanitized)
      setSuccessId(res.id)
      reset({ reason: values.reason })
    } catch (err: any) {
      setServerError(err?.message || 'Failed to send your message. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Contact Form */}
      <section className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Contact Us</h1>
          <p className="text-slate-600">
            Tell us how we can help. We usually respond within 1-2 business days.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Your name"
                  {...register('name', { required: true, minLength: 2, maxLength: 200 })}
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">Please enter your name (2-200 characters).</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                  })}
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">Please enter a valid email address.</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Brief subject"
                {...register('subject', { required: true, minLength: 3, maxLength: 200 })}
              />
              {errors.subject && <p className="text-sm text-red-600 mt-1">Please enter a subject (3-200 characters).</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Reason</label>
              <select
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                {...register('reason', { required: true })}
              >
                <option value="support">Support</option>
                <option value="bug">Bug Report</option>
                <option value="suggestion">Suggestion</option>
                <option value="feature_request">Feature Request</option>
                <option value="billing">Billing</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>

            {reason === 'other' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Specify Other Reason</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Tell us more about your inquiry"
                  {...register('reasonOther', { required: true, minLength: 3, maxLength: 200 })}
                />
                {errors.reasonOther && <p className="text-sm text-red-600 mt-1">Please describe your reason (3-200 characters).</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <textarea
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                placeholder="How can we help? Please include as many details as possible."
                {...register('message', { required: true, minLength: 10, maxLength: 5000 })}
              />
              {errors.message && <p className="text-sm text-red-600 mt-1">Please enter a message (10-5000 characters).</p>}
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700" role="alert">
                {serverError}
              </div>
            )}
            
            {successId && !serverError && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4" role="status">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="text-sm text-green-700 font-medium">Thanks! Your message has been sent.</p>
                    <p className="text-xs text-green-600 mt-1">Ticket ID: <span className="font-mono">{successId}</span></p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Contact Methods - Moved to Bottom */}
      <section className="container mx-auto max-w-6xl px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Email Support</h3>
            <p className="text-slate-600 text-sm mb-3">Get help via email</p>
            <a href="mailto:support@eazycertify.com" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              support@eazycertify.com
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Response Time</h3>
            <p className="text-slate-600 text-sm mb-3">Quick turnaround</p>
            <p className="text-green-600 font-medium text-sm">1-2 business days</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">24/7 Support</h3>
            <p className="text-slate-600 text-sm mb-3">We're always here</p>
            <p className="text-purple-600 font-medium text-sm">Round the clock</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
