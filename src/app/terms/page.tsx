'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-12 text-white text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl text-blue-100">
              Please read these terms carefully before using our platform.
            </p>
            <p className="text-sm text-blue-200 mt-4">Last updated: December 7, 2025</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-8 bg-slate-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12 prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                  Acceptance of Terms
                </h2>
                <p>
                  By accessing and using EazyCertify ("we," "our," or "us"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                  Description of Service
                </h2>
                <p>
                  EazyCertify provides online practice exams and study materials for various IT certifications (e.g., Microsoft Azure, AWS, Google Cloud). Our services are designed to help users prepare for these exams but are not official study guides from the certification providers.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                  User Accounts & Access Security
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Registration:</strong> You must provide accurate and complete information when creating an account.</li>
                  <li><strong>Single-User License:</strong> Your account is for your personal use only. Sharing account credentials with others is strictly prohibited.</li>
                  <li><strong>Device Restriction:</strong> To prevent unauthorized sharing, our system may lock your account if it detects access from multiple devices or suspicious activity. You agree to these security measures.</li>
                  <li><strong>Security:</strong> You are responsible for maintaining the confidentiality of your password and account.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                  Subscriptions & Payments
                </h2>
                <p>
                  We offer paid subscriptions for premium access to exam content. Payments are processed securely via third-party payment processors (e.g., Stripe).
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Pricing:</strong> Prices for subscriptions are displayed on the website and are subject to change.</li>
                  <li><strong>Billing:</strong> You authorize us to charge your payment method for the selected subscription plan.</li>
                  <li><strong>Renewal:</strong> Subscriptions generally do not auto-renew unless explicitly stated. Access expires at the end of the purchased period.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                  Refund Policy
                </h2>
                <p>
                  Due to the digital nature of our products (immediate access to content), all sales are generally final and non-refundable.
                </p>
                <p>
                  Exceptions may be made at our sole discretion in cases of:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Duplicate payments for the same item.</li>
                  <li>Technical issues preventing access that we cannot resolve.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                  Intellectual Property
                </h2>
                <p>
                  All content on EazyCertify, including questions, answers, explanations, text, graphics, and logos, is the property of EazyCertify or its licensors and is protected by copyright laws.
                </p>
                <p>
                  You may not:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Copy, reproduce, distribute, or create derivative works from our content.</li>
                  <li>Use automated tools (scrapers, bots) to access or collect data from our site.</li>
                  <li>Share or resell our content to third parties.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
                  Disclaimers & Limitation of Liability
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Not Affiliated:</strong> EazyCertify is an independent entity and is not affiliated with, endorsed by, or associated with Microsoft, Amazon, Google, Cisco, or any other certification provider.</li>
                  <li><strong>No Guarantee:</strong> While we strive for accuracy, we do not guarantee that our practice questions will exactly match the actual exam questions. Passing our practice exams does not guarantee passing the official certification exam.</li>
                  <li><strong>"As Is" Basis:</strong> The service is provided "as is" without warranties of any kind.</li>
                  <li><strong>Liability:</strong> In no event shall EazyCertify be liable for any indirect, incidental, special, or consequential damages arising out of your use of the service.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
                  Termination
                </h2>
                <p>
                  We reserve the right to suspend or terminate your account immediately, without prior notice or liability, for any reason, including if you breach these Terms (e.g., account sharing, scraping).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
                  Changes to Terms
                </h2>
                <p>
                  We reserve the right to modify these Terms at any time. Your continued use of the service after any changes constitutes your acceptance of the new Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">10</span>
                  Contact Us
                </h2>
                <p>
                  If you have any questions about these Terms, please contact us at <a href="mailto:support@eazycertify.com" className="text-blue-600 hover:underline font-medium">support@eazycertify.com</a>.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
