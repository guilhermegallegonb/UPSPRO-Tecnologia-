'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Plan, CheckoutResponse } from '@/types'
import { PixCheckout } from './PixCheckout'

interface Props {
  tributeId: string
  open: boolean
  onClose: () => void
}

const PLANS = [
  {
    id: 'basic' as Plan,
    name: 'Básico',
    price: 'R$ 14,90',
    icon: '✨',
    features: ['Remove marca d\'água', 'Impressão em A4', 'Link válido por 7 dias', 'Música completa (3 min)'],
  },
  {
    id: 'premium' as Plan,
    name: 'Premium',
    price: 'R$ 24,90',
    icon: '👑',
    badge: 'Mais escolhido',
    features: ['Remove marca d\'água', 'Impressão em A4', 'Link permanente', 'Música ilimitada', 'Compartilhamento premium'],
  },
]

export function PaywallModal({ tributeId, open, onClose }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkout, setCheckout] = useState<CheckoutResponse | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  const startCheckout = async (plan: Plan) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tributeId, plan }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Erro ao gerar PIX'); setLoading(false); return }
      setCheckout(data)
      setSelectedPlan(plan)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    }
    setLoading(false)
  }

  const handleSuccess = (id: string) => {
    router.push(`/view/${id}?payment=success`)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-md rounded-3xl p-6 relative"
            style={{ background: 'var(--c-bg2)', border: '1px solid var(--c-border)' }}
          >
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity" style={{ background: 'var(--c-surface)', color: 'var(--c-text)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            {!checkout ? (
              <>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">❤️</div>
                  <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--c-text)' }}>
                    Sua homenagem está pronta!
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--c-text2)' }}>
                    Desbloqueie para remover a marca d&apos;água e compartilhar com quem você ama.
                  </p>
                </div>

                <div className="flex flex-col gap-3 mb-4">
                  {PLANS.map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => startCheckout(plan.id)}
                      disabled={loading}
                      className="relative flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:scale-[1.01] disabled:opacity-60"
                      style={{ background: 'var(--c-surface)', border: `2px solid ${plan.id === 'premium' ? 'var(--c-primary)' : 'var(--c-border)'}` }}
                    >
                      {plan.badge && (
                        <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: 'var(--grad-btn)' }}>
                          {plan.badge}
                        </span>
                      )}
                      <span className="text-2xl">{plan.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold" style={{ color: 'var(--c-text)' }}>{plan.name}</span>
                          <span className="font-bold" style={{ color: 'var(--c-primary)' }}>{plan.price}</span>
                        </div>
                        <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                          {plan.features.map(f => (
                            <li key={f} className="text-xs flex items-center gap-1" style={{ color: 'var(--c-text2)' }}>
                              <span style={{ color: 'var(--c-primary)' }}>✓</span> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {loading && <svg className="animate-spin w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                    </button>
                  ))}
                </div>

                {error && <p className="text-center text-sm text-red-400">{error}</p>}
                <p className="text-center text-xs" style={{ color: 'var(--c-text2)', opacity: 0.6 }}>
                  Pagamento via PIX · Processado pelo Mercado Pago
                </p>
              </>
            ) : (
              <PixCheckout
                checkout={checkout}
                tributeId={tributeId}
                onSuccess={handleSuccess}
                onBack={() => { setCheckout(null); setSelectedPlan(null) }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
