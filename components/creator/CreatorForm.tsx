'use client'
import { useReducer, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { TributeFormData, Theme, Occasion } from '@/types'
import { StepIndicator } from './StepIndicator'
import { Step1Identity } from './steps/Step1Identity'
import { Step2Message } from './steps/Step2Message'
import { Step3Photos } from './steps/Step3Photos'
import { Step4Music } from './steps/Step4Music'
import { Step5Theme } from './steps/Step5Theme'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

const INITIAL_STATE: TributeFormData = {
  id: '',
  momName: '',
  senderName: '',
  occasion: 'Dia das Mães',
  message: '',
  phrases: [],
  theme: 'rose',
  musicTrackId: null,
  musicTrackName: null,
  photoUrls: [],
}

type Action =
  | { type: 'SET'; field: keyof TributeFormData; value: unknown }
  | { type: 'SET_ID'; id: string }

function reducer(state: TributeFormData, action: Action): TributeFormData {
  if (action.type === 'SET_ID') return { ...state, id: action.id }
  return { ...state, [action.field]: action.value }
}

export function CreatorForm() {
  const [step, setStep] = useState(1)
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()
  const { show } = useToast()

  // Gerar ID na primeira vez
  const ensureId = useCallback((): string => {
    if (state.id) return state.id
    const id = uuidv4()
    dispatch({ type: 'SET_ID', id })
    return id
  }, [state.id])

  const update = useCallback(<K extends keyof TributeFormData>(field: K, value: TributeFormData[K]) => {
    dispatch({ type: 'SET', field, value })
    scheduleSave()
  }, [])  // eslint-disable-line

  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => autoSave(), 2000)
  }, [])  // eslint-disable-line

  const autoSave = async () => {
    const id = ensureId()
    setSaving(true)
    try {
      await fetch('/api/tribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...stateToApi(state), id }),
      })
    } catch { /* silencioso */ }
    finally { setSaving(false) }
  }

  const stateToApi = (s: TributeFormData) => ({
    id: s.id,
    momName: s.momName,
    senderName: s.senderName,
    occasion: s.occasion,
    message: s.message,
    phrases: s.phrases,
    theme: s.theme,
    musicTrackId: s.musicTrackId,
    musicTrackName: s.musicTrackName,
  })

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!state.momName.trim()) { show('Informe o nome da mãe 💛', 'warn'); return false }
      if (!state.senderName.trim()) { show('Informe seu nome 💛', 'warn'); return false }
    }
    return true
  }

  const next = () => {
    if (!validateStep()) return
    setStep(s => Math.min(s + 1, 5))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const prev = () => {
    setStep(s => Math.max(s - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const generate = async () => {
    if (!validateStep()) return
    setGenerating(true)
    try {
      const id = ensureId()
      await fetch('/api/tribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...stateToApi(state), id }),
      })
      router.push(`/preview/${id}`)
    } catch {
      show('Erro ao gerar. Tente novamente.', 'error')
      setGenerating(false)
    }
  }

  const steps = [
    { label: 'Identidade', n: 1 },
    { label: 'Mensagem',   n: 2 },
    { label: 'Fotos',      n: 3 },
    { label: 'Música',     n: 4 },
    { label: 'Tema',       n: 5 },
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--c-bg)' }}>
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 border-b glass" style={{ borderColor: 'var(--c-border)' }}>
        <a href="/" className="font-script text-2xl" style={{ color: 'var(--c-primary)' }}>MotherRoll</a>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--c-text2)' }}>
          <span className={`w-2 h-2 rounded-full ${saving ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
          {saving ? 'Salvando…' : 'Salvo'}
        </div>
      </header>

      {/* Steps indicator */}
      <StepIndicator steps={steps} current={step} onStepClick={n => n < step && setStep(n)} />

      {/* Panel */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-5 py-8">
        {step === 1 && <Step1Identity data={state} onChange={update} />}
        {step === 2 && <Step2Message data={state} onChange={update} tributeId={state.id || ensureId()} />}
        {step === 3 && <Step3Photos data={state} onChange={update} tributeId={state.id || ensureId()} />}
        {step === 4 && <Step4Music data={state} onChange={update} />}
        {step === 5 && <Step5Theme data={state} onChange={update} />}
      </div>

      {/* Footer nav */}
      <footer className="sticky bottom-0 z-20 flex items-center justify-between px-5 py-4 border-t glass" style={{ borderColor: 'var(--c-border)' }}>
        <Button variant="secondary" onClick={prev} style={{ visibility: step === 1 ? 'hidden' : 'visible' }}>
          ← Anterior
        </Button>

        {step < 5 ? (
          <Button onClick={next}>
            Próximo →
          </Button>
        ) : (
          <Button onClick={generate} loading={generating} className="gap-2">
            ✨ Gerar Homenagem
          </Button>
        )}
      </footer>
    </div>
  )
}
