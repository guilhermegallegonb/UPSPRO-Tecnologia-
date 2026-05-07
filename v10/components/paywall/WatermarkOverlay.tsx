'use client'
export function WatermarkOverlay() {
  return (
    <>
      {/* Texto repetido em diagonal */}
      <div
        className="fixed inset-0 z-40 pointer-events-none overflow-hidden select-none"
        aria-hidden
      >
        <div
          className="absolute inset-[-50%] flex flex-wrap content-center gap-16"
          style={{ transform: 'rotate(-30deg)' }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} className="font-script text-2xl font-bold whitespace-nowrap"
              style={{ color: 'rgba(255,255,255,0.06)', letterSpacing: '0.1em' }}>
              MotherRoll
            </span>
          ))}
        </div>
      </div>

      {/* Gradiente de blur na parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 h-48 z-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }} />
    </>
  )
}
