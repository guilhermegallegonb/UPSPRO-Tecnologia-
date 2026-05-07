'use client'
import { useEffect, useRef } from 'react'
import { Theme } from '@/types'

const COLORS: Record<Theme, string[]> = {
  rose:      ['rgba(232,160,180,', 'rgba(255,107,158,'],
  gold:      ['rgba(212,175,55,',  'rgba(245,208,96,'],
  floral:    ['rgba(134,197,120,', 'rgba(232,160,180,'],
  dark:      ['rgba(200,200,200,', 'rgba(255,255,255,'],
  parchment: ['rgba(205,170,110,', 'rgba(232,200,122,'],
}

export function ParticleCanvas({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    let particles: Array<{ x:number; y:number; r:number; sx:number; sy:number; alpha:number; color:string }> = []

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      init()
    }

    const init = () => {
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 80)
      const cols   = COLORS[theme]
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        sx: (Math.random() - 0.5) * 0.3,
        sy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1,
        color: cols[Math.floor(Math.random() * cols.length)],
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + p.alpha + ')'
        ctx.fill()
        p.x += p.sx; p.y += p.sy
        if (p.x < -5) p.x = canvas.width + 5
        if (p.x > canvas.width + 5) p.x = -5
        if (p.y < -5) p.y = canvas.height + 5
        if (p.y > canvas.height + 5) p.y = -5
      }
      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}
