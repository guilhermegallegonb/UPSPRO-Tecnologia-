'use client'
import { useRef, useState, useCallback, useEffect } from 'react'

export function useAudio(cutAtSeconds?: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const cutTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const initAudio = useCallback((src: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    const audio = new Audio(src)
    audio.preload = 'auto'
    audioRef.current = audio

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
    })
    audio.addEventListener('durationchange', () => setDuration(audio.duration))
    audio.addEventListener('ended', () => { setPlaying(false); setProgress(0) })

    return audio
  }, [])

  const play = useCallback((src?: string) => {
    const audio = src ? initAudio(src) : audioRef.current
    if (!audio) return

    audio.play().then(() => {
      setPlaying(true)
      if (cutAtSeconds) {
        if (cutTimer.current) clearTimeout(cutTimer.current)
        cutTimer.current = setTimeout(() => {
          audio.pause()
          setPlaying(false)
        }, cutAtSeconds * 1000)
      }
    }).catch(() => {
      // iOS Safari — autoplay bloqueado, aguardar interação
      console.warn('Autoplay bloqueado. Aguardando interação do usuário.')
    })
  }, [initAudio, cutAtSeconds])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setPlaying(false)
    if (cutTimer.current) clearTimeout(cutTimer.current)
  }, [])

  const toggle = useCallback((src?: string) => {
    if (playing) pause()
    else play(src)
  }, [playing, play, pause])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setPlaying(false)
    setProgress(0)
    setCurrentTime(0)
    if (cutTimer.current) clearTimeout(cutTimer.current)
  }, [])

  const loadAndPreview = useCallback((src: string, startAt = 0, previewDuration = 20) => {
    const audio = initAudio(src)
    audio.currentTime = startAt
    audio.play().then(() => {
      setPlaying(true)
      cutTimer.current = setTimeout(() => {
        audio.pause()
        audio.currentTime = startAt
        setPlaying(false)
      }, previewDuration * 1000)
    }).catch(() => {})
  }, [initAudio])

  useEffect(() => {
    return () => {
      if (cutTimer.current) clearTimeout(cutTimer.current)
      audioRef.current?.pause()
    }
  }, [])

  return { playing, progress, currentTime, duration, play, pause, toggle, stop, loadAndPreview }
}

export function formatTime(sec: number): string {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
