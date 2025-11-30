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
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching questions:', error)
    return []
  }

  return questions
}

export default async function ExamPage({ params }: { params: { code: string } }) {
  const { code } = await params
  const exam = await getExam(code)

  if (!exam) {
    notFound()
  }

  const questions = await getQuestions(exam.id)

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <span>Exams</span>
            <span>/</span>
            <span>{exam.provider?.name || 'Unknown Provider'}</span>
            <span>/</span>
            <span className="text-slate-900 font-medium">{exam.code}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {exam.code}: {exam.title}
          </h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              {questions.length} Questions
            </span>
            <span className="text-slate-500">
              Last updated: {new Date(exam.updated_at || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>

        <ExamQuestionsList 
          questions={questions} 
          examId={exam.id}
          examCode={exam.code}
          examTitle={exam.title}
        />
      </main>
    </div>
  )
}
