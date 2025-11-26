import Image from 'next/image'
import ExamPrepHomepage from '../components/examprep-homepage'
import { Header } from '../components/header'

export default function Home () {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <ExamPrepHomepage />
    </div>
  )
}
