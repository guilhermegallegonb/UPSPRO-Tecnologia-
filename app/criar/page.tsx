import { Metadata } from 'next'
import { CreatorForm } from '@/components/creator/CreatorForm'
import { ToastProvider } from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: 'Criar Homenagem — MotherRoll',
  description: 'Crie sua homenagem emocional em menos de 2 minutos.',
}

export default function CriarPage() {
  return (
    <ToastProvider>
      <CreatorForm />
    </ToastProvider>
  )
}
