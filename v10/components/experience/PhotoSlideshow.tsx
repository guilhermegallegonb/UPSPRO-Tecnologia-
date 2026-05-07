'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  photos: string[]
  interval?: number
}

export function PhotoSlideshow({ photos, interval = 3500 }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (photos.length <= 1) return
    const t = setInterval(() => setIndex(i => (i + 1) % photos.length), interval)
    return () => clearInterval(t)
  }, [photos.length, interval])

  if (!photos.length) return null

  return (
    <div className="relative w-full overflow-hidden" style={{ background: '#000' }}>
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[index]}
            alt={`Foto ${index + 1}`}
            className="w-full object-cover"
            style={{ maxHeight: '70vh' }}
          />
        </motion.div>
      </AnimatePresence>

      {photos.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width:  i === index ? 20 : 6,
                height: 6,
                background: i === index ? 'var(--c-primary)' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
