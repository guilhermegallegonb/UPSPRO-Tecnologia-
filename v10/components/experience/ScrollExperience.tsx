'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Tribute } from '@/types'
import { THEMES, getCSSVars } from '@/lib/themes/themeVars'
import { getTrackById } from '@/lib/music/tracks'
import { ParticleCanvas } from './ParticleCanvas'
import { PhotoSlideshow } from './PhotoSlideshow'
import { FloatingPlayer } from './FloatingPlayer'

interface Props {
  tribute: Tribute
  isPreview?: boolean
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
}

function RevealBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.4,0,0.2,1] } } }}
    >
      {children}
    </motion.div>
  )
}

export function ScrollExperience({ tribute, isPreview = false }: Props) {
  const theme = tribute.theme
  const themeConfig = THEMES[theme]
  const cssVars = getCSSVars(theme)
  const track = tribute.music_track_id ? getTrackById(tribute.music_track_id) ?? null : null
  const cutAt = isPreview ? 15 : (tribute.plan === 'basic' ? 180 : undefined)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    Object.entries(cssVars).forEach(([k, v]) => {
      containerRef.current!.style.setProperty(k, v)
    })
  }, [theme]) // eslint-disable-line

  return (
    <div ref={containerRef} className="relative min-h-screen" style={{ background: themeConfig.bg }}>

      {/* ── CAPA ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{ background: themeConfig.gradHero }}>
        <ParticleCanvas theme={theme} />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-xs font-semibold tracking-[.2em] uppercase"
            style={{ color: themeConfig.primary }}
          >
            {tribute.occasion}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.9 }}
            className="font-script leading-tight"
            style={{ fontSize: 'clamp(3rem,10vw,6rem)', color: themeConfig.text }}
          >
            {tribute.mom_name}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1, duration: 0.8 }}
            className="w-16 h-0.5 rounded-full"
            style={{ background: themeConfig.gradAccent }}
          />

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="text-base"
            style={{ color: themeConfig.text2 }}
          >
            Uma mensagem especial de <em className="not-italic font-semibold" style={{ color: themeConfig.primary }}>{tribute.sender_name}</em>
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ delay: 2, duration: 2, repeat: Infinity }}
            className="absolute bottom-10 flex flex-col items-center gap-2"
          >
            <span className="text-xs tracking-widest" style={{ color: themeConfig.text2 }}>role para baixo</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: themeConfig.text2 }}>
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </motion.div>
        </div>
      </section>

      {/* ── MENSAGEM ── */}
      {tribute.message && (
        <section className="px-6 py-20 max-w-2xl mx-auto">
          <RevealBlock>
            <p className="font-serif text-xl leading-relaxed whitespace-pre-wrap text-center"
              style={{ color: themeConfig.text, fontSize: 'clamp(1rem,2.5vw,1.25rem)', lineHeight: 1.9 }}>
              {tribute.message}
            </p>
          </RevealBlock>
        </section>
      )}

      {/* ── FRASES + FOTOS intercaladas ── */}
      {tribute.phrases.map((phrase, i) => (
        <div key={i}>
          <section className="py-20 px-6 text-center" style={{ background: i % 2 === 0 ? themeConfig.bg2 : themeConfig.bg }}>
            <RevealBlock delay={0.1}>
              <blockquote className="font-script leading-snug" style={{ fontSize: 'clamp(1.8rem,5vw,3rem)', color: themeConfig.text }}>
                &ldquo;{phrase}&rdquo;
              </blockquote>
            </RevealBlock>
          </section>

          {/* Inserir slideshow a cada 2 frases */}
          {(i + 1) % 2 === 0 && tribute.photo_urls.length > 0 && (
            <RevealBlock>
              <PhotoSlideshow photos={tribute.photo_urls.slice(Math.floor(i / 2), Math.floor(i / 2) + 3)} />
            </RevealBlock>
          )}
        </div>
      ))}

      {/* ── SLIDESHOW PRINCIPAL (se tiver fotos) ── */}
      {tribute.photo_urls.length > 0 && (
        <RevealBlock>
          <PhotoSlideshow photos={tribute.photo_urls} />
        </RevealBlock>
      )}

      {/* ── ENCERRAMENTO ── */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden"
        style={{ background: themeConfig.gradHero }}>
        <ParticleCanvas theme={theme} />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <RevealBlock>
            <div className="text-5xl animate-heart-beat">♥</div>
          </RevealBlock>
          <RevealBlock delay={0.2}>
            <blockquote className="font-script" style={{ fontSize: 'clamp(1.5rem,4vw,2.5rem)', color: themeConfig.text }}>
              &ldquo;Com todo o amor do mundo…&rdquo;
            </blockquote>
          </RevealBlock>
          <RevealBlock delay={0.4}>
            <p className="text-base" style={{ color: themeConfig.text2 }}>
              — <em style={{ color: themeConfig.primary }}>{tribute.sender_name}</em>
            </p>
          </RevealBlock>
          <RevealBlock delay={0.6}>
            <p className="text-xs tracking-widest mt-4" style={{ color: themeConfig.text2, opacity: 0.5 }}>
              Criado com MotherRoll ✦
            </p>
          </RevealBlock>
        </div>
      </section>

      {/* Player flutuante */}
      <FloatingPlayer track={track} cutAtSeconds={cutAt} autoPlay={!isPreview} />
    </div>
  )
}
