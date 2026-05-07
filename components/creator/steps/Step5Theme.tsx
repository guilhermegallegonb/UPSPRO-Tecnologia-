'use client'
import { TributeFormData, Theme } from '@/types'
import { THEMES } from '@/lib/themes/themeVars'

interface Props {
  data: TributeFormData
  onChange: <K extends keyof TributeFormData>(field: K, value: TributeFormData[K]) => void
}

const THEME_KEYS = Object.keys(THEMES) as Theme[]

export function Step5Theme({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--c-text)' }}>
          A identidade visual do seu amor
        </h2>
        <p className="text-sm" style={{ color: 'var(--c-text2)' }}>
          O tema define as cores, texturas e a atmosfera da homenagem.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {THEME_KEYS.map(themeKey => {
          const theme = THEMES[themeKey]
          const isSelected = data.theme === themeKey

          return (
            <button
              key={themeKey}
              onClick={() => onChange('theme', themeKey)}
              className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:scale-[1.01]"
              style={{
                background: 'var(--c-surface)',
                border: `2px solid ${isSelected ? 'var(--c-primary)' : 'var(--c-border)'}`,
              }}
            >
              {/* Swatch */}
              <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${theme.swatchClass}`}>
                {isSelected ? '✓' : ''}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="font-semibold" style={{ color: 'var(--c-text)' }}>{theme.name}</p>
                <p className="text-sm" style={{ color: 'var(--c-text2)' }}>{theme.description}</p>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--grad-btn)' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
