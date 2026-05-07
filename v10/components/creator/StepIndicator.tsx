'use client'
interface Step { n: number; label: string }
interface Props {
  steps: Step[]
  current: number
  onStepClick: (n: number) => void
}

export function StepIndicator({ steps, current, onStepClick }: Props) {
  return (
    <nav className="flex items-center overflow-x-auto px-5 py-4 gap-0 no-scrollbar" style={{ borderBottom: '1px solid var(--c-border)' }}>
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center flex-shrink-0">
          <button
            onClick={() => onStepClick(s.n)}
            className="flex flex-col items-center gap-1.5 cursor-pointer"
            disabled={s.n > current}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
              ${s.n < current ? 'text-white' : s.n === current ? 'text-white shadow-lg' : 'text-opacity-60'}
            `} style={{
              background: s.n <= current ? 'var(--grad-btn)' : 'var(--c-surface)',
              border: `2px solid ${s.n <= current ? 'transparent' : 'var(--c-border)'}`,
              boxShadow: s.n === current ? '0 0 16px var(--c-glow)' : 'none',
              color: s.n <= current ? '#fff' : 'var(--c-text2)',
            }}>
              {s.n < current ? '✓' : s.n}
            </div>
            <span className="text-[10px] font-medium hidden sm:block" style={{ color: s.n === current ? 'var(--c-primary)' : 'var(--c-text2)' }}>
              {s.label}
            </span>
          </button>
          {i < steps.length - 1 && (
            <div className="w-8 sm:w-12 h-px mx-1 transition-all duration-300" style={{
              background: s.n < current ? 'var(--c-primary)' : 'var(--c-border)',
            }} />
          )}
        </div>
      ))}
    </nav>
  )
}
