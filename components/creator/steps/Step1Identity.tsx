'use client'
import { TributeFormData, Occasion } from '@/types'

const OCCASIONS: { label: string; value: Occasion }[] = [
  { label: '💐 Dia das Mães',    value: 'Dia das Mães' },
  { label: '🎂 Aniversário',     value: 'Aniversário' },
  { label: '🌹 Dia das Mulheres', value: 'Dia das Mulheres' },
  { label: '🎄 Natal',           value: 'Natal' },
  { label: '💛 Só porque sim',   value: 'Só porque sim' },
]

interface Props {
  data: TributeFormData
  onChange: <K extends keyof TributeFormData>(field: K, value: TributeFormData[K]) => void
}

export function Step1Identity({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div>
        <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--c-text)' }}>
          Para quem é esta homenagem?
        </h2>
        <p className="text-sm" style={{ color: 'var(--c-text2)' }}>
          Essas informações aparecem no topo da sua homenagem.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--c-text2)' }}>
            Nome da mãe <span style={{ color: 'var(--c-accent)' }}>*</span>
          </label>
          <input
            type="text"
            className="f-input"
            placeholder="Ex: Maria, Mãe, Vovó…"
            value={data.momName}
            onChange={e => onChange('momName', e.target.value)}
            maxLength={60}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--c-text2)' }}>
            Seu nome <span style={{ color: 'var(--c-accent)' }}>*</span>
          </label>
          <input
            type="text"
            className="f-input"
            placeholder="Ex: João, Sua filha Ana…"
            value={data.senderName}
            onChange={e => onChange('senderName', e.target.value)}
            maxLength={60}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--c-text2)' }}>
          Ocasião
        </label>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map(occ => (
            <button
              key={occ.value}
              onClick={() => onChange('occasion', occ.value)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: data.occasion === occ.value ? 'var(--grad-btn)' : 'var(--c-surface)',
                border: `1px solid ${data.occasion === occ.value ? 'transparent' : 'var(--c-border)'}`,
                color: data.occasion === occ.value ? '#fff' : 'var(--c-text2)',
              }}
            >
              {occ.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
