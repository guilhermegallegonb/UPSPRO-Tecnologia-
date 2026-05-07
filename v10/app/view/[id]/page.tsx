import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { Tribute } from '@/types'
import { ScrollExperience } from '@/components/experience/ScrollExperience'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = createServerClient()
  const { data } = await supabase.from('tributes').select('mom_name, sender_name').eq('id', id).single()

  if (!data) return { title: 'MotherRoll' }

  return {
    title: `Uma homenagem para ${data.mom_name} — MotherRoll`,
    description: `${data.sender_name} criou uma homenagem especial.`,
  }
}

export default async function ViewPage({ params }: Props) {
  const { id } = await params
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('tributes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  const tribute = data as Tribute

  if (!tribute.paid) redirect(`/preview/${id}`)

  // Verificar expiração (plano basic)
  if (tribute.expires_at && new Date(tribute.expires_at) < new Date()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ background: 'var(--c-bg)' }}>
        <div className="text-5xl mb-6">⏳</div>
        <h1 className="font-serif text-3xl mb-4" style={{ color: 'var(--c-text)' }}>Link expirado</h1>
        <p className="mb-8" style={{ color: 'var(--c-text2)' }}>
          Este link do Plano Básico expirou após 7 dias.<br />
          Crie uma nova homenagem para continuar.
        </p>
        <a href="/criar" className="btn-primary">Criar nova homenagem</a>
      </div>
    )
  }

  return <ScrollExperience tribute={tribute} />
}
