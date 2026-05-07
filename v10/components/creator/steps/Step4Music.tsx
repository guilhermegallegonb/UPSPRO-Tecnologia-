'use client'
import { useState } from 'react'
import { TributeFormData } from '@/types'
import { TRACKS, CATEGORIES } from '@/lib/music/tracks'
import { useAudio, formatTime } from '@/hooks/useAudio'

interface Props {
  data: TributeFormData
  onChange: <K extends keyof TributeFormData>(field: K, value: TributeFormData[K]) => void
}

export function Step4Music({ data, onChange }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [previewingId, setPreviewingId] = useState<string | null>(null)
  const { playing, progress, currentTime, loadAndPreview, stop } = useAudio()

  const filtered = activeCategory
    ? TRACKS.filter(t => t.category === activeCategory)
    : TRACKS

  const handlePreview = (trackId: string, file: string, startAt: number) => {
    if (previewingId === trackId && playing) {
      stop()
      setPreviewingId(null)
    } else {
      setPreviewingId(trackId)
      loadAndPreview(file, startAt, 20)
    }
  }

  const selectTrack = (trackId: string, trackName: string) => {
    stop()
    setPreviewingId(null)
    onChange('musicTrackId', trackId)
    onChange('musicTrackName', trackName)
  }

  const clearTrack = () => {
    stop()
    setPreviewingId(null)
    onChange('musicTrackId', null)
    onChange('musicTrackName', null)
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--c-text)' }}>
          A trilha sonora do seu amor
        </h2>
        <p className="text-sm" style={{ color: 'var(--c-text2)' }}>
          Escolha a música que define esse momento especial. Toque para ouvir 20 segundos.
        </p>
      </div>

      {/* Faixa selecionada */}
      {data.musicTrackId && (
        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-primary)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: 'var(--grad-btn)' }}>
            🎵
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: 'var(--c-text)' }}>{data.musicTrackName}</p>
            <p className="text-xs" style={{ color: 'var(--c-text2)' }}>Música selecionada</p>
          </div>
          <button onClick={clearTrack} className="opacity-40 hover:opacity-100 transition-opacity" style={{ color: 'var(--c-text)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* Filtros de categoria */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            background: !activeCategory ? 'var(--grad-btn)' : 'var(--c-surface)',
            border: `1px solid ${!activeCategory ? 'transparent' : 'var(--c-border)'}`,
            color: !activeCategory ? '#fff' : 'var(--c-text2)',
          }}
        >
          Todas
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: activeCategory === cat.id ? 'var(--grad-btn)' : 'var(--c-surface)',
              border: `1px solid ${activeCategory === cat.id ? 'transparent' : 'var(--c-border)'}`,
              color: activeCategory === cat.id ? '#fff' : 'var(--c-text2)',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lista de faixas */}
      <div className="flex flex-col gap-2">
        {filtered.map(track => {
          const isSelected  = data.musicTrackId === track.id
          const isPreviewing = previewingId === track.id

          return (
            <div
              key={track.id}
              className="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer hover:scale-[1.01]"
              style={{
                background: isSelected ? 'var(--c-surface)' : 'var(--c-surface)',
                border: `1px solid ${isSelected ? 'var(--c-primary)' : 'var(--c-border)'}`,
              }}
            >
              {/* Play preview */}
              <button
                onClick={() => handlePreview(track.id, track.file, track.previewStart ?? 0)}
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: isPreviewing && playing ? 'var(--grad-btn)' : 'var(--c-border)' }}
              >
                {isPreviewing && playing ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--c-text2)' }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                )}
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" style={{ color: 'var(--c-text)' }}>{track.name}</p>
                <p className="text-xs" style={{ color: 'var(--c-text2)' }}>{track.categoryLabel} · {formatTime(track.duration)}</p>
                {isPreviewing && playing && (
                  <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--c-border)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'var(--grad-accent)' }} />
                  </div>
                )}
              </div>

              {/* Select */}
              <button
                onClick={() => isSelected ? clearTrack() : selectTrack(track.id, track.name)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all"
                style={{
                  background: isSelected ? 'var(--grad-btn)' : 'var(--c-surface)',
                  border: `1px solid ${isSelected ? 'transparent' : 'var(--c-border)'}`,
                  color: isSelected ? '#fff' : 'var(--c-text2)',
                }}
              >
                {isSelected ? '✓ Selecionada' : 'Selecionar'}
              </button>
            </div>
          )
        })}
      </div>

      {!data.musicTrackId && (
        <p className="text-center text-sm" style={{ color: 'var(--c-text2)' }}>
          Nenhuma música selecionada. A homenagem ficará em silêncio.
        </p>
      )}
    </div>
  )
}
