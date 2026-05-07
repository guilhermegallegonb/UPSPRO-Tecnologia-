'use client'
import { useState, useEffect, useRef } from 'react'
import { Track } from '@/types'
import { useAudio, formatTime } from '@/hooks/useAudio'

interface Props {
  track: Track | null
  cutAtSeconds?: number
  autoPlay?: boolean
}

export function FloatingPlayer({ track, cutAtSeconds, autoPlay = false }: Props) {
  const { playing, progress, currentTime, play, pause, stop } = useAudio(cutAtSeconds)
  const [userTapped, setUserTapped] = useState(false)
  const [showTapHint, setShowTapHint] = useState(true)
  const loaded = useRef(false)

  useEffect(() => {
    if (!track || loaded.current) return
    loaded.current = true
    if (autoPlay) {
      // Aguardar interação — iOS Safari não permite autoplay sem gesto
      const onInteraction = () => {
        play(track.file)
        setUserTapped(true)
        setShowTapHint(false)
        document.removeEventListener('touchstart', onInteraction)
        document.removeEventListener('click', onInteraction)
      }
      document.addEventListener('touchstart', onInteraction, { once: true })
      document.addEventListener('click', onInteraction, { once: true })
    }
    return () => { stop() }
  }, [track]) // eslint-disable-line

  if (!track) return null

  const toggle = () => {
    if (playing) { pause() }
    else { play(track.file); setUserTapped(true); setShowTapHint(false) }
  }

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl max-w-[90vw] min-w-[260px]"
      style={{ background: 'rgba(0,0,0,0.85)', border: '1px solid var(--c-border)', backdropFilter: 'blur(20px)' }}>

      <button onClick={toggle}
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--grad-btn)' }}
      >
        {playing
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          : <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        }
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-semibold truncate">{track.name}</p>
        {showTapHint && !userTapped
          ? <p className="text-white/40 text-xs">Toque para iniciar</p>
          : <p className="text-white/40 text-xs">{formatTime(currentTime)}{cutAtSeconds ? ` / ${formatTime(cutAtSeconds)}` : ''}</p>
        }
      </div>

      <div className="w-16 flex-shrink-0">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: 'var(--grad-accent)' }} />
        </div>
      </div>
    </div>
  )
}
