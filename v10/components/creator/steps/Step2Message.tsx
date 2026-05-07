'use client'
import { useState } from 'react'
import { TributeFormData } from '@/types'
import { getFrasesParaOcasiao } from '@/lib/phrases/autoFrases'

interface Props {
  data: TributeFormData
  tributeId: string
  onChange: <K extends keyof TributeFormData>(field: K, value: TributeFormData[K]) => void
}

export function Step2Message({ data, onChange }: Props) {
  const [phraseInput, setPhraseInput] = useState('')

  const addPhrase = () => {
    if (!phraseInput.trim() || data.phrases.length >= 12) return
    onChange('phrases', [...data.phrases, phraseInput.trim()])
    setPhraseInput('')
  }

  const removePhrase = (i: number) => {
    onChange('phrases', data.phrases.filter((_, idx) => idx !== i))
  }

  const autoFrase = () => {
    const frases = getFrasesParaOcasiao(data.occasion)
    const unused = frases.filter(f => !data.message.includes(f))
    const frase = unused[Math.floor(Math.random() * unused.length)] ?? frases[0]
    onChange('message', data.message ? data.message + '\n\n' + frase : frase)
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div>
        <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--c-text)' }}>
          O que seu coração quer dizer?
        </h2>
        <p className="text-sm" style={{ color: 'var(--c-text2)' }}>
          Escreva livremente. Não existe certo ou errado.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--c-text2)' }}>
            Mensagem Principal
          </label>
          <button onClick={autoFrase} className="text-xs px-3 py-1 rounded-full transition-all" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', color: 'var(--c-primary)' }}>
            ✨ Sugerir frase
          </button>
        </div>
        <textarea
          className="f-textarea"
          placeholder="Escreva sua mensagem do coração…"
          rows={7}
          maxLength={1200}
          value={data.message}
          onChange={e => onChange('message', e.target.value)}
        />
        <span className="text-xs text-right" style={{ color: 'var(--c-text2)' }}>{data.message.length}/1200</span>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--c-text2)' }}>
          Frases em Destaque <span className="normal-case font-normal opacity-60">(aparecem destacadas na homenagem)</span>
        </label>

        <div className="flex flex-col gap-2">
          {data.phrases.map((ph, i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>
              <span className="font-script text-base" style={{ color: 'var(--c-text)' }}>{ph}</span>
              <button onClick={() => removePhrase(i)} className="opacity-40 hover:opacity-100 transition-opacity text-red-400 flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="f-input flex-1"
            placeholder="Adicione uma frase especial…"
            maxLength={120}
            value={phraseInput}
            onChange={e => setPhraseInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addPhrase())}
          />
          <button onClick={addPhrase} className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105" style={{ background: 'var(--grad-btn)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
