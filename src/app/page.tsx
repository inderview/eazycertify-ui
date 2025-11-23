import Image from 'next/image'
import ExamPrepHomepage from '../components/examprep-homepage'

export default function Home () {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-black dark:bg-white" />
            <span className="text-xl font-semibold">EazyCertify</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#features" className="opacity-80 hover:opacity-100">
              Features
            </a>
            <a href="#how-it-works" className="opacity-80 hover:opacity-100">
              How it works
            </a>
            <a href="#pricing" className="opacity-80 hover:opacity-100">
              Pricing
            </a>
            <a href="#contact" className="opacity-80 hover:opacity-100">
              Contact
            </a>
            <a
              href="#get-started"
              className="rounded-full bg-foreground px-4 py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Get Started
            </a>
          </nav>
        </div>
      </header>

      <ExamPrepHomepage />
    </div>
  )
}
