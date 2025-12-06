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
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-12 text-white text-center">
          <div className="container mx-auto px-4 max-w-6xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Have questions or feedback? We're here to help you on your certification journey.
            </p>
          </div>
        </section>

        <section className="py-8 bg-slate-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Info Cards */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">Email Support</h3>
                  <p className="text-slate-600 text-sm mb-3">For general inquiries and support</p>
                  <a href="mailto:support@eazycertify.com" className="text-blue-600 hover:text-blue-700 font-medium">
                    support@eazycertify.com
                  </a>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">Response Time</h3>
                  <p className="text-slate-600 text-sm mb-2">We aim to respond quickly</p>
                  <p className="text-slate-900 font-medium">1-2 business days</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">24/7 Support</h3>
                  <p className="text-slate-600 text-sm mb-2">Always here for you</p>
                  <p className="text-slate-900 font-medium">Round the clock availability</p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                        <input
                          type="text"
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                          placeholder="Your name"
                          {...register('name', { required: true, minLength: 2, maxLength: 200 })}
                        />
                        {errors.name && <p className="text-sm text-red-600 mt-1">Please enter your name (2-200 characters).</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
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
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                        placeholder="Brief subject"
                        {...register('subject', { required: true, minLength: 3, maxLength: 200 })}
                      />
                      {errors.subject && <p className="text-sm text-red-600 mt-1">Please enter a subject (3-200 characters).</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Reason</label>
                      <select
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                          placeholder="Tell us more about your inquiry"
                          {...register('reasonOther', { required: true, minLength: 3, maxLength: 200 })}
                        />
                        {errors.reasonOther && <p className="text-sm text-red-600 mt-1">Please describe your reason (3-200 characters).</p>}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                      <textarea
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 min-h-[160px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none bg-slate-50 focus:bg-white"
                        placeholder="How can we help? Please include as many details as possible."
                        {...register('message', { required: true, minLength: 10, maxLength: 5000 })}
                      />
                      {errors.message && <p className="text-sm text-red-600 mt-1">Please enter a message (10-5000 characters).</p>}
                    </div>

                    {serverError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-center gap-2" role="alert">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {serverError}
                      </div>
                    )}
                    
                    {successId && !serverError && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4" role="status">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-green-700 font-bold">Message Sent Successfully!</p>
                            <p className="text-sm text-green-600 mt-1">We've received your inquiry and will get back to you shortly.</p>
                            <p className="text-xs text-green-500 mt-2">Ticket ID: <span className="font-mono bg-green-100 px-1 py-0.5 rounded">{successId}</span></p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : 'Send Message'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
