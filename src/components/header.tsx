import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
            <span className="font-bold text-white">E</span>
          </div>
          <span className="text-xl font-semibold text-slate-800 dark:text-white">EazyCertify</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
          <Link href="/#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            How it works
          </Link>
          <Link href="/#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Pricing
          </Link>
          <Link href="/#contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Contact
          </Link>
          <Link
            href="/#get-started"
            className="rounded-full bg-slate-900 px-5 py-2.5 text-white transition-all hover:bg-slate-800 hover:shadow-lg dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  )
}
