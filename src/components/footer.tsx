import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                <div>
                    <h3 className="text-white text-xl font-bold mb-4">EazyCertify</h3>
                    <p className="text-sm">Your trusted partner for certification exam preparation.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-white mb-4">Providers</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="#" className="hover:text-white transition-colors">
                                Microsoft Azure
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-white transition-colors">
                                Amazon AWS
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-white transition-colors">
                                Google Cloud
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-white transition-colors">
                                All Providers
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-white mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="#" className="hover:text-white transition-colors">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-white transition-colors">
                                Pricing
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-white transition-colors">
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-white transition-colors">
                                Blog
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-white mb-4">Support</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="#" className="hover:text-white transition-colors">
                                Help Center
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-white transition-colors">
                                Contact Support
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-slate-800 pt-8 text-sm text-center">
                © 2025 EazyCertify. All rights reserved.
            </div>
        </div>
    </footer>
  )
}
