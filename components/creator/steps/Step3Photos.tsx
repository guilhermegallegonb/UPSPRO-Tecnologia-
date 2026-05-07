'use client'
import { useRef, useState, useCallback } from 'react'
import { TributeFormData } from '@/types'
import { useToast } from '@/components/ui/Toast'

interface Props {
  data: TributeFormData
  tributeId: string
  onChange: <K extends keyof TributeFormData>(field: K, value: TributeFormData[K]) => void
}

export function Step3Photos({ data, tributeId, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const { show } = useToast()

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).slice(0, 10 - data.photoUrls.length)
    if (!arr.length) { show('Limite de 10 fotos atingido', 'warn'); return }

    setUploading(true)
    const newUrls: string[] = []

    for (let i = 0; i < arr.length; i++) {
      const file = arr[i]
      if (!file.type.startsWith('image/')) continue

      const fd = new FormData()
      fd.append('photo', file)
      fd.append('index', String(data.photoUrls.length + i))

      try {
        const res = await fetch(`/api/tribute/photos?id=${tributeId}`, { method: 'POST', body: fd })
        const json = await res.json()
        if (json.url) newUrls.push(json.url)
      } catch { show('Erro ao enviar foto', 'error') }
    }

    onChange('photoUrls', [...data.photoUrls, ...newUrls])
    setUploading(false)
  }, [data.photoUrls, tributeId, onChange, show])

  const removePhoto = async (url: string) => {
    await fetch(`/api/tribute/photos?id=${tributeId}&url=${encodeURIComponent(url)}`, { method: 'DELETE' })
    onChange('photoUrls', data.photoUrls.filter(u => u !== url))
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--c-text)' }}>
          Suas memórias favoritas
        </h2>
        <p className="text-sm" style={{ color: 'var(--c-text2)' }}>
          Até 10 fotos. Elas formam um slideshow emocional na homenagem.
        </p>
      </div>

      <input ref={inputRef} type="file" multiple accept="image/*" style={{ display: 'none' }}
        onChange={e => e.target.files && uploadFiles(e.target.files)} />

      {data.photoUrls.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center gap-4 rounded-2xl p-12 cursor-pointer transition-all duration-200 ${dragOver ? 'scale-[1.02]' : ''}`}
          style={{
            border: `2px dashed ${dragOver ? 'var(--c-primary)' : 'var(--c-border)'}`,
            background: dragOver ? 'var(--c-surface)' : 'transparent',
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files) }}
        >
          {uploading ? (
            <svg className="animate-spin w-10 h-10" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--c-primary)', opacity: .7 }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          )}
          <p className="font-medium" style={{ color: 'var(--c-text)' }}>
            {uploading ? 'Enviando fotos…' : 'Arraste fotos aqui'}
          </p>
          <span className="text-sm" style={{ color: 'var(--c-text2)' }}>ou toque para selecionar</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {data.photoUrls.map((url, i) => (
              <div key={url} className="relative aspect-square rounded-xl overflow-hidden group animate-fade-in">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Foto ${i+1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removePhoto(url)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.7)' }}
                >✕</button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button onClick={() => inputRef.current?.click()} className="btn-secondary text-sm">
              + Adicionar mais fotos
            </button>
            <span className="text-sm" style={{ color: 'var(--c-text2)' }}>{data.photoUrls.length}/10 fotos</span>
          </div>
        </div>
      )}
    </div>
  )
}
