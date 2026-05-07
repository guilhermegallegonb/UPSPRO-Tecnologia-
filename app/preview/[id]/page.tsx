'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Tribute } from '@/types'
import { ScrollExperience } from '@/components/experience/ScrollExperience'
import { WatermarkOverlay } from '@/components/paywall/WatermarkOverlay'
import { PaywallModal } from '@/components/paywall/PaywallModal'

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [tribute, setTribute] = useState<Tribute | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetch(`/api/tribute?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { router.push('/criar'); return }
        if (data.paid)  { router.push(`/view/${id}`); return }
        setTribute(data)
        setLoading(false)
        // Abrir paywall após 5s
        setTimeout(() => setModalOpen(true), 5000)
      })
      .catch(() => router.push('/criar'))
  }, [id, router])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--c-bg)' }}>
        <svg className="animate-spin w-10 h-10" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--c-primary)' }}>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p style={{ color: 'var(--c-text2)' }}>Carregando sua homenagem…</p>
      </div>
    )
  }

  if (!tribute) return null

  return (
    <div className="relative">
      {/* Barra de preview */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 no-print"
        style={{ background: 'rgba(0,0,0,0.9)', borderBottom: '1px solid var(--c-border)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-medium" style={{ color: 'var(--c-text2)' }}>
            Prévia com marca d&apos;água
          </span>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary text-sm py-2 px-4"
          style={{ fontSize: '0.8rem', padding: '8px 18px' }}
        >
          🔓 Desbloquear
        </button>
      </div>

      {/* Conteúdo com padding-top para a barra */}
      <div style={{ paddingTop: '52px' }}>
        <ScrollExperience tribute={tribute} isPreview />
      </div>

      {/* Watermark */}
      <WatermarkOverlay />

      {/* Paywall Modal */}
      <PaywallModal
        tributeId={id}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
