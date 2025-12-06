import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import ExamQuestionsList from '@/components/exam-questions-list'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function getExam(code: string) {
  const { data: exam, error } = await supabase
    .from('exam')
    .select(`
      *,
      provider (name)
    `)
    .eq('code', code)
    .single()

  if (error || !exam) {
    return null
  }

  return exam
}

async function getQuestions(examId: number) {
  const { data: questions, error } = await supabase
    .from('question')
    .select(`
      *,
      question_option (*),
      question_group (*)
    `)
    .eq('exam_id', examId)
    .eq('status', 'published')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching questions:', error)
    return []
  }

  return questions
}

import Link from 'next/link'
import { LaunchSimulatorCard } from '@/components/launch-simulator-card'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export default async function ExamPage({ params }: { params: { code: string } }) {
  const { code } = await params
  const cookieStore = await cookies()
  
  const supabaseServer = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: any) {
          try {
            cookiesToSet.forEach(({ name, value, options }: any) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore errors in server components
          }
        },
      },
    }
  )

  const { data: { user } } = await supabaseServer.auth.getUser()
  const exam = await getExam(code)

  if (!exam) {
    notFound()
  }

  let hasAccess = false
  if (user) {
    console.log('ExamPage: Checking access for user:', user.id, 'exam:', exam.id)
    const { data: purchase, error } = await supabaseServer
      .from('purchase')
      .select('id, expires_at')
      .eq('user_id', user.id)
      .eq('exam_id', exam.id)
      .gt('expires_at', new Date().toISOString())
      .single()
    
    console.log('ExamPage: Purchase query result:', { purchase, error })
    
    if (purchase) {
      hasAccess = true
      console.log('ExamPage: Access GRANTED')
    } else {
      console.log('ExamPage: Access DENIED - no valid purchase found')
    }
  } else {
    console.log('ExamPage: No user logged in')
  }

  const questions = await getQuestions(exam.id)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="flex-1">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-blue-200 mb-4">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/exams" className="hover:text-white transition-colors">Exams</Link>
                <span>/</span>
                <span className="text-white font-medium">{exam.code}</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {exam.code}: {exam.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-blue-100">
                <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                  {questions.length} Questions
                </span>
                <span>
                  Last updated: {new Date(exam.updated_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Simulator Card (Right Side) */}
            <div className="shrink-0">
              <LaunchSimulatorCard examId={exam.id} />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 max-w-6xl py-8">
        {/* Questions List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <ExamQuestionsList 
            questions={questions} 
            examId={exam.id}
            examCode={exam.code}
            examTitle={exam.title}
            hasAccess={hasAccess}
          />
        </div>
      </main>
    </div>
  )
}
