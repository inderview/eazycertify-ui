'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-12 text-white text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-blue-100">
              We are committed to protecting your personal data and privacy.
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
                  Introduction
                </h2>
                <p>
                  EazyCertify ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                  Information We Collect
                </h2>
                <p>We collect information that you provide directly to us and information automatically collected when you use our services.</p>
                
                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">Personal Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Data:</strong> Name, email address, and password when you register.</li>
                  <li><strong>Payment Data:</strong> Billing information collected by our payment processor (Stripe). We do not store full credit card numbers on our servers.</li>
                  <li><strong>Communication Data:</strong> Information you provide when contacting support.</li>
                </ul>

                <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">Usage & Device Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Device Fingerprinting:</strong> To enforce our single-user license policy and prevent account sharing, we collect technical details about your device (e.g., browser type, operating system, screen resolution, IP address).</li>
                  <li><strong>Log Data:</strong> IP address, access times, pages viewed, and the page you visited before navigating to our website.</li>
                  <li><strong>Exam Performance:</strong> Your scores, answers, and progress in practice exams to provide performance analytics.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                  How We Use Your Information
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide, maintain, and improve our services.</li>
                  <li>To process transactions and send related information, including confirmations and receipts.</li>
                  <li>To enforce our Terms of Service, specifically to detect and prevent unauthorized account sharing via device fingerprinting.</li>
                  <li>To send you technical notices, updates, security alerts, and support messages.</li>
                  <li>To analyze trends and usage to improve user experience.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                  Sharing of Information
                </h2>
                <p>
                  We do not sell your personal information. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (e.g., payment processing, email delivery, hosting).</li>
                  <li><strong>Legal Requirements:</strong> If required to do so by law or in response to valid requests by public authorities.</li>
                  <li><strong>Protection of Rights:</strong> To protect the rights, property, or safety of EazyCertify, our users, or others.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                  Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                  Cookies and Tracking Technologies
                </h2>
                <p>
                  We use cookies and similar tracking technologies to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
                  Your Data Rights
                </h2>
                <p>
                  Depending on your location, you may have rights regarding your personal data, including the right to access, correct, delete, or restrict the processing of your data. To exercise these rights, please contact us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
                  Changes to This Privacy Policy
                </h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
                  Contact Us
                </h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@eazycertify.com" className="text-blue-600 hover:underline font-medium">privacy@eazycertify.com</a>.
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
